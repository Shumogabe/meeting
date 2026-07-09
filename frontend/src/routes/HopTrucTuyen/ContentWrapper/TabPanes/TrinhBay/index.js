import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react";
import getStroke from "perfect-freehand";
import Button from "react-bootstrap/Button";
import { BiPaint } from "react-icons/bi";
import {
  BsCircle,
  BsDiamond,
  BsEraserFill,
  BsFonts,
  BsSlashLg,
  BsSquare,
  BsTriangle,
  BsTypeBold,
  BsTypeItalic,
} from "react-icons/bs";
import Slider from "react-input-slider";
import rough from "roughjs/bundled/rough.esm";
import "tippy.js/dist/tippy.css";
import Api from "../../../../../api";
import { CheckUser } from "../../../../../components/Modal";
import { SwalAlertAllConfiguration } from "../../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../../config";
import { HREF } from "../../../../../constants/dictionaries";
import Helper from "../../../../../helper/helper";
import "./css.css";
const generator = rough.generator();
const dataColor = [
  "#000000",
  "#464646",
  "#787878",
  "#980031",
  "#ed1d25",
  "#ff7d01",
  "#ffc30e",
  "#a7e71d",
  "#23b14c",
  "#03b8ef",
  "#4c6cf3",
  "#303699",
  "#6e3198",
  "#ffffff",
  "#dcdcdc",
  "#9c593c",
  "#ffa3b1",
  "#e5aa7a",
  "#f5e59c",
  "#fff9be",
  "#d3f9bc",
  "#9cbb60",
  "#99d9eb",
  "#6f99d2",
  "#536c8e",
  "#b5a5d6",
];

