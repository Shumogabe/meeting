import React, { useEffect, useRef, useState } from "react";
import { CaretUpOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Input, Modal, Slider, Switch } from "antd";
import Api from "../../../api";
import Message from "../../../components/Message";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";
import "./css.css";
let stream, mediaRecorder;
export default function ButtonMeeting({
  isAudioMuted,
  isVideoMuted,
  isHand,
  isChat,
  isParticipants,
  isToggleTileView,
  recording,
  shareVideo,
  liveStream,
  isMouseActive,
  setIsMouseActive,
  handleMouseEvent,
  mouseMoveTimer,
  currentDevicesAudioInput,
  currentDevicesAudioOutput,
  currentDevicesVideoInput,
  getAvailableDevicesAudioInput,
  getAvailableDevicesAudioOutput,
  getAvailableDevicesVideoInput,
  executeCommand,
  setDevice,
  user,
  qualityVideo,
  roomLink,
  owner,
  meetingData,
  unreadCount,
  shareScreen,
  roomMini,
  firmstrip,
  setFirmstrip,
  tileViewCount,
  setTileViewCount,
  apiRef,
  recordingLinkAvailable,
  recordingStatusChanged,
  scheduleId,
}) {
  const refs = useRef([]);
  const [camDrop, setCamDrop] = useState(false);
  const [micDrop, setMicDrop] = useState(false);
  const [option, setOption] = useState(false);

  const [lobby, setLobby] = useState(false);
  const [noise, setNoise] = useState(false);
  const [password, setPassword] = useState(meetingData?.password);
  const [url, setUrl] = useState();
  const [self, setSelf] = useState(false);
  const [streamKey, setStreamKey] = useState();
  const [quality, setQuality] = useState(qualityVideo);
  const [name, setName] = useState(user?.userName);
  const [email, setEmail] = useState(user?.email);
  const [choose, setChoose] = useState({
    audioInput: currentDevicesAudioInput && currentDevicesAudioInput?.label,
    audioOutput: currentDevicesAudioOutput && currentDevicesAudioOutput?.label,
    videoInput: currentDevicesVideoInput && currentDevicesVideoInput?.label,
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (modalForm.includes("display")) {
      if (Helper.isNullOrUndefined(name)) {
        return Message.warning("Tên hiển thị không được để trống");
      }
      executeCommand(
        "name",
        owner !== 1
          ? name
              ?.replace("Chủ trì", "")
              ?.replace("Thư ký", "")
              ?.replace("Chuyên viên hỗ trợ", "")
              ?.replace("Kỹ thuật viên", "")
          : name
      );
      executeCommand("email", email);
      let client = {
        fullName: name, // + " - Khách mời",
        email: email,
        userName: name, // + " - Khách mời",
      };
      localStorage.setItem("user", JSON.stringify(client));
    }
    if (modalForm.includes("password")) {
      executeCommand("password", password);
      new Api().edit_meeting_schedule_password({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: meetingData?.id,
        data: {
          password: password,
          modifiedBy: user?.id,
          modifiedDate: new Date(),
        },
      });
    }
    if (modalForm.includes("sharevideo")) {
      if (!shareVideo && Helper.isNullOrUndefined(url)) {
        return Message.warning("Bạn chưa nhập đường dẫn phòng họp");
      }
      executeCommand("sharevideo", url);
    }
    if (modalForm.includes("recording")) {
      executeCommand("recording", self);
    }
    if (modalForm.includes("livestream")) {
      if (!liveStream && Helper.isNullOrUndefined(streamKey)) {
        return Message.warning("Chưa nhập khóa");
      }
      executeCommand("livestream", streamKey);
    }
    handleCancel();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModalForm();
    setUrl();
    setQuality(qualityVideo);
    setStreamKey();
  };

  const onCopyLink = (code) => {
    navigator.clipboard.writeText(code);
    SwalAlertAllConfiguration({
      title: "Sao chép đường dẫn thành công",
      text: "",
      icon: "success",
    });
  };

  const onHandleToggle = (mouse) => {
    setMicDrop(false);
    setCamDrop(false);
    setOption(false);
    handleCancel();
    switch (mouse) {
      case "enter":
        // refs.current[1].classList.toggle('active');
        refs.current[1].classList.toggle("d-none");
        refs.current[2].classList.toggle("d-flex");
        refs.current[2].classList.toggle("active");
        // refs.current[2].classList.remove('d-none');
        // refs.current[2].classList.toggle('d-block');
        break;
      case "leave":
        refs.current[1].classList.remove("active");
        refs.current[1].classList.remove("d-none");
        refs.current[2].classList.remove("d-flex");
        refs.current[2].classList.remove("active");
        // refs.current[2].classList.remove('d-block');
        // refs.current[2].classList.toggle('d-none');
        break;
      default:
        break;
    }
  };

  const [testRecord, setTestRecord] = useState(false);

  function upFile(fileList, filePath, docList, scheduleId, user, content) {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });
    new Api()
      .Upload_files_to_bucket({
        // token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
        filePath: filePath,
        formData: formData,
      })
      .then(() => {
        // return SwalAlertAllConfiguration({
        //   title: "Tải tài liệu lên thành công",
        //   icon: "success",
        // });
      });
    docList &&
      docList.map((item, index) =>
        Helper.isNullOrUndefined(
          JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
        )
          ? new Api().create_meeting_video_without({
              data: {
                title: content,
                scheduleId: scheduleId,
                url: filePath,
                originalName: item.name,
                systemName: item.uid,
                type: item.type,
                size: item.size,
                status: 2,
                createdDate: item.lastModifiedDate,
                createdBy: !Helper.isNullOrUndefined(user?.id) ? user?.id : 0,
              },
            })
          : new Api().create_meeting_video({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              data: {
                title: content,
                scheduleId: scheduleId,
                url: filePath,
                originalName: item.name,
                systemName: item.uid,
                type: item.type,
                size: item.size,
                status: 2,
                createdDate: item.lastModifiedDate,
                createdBy: !Helper.isNullOrUndefined(user?.id) ? user?.id : 0,
              },
            })
      );
  }

  function saveFile(recordedChunks) {
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    let filename = window.prompt("Nhập tên"),
      downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    filename = filename || new Date().valueOf() || new Date().getTime();
    downloadLink.download = `${filename}.webm`;

    var file = new File([blob], filename, { type: blob.type });

    upFile(
      [file],
      "ghihinhcuochop/" + scheduleId,
      [file],
      scheduleId,
      user,
      filename
    );

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
  }

  function createRecorder(stream, mimeType) {
    // the stream data is stored in this array
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };
    mediaRecorder.onstop = function () {
      saveFile(recordedChunks);
      recordedChunks = [];
    };
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
  }

  async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: { displaySurface: "browser" },
      preferCurrentTab: true,
    });
  }

  async function startrecord() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Safe to call getDisplayMedia
        stream = await recordScreen();
        let mimeType = "video/webm";
        mediaRecorder = createRecorder(stream, mimeType);
      } else {
        alert("Chức năng này không được hỗ trợ.");
      }
    } catch (error) {
      alert(error);
    }
  }

  function stoprecord() {
    if (stream) {
      var tracks = stream.getTracks();
      for (var i = 0; i < tracks.length; i++) tracks[i].stop();
      mediaRecorder.stop();
    }
  }

  useEffect(() => {
    if (testRecord === true) {
      startrecord();
    }
    if (testRecord === false) {
      stoprecord();
    }
  }, [testRecord]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseEvent);
    return () => {
      window.removeEventListener("mousemove", handleMouseEvent);
      if (mouseMoveTimer) {
        clearTimeout(mouseMoveTimer);
      }
    };
  }, []);

  return (
    // <>
    //   {!Helper.isNullOrUndefined(meetingData) &&
    //     !Helper.isNullOrUndefined(user) &&
    //     !Helper.isNullOrUndefined(owner) &&
    //     roomMini === false && (
    //       <>
    //         <footer
    //           ref={(element) => {
    //             refs.current[3] = element;
    //           }}
    //           className={
    //             isMouseActive
    //               ? "menu-toggle-meeting"
    //               : "menu-toggle-meeting d-none"
    //             // "menu-toggle-meeting"
    //           }
    //           style={{
    //             marginLeft:
    //               (!Helper.isNullOrUndefined(
    //                 document.getElementById("meeting-sidebar")
    //               ) &&
    //                 Number(
    //                   -document.getElementById("meeting-sidebar")?.offsetWidth
    //                   // window.screen.width
    //                 ) / 2) + "px",
    //           }}
    //         >
    //           <div className="menu">
    //             <div
    //               ref={(element) => {
    //                 refs.current[1] = element;
    //               }}
    //               className="toggle d-none"
    //               // onMouseEnter={() => onHandleToggle("enter")}
    //               // onMouseLeave={() => onHandleToggle("leave")}
    //               // onMouseOver={() => onHandleToggle("enter")}
    //               // onMouseOut={() => onHandleToggle("leave")}
    //             >
    //               {/* <i className="fas fa-plus" /> */}
    //               {/* <DoubleLeftOutlined
    //                 style={{
    //                   fontSize: "32px",
    //                   color: "#fff",
    //                   position: "absolute",
    //                   transform: "rotate(-90deg)",
    //                   top: "50%",
    //                   left: "50%",
    //                 }}
    //               /> */}
    //               <DownOutlined
    //                 style={{
    //                   color: "#fff",
    //                   position: "absolute",
    //                   top: "50%",
    //                   left: "50%",
    //                 }}
    //               />
    //             </div>
    //             <div
    //               ref={(element) => {
    //                 refs.current[2] = element;
    //               }}
    //               className="list d-flex active"
    //               // onMouseEnter={() => onHandleToggle("enter")}
    //               // onMouseLeave={() => onHandleToggle("leave")}
    //               // onMouseOver={() => onHandleToggle("enter")}
    //               // onMouseOut={() => onHandleToggle("leave")}
    //             >
    //               <li style={{ "--i": 1 }} title="Bật / Tắt tiếng">
    //                 <div className="btn-group dropup">
    //                   <button
    //                     type="button"
    //                     onClick={() => executeCommand("toggleAudio")}
    //                     className={`btn-btn btn btn-secondary ${
    //                       isAudioMuted ? "bg-light" : "bg-dark"
    //                     }`}
    //                     id="battattieng"
    //                   >
    //                     <i
    //                       className={`fas grey-color ${
    //                         isAudioMuted
    //                           ? "fa-microphone"
    //                           : "fa-microphone-slash"
    //                       } `}
    //                       aria-hidden="true"
    //                     ></i>
    //                   </button>
    //                   <DropdownAudioInputOutput
    //                     getAvailableDevicesAudioInput={
    //                       getAvailableDevicesAudioInput
    //                     }
    //                     setDevice={setDevice}
    //                     setChoose={setChoose}
    //                     getAvailableDevicesAudioOutput={
    //                       getAvailableDevicesAudioOutput
    //                     }
    //                     choose={choose}
    //                     setMicDrop={setMicDrop}
    //                     micDrop={micDrop}
    //                     setCamDrop={setCamDrop}
    //                     setOption={setOption}
    //                     handleCancel={handleCancel}
    //                   />
    //                   {micDrop && (
    //                     <div
    //                       className="dropdown-menu-toggle"
    //                       id="dropdownmicvaloa"
    //                       style={{
    //                         margin: "unset",
    //                         display: "none",

    //                         // transform: micDrop
    //                         //   ? "translate(" +
    //                         //     document.getElementById("#battattieng")
    //                         //       .offsetHeight +
    //                         //     "px, -" +
    //                         //     document.querySelector("#dropdownmicvaloa")
    //                         //       .offsetHeight +
    //                         //     "px)"
    //                         //   : "",
    //                       }}
    //                     >
    //                       {getAvailableDevicesAudioInput && (
    //                         <div
    //                           className="card text-white bg-dark"
    //                           style={{ margin: "unset" }}
    //                         >
    //                           <div className="card-header">
    //                             <i className="fas fa-microphone"></i>{" "}
    //                             Microphones
    //                             {/* {document.getElementById("#battattieng")
    //                               .offsetHeight
    //                               ? 1
    //                               : 0}
    //                             {document.querySelector("#dropdownmicvaloa")
    //                               .offsetHeight
    //                               ? 2
    //                               : 3} */}
    //                           </div>
    //                           <div
    //                             className="card-body bg-secondary"
    //                             style={{ padding: "unset" }}
    //                           >
    //                             <p className="card-text">
    //                               <>
    //                                 {getAvailableDevicesAudioInput.map(
    //                                   (list, index) => (
    //                                     <button
    //                                       key={index}
    //                                       className={`dropdown-item ${
    //                                         choose.audioInput === index
    //                                           ? "active"
    //                                           : ""
    //                                       }`}
    //                                       onClick={() => {
    //                                         setDevice(
    //                                           "setAudioInputDevice",
    //                                           list.label,
    //                                           list.deviceId
    //                                         );
    //                                         setChoose((pre) => ({
    //                                           ...pre,
    //                                           audioInput: index,
    //                                         }));
    //                                       }}
    //                                     >
    //                                       {list.label}
    //                                     </button>
    //                                   )
    //                                 )}
    //                               </>
    //                             </p>
    //                           </div>
    //                         </div>
    //                       )}
    //                       {getAvailableDevicesAudioOutput && (
    //                         <div
    //                           className="card text-white bg-dark"
    //                           style={{ margin: "unset" }}
    //                         >
    //                           <div className="card-header">
    //                             <i className="fas fa-volume-up"></i> Loa
    //                           </div>
    //                           <div
    //                             className="card-body bg-secondary"
    //                             style={{ padding: "unset" }}
    //                           >
    //                             <p className="card-text">
    //                               <>
    //                                 {getAvailableDevicesAudioOutput.map(
    //                                   (list, index) => (
    //                                     <button
    //                                       key={index}
    //                                       className={`dropdown-item ${
    //                                         choose.audioOutput === index
    //                                           ? "active"
    //                                           : ""
    //                                       }`}
    //                                       onClick={() => {
    //                                         setDevice(
    //                                           "setAudioOutputDevice",
    //                                           list.label,
    //                                           list.deviceId
    //                                         );
    //                                         setChoose((pre) => ({
    //                                           ...pre,
    //                                           audioOutput: index,
    //                                         }));
    //                                       }}
    //                                     >
    //                                       {list.label}
    //                                     </button>
    //                                   )
    //                                 )}
    //                               </>
    //                             </p>
    //                           </div>
    //                         </div>
    //                       )}
    //                     </div>
    //                   )}
    //                 </div>
    //               </li>
    //               <li style={{ "--i": 2 }} title="Bật / Tắt camera">
    //                 <div className="btn-group dropup">
    //                   <button
    //                     type="button"
    //                     onClick={() => executeCommand("toggleVideo")}
    //                     className={`btn-btn btn btn-secondary ${
    //                       isVideoMuted ? "bg-light" : "bg-dark"
    //                     }`}
    //                   >
    //                     <i
    //                       className={`fas grey-color ${
    //                         isVideoMuted ? "fa-video" : "fa-video-slash"
    //                       } `}
    //                       aria-hidden="true"
    //                     ></i>
    //                   </button>
    //                   <DropdownCameras
    //                     getAvailableDevicesVideoInput={
    //                       getAvailableDevicesVideoInput
    //                     }
    //                     setDevice={setDevice}
    //                     setChoose={setChoose}
    //                     choose={choose}
    //                     setCamDrop={setCamDrop}
    //                     camDrop={camDrop}
    //                     setMicDrop={setMicDrop}
    //                     setOption={setOption}
    //                     handleCancel={handleCancel}
    //                   />
    //                   {camDrop && (
    //                     <div
    //                       className="dropdown-menu-toggle"
    //                       style={{
    //                         margin: "unset",
    //                         display: "none",
    //                         // transform: "translate3d(49px, -100px, 0px)",
    //                       }}
    //                     >
    //                       {getAvailableDevicesVideoInput && (
    //                         <div
    //                           className="card text-white bg-dark"
    //                           style={{ margin: "unset" }}
    //                         >
    //                           <div className="card-header">
    //                             <i className="fas fa-video"></i> Camera
    //                           </div>
    //                           <div
    //                             className="card-body bg-secondary"
    //                             style={{ padding: "unset" }}
    //                           >
    //                             <p className="card-text">
    //                               <>
    //                                 {getAvailableDevicesVideoInput.map(
    //                                   (list, index) => (
    //                                     <button
    //                                       key={index}
    //                                       className={`dropdown-item ${
    //                                         choose.videoInput === index
    //                                           ? "active"
    //                                           : ""
    //                                       }`}
    //                                       onClick={() => {
    //                                         setDevice(
    //                                           "setVideoInputDevice",
    //                                           list.label,
    //                                           list.deviceId
    //                                         );
    //                                         setChoose((pre) => ({
    //                                           ...pre,
    //                                           videoInput: index,
    //                                         }));
    //                                       }}
    //                                     >
    //                                       {list.label}
    //                                     </button>
    //                                   )
    //                                 )}
    //                               </>
    //                             </p>
    //                           </div>
    //                         </div>
    //                       )}
    //                     </div>
    //                   )}
    //                 </div>
    //               </li>
    //               <li style={{ "--i": 3 }} title="Mở / Đóng chia sẻ màn hình">
    //                 <button
    //                   id="toggleShareScreen"
    //                   className={`btn-btn btn btn-secondary ${
    //                     shareScreen ? "bg-light" : "bg-dark"
    //                   }`}
    //                   onClick={() => executeCommand("toggleShareScreen")}
    //                 >
    //                   <i
    //                     className="fas grey-color fa-share-square"
    //                     aria-hidden="true"
    //                   ></i>
    //                 </button>
    //               </li>
    //               <li style={{ "--i": 4 }} title="Giơ / Hạ tay">
    //                 <button
    //                   id="toggleHand"
    //                   onClick={() => executeCommand("toggleHand")}
    //                   className={`btn-btn btn btn-secondary ${
    //                     isHand ? "bg-light" : "bg-dark"
    //                   }`}
    //                 >
    //                   <i
    //                     className={`fas fa-hand-paper ${
    //                       isHand ? "bg-light" : "bg-dark"
    //                     }`}
    //                   ></i>
    //                 </button>
    //               </li>
    //               <li style={{ "--i": 5 }} title="Mở / Đóng thảo luận">
    //                 {unreadCount > 0 && (
    //                   <div className="dropup">
    //                     <button
    //                       type="button"
    //                       className="btn btn-danger"
    //                       onClick={() => executeCommand("toggleChat")}
    //                       style={{
    //                         position: "absolute",
    //                         top: "-14px",
    //                         padding: "2px",
    //                         width: "26px",
    //                         left: "25px",
    //                       }}
    //                     >
    //                       {unreadCount}
    //                     </button>
    //                   </div>
    //                 )}
    //                 <button
    //                   onClick={() => executeCommand("toggleChat")}
    //                   className={`btn-btn btn btn-secondary ${
    //                     isChat ? "bg-light" : "bg-dark"
    //                   }`}
    //                 >
    //                   <i
    //                     className={`fas fa-comment-alt ${
    //                       isChat ? "bg-light" : "bg-dark"
    //                     }`}
    //                   ></i>
    //                 </button>
    //               </li>
    //               {window.innerWidth > 600 && (
    //                 <>
    //                   <li style={{ "--i": 6 }} title="Những người tham dự">
    //                     <button
    //                       id="toggleParticipantsPane"
    //                       onClick={() =>
    //                         executeCommand("toggleParticipantsPane")
    //                       }
    //                       className={`btn-btn btn btn-secondary ${
    //                         isParticipants ? "bg-light" : "bg-dark"
    //                       }`}
    //                     >
    //                       <i
    //                         className={`fas fa-user-friends ${
    //                           isParticipants ? "bg-light" : "bg-dark"
    //                         }`}
    //                       ></i>
    //                     </button>
    //                   </li>
    //                   <li style={{ "--i": 7 }} title="Mở / Đóng xem dạng lưới">
    //                     <Dropdown
    //                       menu={{
    //                         items: [
    //                           {
    //                             key: "tile",
    //                             type: "group",
    //                             label: (
    //                               <b style={{ color: "#000" }}>
    //                                 Thiết lập hiển thị
    //                               </b>
    //                             ),
    //                             children: [
    //                               {
    //                                 key: "1",
    //                                 label: "1 màn hình chính",
    //                                 onClick: (e) => {
    //                                   setFirmstrip("1");
    //                                   executeCommand("resizeFilmStrip1");
    //                                 },
    //                               },
    //                               {
    //                                 key: "2",
    //                                 label: "2 màn hình chính",
    //                                 onClick: (e) => {
    //                                   setFirmstrip("2");
    //                                   executeCommand("resizeFilmStrip2");
    //                                 },
    //                               },
    //                               {
    //                                 key: "4",
    //                                 label: "4 màn hình chính",
    //                                 onClick: (e) => {
    //                                   setFirmstrip("4");
    //                                   executeCommand("resizeFilmStrip4");
    //                                 },
    //                               },
    //                               {
    //                                 key: "6",
    //                                 label: "6 màn hình chính",
    //                                 onClick: (e) => {
    //                                   setFirmstrip("6");
    //                                   executeCommand("resizeFilmStrip6");
    //                                 },
    //                               },
    //                             ],
    //                           },
    //                           {
    //                             key: "firmstrip",
    //                             type: "group",
    //                             label: (
    //                               <b style={{ color: "#000" }}>Tùy chọn thêm</b>
    //                             ),
    //                             children: [
    //                               {
    //                                 key: "hiden",
    //                                 label:
    //                                   // "Ẩn/hiện thanh dọc hiển thị người tham gia",
    //                                   "Ẩn/hiện menu họp trực tuyến",
    //                                 onClick: (e) =>
    //                                   setTileViewCount(
    //                                     tileViewCount === "show"
    //                                       ? "hide"
    //                                       : "show"
    //                                   ),
    //                               },
    //                               // {
    //                               //   key: "show",
    //                               //   label: "Hiện",
    //                               //   onClick: (e) => setTileViewCount("show"),
    //                               // },
    //                               {
    //                                 key: "toggleTileView",
    //                                 // type: "group",
    //                                 label: (
    //                                   <>
    //                                     {isToggleTileView ? "Đóng" : "Mở"}
    //                                     {" xem dạng lưới"}
    //                                   </>
    //                                 ),
    //                                 onClick: () =>
    //                                   executeCommand("toggleTileView"),
    //                               },
    //                             ],
    //                           },
    //                         ],
    //                         selectable: true,
    //                         selectedKeys: [firmstrip, tileViewCount],
    //                       }}
    //                     >
    //                       <button
    //                         id="toggleTileView"
    //                         // onClick={() => executeCommand("toggleTileView")}
    //                         className={`btn-btn btn btn-secondary ${
    //                           isToggleTileView ? "bg-light" : "bg-dark"
    //                         }`}
    //                       >
    //                         <i
    //                           className={`fas fa-th-large ${
    //                             isToggleTileView ? "bg-light" : "bg-dark"
    //                           }`}
    //                         ></i>
    //                       </button>
    //                     </Dropdown>
    //                     <div className="btn-group dropup"></div>
    //                   </li>
    //                   <li style={{ "--i": 8 }} title="Chức năng khác">
    //                     <Dropdown
    //                       menu={{
    //                         items: [
    //                           {
    //                             key: "tile",
    //                             type: "group",
    //                             label: (
    //                               <b style={{ color: "#000" }}>
    //                                 Chức năng khác
    //                               </b>
    //                             ),
    //                             children: [
    //                               {
    //                                 key: "1",
    //                                 label: "Thông tin cá nhân",
    //                                 icon: <i className="fas fa-user" />,
    //                                 onClick: () => {
    //                                   showModal();
    //                                   setOption(!option);
    //                                   setModalForm("display");
    //                                 },
    //                               },
    //                               {
    //                                 key: "2",
    //                                 label: "Chọn ảnh nền",
    //                                 icon: <i className="far fa-image" />,
    //                                 onClick: () => {
    //                                   executeCommand("background");
    //                                 },
    //                               },
    //                               owner === 1 && {
    //                                 key: "3",
    //                                 label:
    //                                   (!lobby ? "Mở" : "Tắt") +
    //                                   " chế độ sảnh chờ",
    //                                 icon: <i className="fas fa-users" />,
    //                                 onClick: () => {
    //                                   executeCommand("lobby", !lobby);
    //                                   setLobby(!lobby);
    //                                 },
    //                               },
    //                               {
    //                                 key: "4",
    //                                 label: "Đường dẫn phòng họp",
    //                                 icon: <i className="fas fa-link" />,
    //                                 onClick: () => {
    //                                   showModal();
    //                                   setOption(!option);
    //                                   setModalForm("link");
    //                                 },
    //                               },
    //                               owner === 1 && {
    //                                 key: "5",
    //                                 label: "Mật khẩu phòng họp",
    //                                 icon: <i className="fas fa-unlock-alt" />,
    //                                 onClick: () => {
    //                                   showModal();
    //                                   setOption(!option);
    //                                   setModalForm("password");
    //                                 },
    //                               },
    //                               {
    //                                 key: "6",
    //                                 label: "Cài đặt hiệu suất",
    //                                 icon: (
    //                                   <i className="fas fa-tachometer-alt" />
    //                                 ),
    //                                 onClick: () => {
    //                                   showModal();
    //                                   setOption(!option);
    //                                   setModalForm("videoquality");
    //                                 },
    //                               },
    //                               // {
    //                               //   key: "7",
    //                               //   label:
    //                               //     (!recording ? "Bắt đầu" : "Kết thúc") +
    //                               //     " ghi hình",
    //                               //   icon: <i className="fas fa-record-vinyl" />,
    //                               //   onClick: () => {
    //                               //     if (recording) {
    //                               //       executeCommand("recording");
    //                               //     } else {
    //                               //       showModal();
    //                               //       setOption(!option);
    //                               //       setModalForm("recording");
    //                               //     }
    //                               //   },
    //                               // },
    //                               {
    //                                 key: "7.1",
    //                                 label:
    //                                   (!testRecord ? "Bắt đầu" : "Kết thúc") +
    //                                   " ghi hình",
    //                                 icon: <i className="fas fa-record-vinyl" />,
    //                                 onClick: () => {
    //                                   setTestRecord(!testRecord);
    //                                 },
    //                               },
    //                               {
    //                                 key: "8",
    //                                 label:
    //                                   (!shareVideo ? "Bắt đầu" : "Dừng") +
    //                                   " chia sẻ video",
    //                                 icon: <i className="far fa-play-circle" />,
    //                                 onClick: () => {
    //                                   if (shareVideo) {
    //                                     executeCommand("sharevideo");
    //                                   } else {
    //                                     showModal();
    //                                     setOption(!option);
    //                                     setModalForm("sharevideo");
    //                                   }
    //                                 },
    //                               },
    //                               {
    //                                 key: "9",
    //                                 label:
    //                                   (!noise ? "Bật" : "Tắt") + " cách âm",
    //                                 icon: <i className="fas fa-wave-square" />,
    //                                 onClick: () => {
    //                                   setNoise(!noise);
    //                                   executeCommand(
    //                                     "noisesuppression",
    //                                     !noise
    //                                   );
    //                                 },
    //                               },
    //                               {
    //                                 key: "10",
    //                                 label: "Phím tắt",
    //                                 icon: <i className="far fa-file-alt" />,
    //                                 onClick: () => {
    //                                   showModal();
    //                                   setOption(!option);
    //                                   setModalForm("keyboard");
    //                                 },
    //                               },
    //                             ],
    //                           },
    //                         ],
    //                         selectable: true,
    //                         selectedKeys: [
    //                           lobby === true && "3",
    //                           recording === true && "7",
    //                           testRecord === true && "7.1",
    //                           shareVideo === true && "8",
    //                           noise === true && "9",
    //                         ],
    //                       }}
    //                     >
    //                       <button
    //                         className="btn-btn bg-dark btn btn-secondary"
    //                         onClick={() => {
    //                           setOption(!option);
    //                           setMicDrop(false);
    //                           setCamDrop(false);
    //                           handleCancel();
    //                         }}
    //                         onMouseEnter={() => {
    //                           setOption(!option);
    //                           setMicDrop(false);
    //                           setCamDrop(false);
    //                           handleCancel();
    //                         }}
    //                       >
    //                         <i className="fas fa-ellipsis-h"></i>
    //                       </button>
    //                     </Dropdown>
    //                   </li>
    //                 </>
    //               )}

    //               <li style={{ "--i": 9 }} title="Thoát">
    //                 <button
    //                   className="btn-btn bg-danger btn btn-secondary"
    //                   onClick={() => {
    //                     executeCommand("toggleHangup");
    //                     // if (owner === 1) {
    //                     //   new Api().schedule_start({
    //                     //     token: JSON.parse(
    //                     //       sessionStorage.getItem(SESSION_STORAGE)
    //                     //     )?.access_token,
    //                     //     id: meetingData?.id,
    //                     //     data: {
    //                     //       start: false,
    //                     //       modifiedBy: user?.id,
    //                     //       modifiedDate: new Date(),
    //                     //     },
    //                     //   });
    //                     //   new Api().schedule_status({
    //                     //     token: JSON.parse(
    //                     //       sessionStorage.getItem(SESSION_STORAGE)
    //                     //     )?.access_token,
    //                     //     id: meetingData?.id,
    //                     //     data: {
    //                     //       status: 3,
    //                     //       modifiedBy: user?.id,
    //                     //       modifiedDate: new Date(),
    //                     //     },
    //                     //   });
    //                     // }
    //                   }}
    //                 >
    //                   <i className="fas fa-phone-slash" aria-hidden="true"></i>
    //                 </button>
    //               </li>
    //             </div>
    //           </div>
    //         </footer>
    //         {modalForm && (
    //           <Modal
    //             // style={{ position: 'absolute', background: '#fff' }}
    //             title={
    //               modalForm.includes("display")
    //                 ? "Thông tin cá nhân"
    //                 : modalForm.includes("password")
    //                 ? "Mật khẩu phòng họp"
    //                 : modalForm.includes("livestream")
    //                 ? "Mã (key) phát trực tiếp"
    //                 : modalForm.includes("recording")
    //                 ? "Ghi hình cuộc họp"
    //                 : modalForm.includes("videoquality")
    //                 ? "Điều chỉnh chất lượng đầu thu hình ảnh"
    //                 : modalForm.includes("sharevideo")
    //                 ? "Chia sẻ video"
    //                 : modalForm.includes("link")
    //                 ? "Đường dẫn phòng họp"
    //                 : modalForm.includes("keyboard") && "Danh sách phím tắt"
    //             }
    //             open={isModalOpen}
    //             onOk={handleOk}
    //             onCancel={handleCancel}
    //             width={window.innerWidth / 2}
    //           >
    //             {modalForm.includes("display") && (
    //               <>
    //                 <div className="row">
    //                   <div className="col-6">
    //                     <label htmlFor="name">Tên hiển thị</label>
    //                     <Input
    //                       id="name"
    //                       placeholder="Nhập tên hiển thị"
    //                       value={name}
    //                       onChange={(e) => setName(e.target.value)}
    //                     />
    //                   </div>
    //                   <div className="col-6">
    //                     <label htmlFor="email">Email</label>
    //                     <Input
    //                       id="email"
    //                       placeholder="Nhập email"
    //                       value={email}
    //                       onChange={(e) => setEmail(e.target.value)}
    //                     />
    //                   </div>
    //                 </div>
    //               </>
    //             )}
    //             {modalForm.includes("password") && (
    //               <>
    //                 <label htmlFor="pass">Nhập mật khẩu</label>
    //                 <Input.Password
    //                   id="pass"
    //                   placeholder="Nhập mật khẩu"
    //                   value={password}
    //                   onChange={(e) => setPassword(e.target.value)}
    //                 />
    //               </>
    //             )}
    //             {modalForm.includes("livestream") && (
    //               <>
    //                 <label htmlFor="key">
    //                   Nhập key phát trực tiếp từ kênh Youtube của bạn
    //                 </label>
    //                 <Input
    //                   id="key"
    //                   placeholder="Nhập key phát trực tiếp từ kênh Youtube của bạn"
    //                   value={streamKey}
    //                   onChange={(e) => setStreamKey(e.target.value)}
    //                 />
    //               </>
    //             )}
    //             {modalForm.includes("recording") && (
    //               <>
    //                 <label>
    //                   Cho phép chỉ ghi hình âm thanh và hình ảnh của bản thân
    //                 </label>
    //                 <Switch checked={self} onChange={(e) => setSelf(e)} />
    //               </>
    //             )}
    //             {modalForm.includes("keyboard") && (
    //               <>
    //                 <ul>
    //                   <li>
    //                     <kbd>F</kbd> - Hiển thị hoặc ẩn danh sách các video thu
    //                     nhỏ bên phải
    //                   </li>
    //                   <li>
    //                     <kbd>M</kbd> - Tắt hoặc bật đầu thu âm thanh
    //                     (microphone) của bạn
    //                   </li>
    //                   <li>
    //                     <kbd>V</kbd> - Tắt hoặc bật đầu thu hình ảnh (camera)
    //                     của bạn
    //                   </li>
    //                   <li>
    //                     <kbd>A</kbd> - Quản lý chất lượng hình ảnh của bạn
    //                   </li>
    //                   <li>
    //                     <kbd>C</kbd> - Mở hoặt đóng cuộc trò chuyện
    //                   </li>
    //                   <li>
    //                     <kbd>D</kbd> - Chuyển đổi giữa hình ảnh và chia sẻ màn
    //                     hình
    //                   </li>
    //                   <li>
    //                     <kbd>P</kbd> - Hiển thị hoặc ẩn danh sách người tham gia
    //                   </li>
    //                   <li>
    //                     <kbd>R</kbd> - Nâng hoặc hạ tay của bạn
    //                   </li>
    //                   <li>
    //                     <kbd>S</kbd> - Xem hoặc thoát xem toàn màn hình
    //                   </li>
    //                   <li>
    //                     <kbd>W</kbd> - Chuyển đổi chế độ xem ô xếp
    //                   </li>
    //                   <li>
    //                     <kbd>?</kbd> - Hiển thị hoặc ẩn danh sách phím tắt
    //                   </li>
    //                   <li>
    //                     <kbd>SPACE</kbd> - Ấn giữ phím cách (space) để nói
    //                     chuyện
    //                   </li>
    //                   <li>
    //                     <kbd>T</kbd> - Hiển thị số liệu thống kê về thời gian sử
    //                     dụng đầu thu âm thanh (microphone)
    //                   </li>
    //                   <li>
    //                     <kbd>0</kbd> - (Ghim) Tập trung vào hình ảnh của bạn
    //                   </li>
    //                   <li>
    //                     <kbd>1</kbd>-<kbd>9</kbd> - (Ghim) Tập trung vào hình
    //                     ảnh của người khác
    //                   </li>
    //                 </ul>
    //               </>
    //             )}
    //             {modalForm.includes("link") && (
    //               <>
    //                 {/* <Input id="roomLink" disabled value={roomLink} />
    //               <button onClick={() => onCopyLink(roomLink)}>Sao chép</button> */}
    //                 <div className="input-group mb-3">
    //                   <input
    //                     type="text"
    //                     className="form-control"
    //                     id="roomLink"
    //                     placeholder="Url"
    //                     disabled
    //                     defaultValue={roomLink}
    //                   />
    //                   <div className="input-group-append">
    //                     <button
    //                       className="btn btn-outline-secondary"
    //                       type="button"
    //                       id="button-addon2"
    //                       onClick={() => onCopyLink(roomLink)}
    //                     >
    //                       Copy
    //                     </button>
    //                   </div>
    //                 </div>
    //               </>
    //             )}
    //             {modalForm.includes("sharevideo") && (
    //               <>
    //                 <label htmlFor="url">Nhập đường dẫn</label>
    //                 <Input
    //                   id="url"
    //                   placeholder="Nhập đường dẫn"
    //                   value={url}
    //                   onChange={(e) => setUrl(e.target.value)}
    //                 />
    //               </>
    //             )}
    //             {modalForm.includes("videoquality") && (
    //               <>
    //                 <label htmlFor="pass">
    //                   {"Chọn chất lượng video: " +
    //                     apiRef.current.getVideoQuality() +
    //                     "p"}
    //                 </label>
    //                 <Slider
    //                   // min={0}
    //                   // max={1080}
    //                   tooltip={{
    //                     formatter: null,
    //                   }}
    //                   marks={{
    //                     0: "144p",
    //                     14.28571428571429: "240p",
    //                     28.57142857142858: "360p",
    //                     42.85714285714287: "480p",
    //                     57.14285714285716: "720p",
    //                     71.42857142857145: "1080p60 (HD)",
    //                     85.71428571428574: "1440p60 (HD)",
    //                     100: "2160p60 (4K)",
    //                   }}
    //                   step={null}
    //                   // defaultValue={quality}
    //                   // value={quality}
    //                   onChange={(e) => {
    //                     setQuality(e);
    //                     //console.log(e);
    //                     switch (e) {
    //                       case 0:
    //                         executeCommand("videoquality", 144);
    //                         break;
    //                       case 14.28571428571429:
    //                         executeCommand("videoquality", 240);
    //                         break;
    //                       case 28.57142857142858:
    //                         executeCommand("videoquality", 360);
    //                         break;
    //                       case 42.85714285714287:
    //                         executeCommand("videoquality", 480);
    //                         break;
    //                       case 57.14285714285716:
    //                         executeCommand("videoquality", 720);
    //                         break;
    //                       case 71.42857142857145:
    //                         executeCommand("videoquality", 1080);
    //                         break;
    //                       case 85.71428571428574:
    //                         executeCommand("videoquality", 1440);
    //                         break;
    //                       case 100:
    //                         executeCommand("videoquality", 2160);
    //                         break;

    //                       default:
    //                         break;
    //                     }
    //                   }}
    //                   onAfterChange={() => {}}
    //                 />
    //               </>
    //             )}
    //           </Modal>
    //         )}
    //       </>
    //     )}
    // </>
    <></>
  );
}

