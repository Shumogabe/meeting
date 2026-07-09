import React, { useLayoutEffect, useState } from "react";
import { DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import Api from "../../api";
import Message from "../../components/Message";
import ScrollbarsCustum from "../../components/ScrollbarsCustum";
import { SwalAlertAllConfiguration } from "../../components/Swal";
import { SESSION_STORAGE } from "../../config";
import { HREF } from "../../constants/dictionaries";
import MyEditor from "../../helper/ckeditor";
import Helper from "../../helper/helper";

let timeoutDonViQuanTriVanHanh;
let timeoutDonViChuQuan;
// let timeoutHeDieuHanh;
let timeoutDichVuDaCap;
let currentValueDonViQuanTriVanHanh;
let currentValueDonViChuQuan;
// let currentValueHeDieuHanh;
let currentValueDichVuDaCap;

export default function ThemSua({
  edit,
  onHandleCancel,
  setScheduleId,
  scheduleId,
}) {
  // const scrollBarRefDichVuThemSua = useRef();
  const [title, setTitle] = useState();
  const [hrefPageMain, setHrefPageMain] = useState();
  const isEdit =
    window.location.pathname.includes("/cap-nhat") &&
    window.location.search.includes("?id=")
      ? true
      : false;

  // const [thongSoMayChu, setThongSoMayChu] = useState([
  //   {
  //     iD_ThongTinDangKyDichVu: "",
  //     cpu: "",
  //     ram: "",
  //     oCung: "",
  //     heDieuHanh: "",
  //     upload: "",
  //     download: "",
  //     countIPv4: "",
  //     countIPv6: "",
  //     phanMem: "",
  //   },
  // ]);

  const [thongSoMayChuDaCap, setThongSoMayChuDaCap] = useState([]);

  const [dichVu, setDichVu] = useState("");
  const [dichVuUrl, setDichVuUrl] = useState("");

  const [oldData, setOldData] = useState({});
  const [data, setData] = useState({});
  const [filter, setFilter] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);

  const [donViQuanTriVanHanhOptions, setDonViQuanTriVanHanhOptions] = useState(
    []
  );

  const [donViChuQuanOptions, setDonViChuQuanOptions] = useState([]);

  const [heDieuHanhOptions, setHeDieuHanhOptions] = useState([]);
  const [dichVuDaCapOptions, setDichVuDaCapOptions] = useState([]);

  // useEffect(() => {
  //   if (data.donViChuQuan) {
  //     // Nếu đơn vị chủ quản được chọn
  //     GetList_ThongTinDonViQuanTriVanHanh(
  //       "",
  //       setDonViQuanTriVanHanhOptions,
  //       data.donViChuQuan
  //     );
  //   }
  // }, [data.donViChuQuan]);

  const GetList_ThongTinDonViQuanTriVanHanh = (value, callback, parent_id) => {
    if (timeoutDonViQuanTriVanHanh) {
      clearTimeout(timeoutDonViQuanTriVanHanh);
      timeoutDonViQuanTriVanHanh = null;
    }
    currentValueDonViQuanTriVanHanh = value;
    const fake = () => {
      new Api()
        .GetList_ThongTinDonVi({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          strSearch: currentValueDonViQuanTriVanHanh,
          isDeleted: 0,
          parent_id: parent_id || 0,
        })
        .then((res) => {
          if (currentValueDonViQuanTriVanHanh === value) {
            let dataOption = [];
            if (res && res?.data?.data) {
              dataOption = res?.data?.data.map((item) => ({
                value: item?.id,
                label: item?.ten_day_du,
              }));
            }
            callback(dataOption);
          }
        })
        .catch((err) => Message.error(err.message));
    };
    if (value === null) {
      callback([]);
    } else {
      timeoutDonViQuanTriVanHanh = setTimeout(fake, 800);
    }
  };

  const GetList_ThongTinDonViChuQuan = (value, callback) => {
    if (timeoutDonViChuQuan) {
      clearTimeout(timeoutDonViChuQuan);
      timeoutDonViChuQuan = null;
    }
    currentValueDonViChuQuan = value;
    const fake = () => {
      new Api()
        .GetList_ThongTinDonVi({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          strSearch: currentValueDonViChuQuan,
          isDeleted: 0,
        })
        .then((res) => {
          if (currentValueDonViChuQuan === value) {
            const dataOption =
              res &&
              res?.data?.data.map((item) => ({
                // ...item,
                value: item?.id,
                label: item?.ten_day_du,
              }));
            callback(dataOption);
          }
        })
        .catch((err) => Message.error(err.message));
    };
    if (value === null) {
      callback([]);
    } else {
      timeoutDonViChuQuan = setTimeout(fake, 800);
    }
  };

  //   const GetList_ThongTinHeDieuHanh = (value, callback) => {
  //     if (timeoutHeDieuHanh) {
  //       clearTimeout(timeoutHeDieuHanh);
  //       timeoutHeDieuHanh = null;
  //     }
  //     currentValueHeDieuHanh = value;
  //     const fake = () => {
  //       new Api()
  //         .GetList_ThongTinHeDieuHanh({
  //           token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
  //           strSearch: currentValueHeDieuHanh,
  //           isDeleted: false,
  //           tinhtrang: true,
  //         })
  //         .then((res) => {
  //           if (currentValueHeDieuHanh === value) {
  //             const dataOption =
  //               res &&
  //               res?.data?.data.map((item) => ({
  //                 // ...item,
  //                 value: item?.id,
  //                 label: item?.ten,
  //               }));
  //             callback(dataOption);
  //           }
  //         })
  //         .catch((err) => Message.error(err.message));
  //     };
  //     if (value === null) {
  //       callback([]);
  //     } else {
  //       timeoutHeDieuHanh = setTimeout(fake, 800);
  //     }
  //   };

  const GetList_DichVuDaCap = (value, callback) => {
    if (timeoutDichVuDaCap) {
      clearTimeout(timeoutDichVuDaCap);
      timeoutDichVuDaCap = null;
    }
    currentValueDichVuDaCap = value;
    const fake = () => {
      new Api()
        .GetList_ThongTinDangKyDichVu({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          tinhtrang: 7,
          loaidichvu: 1,
          strSearch: currentValueDichVuDaCap,
          isDeleted: false,
        })
        .then((res) => {
          if (currentValueDichVuDaCap === value) {
            const dataOption =
              res &&
              res?.data?.data.map((item) => ({
                // ...item,
                value: item?.id,
                label: item?.tieuDe,
              }));
            callback(dataOption);
          }
        })
        .catch((err) => Message.error(err.message));
    };
    if (value === null) {
      callback([]);
    } else {
      timeoutDichVuDaCap = setTimeout(fake, 800);
    }
  };

  const GetDichVuDaCap = (id) => {
    if (!Helper.isNullOrUndefined(id)) {
      new Api()
        .Get_ThongTinDangKyDichVu({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
        })
        .then((res) => {
          if (
            res &&
            !Helper.isNullOrUndefined(res?.thongTinDangKy) &&
            !isEdit
          ) {
            setData((pre) => ({
              ...pre,
              dienThoai: res?.thongTinDangKy?.dienThoai,
              email: res?.thongTinDangKy?.email,
              tenHeThongThongTin: res?.thongTinDangKy?.tenHeThongThongTin,
              tenDuAn: res?.thongTinDangKy?.tenDuAn,
              donViChuQuan: res?.thongTinDangKy?.donViChuQuan,
              donViQuanTriVanHanh: res?.thongTinDangKy?.donViQuanTriVanHanh,
              ngayKetThucSuDung: res?.thongTinDangKy?.ngayKetThucSuDung,
              capDoHeThongThongTin: res?.thongTinDangKy?.capDoHeThongThongTin,
              canBoKyThuat: res?.thongTinDangKy?.canBoKyThuat,
            }));
          }
          if (res && res?.thongTinThongSoKyThuat?.length > 0)
            setThongSoMayChuDaCap(res && res?.thongTinThongSoKyThuat);
        })
        .catch((err) => Message.error(err.message));
    }
  };

  useLayoutEffect(() => {
    GetList_ThongTinDonViQuanTriVanHanh("", setDonViQuanTriVanHanhOptions);
    GetList_ThongTinDonViChuQuan("", setDonViChuQuanOptions);
    // GetList_ThongTinHeDieuHanh("", setHeDieuHanhOptions);
    GetList_DichVuDaCap("", setDichVuDaCapOptions);
    if (isEdit && isEdit === true) {
      GetDatas();
    } else {
      setData({});
    }
    var tite;
    switch (
      window.location.pathname
        .replace("/cac-don-vi", "")
        .replace("/them-moi", "")
        .replace("/cap-nhat", "")
    ) {
      case HREF.DANG_KY_CAP_DICH_VU:
        setDichVu("cấp");
        setDichVuUrl("cap");
        tite = "Đăng ký cấp dịch vụ";
        setHrefPageMain(HREF.DANG_KY_CAP_DICH_VU);
        break;
      case HREF.DANG_KY_DOI_DICH_VU:
        setDichVu("đổi");
        setDichVuUrl("doi");
        tite = "Đăng ký đổi dịch vụ";
        setHrefPageMain(HREF.DANG_KY_DOI_DICH_VU);
        break;
      case HREF.DANG_KY_HUY_DICH_VU:
        setDichVu("hủy");
        setDichVuUrl("huy");
        tite = "Đăng ký hủy dịch vụ";
        setHrefPageMain(HREF.DANG_KY_HUY_DICH_VU);
        break;
      default:
        window.location.href = "/";
        break;
    }
    setTitle(tite);
    document.title = isEdit === true ? `Sửa ${tite}` : `${tite}`;
  }, []);

  const GetDatas = () => {
    new Api()
      .Get_ThongTinDangKyDichVu({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: window.location.search.slice(1).split("&")[0].split("=")[1],
      })
      .then((res) => {
        if (res && res?.thongTinDangKy) {
          setData(res && res?.thongTinDangKy);
          setOldData(res && res?.thongTinDangKy);
          GetDichVuDaCap(res && res?.thongTinDangKy?.iD_ThongTinDangKyDichVu);
        }
        // if (res && res?.thongTinThongSoKyThuat?.length > 0)
        //   setThongSoMayChu(res && res?.thongTinThongSoKyThuat);
      });
    // .catch((err) => Message.error(err.message));
  };

  // const OnHanldeChangeThongSoKyThuat = (index, column, newValue) => {
  //   const objIndex = index;
  //   let updatedObj = { ...thongSoMayChu[objIndex], column: newValue };

  //   if (column === "cpu")
  //     updatedObj = { ...thongSoMayChu[objIndex], cpu: newValue };
  //   if (column === "ram")
  //     updatedObj = { ...thongSoMayChu[objIndex], ram: newValue };
  //   if (column === "oCung")
  //     updatedObj = { ...thongSoMayChu[objIndex], oCung: newValue };
  //   if (column === "heDieuHanh")
  //     updatedObj = { ...thongSoMayChu[objIndex], heDieuHanh: newValue };
  //   if (column === "upload")
  //     updatedObj = { ...thongSoMayChu[objIndex], upload: newValue };
  //   if (column === "download")
  //     updatedObj = { ...thongSoMayChu[objIndex], download: newValue };
  //   if (column === "countIPv4")
  //     updatedObj = { ...thongSoMayChu[objIndex], countIPv4: newValue };
  //   if (column === "countIPv6")
  //     updatedObj = { ...thongSoMayChu[objIndex], countIPv6: newValue };
  //   if (column === "phanMem")
  //     updatedObj = { ...thongSoMayChu[objIndex], phanMem: newValue };
  //   if (column === "ghiChu")
  //     updatedObj = { ...thongSoMayChu[objIndex], ghiChu: newValue };
  //   if (column === "column")
  //     updatedObj = { ...thongSoMayChu[objIndex], column: newValue };

  //   const updatedArray = [
  //     ...thongSoMayChu.slice(0, objIndex),
  //     updatedObj,
  //     ...thongSoMayChu.slice(objIndex + 1),
  //   ];
  //   setThongSoMayChu(updatedArray);
  // };

  const ChangeTab = () => {
    document
      .querySelector("#custom-tabs-four-thong-tin-chung-tab")
      .classList.remove("active");

    document
      .querySelector("#custom-tabs-four-thong-tin-chung-tab")
      .setAttribute("aria-selected", "false");

    document
      .querySelector("#custom-tabs-four-thong-tin-chung")
      .classList.remove("active", "show");

    document
      .querySelector("#custom-tabs-four-thong-so-may-chu-tab")
      .classList.add("active");

    document
      .querySelector("#custom-tabs-four-thong-so-may-chu-tab")
      .setAttribute("aria-selected", "true");

    document
      .querySelector("#custom-tabs-four-thong-so-may-chu")
      .classList.add("active", "show");
  };

  const OnClick = (tinhtrang) => {
    if (
      (dichVu === "đổi" || dichVu === "hủy") &&
      Helper.isNullOrUndefined(data?.iD_ThongTinDangKyDichVu)
    )
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa chọn dịch vụ đã cấp",
        timer: 3000,
      });
    if (Helper.isNullOrUndefined(data?.tieuDe))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập tiêu đề",
        timer: 3000,
      });
    if (Helper.isNullOrUndefined(data?.dienThoai))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập số điện thoại liên hệ",
        timer: 3000,
      });
    // if (Helper.isNullOrUndefined(data?.tenHeThongThongTin))
    //   return SwalAlertAllConfiguration({
    //     icon: "warning",
    //     title: "Chưa nhập tên hệ thống thông tin",
    //     timer: 3000,
    //   });
    // if (Helper.isNullOrUndefined(data?.tenDuAn))
    //   return SwalAlertAllConfiguration({
    //     icon: "warning",
    //     title: "Chưa nhập tên dự án",
    //     timer: 3000,
    //   });
    if (
      !Helper.isNullOrUndefined(donViQuanTriVanHanhOptions) &&
      Helper.isNullOrUndefined(data?.donViQuanTriVanHanh)
    )
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập đơn vị quản trị vận hành",
        timer: 3000,
      });
    if (Helper.isNullOrUndefined(data?.donViChuQuan))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập đơn vị chủ quản",
        timer: 3000,
      });
    // if (Helper.isNullOrUndefined(data?.capDoHeThongThongTin))
    //   return SwalAlertAllConfiguration({
    //     icon: "warning",
    //     title: "Chưa nhập cấp độ hệ thống thông tin",
    //     timer: 3000,
    //   });
    // if (Helper.isNullOrUndefined(data?.canBoKyThuat))
    //   return SwalAlertAllConfiguration({
    //     icon: "warning",
    //     title: "Chưa nhập cán bộ kỹ thuật",
    //     timer: 3000,
    //   });
    if (JSON.stringify(data) === JSON.stringify(oldData) && tinhtrang === 0)
      return ChangeTab();

    if (
      isEdit &&
      isEdit === true &&
      !Helper.isNullOrUndefined(
        JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.sub
      ) &&
      tinhtrang !== 0
    ) {
      new Api()
        .Update_ThongTinDangKyDichVu({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: data?.id,
          data: {
            ...data,
            email:
              JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
                ?.sub + "@monre.gov.vn",
            tinhTrang: tinhtrang,
            iD_ThongTinDangKyDichVu: Helper.isNullOrUndefined(
              data?.iD_ThongTinDangKyDichVu
            )
              ? "00000000-0000-0000-0000-000000000000"
              : data?.iD_ThongTinDangKyDichVu,
            donViQuanTriVanHanh: Helper.isNullOrUndefined(
              data?.donViQuanTriVanHanh
            )
              ? data?.donViChuQuan
              : data?.donViQuanTriVanHanh,
          },
        })
        .then((res) => {
          if (!Helper.isNullOrUndefined(res?.data)) {
            setData(res?.data);
            setOldData(res?.data);
            // ChangeTab();
            // if (
            //   !Helper.isNullOrUndefined(thongSoMayChu) &&
            //   hrefPageMain !== HREF.DANG_KY_HUY_DICH_VU
            // ) {
            //   thongSoMayChu.map((item, index) =>
            //     new Api()
            //       .Post_PostThongTinThongSoKyThuat({
            //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            //           ?.access_token,
            //         data: {
            //           ...item,
            //           heDieuHanh: Helper.isNullOrUndefined(item?.heDieuHanh)
            //             ? "00000000-0000-0000-0000-000000000000"
            //             : item?.heDieuHanh,
            //           iD_ThongTinDangKyDichVu: data?.id,
            //           countIPv4: Helper.isNullOrUndefined(item?.countIPv4)
            //             ? 1
            //             : item?.countIPv4,
            //           countIPv6: Helper.isNullOrUndefined(item?.countIPv6)
            //             ? 1
            //             : item?.countIPv6,
            //           cpu: Helper.isNullOrUndefined(item?.cpu) ? 0 : item?.cpu,
            //           ram: Helper.isNullOrUndefined(item?.ram) ? 0 : item?.ram,
            //           oCung: Helper.isNullOrUndefined(item?.oCung)
            //             ? 0
            //             : item?.oCung,
            //           upload: Helper.isNullOrUndefined(item?.upload)
            //             ? 0
            //             : item?.upload,
            //           download: Helper.isNullOrUndefined(item?.download)
            //             ? 0
            //             : item?.download,
            //         },
            //       })
            //       .then((res) => {
            //         // console.log(thongSoMayChu?.length);
            //         // console.log(index);
            //         if (index === 0 && res) {
            //           SwalAlertTimeRedirect({
            //             title:
            //               tinhtrang === 2
            //                 ? "Sửa đăng ký thành công"
            //                 : tinhtrang === 1 && "Lưu thành công", //"<strong>HTML <u>example</u></strong>",
            //             icon: "success", //"info",
            //             footer: null, //'<a href="">Why do I have this issue?</a>',
            //             timer: 3000, //1500,
            //             showConfirmButton: false,
            //             redirect: () => {
            //               window.location.href =(
            //                 window.location.pathname.replace("/cap-nhat", "")
            //               );
            //             },
            //           });
            //         }
            //       })
            //   );
            // } else {
            //   SwalAlertAllConfiguration({
            //     title: "Chưa điền thông số máy chủ",
            //     icon: "warning", //"info",
            //     footer: null, //'<a href="">Why do I have this issue?</a>',
            //     // timer: 3000, //1500,
            //   });
            //   // SwalAlertTimeRedirect({
            //   //   title:
            //   //     tinhtrang === 2
            //   //       ? "Đăng ký thành công"
            //   //       : tinhtrang === 1 && "Lưu thành công", //"<strong>HTML <u>example</u></strong>",
            //   //   icon: "success", //"info",
            //   //   footer: null, //'<a href="">Why do I have this issue?</a>',
            //   //   timer: 3000, //1500,
            //   //   showConfirmButton: false,
            //   //   redirect: () => {
            //   //     window.location.href =(
            //   //       window.location.pathname.replace("/cap-nhat", "")
            //   //     );
            //   //   },
            //   // });
            // }
            SwalAlertAllConfiguration({
              title:
                tinhtrang === 2
                  ? "Sửa đăng ký thành công"
                  : tinhtrang === 1 && "Lưu thành công", //"<strong>HTML <u>example</u></strong>",
              icon: "success", //"info",
              footer: null, //'<a href="">Why do I have this issue?</a>',
              timer: 3000, //1500,
              showConfirmButton: false,
            });
            onHandleCancel();
          }
        })
        .catch((err) => {
          SwalAlertAllConfiguration({
            title: err.message,
            icon: "error", //"info",
            footer: null, //'<a href="">Why do I have this issue?</a>',
            // timer: 3000, //1500,
          });
        });
    } else {
      if (tinhtrang === 0) {
        ChangeTab();
      } else {
        new Api()
          .Post_ThongTinDangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              ...data,
              email:
                JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
                  ?.sub + "@monre.gov.vn",
              iD_ThongTinDangKyDichVu: Helper.isNullOrUndefined(
                data?.iD_ThongTinDangKyDichVu
              )
                ? "00000000-0000-0000-0000-000000000000"
                : data?.iD_ThongTinDangKyDichVu,
              tinhTrang: tinhtrang,
              loaiDichVu:
                dichVuUrl === "cap"
                  ? 1
                  : dichVuUrl === "doi"
                  ? 2
                  : dichVuUrl === "huy"
                  ? 3
                  : dichVuUrl === "nhucau"
                  ? 4
                  : 5,
              donViQuanTriVanHanh: Helper.isNullOrUndefined(
                data?.donViQuanTriVanHanh
              )
                ? data?.donViChuQuan
                : data?.donViQuanTriVanHanh,
            },
          })
          .then((res) => {
            if (!Helper.isNullOrUndefined(res?.data)) {
              // Message.success("Thêm thành công");
              setData(res?.data);
              setOldData(res?.data);
              // ChangeTab();
              // if (
              //   thongSoMayChu?.length !== 0 &&
              //   hrefPageMain !== HREF.DANG_KY_HUY_DICH_VU
              // ) {
              //   thongSoMayChu.map((item, index) =>
              //     new Api()
              //       .Post_PostThongTinThongSoKyThuat({
              //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              //           ?.access_token,
              //         data: {
              //           ...item,
              //           heDieuHanh: Helper.isNullOrUndefined(item?.heDieuHanh)
              //             ? "00000000-0000-0000-0000-000000000000"
              //             : item?.heDieuHanh,
              //           iD_ThongTinDangKyDichVu: res?.data?.id,
              //           countIPv4: Helper.isNullOrUndefined(item?.countIPv4)
              //             ? 1
              //             : item?.countIPv4,
              //           countIPv6: Helper.isNullOrUndefined(item?.countIPv6)
              //             ? 1
              //             : item?.countIPv6,
              //           cpu: Helper.isNullOrUndefined(item?.cpu)
              //             ? 0
              //             : item?.cpu,
              //           ram: Helper.isNullOrUndefined(item?.ram)
              //             ? 0
              //             : item?.ram,
              //           oCung: Helper.isNullOrUndefined(item?.oCung)
              //             ? 0
              //             : item?.oCung,
              //           upload: Helper.isNullOrUndefined(item?.upload)
              //             ? 0
              //             : item?.upload,
              //           download: Helper.isNullOrUndefined(item?.download)
              //             ? 0
              //             : item?.download,
              //         },
              //       })
              //       .then((res) => {
              //         // console.log(thongSoMayChu?.length);
              //         // console.log(index);
              //         if (index === 0 && res) {
              //           SwalAlertTimeRedirect({
              //             title:
              //               tinhtrang === 2
              //                 ? "Đăng ký thành công"
              //                 : tinhtrang === 1 && "Lưu thành công", //"<strong>HTML <u>example</u></strong>",
              //             icon: "success", //"info",
              //             footer: null, //'<a href="">Why do I have this issue?</a>',
              //             timer: 3000, //1500,
              //             showConfirmButton: false,
              //             redirect: () => {
              //               window.location.href =(
              //                 window.location.pathname.replace("/them", "")
              //               );
              //             },
              //           });
              //         }
              //       })
              //   );
              // } else {
              //   SwalAlertTimeRedirect({
              //     title:
              //       tinhtrang === 2
              //         ? "Đăng ký thành công"
              //         : tinhtrang === 1 && "Lưu thành công", //"<strong>HTML <u>example</u></strong>",
              //     icon: "success", //"info",
              //     footer: null, //'<a href="">Why do I have this issue?</a>',
              //     timer: 3000, //1500,
              //     showConfirmButton: false,
              //     redirect: () => {
              //       window.location.href =(
              //         window.location.pathname.replace("/them", "")
              //       );
              //     },
              //   });
              // }
              SwalAlertAllConfiguration({
                title:
                  tinhtrang === 2
                    ? "Đăng ký thành công"
                    : tinhtrang === 1 && "Lưu thành công", //"<strong>HTML <u>example</u></strong>",
                icon: "success", //"info",
                footer: null, //'<a href="">Why do I have this issue?</a>',
                timer: 3000, //1500,
                showConfirmButton: false,
              });
              onHandleCancel();
            }
          })
          .catch((err) => {
            SwalAlertAllConfiguration({
              title: err.message,
              icon: "error", //"info",
              footer: null, //'<a href="">Why do I have this issue?</a>',
              timer: 3000, //1500,
            });
          });
      }
    }
  };

  return (
    <>
      <ScrollbarsCustum
        // ref={scrollBarRefDichVuThemSua}
        style={{
          height: window.innerHeight / 2,
          maxHeight: window.innerHeight / 2 + "px",
          //           height: 400,
          // maxHeight: "400px",
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        {data?.tinhTrang === 3 && (
          <div className="col-md-12">
            <div className="row form-group">
              <div className="col-md-12">
                <label>Yêu cầu bổ sung</label>
              </div>
              <div className="col-md-12">
                {!Helper.isNullOrUndefined(data?.yKienPhanHoi) && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.yKienPhanHoi,
                    }}
                  ></div>
                )}
                {!Helper.isNullOrUndefined(data?.yKienLanhDao) && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.yKienLanhDao,
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="card card-info card-outline card-outline-tabs">
          <div className="card-header p-0 border-bottom-0">
            <ul
              className="nav nav-tabs"
              id="custom-tabs-four-tab"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="custom-tabs-four-thong-tin-chung-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-thong-tin-chung"
                  role="tab"
                  aria-controls="custom-tabs-four-thong-tin-chung"
                  aria-selected="true"
                >
                  THÔNG TIN CHUNG
                </a>
              </li>
              {/* {hrefPageMain !== HREF.DANG_KY_HUY_DICH_VU && (
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="custom-tabs-four-thong-so-may-chu-tab"
                          data-toggle="pill"
                          href
                          role="tab"
                          aria-controls="custom-tabs-four-thong-so-may-chu"
                          aria-selected="true"
                          onClick={() => OnClick(0)}
                        >
                          THÔNG SỐ MÁY CHỦ
                        </a>
                      </li>
                    )} */}
            </ul>
          </div>
          <div className="card-body">
            <div
              className="tab-content form-group"
              id="custom-tabs-four-tabContent"
            >
              <div
                className="tab-pane fade show active"
                id="custom-tabs-four-thong-tin-chung"
                role="tabpanel"
                aria-labelledby="custom-tabs-four-thong-tin-chung-tab"
              >
                {/*The task */}
                {data && (
                  <div className="row">
                    {(dichVu === "đổi" || dichVu === "hủy") && (
                      <div className="col-md-12">
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>
                              Dịch vụ đã cấp{" "}
                              <span className="text-danger">(*)</span>
                            </label>
                          </div>
                          <div className="col-md-12">
                            <Select
                              showSearch
                              allowClear={true}
                              placeholder="-- Tìm kiếm và chọn dịch vụ đã cấp --"
                              style={{ width: "100%" }}
                              value={
                                !Helper.isNullOrUndefined(
                                  data?.iD_ThongTinDangKyDichVu
                                )
                                  ? data?.iD_ThongTinDangKyDichVu
                                  : undefined
                              }
                              format={toString()}
                              defaultValue={
                                !Helper.isNullOrUndefined(
                                  data?.iD_ThongTinDangKyDichVu
                                )
                                  ? data?.iD_ThongTinDangKyDichVu
                                  : undefined
                              }
                              filterOption={false}
                              onChange={(e) => {
                                setData((pre) => ({
                                  ...pre,
                                  iD_ThongTinDangKyDichVu: e,
                                }));
                                GetList_DichVuDaCap(
                                  "",
                                  setDichVuDaCapOptions,
                                  e
                                );
                                GetDichVuDaCap(e);
                              }}
                              onSearch={(e) => {
                                GetList_DichVuDaCap(e, setDichVuDaCapOptions);
                              }}
                              options={dichVuDaCapOptions}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Tiêu đề <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Input
                            type="text"
                            allowClear={true}
                            style={{ width: "100%" }}
                            defaultValue={data?.tieuDe}
                            value={data?.tieuDe}
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                tieuDe: e.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Số điện thoại liên hệ{" "}
                            <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Input
                            type="text"
                            allowClear={true}
                            style={{ width: "100%" }}
                            defaultValue={data?.dienThoai}
                            value={data?.dienThoai}
                            onChange={(e) =>
                              setData((pre) => ({
                                ...pre,
                                dienThoai: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Tên hệ thống thông tin{" "}
                            <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Input
                            type="text"
                            allowClear={true}
                            style={{ width: "100%" }}
                            defaultValue={data?.tenHeThongThongTin}
                            value={data?.tenHeThongThongTin}
                            onChange={(e) =>
                              setData((pre) => ({
                                ...pre,
                                tenHeThongThongTin: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Tên dự án <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Input
                            type="text"
                            allowClear={true}
                            style={{ width: "100%" }}
                            defaultValue={data?.tenDuAn}
                            value={data?.tenDuAn}
                            onChange={(e) =>
                              setData((pre) => ({
                                ...pre,
                                tenDuAn: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Đơn vị chủ quản{" "}
                            <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Select
                            showSearch
                            allowClear={true}
                            placeholder="-- Tìm kiếm và chọn đơn vị --"
                            style={{ width: "100%" }}
                            value={
                              !Helper.isNullOrUndefined(data?.donViChuQuan)
                                ? data?.donViChuQuan
                                : undefined
                            }
                            format={toString()}
                            defaultValue={
                              !Helper.isNullOrUndefined(data?.donViChuQuan)
                                ? data?.donViChuQuan
                                : undefined
                            }
                            filterOption={false}
                            onChange={(e) => {
                              setData((pre) => ({
                                ...pre,
                                donViChuQuan: e,
                                donViQuanTriVanHanh: null, // Đặt giá trị đơn vị vận hành về null khi chọn đơn vị chủ quản mới
                              }));
                              setSelectedParentId(e); // Lưu trữ parent_id của đơn vị chủ quản được chọn
                              setFilter(!!e);
                              GetList_ThongTinDonViQuanTriVanHanh(
                                "",
                                setDonViQuanTriVanHanhOptions,
                                e
                              );
                            }}
                            onSearch={(e) => {
                              GetList_ThongTinDonViChuQuan(
                                e,
                                setDonViChuQuanOptions
                              );
                            }}
                            options={donViChuQuanOptions}
                          />
                          <i style={{ color: "red", fontSize: "14px" }}>
                            (Yêu cầu chọn đơn vị chủ quản trước khi nhập đơn vị
                            vận hành)
                          </i>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Đơn vị quản trị vận hành{" "}
                            <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Select
                            showSearch
                            allowClear={true}
                            placeholder="-- Tìm kiếm và chọn đơn vị --"
                            style={{ width: "100%" }}
                            value={
                              !Helper.isNullOrUndefined(
                                data?.donViQuanTriVanHanh
                              )
                                ? data?.donViQuanTriVanHanh
                                : undefined
                            }
                            defaultValue={
                              !Helper.isNullOrUndefined(
                                data?.donViQuanTriVanHanh
                              )
                                ? data?.donViQuanTriVanHanh
                                : undefined
                            }
                            filterOption={false}
                            onChange={(e) => {
                              setData((pre) => ({
                                ...pre,
                                donViQuanTriVanHanh: e,
                              }));
                            }}
                            onSearch={(e) => {
                              GetList_ThongTinDonViQuanTriVanHanh(
                                e,
                                setDonViQuanTriVanHanhOptions,
                                selectedParentId
                              );
                            }}
                            options={donViQuanTriVanHanhOptions}
                            disabled={!filter}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Ngày kết thúc sử dụng</label>
                        </div>
                        <div className="col-md-12">
                          <DatePicker
                            type="date"
                            placeholder={"Ngày kết thúc sử dụng"}
                            allowClear={true}
                            style={{ width: "100%" }}
                            value={
                              data?.ngayKetThucSuDung
                                ? dayjs(data?.ngayKetThucSuDung)
                                : undefined
                            }
                            format="DD/MM/YYYY"
                            dateFormat="DD/MM/YYYY"
                            onChange={(date, dateString) => {
                              setData((pre) => ({
                                ...pre,
                                ngayKetThucSuDung: date
                                  ? date.valueOf()
                                  : undefined,
                              }));
                            }}
                          />
                          <i style={{ color: "red", fontSize: "14px" }}>
                            (Nếu để trống là vô hạn)
                          </i>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Cấp độ hệ thống thông tin{" "}
                            <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <InputNumber
                            allowClear={true}
                            style={{ width: "100%" }}
                            defaultValue={data?.capDoHeThongThongTin}
                            value={data?.capDoHeThongThongTin}
                            onChange={(e) =>
                              setData((pre) => ({
                                ...pre,
                                capDoHeThongThongTin: e,
                              }))
                            }
                          />
                          <i style={{ color: "red", fontSize: "14px" }}>
                            (Dự kiến)
                          </i>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-md-12">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>
                            Cán bộ kỹ thuật{" "}
                            <span className="text-danger">(*)</span>
                          </label>
                        </div>
                        <div className="col-md-12">
                          <Input
                            type="textArea"
                            rows={4}
                            allowClear={true}
                            style={{ width: "100%" }}
                            defaultValue={data?.canBoKyThuat}
                            value={data?.canBoKyThuat}
                            onChange={(e) =>
                              setData((pre) => ({
                                ...pre,
                                canBoKyThuat: e.target.value,
                              }))
                            }
                          />
                          <i style={{ color: "red", fontSize: "14px" }}>
                            (Nhập đầy đủ: tên, số điện thoại, email, đơn vị)
                          </i>
                        </div>
                      </div>
                    </div> */}
                    <div className="col-md-12">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Nội dung</label>
                        </div>
                        <div className="col-md-12">
                          <MyEditor
                            handleChange={(data) => {
                              // setContentContent(data);
                              setData((pre) => ({
                                ...pre,
                                ghiChu: data,
                              }));
                            }}
                            data={data?.ghiChu || ""}
                            // {...state}
                          />
                          {/* {data?.tieuDe && (
                            <CKEditor
                              initData={
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: data?.ghiChu,
                                  }}
                                ></div>
                              }
                              data={
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: data?.ghiChu,
                                  }}
                                ></div>
                              }
                              onChange={(e) =>
                                setData((pre) => ({
                                  ...pre,
                                  ghiChu: e.editor.getData(),
                                }))
                              }
                            />
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 align-center">
                      {(data?.tinhTrang <= 1 ||
                        Helper.isNullOrUndefined(data?.tinhTrang)) &&
                        hrefPageMain !==
                          HREF.QUAN_LY_DANG_KY_NHU_CAU_SU_DUNG && (
                          <>
                            <button
                              className="btn btn-default"
                              onClick={() => {
                                OnClick(1);
                              }}
                            >
                              <i className="fas fa-save blue" />{" "}
                              {isEdit ? "SỬA ĐĂNG KÝ" : "LƯU BẢN NHÁP"}
                            </button>{" "}
                          </>
                        )}
                      <button
                        className="btn btn-default"
                        onClick={() => {
                          OnClick(2);
                        }}
                      >
                        <i className="fas fa-share blue" /> ĐĂNG KÝ
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* {hrefPageMain !== HREF.DANG_KY_HUY_DICH_VU && (
                      <div
                        className="tab-pane fade"
                        id="custom-tabs-four-thong-so-may-chu"
                        role="tabpanel"
                        aria-labelledby="custom-tabs-four-thong-so-may-chu-tab"
                      >
                        <div className="row">
                          {(dichVu === "đổi" || dichVu === "hủy") && (
                            <div className="col-6">
                              <p>
                                <b>Thông số máy chủ đã cấp</b>
                              </p>
                              {thongSoMayChuDaCap.map((item, index) => {
                                return (
                                  <div className="card bg-info">
                                    <div
                                      className="card-header border-0"
                                      style={{ margin: "-9px" }}
                                    >
                                      <h3
                                        className="card-title"
                                        style={{
                                          textTransform: "uppercase",
                                          padding: "0.7rem 0.5rem 0.3rem",
                                        }}
                                      >
                                        <i className="far fa-calendar-alt" />{" "}
                                        Thông số máy chủ {index + 1}
                                      </h3>
                                      <div className="card-tools">
                                        <button
                                          type="button"
                                          className="btn btn-info btn-sm"
                                          data-card-widget="collapse"
                                        >
                                          <i className="fas fa-minus" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="card-body bg-white">
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>CPU</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.cpu} core
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>RAM</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.ram} GB
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>Ổ cứng</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.oCung} GB
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>Hệ điều hành</label>
                                            </div>
                                            <div className="col-md-10">
                                              <GetThongTinHeDieuHanh
                                                id={item?.heDieuHanh}
                                                JSON.parse(sessionStorage.getItem(SESSION_STORAGE))={JSON.parse(sessionStorage.getItem(SESSION_STORAGE))}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>Băng thông upload</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.upload} Mbps
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>Băng thông download</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.download} Mbps
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>Số lượng IPv4</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.countIPv4}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="row form-group">
                                            <div className="col-md-2">
                                              <label>Số lượng IPv6</label>
                                            </div>
                                            <div className="col-md-10">
                                              {item?.countIPv6}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-12">
                                          <div className="row form-group">
                                            <div className="col-md-1">
                                              <label>Phần mềm</label>
                                            </div>
                                            <div className="col-md-11">
                                              {item?.phanMem}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-12">
                                          <div className="row form-group">
                                            <div className="col-md-1">
                                              <label>Ghi chú</label>
                                            </div>
                                            <div className="col-md-11">
                                              {item?.ghiChu}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div
                            className={
                              dichVu === "đổi" || dichVu === "hủy"
                                ? "col-6"
                                : "col-12"
                            }
                          >
                            {(dichVu === "đổi" || dichVu === "hủy") && (
                              <p>
                                <b>Thông số máy chủ {dichVu} dịch vụ</b>
                              </p>
                            )}
                            {thongSoMayChu.map((item, index) => {
                              return (
                                <div className="card bg-info">
                                  <div
                                    className="card-header border-0"
                                    style={{ margin: "-9px" }}
                                  >
                                    <h3
                                      className="card-title"
                                      style={{
                                        textTransform: "uppercase",
                                        padding: "0.7rem 0.5rem 0.3rem",
                                      }}
                                    >
                                      <i className="far fa-calendar-alt" />{" "}
                                      Thông số máy chủ {index + 1}
                                    </h3>
                                    <div className="card-tools">
                                      {thongSoMayChu?.length === index + 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-info btn-sm"
                                          onClick={() => {
                                            setThongSoMayChu((pre) => [
                                              ...pre,
                                              {
                                                iD_ThongTinDangKyDichVu: "",
                                                cpu: "",
                                                ram: "",
                                                oCung: "",
                                                heDieuHanh: "",
                                                upload: "",
                                                download: "",
                                                countIPv4: "",
                                                countIPv6: "",
                                                phanMem: "",
                                              },
                                            ]);
                                          }}
                                        >
                                          Thêm thông số máy chủ
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        className="btn btn-info btn-sm"
                                        onClick={() => {
                                          const lastItem = thongSoMayChu[index];
                                          if (lastItem) {
                                            setThongSoMayChu((pre) => [
                                              ...pre,
                                              {
                                                ...lastItem,
                                                iD_ThongTinDangKyDichVu: "",
                                              },
                                            ]);
                                          }
                                        }}
                                      >
                                        Nhân bản
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-info btn-sm"
                                        data-card-widget="collapse"
                                      >
                                        <i className="fas fa-minus" />
                                      </button>
                                      {thongSoMayChu?.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-info btn-sm"
                                          // data-card-widget="remove"
                                          onClick={() => {
                                            ModalDelete(() => {
                                              if (item?.id)
                                                OnDeleteThongTinThongSoMayChu(
                                                  item?.id,
                                                  item
                                                );
                                              // thongSoMayChu.splice(index, 1);
                                              setThongSoMayChu([
                                                ...thongSoMayChu.slice(
                                                  0,
                                                  index
                                                ),
                                                ...thongSoMayChu.slice(
                                                  index + 1
                                                ),
                                              ]);
                                            });
                                          }}
                                        >
                                          <i className="fas fa-times" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="card-body bg-white">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>CPU</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              style={{ width: "100%" }}
                                              defaultValue={item?.cpu}
                                              value={item?.cpu}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "cpu",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <i
                                              style={{
                                                color: "red",
                                                fontSize: "14px",
                                              }}
                                            >
                                              (Tổng số core)
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>RAM</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              addonAfter={
                                                <b style={{ fontSize: "16px" }}>
                                                  GB
                                                </b>
                                              }
                                              style={{ width: "100%" }}
                                              defaultValue={item?.ram}
                                              value={item?.ram}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "ram",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Ổ cứng</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              addonAfter={
                                                <b style={{ fontSize: "16px" }}>
                                                  GB
                                                </b>
                                              }
                                              style={{ width: "100%" }}
                                              defaultValue={item?.oCung}
                                              value={item?.oCung}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "oCung",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Hệ điều hành</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Select
                                              showSearch
                                              allowClear={true}
                                              placeholder="-- Chọn --"
                                              style={{ width: "100%" }}
                                              value={
                                                !Helper.isNullOrUndefined(
                                                  item?.heDieuHanh
                                                )
                                                  ? item?.heDieuHanh
                                                  : null
                                              }
                                              defaultValue={
                                                !Helper.isNullOrUndefined(
                                                  item?.heDieuHanh
                                                )
                                                  ? item?.heDieuHanh
                                                  : undefined
                                              }
                                              onChange={(e) => {
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "heDieuHanh",
                                                  e
                                                );
                                              }}
                                              onSearch={(e) => {
                                                GetList_ThongTinHeDieuHanh(
                                                  e,
                                                  setHeDieuHanhOptions
                                                );
                                              }}
                                              options={heDieuHanhOptions}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Băng thông upload</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              addonAfter={
                                                <b style={{ fontSize: "16px" }}>
                                                  Mbps
                                                </b>
                                              }
                                              style={{ width: "100%" }}
                                              defaultValue={item?.upload}
                                              value={item?.upload}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "upload",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <i
                                              style={{
                                                color: "red",
                                                fontSize: "14px",
                                              }}
                                            >
                                              (Không điền là không có dự kiến)
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Băng thông download</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              addonAfter={
                                                <b style={{ fontSize: "16px" }}>
                                                  Mbps
                                                </b>
                                              }
                                              style={{ width: "100%" }}
                                              defaultValue={item?.download}
                                              value={item?.download}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "download",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <i
                                              style={{
                                                color: "red",
                                                fontSize: "14px",
                                              }}
                                            >
                                              (Không điền là không có dự kiến)
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Số lượng IPv4</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              style={{ width: "100%" }}
                                              defaultValue={item?.countIPv4}
                                              value={item?.countIPv4}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "countIPv4",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <i
                                              style={{
                                                color: "red",
                                                fontSize: "14px",
                                              }}
                                            >
                                              (Không điền mặc định là 1)
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Số lượng IPv6</label>
                                          </div>
                                          <div className="col-md-10">
                                            <Input
                                              type="text"
                                              allowClear={true}
                                              style={{ width: "100%" }}
                                              defaultValue={item?.countIPv6}
                                              value={item?.countIPv6}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "countIPv6",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <i
                                              style={{
                                                color: "red",
                                                fontSize: "14px",
                                              }}
                                            >
                                              (Không điền mặc định là 1)
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="row form-group">
                                          <div className="col-md-1">
                                            <label>Phần mềm</label>
                                          </div>
                                          <div className="col-md-11">
                                            <Input
                                              type="textArea"
                                              rows={4}
                                              allowClear={true}
                                              style={{ width: "100%" }}
                                              defaultValue={item?.phanMem}
                                              value={item?.phanMem}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "phanMem",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            <i
                                              style={{
                                                color: "red",
                                                fontSize: "14px",
                                              }}
                                            >
                                              (Dự kiến)
                                            </i>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="row form-group">
                                          <div className="col-md-1">
                                            <label>Ghi chú</label>
                                          </div>
                                          <div className="col-md-11">
                                            <Input
                                              type="textArea"
                                              rows={4}
                                              allowClear={true}
                                              style={{ width: "100%" }}
                                              defaultValue={item?.ghiChu}
                                              value={item?.ghiChu}
                                              onChange={(e) =>
                                                OnHanldeChangeThongSoKyThuat(
                                                  index,
                                                  "ghiChu",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="col-md-12 align-center">
                          {(data?.tinhTrang <= 1 ||
                            Helper.isNullOrUndefined(data?.tinhTrang)) &&
                            hrefPageMain !==
                              HREF.QUAN_LY_DANG_KY_NHU_CAU_SU_DUNG && (
                              <>
                                <button
                                  className="btn btn-default"
                                  onClick={() => {
                                    OnClick(1);
                                  }}
                                >
                                  <i className="fas fa-save blue" />{" "}
                                  {isEdit ? "SỬA ĐĂNG KÝ" : "LƯU BẢN NHÁP"}
                                </button>{" "}
                              </>
                            )}
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => OnClick(2)}
                          >
                            <i className="fas fa-share blue" /> ĐĂNG KÝ
                          </button>
                        </div>
                      </div>
                    )} */}
            </div>
          </div>
        </div>
      </ScrollbarsCustum>
    </>
  );
}