const MeetingPaint = ({
  schedule_id,
  user,
  marginTopLayout,
  marginRightLayout,
  meetingData,
}) => {
  const [elements, setElements] = useState([]);
  const [styleColor, setStyleColor] = useState("black");
  const [active, setActive] = useState("none");
  const [tool, setTool] = useState("pencil");
  const [fontSize, setFontSize] = useState("18px");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [styleBold, setStyleBold] = useState("");
  const [styleItalic, setStyleItalic] = useState("");
  const [cursor, setCursor] = useState("");
  const [statusStyleBold, setStatusStyleBold] = useState(false);
  const [statusStyleItalic, setStatusStyleItalic] = useState(false);
  const [sizeStroke, setSizeStroke] = useState(5);
  const [sizeEraser, setSizeEraser] = useState(5);
  const [selectedElement, setSelectedElement] = useState(null);
  const textAreaRef = useRef();
  const [modalShow, setModalShow] = useState(false);
  const [dataPaint, setDataPaint] = useState([]);
  const [nameFilePaint, setNameFilePaint] = useState("");
  const [idFilePaint, setIdFilePaint] = useState(0);
  const [title, setTitle] = useState(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(100, 100, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      if (active === "writing" && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
  });

  //text
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (active === "writing") {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
  }, [active, selectedElement]);

  //get dữ liệu các bảng vẽ
  useEffect(() => {
    getDataPaint();
  }, []);

  //Kiểu chữ in đậm ,nghiêng
  useEffect(() => {
    if (statusStyleBold === true) {
      setStyleBold("bold");
    } else {
      setStyleBold("");
    }
    if (statusStyleItalic === true) {
      setStyleItalic("italic");
    } else {
      setStyleItalic("");
    }
  }, [statusStyleBold, statusStyleItalic]);

  //Kiểu cursor
  useEffect(() => {
    if (
      tool === "line" ||
      tool === "polygon" ||
      tool === "polygon2" ||
      tool === "arc" ||
      tool === "rectangle"
    ) {
      setCursor("crosshair");
    }
    if (tool === "pencil") {
      setCursor("pointer");
    }
    if (tool === "text") {
      setCursor("text");
    }
    if (tool === "deletee") {
      setCursor("cell");
    }
  }, [tool]);
  //
  const average = (a, b) => (a + b) / 2;

  function getSvgPathFromStroke(points, closed = true) {
    const len = points.length;

    if (len < 4) {
      return ``;
    }

    let a = points[0];
    let b = points[1];
    const c = points[2];

    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
      2
    )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
      b[1],
      c[1]
    ).toFixed(2)} T`;

    for (let i = 2, max = len - 1; i < max; i++) {
      a = points[i];
      b = points[i + 1];
      result += `${average(a[0], b[0]).toFixed(2)},${average(
        a[1],
        b[1]
      ).toFixed(2)} `;
    }

    if (closed) {
      result += "Z";
    }

    return result;
  }

  function getDataPaint(value) {
    new Api()
      .get_whiteboard_byScheduleId({ id: schedule_id })
      .then((response) => {
        setDataPaint(response?.data);
      });
  }

  //
  function drawElement(roughCanvas, context, element) {
    switch (element.type) {
      case "line":
      case "polygon":
      case "polygon2":
      case "arc":
      case "rectangle":
        roughCanvas.draw(element.roughElement);
        break;
      case "pencil":
        const stroke = getSvgPathFromStroke(
          getStroke(element.points, { size: element.sizeStroke })
        );
        context.fillStyle = element.styleColor;
        context.fill(new Path2D(stroke));
        break;
      case "deletee":
        const stroke1 = getSvgPathFromStroke(
          getStroke(element.points, { size: element.sizeEraser })
        );
        context.fillStyle = "white";
        context.fill(new Path2D(stroke1));
        break;
      case "text":
        context.textBaseline = "top";
        context.font = `${element.styleBold} ${element.styleItalic} ${element.size} ${element.fontFamily}`;
        context.fillStyle = element.color;
        context.fillText(element.text, element.x1, element.y1);
        break;
      default:
        throw new Error(`Type not recognised: ${element.type}`);
    }
  }

  //Hàm tạo các phần tử trên canvas
  function createElement(id, x1, y1, x2, y2, type) {
    let roughElement;
    switch (type) {
      case "line":
        roughElement = generator.line(x1, y1, x2, y2, {
          stroke: styleColor,
          strokeWidth: sizeStroke,
        });
        return { id, x1, y1, x2, y2, type, roughElement };
      case "polygon":
        roughElement = generator.polygon(
          [
            [x1, y2],
            [x1 + (x2 - x1) / 2, y1],
            [x2, y2],
          ],
          {
            stroke: styleColor,
            strokeWidth: sizeStroke,
          }
        );
        return { id, x1, y1, x2, y2, type, roughElement };
      case "polygon2":
        roughElement = generator.polygon(
          [
            [x1, y1 + (y2 - y1) / 2],
            [x1 + (x2 - x1) / 2, y1],
            [x2, y1 + (y2 - y1) / 2],
            [x1 + (x2 - x1) / 2, y2],
          ],
          { stroke: styleColor, strokeWidth: sizeStroke }
        );
        return { id, x1, y1, x2, y2, type, roughElement };
      case "arc":
        roughElement = generator.arc(
          (x2 - x1) / 2 + x1,
          (y2 - y1) / 2 + y1,
          x2 - x1,
          y2 - y1,
          0,
          Math.PI * 2,
          false,
          {
            stroke: styleColor,
            strokeWidth: sizeStroke,
          }
        );
        return { id, x1, y1, x2, y2, type, roughElement };
      case "rectangle":
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
          stroke: styleColor,
          strokeWidth: sizeStroke,
        });
        return { id, x1, y1, x2, y2, type, roughElement };
      case "pencil":
        return {
          id,
          type,
          points: [{ x: x1, y: y1 }],
          sizeStroke: sizeStroke,
          styleColor: styleColor,
        };
      case "deletee":
        return { id, type, points: [{ x: x1, y: y1 }], sizeEraser: sizeEraser };
      case "text":
        return {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          text: "",
          size: fontSize,
          color: styleColor,
          fontFamily: fontFamily,
          styleItalic: styleItalic,
          styleBold: styleBold,
        };
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  }

  //Cập nhật phần tử trên canvas
  const updatedElement = (id, x1, y1, x2, y2, type, options) => {
    const elementsCopy = [...elements];
    switch (type) {
      case "line":
      case "polygon":
      case "polygon2":
      case "arc":
      case "rectangle":
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case "deletee":
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
          size: options.size,
          color: options.color,
          fontFamily: options.fontFamily,
          styleBold: options.styleBold,
          styleItalic: options.styleItalic,
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  //
  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  };

  //
  const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
  };

  //
  function positionWithinElement(x, y, element) {
    const { type, x1, x2, y1, y2 } = element;
    switch (type) {
      case "rectangle":
      case "polygon":
      case "polygon2":
      case "arc":
        const topLeft = nearPoint(x, y, x1, y1, "tl");
        const topRight = nearPoint(x, y, x2, y1, "tr");
        const bottomLeft = nearPoint(x, y, x1, y2, "bl");
        const bottomRight = nearPoint(x, y, x2, y2, "br");
        const inside =
          x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      case "line":
        const on = onLine(x1, y1, x2, y2, x, y);
        const start = nearPoint(x, y, x1, y1, "start");
        const end = nearPoint(x, y, x2, y2, "end");
        return start || end || on;
      case "pencil":
        const betweenAnyPoint = element.points.some((point, index) => {
          const nextPoint = element.points[index + 1];
          if (!nextPoint) return false;
          return (
            onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
          );
        });
        return betweenAnyPoint ? "inside" : null;
      case "deletee":
        return null;
      case "text":
        return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  }

  //
  function adjustmentRequired(type) {
    return ["line", "rectangle", "polygon", "polygon2", "arc"].includes(type);
  }

  //
  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  //Hàm di chuyển các phần tử trên canvas
  function getElementAtPosition(x, y, elements) {
    return elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(x, y, element),
      }))
      .find((element) => element.position !== null);
  }

  //Hàm tăng giảm kích thước phần tử trong canvas
  function adjustElementCoordinates(element) {
    const { type, x1, y1, x2, y2 } = element;
    if (
      type === "rectangle" ||
      type === "arc" ||
      type === "polygon" ||
      type === "polygon2"
    ) {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  }

  //
  function resizedCoordinates(clientX, clientY, position, coordinates) {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2, y2 };
      case "tr":
        return { x1, y1: clientY, x2: clientX, y2 };
      case "bl":
        return { x1: clientX, y1, x2, y2: clientY };
      case "br":
      case "end":
        return { x1, y1, x2: clientX, y2: clientY };
      default:
        return null;
    }
  }

  //
  function cursorForPosition(position) {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "move";
    }
  }

  //Sự kiện khi nhấn và di chuột
  const handleMouseDown = (e) => {
    //console.log(e);
    if (active === "writing") return;
    const { clientX, clientY } = e;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "pencil") {
          const xOffsets = element.points.map((point) => clientX - point.x);
          const yOffsets = element.points.map((point) => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState) => prevState);
        if (element.position === "inside") {
          setActive("moving");
        } else {
          setActive("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      if (tool === "text") {
        setActive("writing");
      } else {
        setActive("drawing");
      }
    }
  };

  //Sự kiện khi di chuột trên thẻ
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
    if (active === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updatedElement(index, x1, y1, clientX, clientY, tool);
    } else if (active === "moving") {
      if (selectedElement.type === "pencil") {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const nexX1 = clientX - offsetX;
        const nexY1 = clientY - offsetY;
        const options = type === "text" ? { text: selectedElement.text } : {};
        updatedElement(
          id,
          nexX1,
          nexY1,
          nexX1 + width,
          nexY1 + height,
          type,
          options
        );
      }
    } else if (active === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updatedElement(id, x1, y1, x2, y2, type);
    }
  };

  //Sự kiện khi ngừng nhấn và thả chuột
  const handleMouseUp = (e) => {
    //console.log(e);
    const { clientX, clientY } = e;
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setActive("writing");
        return;
      }
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (active === "drawing" || active === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updatedElement(id, x1, y1, x2, y2, type);
      }
    }
    if (active === "writing") return;

    setActive("none");
    setSelectedElement(null);
  };

  const handleBlur = (e) => {
    const { id, x1, y1, type } = selectedElement;
    setActive("none");
    setSelectedElement(null);
    updatedElement(id, x1, y1, null, null, type, {
      text: e.target.value,
      size: fontSize,
      color: styleColor,
      fontFamily: fontFamily,
      styleBold: styleBold,
      styleItalic: styleItalic,
    });
  };

  //Lưu mới bảng vẽ
  const handleNewSave = () => {
    setTool("pencil");
    if (!nameFilePaint) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Tên bảng vẽ không được để trống!",
        icon: "warning",
      });
    } else {
      if (dataPaint.some((item) => item.title === nameFilePaint) === true) {
        SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Tên bảng vẽ đã tồn tại!",
          icon: "warning",
        });
      } else {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        new Api()
          .create_meeting_whiteboard({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              title: nameFilePaint,
              scheduleId: schedule_id,
              content: JSON.stringify(elements),
              createdBy: user && user?.id,
            },
          })
          .then((response) => {
            setModalShow(false);
            setNameFilePaint("");
            context.clearRect(100, 100, canvas.width, canvas.height);
            getDataPaint();
          });
      }
    }
  };

  //Mở tab đặt tên bảng vẽ
  const handleCreateNamePaint = () => {
    setTool("pencil");
    setModalShow(true);
  };

  //Xoa bảng vẽ
  const handleDeletePaint = () => {
    if (
      user &&
      user?.id ===
        dataPaint.filter((item) => item.title === title)[0]?.createdBy
    ) {
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Bạn chắc chắn muốn xóa bảng vẽ?",
        icon: "warning",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Trở lại",
      }).then((result) => {
        if (result.isConfirmed) {
          new Api()
            .remove_meeting_whiteboard({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: idFilePaint,
            })
            .then((res) => {
              SwalAlertAllConfiguration({
                title: "Thông báo! ",
                text: "Xóa bảng vẽ thành công!",
                icon: "success",
                timer: 3000,
              });
              setElements([]);
              setSelectedElement(null);
              setIdFilePaint(0);
              setTitle(null);
              getDataPaint();
            });
        }
      });
    } else if (
      dataPaint.filter((item) => item.title === title)[0]?.createdBy === 0
    ) {
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Bạn chắc chắn muốn xóa bảng vẽ?",
        icon: "warning",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Trở lại",
      }).then((result) => {
        if (result.isConfirmed) {
          new Api()
            .remove_meeting_whiteboard({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: idFilePaint,
            })
            .then((res) => {
              setElements([]);
              setSelectedElement(null);
              setIdFilePaint(0);
              setTitle(null);
              getDataPaint();
            });
        }
      });
    } else if (
      user &&
      user?.id !==
        dataPaint.filter((item) => item.title === title)[0]?.createdBy
    ) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Bạn không có quyền xóa",
        icon: "warning",
      });
    }
  };

  //Tạo bảng vẽ
  const handleCreate = () => {
    setIdFilePaint(0);
    setTitle(null);
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if (canvas.getContext) {
      setElements([]);
      setSelectedElement(null);
      context.clearRect(100, 100, canvas.width, canvas.height);
    }
  };

  //Lưu bảng vẽ
  const handleSave = () => {
    if (idFilePaint === 0) {
      setTool("pencil");
      setModalShow(true);
    } else {
      if (
        user &&
        user?.id ===
          dataPaint.filter((item) => item.id === idFilePaint)[0].createdBy
      ) {
        let name = dataPaint.filter((item) => item.id === idFilePaint)[0].title;
        return new Api()
          .remove_meeting_whiteboard({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            id: idFilePaint,
          })
          .then((res) => {
            new Api()
              .create_meeting_whiteboard({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                data: {
                  title: name,
                  scheduleId: schedule_id,
                  content: JSON.stringify(elements),
                  createdBy: user && user?.id,
                },
              })
              .then((response) => {
                getDataPaint();
                setTitle(name);
                SwalAlertAllConfiguration({
                  title: "Thông báo! ",
                  text: "Lưu bảng vẽ thành công",
                  icon: "success",
                });
              });
          });
      } else if (
        dataPaint.filter((item) => item.id === idFilePaint)[0].createdBy === 0
      ) {
        let name = dataPaint.filter((item) => item.id === idFilePaint)[0].title;
        new Api()
          .remove_meeting_whiteboard({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            id: idFilePaint,
          })
          .then((res) => {
            new Api()
              .create_meeting_whiteboard({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                data: {
                  title: name,
                  scheduleId: schedule_id,
                  content: JSON.stringify(elements),
                  createdBy: user && user?.id,
                },
              })
              .then((response) => {
                getDataPaint();
                setTitle(name);
                SwalAlertAllConfiguration({
                  title: "Thông báo! ",
                  text: "Lưu bảng vẽ thành công",
                  icon: "success",
                });
              });
          });
      } else if (
        user &&
        user?.id !==
          dataPaint.filter((item) => item.id === idFilePaint)[0].createdBy
      ) {
        setElements(
          JSON.parse(
            dataPaint.filter((item) => item.id === idFilePaint)[0].content
          )
        );
        return SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Bạn không có quyền sửa bảng vẽ",
          icon: "warning",
        });
      }
    }
  };

  //Mở bảng vẽ
  const handleOpenFilePaint = (item) => {
    if (title == null) {
      setElements(JSON.parse(item.content));
      setIdFilePaint(item.id);
      setTitle(item.title);
    } else {
      if (
        dataPaint.filter((item1) => item1.title === title)[0].content !==
        JSON.stringify(elements)
      ) {
        return SwalAlertAllConfiguration({
          title: "Thông báo!",
          text: "Chưa lưu bảng vẽ. Có tiếp tục?",
          icon: "warning",
          cancelButtonText: "Trở lại",
          confirmButtonText: "Tiếp tục",
        }).then((result) => {
          if (result.isConfirmed) {
            setElements(JSON.parse(item.content));
            setIdFilePaint(item.id);
            setTitle(item.title);
          }
        });
      } else {
        setElements(JSON.parse(item.content));
        setIdFilePaint(item.id);
        setTitle(item.title);
      }
    }
  };
  const [permissions, setPermissions] = useState(0);

  useEffect(() => {
    CheckUser().then((user) => {
      if (Helper.isNullOrUndefined(user)) {
        setPermissions(0);
      } else {
        setPermissions(1);
      }
    });
  }, []);

  return (
    <>
      <div
        style={{
          margin:
            marginTopLayout +
            marginRightLayout +
            " 0px " +
            (!Helper.isNullOrUndefined(
              document.getElementById("meeting-sidebar")?.offsetWidth
            ) &&
              Number(
                -document.getElementById("meeting-sidebar")?.offsetWidth -
                  7.5 -
                  8
                // window.screen.width
              )) +
            "px",
        }}
        //   style={{
        //     padding: '0',
        //     overflow: 'hidden',
        //   }}
      >
        {/* Tài liệu của bảng vẽ */}
        <div
          className="doccument-paint"
          style={{
            top:
              (!Helper.isNullOrUndefined(
                document.getElementById("main-header")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-header")?.offsetHeight
                  // window.screen.width
                )) + "px",
            height:
              window.innerHeight -
              (!Helper.isNullOrUndefined(
                document.getElementById("main-header")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-header")?.offsetHeight
                  // window.screen.width
                )) -
              // "px" +
              (!Helper.isNullOrUndefined(
                document.getElementById("main-footer")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-footer")?.offsetHeight
                  // window.screen.width
                )) +
              "px",
          }}
        >
          <ul className="list-doccument-paint">
            <li
              style={{ fontWeight: "bold", background: "#cdcdcd" }}
              onClick={() => {
                getDataPaint();
              }}
            >
              {/* <i className="fas fa-sync-alt"></i> */}
              Danh sách bảng vẽ
            </li>
            {dataPaint.length >= 1 &&
              dataPaint.map((item) => (
                <li
                  style={
                    item.title === title
                      ? { backgroundColor: "#adafb1", color: "black" }
                      : { backgroundColor: "white" }
                  }
                  key={item.id}
                  onClick={() => handleOpenFilePaint(item)}
                >
                  {item.title}
                </li>
              ))}
          </ul>
          <div
            className="list-button d-flex justify-content-around flex-wrap"
            style={{
              bottom: 0,
              // (!Helper.isNullOrUndefined(
              //   document.getElementById("main-footer")?.offsetHeight
              // ) &&
              //   Number(
              //     document.getElementById("main-footer")?.offsetHeight
              //     // window.screen.width
              //   )) + "px",
            }}
          >
            {meetingData?.schedule?.status !== 3 && (
              <>
                <button
                  className="btn btn-default full-width"
                  type="button"
                  data-toggle="modal"
                  style={{ maxHeight: "35px" }}
                  title="Tạo mới"
                  onClick={() => {
                    if (permissions === 1) {
                      return handleCreate();
                    }
                    if (permissions === 0) {
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Bạn cần đăng nhập để thực hiện chức năng này!",
                        icon: "warning",
                        footer:
                          "<a href=" + HREF.DangNhap + ">Đăng nhập tại đây</a>",
                      });
                    }
                  }}
                >
                  <i className="fas fa-plus info"></i> Trang mới
                </button>
                <button
                  className="btn btn-default btn-create"
                  type="button"
                  style={{ maxHeight: "35px" }}
                  data-toggle="modal"
                  title="Lưu"
                  onClick={() => {
                    if (permissions === 1) {
                      return handleSave();
                    }
                    if (permissions === 0) {
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Bạn cần đăng nhập để thực hiện chức năng này!",
                        icon: "warning",
                        footer:
                          "<a href=" + HREF.DangNhap + ">Đăng nhập tại đây</a>",
                      });
                    }
                  }}
                >
                  <i className="fas fa-check info"></i> Lưu
                </button>
                <button
                  className="btn btn-default btn-create"
                  type="button"
                  style={{ maxHeight: "35px" }}
                  data-toggle="modal"
                  title="Lưu mới"
                  onClick={() => {
                    if (permissions === 1) {
                      return handleCreateNamePaint();
                    }
                    if (permissions === 0) {
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Bạn cần đăng nhập để thực hiện chức năng này!",
                        icon: "warning",
                        footer:
                          "<a href=" + HREF.DangNhap + ">Đăng nhập tại đây</a>",
                      });
                    }
                  }}
                >
                  <i className="fas fa-edit info"></i> Lưu mới
                </button>
                <button
                  className="btn btn-default btn-create"
                  type="button"
                  style={{ maxHeight: "35px" }}
                  data-toggle="modal"
                  title="Xóa"
                  onClick={() => {
                    if (permissions === 1) {
                      return handleDeletePaint();
                    }
                    if (permissions === 0) {
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Bạn cần đăng nhập để thực hiện chức năng này!",
                        icon: "warning",
                        footer:
                          "<a href=" + HREF.DangNhap + ">Đăng nhập tại đây</a>",
                      });
                    }
                  }}
                >
                  <i className="fas fa-trash-alt info"></i> Xóa
                </button>
              </>
            )}
          </div>
        </div>
        {/* Top all */}
        <div className="box-top-paint"></div>
        {/* right all */}
        <div className="box-right-paint"></div>
        {/* left all */}
        <div className="box-left-paint"></div>
        {/* bottom all */}
        <div className="box-bottom-paint"></div>

        {/* Top của bảng vẽ */}
        <div className="box-top-doccument-paint"></div>
        {/* Bottom của bảng vẽ */}
        <div className="box-bottom-doccument-paint"></div>
        {/* Left của bảng vẽ */}
        <div className="box-left-doccument-paint"> </div>
        {/* Right của bảng vẽ */}
        <div className="box-right-doccument-paint"> </div>
        {/* /// */}
        {active === "writing" ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: "fixed",
              top: selectedElement.y1,
              left: selectedElement.x1,
              color: styleColor,
              fontSize: fontSize,
              margin: 0,
              padding: 0,
              outline: 0,
              resize: "auto",
              whiteSpace: "pre-wrap",
              background: "transparent",
              zIndex: "20",
            }}
          ></textarea>
        ) : null}

        <canvas
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: cursor }}
          id="canvas"
          width={window.innerWidth}
          // width="981"
          height={window.innerHeight}
          // height="494"
        >
          canvas
        </canvas>
        <canvas
          id="canvas1"
          style={{
            top:
              (!Helper.isNullOrUndefined(
                document.getElementById("main-header")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-header")?.offsetHeight
                  // window.screen.width
                )) + "px",
            height:
              window.innerHeight -
              (!Helper.isNullOrUndefined(
                document.getElementById("main-header")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-header")?.offsetHeight
                  // window.screen.width
                )) -
              (!Helper.isNullOrUndefined(
                document.getElementById("main-footer")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-footer")?.offsetHeight
                  // window.screen.width
                )) +
              "px",
            width:
              window.innerWidth -
              (!Helper.isNullOrUndefined(
                document.getElementById("main-sidebar")?.offsetWidth
              ) &&
                Number(
                  document.getElementById("main-sidebar")?.offsetWidth
                  // window.screen.width
                )) +
              "px",
          }}
        ></canvas>

        {/*Công cụ của bảng vẽ */}

        {/* Tool của bảng vẽ */}
        <div
          className="box-color-paint"
          style={{
            bottom:
              (!Helper.isNullOrUndefined(
                document.getElementById("main-footer")?.offsetHeight
              ) &&
                Number(
                  document.getElementById("main-footer")?.offsetHeight
                  // window.screen.width
                )) + "px",
            // width: '81%',
          }}
        >
          {meetingData?.schedule?.status !== 3 && (
            <>
              <div className="box-tool-paint">
                <h6>Công cụ</h6>

                <div className="list-item-tool">
                  <Tippy content="Vẽ">
                    <button
                      style={
                        tool === "pencil"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("pencil")}
                    >
                      <BiPaint />
                    </button>
                  </Tippy>
                  <Tippy content="Di chuyển">
                    <button
                      style={
                        tool === "selection"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("selection")}
                    >
                      <i className="fas fa-expand-arrows-alt"></i>
                    </button>
                  </Tippy>
                  <Tippy content="Đường thẳng">
                    <button
                      style={
                        tool === "line"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("line")}
                    >
                      <BsSlashLg />
                    </button>
                  </Tippy>
                  <Tippy content="Hình chữ nhật">
                    <button
                      style={
                        tool === "rectangle"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("rectangle")}
                    >
                      <BsSquare />
                    </button>
                  </Tippy>
                  <Tippy content="Hình tròn">
                    <button
                      style={
                        tool === "arc"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("arc")}
                    >
                      <BsCircle />
                    </button>
                  </Tippy>
                  <Tippy content="Hình tam giác">
                    <button
                      style={
                        tool === "polygon"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("polygon")}
                    >
                      <BsTriangle />
                    </button>
                  </Tippy>
                  <Tippy content="Hình thoi">
                    <button
                      style={
                        tool === "polygon2"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("polygon2")}
                    >
                      <BsDiamond />
                    </button>
                  </Tippy>

                  <Tippy content="Văn bản">
                    <button
                      style={
                        tool === "text"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("text")}
                    >
                      <BsFonts />
                    </button>
                  </Tippy>
                  <Tippy content="Tẩy">
                    <button
                      style={
                        tool === "deletee"
                          ? { color: "white", backgroundColor: "darkgray" }
                          : null
                      }
                      onClick={() => setTool("deletee")}
                    >
                      <BsEraserFill />
                    </button>
                  </Tippy>
                </div>
              </div>
              <di v className="slide-size">
                <h6>Kích thước</h6>
                <div className="box-slide-size">
                  <div className="slide-size-scoll">
                    <span>
                      Nét vẽ :{" "}
                      <span style={{ color: "red" }}>{sizeStroke}</span>
                    </span>
                    <Slider
                      axis="x"
                      xstep={1}
                      xmin={1}
                      xmax={100}
                      x={sizeStroke}
                      onChange={({ x }) =>
                        setSizeStroke(parseFloat(x.toFixed(2)))
                      }
                    />
                  </div>
                  <div className="slide-size-scoll">
                    <span>
                      Tẩy : <span style={{ color: "red" }}>{sizeEraser}</span>
                    </span>
                    <Slider
                      axis="x"
                      xstep={1}
                      xmin={1}
                      xmax={100}
                      x={sizeEraser}
                      onChange={({ x }) =>
                        setSizeEraser(parseFloat(x.toFixed(2)))
                      }
                    />
                  </div>
                </div>
              </di>
              <div className="text-paint">
                <h6>Kiểu chữ</h6>
                <div className="box-text-paint">
                  <select
                    style={{
                      width: "100%",
                      height: "30%",
                      border: "1px solid #dee2e6",
                    }}
                    id="font-family"
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    <option value="Arial" selected>
                      {" "}
                      Arial
                    </option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Courier">Courier</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Optima">Optima</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Didot">Didot</option>
                    <option value="Brush Script MT">Brush Script MT</option>
                    <option value="Copperplate">Copperplate</option>
                  </select>
                  <div className="style-text-paint">
                    <select
                      style={{ border: "1px solid #dee2e6" }}
                      id="font-size"
                      onChange={(e) => setFontSize(e.target.value)}
                    >
                      <option value="4px">4</option>
                      <option value="6px">6</option>
                      <option value="8px">8</option>
                      <option value="10px">10</option>
                      <option value="12px">12</option>
                      <option value="14px">14</option>
                      <option value="16px">16</option>
                      <option value="18px" selected>
                        18
                      </option>
                      <option value="20px">20</option>
                      <option value="22px">22</option>
                      <option value="24px">24</option>
                      <option value="26px">26</option>
                      <option value="28px">28</option>
                      <option value="30px">30</option>
                      <option value="35px">35</option>
                      <option value="40px">40</option>
                      <option value="50px">50</option>
                    </select>
                    <button
                      style={
                        statusStyleBold === true
                          ? {
                              border: "1px solid black",
                              backgroundColor: "#03b8ef",
                              borderRadius: "5px",
                            }
                          : null
                      }
                      onClick={() => setStatusStyleBold(!statusStyleBold)}
                    >
                      <BsTypeBold />
                    </button>
                    <button
                      style={
                        statusStyleItalic === true
                          ? {
                              border: "1px solid black",
                              backgroundColor: "#03b8ef",
                              borderRadius: "5px",
                            }
                          : null
                      }
                      onClick={() => setStatusStyleItalic(!statusStyleItalic)}
                    >
                      <BsTypeItalic />
                    </button>
                  </div>
                </div>
              </div>
              <div className="color-paint">
                <h6>Màu</h6>

                <div className="list-color-paint">
                  <div
                    className="current-color"
                    style={{ backgroundColor: styleColor }}
                  ></div>
                  <ul className="box-list-color-paint">
                    {dataColor.map((item, index) => (
                      <li
                        key={index}
                        style={{ backgroundColor: item }}
                        onClick={() => setStyleColor(item)}
                      ></li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Đặt tên */}
        {modalShow === true ? (
          <>
            <div
              className="wrap-layout"
              onClick={() => setModalShow(false)}
            ></div>
            <div
              className="name-file-paint"
              style={{ border: "1px solid black" }}
            >
              <h4>Tên bảng vẽ</h4>
              <hr />
              <input
                type="text"
                value={nameFilePaint}
                onChange={(e) => setNameFilePaint(e.target.value)}
              />
              <Button
                style={{ width: "30%", marginRight: "5px" }}
                onClick={handleNewSave}
              >
                Lưu
              </Button>
              <Button
                style={{ width: "30%" }}
                onClick={() => setModalShow(false)}
              >
                Đóng
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};
export default MeetingPaint;