export function DropdownCameras({
  getAvailableDevicesVideoInput,
  setDevice,
  setChoose,
  choose,
  setCamDrop,
  camDrop,
  setMicDrop,
  setOption,
  handleCancel,
}) {
  const [cameras, setCameras] = useState([]);
  const [videoStreams, setVideoStreams] = useState([]);

  // Get list of available cameras when component mounts
  useEffect(() => {
    const getCameras = async () => {
      const devices = await navigator?.mediaDevices?.enumerateDevices();
      const videoDevices = devices?.filter(
        (device) => device?.kind === "videoinput"
      );
      setCameras(videoDevices);
    };

    getCameras();
  }, []);

  // Start video streams for all available cameras
  useEffect(() => {
    const startStreams = async () => {
      const streams = [];

      for (let camera of cameras) {
        try {
          const stream = await navigator?.mediaDevices?.getUserMedia({
            video: { deviceId: camera?.deviceId },
          });
          streams.push(stream);
        } catch (err) {
          console.error(`Error accessing camera ${camera?.deviceId}:`, err);
        }
      }

      setVideoStreams(streams);
    };

    if (cameras?.length > 0) {
      startStreams();
    }
  }, [cameras]);

  // Stop all video streams when the component unmounts
  useEffect(() => {
    return () => {
      videoStreams.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
    };
  }, [videoStreams]);

  return (
    <>
      <Dropdown
        trigger={["click"]}
        menu={{
          items:
            videoStreams &&
            videoStreams.map((stream, index) => ({
              key: cameras[index].deviceId,
              label: (
                <div
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: "200px",
                  }}
                >
                  <span
                    style={{
                      background: "#2b2b2b",
                      color: "#fff",
                      borderRadius: "5px",
                      position: "absolute",
                      textOverflow: "ellipsis",
                    }}
                    title={cameras[index].label || `Camera ${index + 1}`}
                  >
                    {cameras[index].label || `Camera ${index + 1}`}
                  </span>
                  <video
                    autoPlay
                    muted
                    playsInline
                    style={{ width: "200px", height: "auto" }}
                    ref={(video) => {
                      if (video && stream) {
                        video.srcObject = stream;
                      }
                    }}
                  />
                </div>
              ),
              onClick: (e) => {
                setDevice(
                  "setVideoInputDevice",
                  cameras[index].label,
                  cameras[index].label
                );
                setChoose((pre) => ({
                  ...pre,
                  videoInput: cameras[index].label,
                }));
              },
            })),
          selectable: true,
          selectedKeys: [choose.videoInput],
        }}
        placement="topLeft"
        // arrow
      >
        <button
          type="button"
          className="btn btn-secondary dropdown-toggle-split"
          onClick={() => {
            setCamDrop(!camDrop);
            setMicDrop(false);
            setOption(false);
            handleCancel();
          }}
          onMouseEnter={() => {
            setCamDrop(!camDrop);
            setMicDrop(false);
            setOption(false);
            handleCancel();
          }}
        >
          <CaretUpOutlined />
        </button>
      </Dropdown>
    </>
  );
}

export function DropdownAudioInputOutput({
  getAvailableDevicesAudioInput,
  setDevice,
  setChoose,
  getAvailableDevicesAudioOutput,
  choose,
  setMicDrop,
  micDrop,
  setCamDrop,
  setOption,
  handleCancel,
}) {
  return (
    <>
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            {
              key: "Microphones",
              type: "group",
              label: (
                <b style={{ color: "#000" }}>
                  <i className="fas fa-microphone"></i> Microphones
                </b>
              ),
              children:
                getAvailableDevicesAudioInput &&
                getAvailableDevicesAudioInput.map((list, index) => ({
                  key: list.label,
                  label: list.label,
                  onClick: (e) => {
                    setDevice("setAudioInputDevice", list.label, list.label);
                    setChoose((pre) => ({
                      ...pre,
                      audioInput: list.label,
                    }));
                  },
                })),
            },
            {
              type: "divider",
            },
            {
              key: "Loa",
              type: "group",
              label: (
                <b style={{ color: "#000" }}>
                  <i className="fas fa-volume-up"></i> Loa
                </b>
              ),
              children:
                getAvailableDevicesAudioOutput &&
                getAvailableDevicesAudioOutput.map((list, index) => ({
                  key: list.label,
                  label: list.label,
                  onClick: (e) => {
                    setDevice("setAudioOutputDevice", list.label, list.label);
                    setChoose((pre) => ({
                      ...pre,
                      audioOutput: list.label,
                    }));
                  },
                })),
            },
          ],
          selectable: true,
          selectedKeys: [choose.audioInput, choose.audioOutput],
        }}
        placement="topLeft"
        // arrow
      >
        <button
          type="button"
          className="btn btn-secondary dropdown-toggle-split"
          onClick={() => {
            setMicDrop(!micDrop);
            setCamDrop(false);
            setOption(false);
            handleCancel();
          }}
          onMouseEnter={() => {
            setMicDrop(!micDrop);
            setCamDrop(false);
            setOption(false);
            handleCancel();
          }}
        >
          <CaretUpOutlined />
        </button>
      </Dropdown>
    </>
  );
}
