import React, { useEffect, useState } from "react";
import { Col, DatePicker, Input, Modal, Row, Select, Table } from "antd";
import Highlighter from "react-highlight-words";
import { useNavigate, useSearchParams } from "react-router-dom";
import Api from "../../../api";
import {
  SwalAlertAllConfiguration,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import ModalBaoCaoThongKe from "./includes/modal";
import BaoCaoDinhKy from "./pages/BaoCaoDinhKy";
import BaoCaoThongKeDiemDiemCau from "./pages/BaoCaoThongKeDiemDiemCau";
import BaoCaoThongKeHoiNghiHoiThao from "./pages/BaoCaoThongKeHoiNghiHoiThao";
import BaoCaoTongHop from "./pages/BaoCaoTongHop";
import ThongKeBieuQuyetCuocHop from "./pages/ThongKeBieuQuyetCuocHop";
import ThongKeGhiHinhCuocHop from "./pages/ThongKeGhiHinhCuocHop";
import ThongKeKetLuanCuocHop from "./pages/ThongKeKetLuanCuocHop";
import ThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTai from "./pages/ThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTai";
import ThongKeSoCuocHopDangDienRa from "./pages/ThongKeSoCuocHopDangDienRa";
import ThongKeSoCuocHopTheoLichSuTrenTongTheHeThong from "./pages/ThongKeSoCuocHopTheoLichSuTrenTongTheHeThong";
import ThongKeSoCuocHopTheoLichSuTrenTungMayChu from "./pages/ThongKeSoCuocHopTheoLichSuTrenTungMayChu";
import ThongKeSoNguoiThamGiaTrongMotCuocHop from "./pages/ThongKeSoNguoiThamGiaTrongMotCuocHop";
import ThongKeTaiLieuHopCacCuocHop from "./pages/ThongKeTaiLieuHopCacCuocHop";
import ThongKeTongSoCuocHopTrenTungMayChu from "./pages/ThongKeTongSoCuocHopTrenTungMayChu";
import ThongKeTongSoNguoiThamGiaCuocHopDangDienRa from "./pages/ThongKeTongSoNguoiThamGiaCuocHopDangDienRa";
import ThongKeTongSoSoNguoiThamGiaCuocHopTheoLichSu from "./pages/ThongKeTongSoSoNguoiThamGiaCuocHopTheoLichSu";
import { CheckUser } from "../../../components/Modal";
const { RangePicker } = DatePicker;

const List_BaoCaoThongKe = [
  {
    url: "QuanLyBaoCaoThongKeHoiNghiHoiThao",
    key: HREF.QuanLyBaoCaoThongKeHoiNghiHoiThao.replace("/", ""),
    title: "Quản lý báo cáo thống kê hội nghị hội thảo",
    type: "Lịch họp",
    href: ({ ...props }) => <BaoCaoThongKeHoiNghiHoiThao {...props} />,
  },
  {
    url: "QuanLyBaoCaoDinhKy",
    key: HREF.QuanLyBaoCaoDinhKy.replace("/", ""),
    title: "Quản lý báo cáo định kỳ",
    type: "Tổng hợp",
    href: ({ ...props }) => <BaoCaoDinhKy {...props} />,
  },
  {
    url: "QuanLyBaoCaoThongKeDiemDiemCau",
    key: HREF.QuanLyBaoCaoThongKeDiemDiemCau.replace("/", ""),
    title: "Quản lý báo cáo thống kê điểm điểm cầu",
    type: "Điểm cầu",
    href: ({ ...props }) => <BaoCaoThongKeDiemDiemCau {...props} />,
  },
  {
    url: "QuanLyBaoCaoTongHop",
    key: HREF.QuanLyBaoCaoTongHop.replace("/", ""),
    title: "Quản lý báo cáo tổng hợp",
    type: "Tổng hợp",
    href: ({ ...props }) => <BaoCaoTongHop {...props} />,
  },
  {
    url: "QuanLyThongKeTongSoCuocHopDangDienRa",
    key: HREF.QuanLyThongKeTongSoCuocHopDangDienRa.replace("/", ""),
    title: "Quản lý thống kê tổng số cuộc họp đang điễn ra",
    type: "Lịch họp",
    href: ({ ...props }) => <ThongKeSoCuocHopDangDienRa {...props} />,
  },
  {
    url: "QuanLyThongKeTongSoCuocHopTrenTungMayChu",
    key: HREF.QuanLyThongKeTongSoCuocHopTrenTungMayChu.replace("/", ""),
    title: "Quản lý thống kê tổng số cuộc họp trên từng máy chủ",
    type: "Lịch họp",
    href: ({ ...props }) => <ThongKeTongSoCuocHopTrenTungMayChu {...props} />,
  },
  {
    url: "QuanLyThongKeSoCuocHopTheoLichSuTrenTongTheHeThong",
    key: HREF.QuanLyThongKeSoCuocHopTheoLichSuTrenTongTheHeThong.replace(
      "/",
      ""
    ),
    title: "Quản lý thống kê số cuộc họp theo lịch sử trên tổng thể hệ thống",
    type: "Lịch họp",
    href: ({ ...props }) => (
      <ThongKeSoCuocHopTheoLichSuTrenTongTheHeThong {...props} />
    ),
  },
  {
    url: "QuanLyThongKeSoCuocHopTheoLichSuTrenTungMayChu",
    key: HREF.QuanLyThongKeSoCuocHopTheoLichSuTrenTungMayChu.replace("/", ""),
    title: "Quản lý thống kê số cuộc họp theo lịch sử trên từng máy chủ",
    type: "Lịch họp",
    href: ({ ...props }) => (
      <ThongKeSoCuocHopTheoLichSuTrenTungMayChu {...props} />
    ),
  },
  {
    url: "QuanLyThongKeTongSoNguoiThamGiaCuocHopDangDienRa",
    key: HREF.QuanLyThongKeTongSoNguoiThamGiaCuocHopDangDienRa.replace("/", ""),
    title: "Quản lý thống kê tổng số người tham gia cuộc họp đang diễn ra",
    type: "Lịch họp",
    href: ({ ...props }) => (
      <ThongKeTongSoNguoiThamGiaCuocHopDangDienRa {...props} />
    ),
  },
  {
    url: "QuanLyThongKeTongSoSoNguoiThamGiaCuocHopTheoLichSu",
    key: HREF.QuanLyThongKeTongSoSoNguoiThamGiaCuocHopTheoLichSu.replace(
      "/",
      ""
    ),
    title: "Quản lý thống kê tổng số số người tham gia cuộc họp theo lịch sử",
    type: "Lịch họp",
    href: ({ ...props }) => (
      <ThongKeTongSoSoNguoiThamGiaCuocHopTheoLichSu {...props} />
    ),
  },
  {
    url: "QuanLyThongKeSoNguoiThamGiaTrongMotCuocHop",
    key: HREF.QuanLyThongKeSoNguoiThamGiaTrongMotCuocHop.replace("/", ""),
    title: "Quản lý thống kê số người tham gia trong một cuộc họp",
    type: "Lịch họp",
    href: ({ ...props }) => <ThongKeSoNguoiThamGiaTrongMotCuocHop {...props} />,
  },
  {
    url: "QuanLyThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTai",
    key: HREF.QuanLyThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTai.replace(
      "/",
      ""
    ),
    title:
      "Quản lý thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại (theo khoảng thời gian)",
    type: "Lịch họp",
    href: ({ ...props }) => (
      <ThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTai {...props} />
    ),
  },
  {
    url: "QuanLyThongKeTaiLieuHopCacCuocHop",
    key: HREF.QuanLyThongKeTaiLieuHopCacCuocHop.replace("/", ""),
    title: "Quản lý thống kê tài liệu họp các cuộc họp",
    type: "Lịch họp",
    href: ({ ...props }) => <ThongKeTaiLieuHopCacCuocHop {...props} />,
  },
  {
    url: "QuanLyThongKeGhiHinhCuocHop",
    key: HREF.QuanLyThongKeGhiHinhCuocHop.replace("/", ""),
    title: "Quản lý thống kê ghi hình cuộc họp",
    type: "Lịch họp",
    href: ({ ...props }) => <ThongKeGhiHinhCuocHop {...props} />,
  },
  {
    url: "QuanLyThongKeBieuQuyetCuocHop",
    key: HREF.QuanLyThongKeBieuQuyetCuocHop.replace("/", ""),
    title: "Quản lý thống kê biểu quyết cuộc họp",
    type: "Biểu quyết",
    href: ({ ...props }) => <ThongKeBieuQuyetCuocHop {...props} />,
  },
  {
    url: "QuanLyThongKeKetLuanCuocHop",
    key: HREF.QuanLyThongKeKetLuanCuocHop.replace("/", ""),
    title: "Quản lý thống kê kết luận cuộc họp",
    type: "Lịch họp",
    href: ({ ...props }) => <ThongKeKetLuanCuocHop {...props} />,
  },
];

export default function ContentWrapper({ title, permissions, user, setUser }) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isType, setIsType] = useState(false);
  const [edit, setEdit] = useState(null);

  const [thongKeData, setThongKeData] = useState(null);
  const [isAction, setIsAction] = useState(false);

  const [typeTab, setTypeTab] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isView, setIsView] = useState(false);
  const [view, setView] = useState(null);

  const [dungLuongToiDaTepTaiLen, setDungLuongToiDaTepTaiLen] = useState(0);

  useEffect(() => {
    if (
      !Helper.isNullOrUndefined(permissions) &&
      permissions &&
      permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true
    ) {
      setTypeTab(
        searchParams &&
          searchParams.get("doituong") &&
          List_BaoCaoThongKe.find(
            (item) => item.key === searchParams.get("doituong")
          ).url
      );
      setPage(
        searchParams &&
          searchParams.get("doituong") &&
          List_BaoCaoThongKe.find(
            (item) => item.key === searchParams.get("doituong")
          ).title
      );
    }
  }, [permissions]);

  useEffect(() => {}, [search, type]);

  useEffect(() => {
    // CheckUser().then((user) => {
    //   if (Helper.isNullOrUndefined(user)) {
    //   } else {

    //   }
    // });
    new Api()
      .LayRaThietLapCauHinh("tl_ch_baocaothongke", "DungLuongToiDaTepTaiLen")
      .then((res) => {
        if (res.code === 200) {
          setDungLuongToiDaTepTaiLen(res?.data?.giatri);
        }
      });
  }, []);

  const showModal = () => {
    setIsAction(false);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setEdit(null);
    setIsAction(true);
    setIsModalOpen(false);
    setIsView(false);
  };
  const handleCancel = () => {
    setEdit(null);
    setIsAction(true);
    setIsModalOpen(false);
    setIsView(false);
  };

  const create_ThongKe = (key, data) => {
    setIsAction(true);
    return new Api().create_QuanLyBaoCaoThongKe({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      key: key,
      data: data,
    });
    // switch (type) {
    //   case "Lịch họp":
    //     return new Api().create_ThongKeLichHop({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   case "Tổng hợp":
    //     return new Api().create_ThongKeTongHop({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   case "Biểu quyết":
    //     return new Api().create_ThongKeBieuQuyet({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   case "Điểm cầu":
    //     return new Api().create_ThongKeDiemCau({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   default:
    //     break;
    // }
  };

  const update_ThongKe = (key, data) => {
    setIsAction(true);
    return new Api().update_QuanLyBaoCaoThongKe({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      key: key,
      data: data,
    });
    // switch (type) {
    //   case "Lịch họp":
    //     return new Api().update_ThongKeLichHop({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   case "Tổng hợp":
    //     return new Api().update_ThongKeTongHop({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   case "Biểu quyết":
    //     return new Api().update_ThongKeBieuQuyet({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   case "Điểm cầu":
    //     return new Api().update_ThongKeDiemCau({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       data: data,
    //     });
    //   default:
    //     break;
    // }
  };

  const delete_ThongKe = (key, data) => {
    if (data?.id) {
      setIsAction(true);
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn xóa?",
        text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
        preConfirm: async (login) => {
          try {
            return new Api()
              .delete_QuanLyBaoCaoThongKe({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                key: key,
                id: data?.id,
              })
              .then(() => {
                SwalAlertAllConfiguration({
                  title: "Thông báo",
                  text: "Xóa thành công",
                  timer: 2000,
                  icon: "success",
                });
              });
            // switch (type) {
            //   case "Lịch họp":
            //     return new Api().delete_ThongKeLichHop({
            //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            //         ?.access_token,
            //       id: id,
            //     });
            //   case "Tổng hợp":
            //     return new Api().delete_ThongKeTongHop({
            //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            //         ?.access_token,
            //       id: id,
            //     });
            //   case "Biểu quyết":
            //     return new Api().delete_ThongKeBieuQuyet({
            //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            //         ?.access_token,
            //       id: id,
            //     });
            //   case "Điểm cầu":
            //     return new Api().delete_ThongKeDiemCau({
            //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            //         ?.access_token,
            //       id: id,
            //     });
            //   default:
            //     break;
            // }
          } catch (error) {
            SwalShowValidationMessage(`
            Request failed: ${error}
          `);
          }
        },
        allowOutsideClick: () => !SwalIsLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          setIsAction(true);
        }
      });
    } else {
      SwalAlertAllConfiguration({
        title: "Thông báo! Nội dung không tồn tại",
        text: "",
        icon: "warning",
      });
    }
  };

  const getlist_unapproved_ThongKe = (key, search, pageSize, pageNumber) => {
    return new Api().getlist_search_QuanLyBaoCaoThongKe({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      key: key,
      txtSearch: search,
      pageSize: pageSize,
      pageNumber: pageNumber,
    });
    // switch (type) {
    //   case "Lịch họp":
    //     return new Api().getlist_unapproved_ThongKeLichHop({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       search: search,
    //       name: name,
    //       dateFrom: dateFrom,
    //       dateTo: dateTo,
    //       pageSize: pageSize,
    //       pageNumber: pageNumber,
    //     });
    //   case "Tổng hợp":
    //     return new Api().getlist_unapproved_ThongKeTongHop({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       search: search,
    //       name: name,
    //       dateFrom: dateFrom,
    //       dateTo: dateTo,
    //       pageSize: pageSize,
    //       pageNumber: pageNumber,
    //     });
    //   case "Biểu quyết":
    //     return new Api().getlist_unapproved_ThongKeBieuQuyet({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       search: search,
    //       name: name,
    //       dateFrom: dateFrom,
    //       dateTo: dateTo,
    //       pageSize: pageSize,
    //       pageNumber: pageNumber,
    //     });
    //   case "Điểm cầu":
    //     return new Api().getlist_unapproved_ThongKeDiemCau({
    //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //         ?.access_token,
    //       search: search,
    //       name: name,
    //       dateFrom: dateFrom,
    //       dateTo: dateTo,
    //       pageSize: pageSize,
    //       pageNumber: pageNumber,
    //     });
    //   default:
    //     break;
    // }
  };

  // const bieudo_ThongKe = () => {
  //   switch (type) {
  //     case "Lịch họp":
  //       return new Api().bieudo_ThongKeLichHop({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     case "Tổng hợp":
  //       return new Api().bieudo_ThongKeTongHop({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     case "Biểu quyết":
  //       return new Api().bieudo_ThongKeBieuQuyet({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     case "Điểm cầu":
  //       return new Api().bieudo_ThongKeDiemCau({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     default:
  //       break;
  //   }
  // };

  // const excel_ThongKe = () => {
  //   setIsAction(true);
  //   switch (type) {
  //     case "Lịch họp":
  //       return new Api().xuat_excel_ThongKeLichHop({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     case "Tổng hợp":
  //       return new Api().xuat_excel_ThongKeTongHop({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     case "Biểu quyết":
  //       return new Api().xuat_excel_ThongKeBieuQuyet({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     case "Điểm cầu":
  //       return new Api().xuat_excel_ThongKeDiemCau({
  //         token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //           ?.access_token,
  //       });
  //     default:
  //       break;
  //   }
  // };

  return (
    <div className="content-wrapper mt-3">
      {/* Content Header (Page header) */}
      <div id="content-header" className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">{title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href={HREF.TrangChu}>
                    <i className="fas fa-home" />
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    href
                    onClick={() => {
                      setType("");
                      setPage("");
                      handleCancel();
                    }}
                    type="button"
                  >
                    {title}
                  </a>
                </li>
                {type && (
                  <li className={"breadcrumb-item " + (page ? "active" : "")}>
                    {!Helper.isNullOrUndefined(page) ? (
                      <a
                        href
                        onClick={() => {
                          setPage("");
                          handleCancel();
                        }}
                        type="button"
                      >
                        {type}
                      </a>
                    ) : (
                      type
                    )}
                  </li>
                )}
                {!Helper.isNullOrUndefined(page) && (
                  <li
                    className="breadcrumb-item active"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    {page}
                  </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info meeting-calendar">
            <div className="card-body">
              {!isView && !isModalOpen && (
                <>
                  {Helper.isNullOrUndefined(page) ? (
                    <>
                      <Row>
                        <Col span={12}>
                          <Input
                            placeholder="Nhập tên báo cáo, thống kê"
                            size="large"
                            onChange={(e) => setSearch(e.target.value)}
                            defaultValue={search}
                          />
                        </Col>
                        <Col span={12}>
                          <Select
                            size="large"
                            defaultValue={type}
                            value={type}
                            onChange={(value) => {
                              setType(value);
                            }}
                            options={[
                              {
                                value: "",
                                label: "--Chọn loại báo cáo, thống kê--",
                              },
                              {
                                value: "Lịch họp",
                                label: "Lịch họp",
                              },
                              {
                                value: "Biểu quyết",
                                label: "Biểu quyết",
                              },
                              {
                                value: "Điểm cầu",
                                label: "Điểm cầu",
                              },
                              {
                                value: "Tổng hợp",
                                label: "Tổng hợp",
                              },
                            ]}
                          />
                          <button
                            className="btn btn-outline-default"
                            type="button"
                          >
                            <i className="fas fa-search info" /> TÌM KIẾM
                          </button>
                        </Col>
                      </Row>
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        columns={[
                          {
                            title: "Tên báo cáo thống kê",
                            dataIndex: "title",
                            key: "title",
                            render: (text, record) =>
                              search ? (
                                <a
                                  href
                                  onClick={() => {
                                    setType(record?.type);
                                    setPage(text);
                                    navigate({
                                      search: "?doituong=" + record?.key,
                                    });
                                  }}
                                >
                                  <Highlighter
                                    highlightStyle={{
                                      backgroundColor: "#ffc069",
                                      padding: 0,
                                    }}
                                    searchWords={[search]}
                                    autoEscape
                                    textToHighlight={
                                      text ? text.toString() : ""
                                    }
                                  />
                                </a>
                              ) : (
                                <a
                                  href
                                  onClick={() => {
                                    setType(record?.type);
                                    setPage(text);
                                    navigate({
                                      search: "?doituong=" + record?.key,
                                    });
                                  }}
                                >
                                  {text}
                                </a>
                              ),
                          },
                          {
                            title: "Phân loại",
                            dataIndex: "type",
                            key: "type",
                            render: (text) => (
                              <a href onClick={() => setType(text)}>
                                {text}
                              </a>
                            ),
                          },
                        ]}
                        dataSource={
                          search
                            ? List_BaoCaoThongKe?.filter((item) =>
                                item?.title
                                  .toString()
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              )
                            : type
                            ? List_BaoCaoThongKe?.filter(
                                (item) => item?.type === type
                                // .toString()
                                // .toLowerCase()
                                // .includes(search.toLowerCase())
                              )
                            : List_BaoCaoThongKe
                        }
                      />
                    </>
                  ) : (
                    <>
                      {List_BaoCaoThongKe.map((route, index) => {
                        if (
                          page &&
                          page.toString().toLowerCase() ===
                            route?.title.toString().toLowerCase()
                        ) {
                          return (
                            <>
                              {/* {route?.href(
                            route?.key,
                            route?.type,
                            route?.title,
                            setIsModalOpen,
                            setIsEdit,
                            setIsType
                          )} */}
                              {route?.href({
                                url: route?.url,
                                name: route?.key,
                                type: route?.type,
                                title: route?.title,
                                setIsModalOpen: setIsModalOpen,
                                setIsEdit: setIsEdit,
                                setIsType: setIsType,
                                create_ThongKe: create_ThongKe,
                                delete_ThongKe: delete_ThongKe,
                                getlist_unapproved_ThongKe:
                                  getlist_unapproved_ThongKe,
                                // bieudo_ThongKe: bieudo_ThongKe,
                                // excel_ThongKe: excel_ThongKe,
                                setEdit: setEdit,
                                isAction: isAction,
                                setIsAction: setIsAction,
                                typeTab: typeTab,
                                setTypeTab: setTypeTab,
                                permissions: permissions,
                                user: user,
                                setUser: setUser,
                                handleCancel: handleCancel,
                                isView: isView,
                                setIsView: setIsView,
                                view: view,
                                setView: setView,
                              })}
                            </>
                          );
                        }
                      })}
                    </>
                  )}
                </>
              )}
              {isView && !isModalOpen && (
                <>
                  <h5>Xem</h5>
                  <ModalBaoCaoThongKe
                    onHandleCancel={handleCancel}
                    // onHandleOk={isEdit ? update_ThongKe : create_ThongKe}
                    // isEdit={isEdit}
                    isView={isView}
                    // isType={isType}
                    // setIsType={setIsType}
                    edit={view}
                    setEdit={setEdit}
                    type={type}
                  />
                </>
              )}
              {isModalOpen && !isView && (
                <>
                  <h5>{isEdit ? "Sửa" : "Thêm"}</h5>
                  <ModalBaoCaoThongKe
                    onHandleCancel={handleCancel}
                    onHandleOk={isEdit ? update_ThongKe : create_ThongKe}
                    isEdit={isEdit}
                    isType={isType}
                    setIsType={setIsType}
                    edit={edit}
                    setEdit={setEdit}
                    typeTab={typeTab}
                    type={type}
                    dungLuongToiDaTepTaiLen={dungLuongToiDaTepTaiLen}
                  />
                </>
              )}
            </div>
            {/* /.card */}
          </div>
          {/* /.card */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
      {/* <Modal
        title={isEdit ? "Sửa" : "Thêm"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
        width={window.innerWidth / 2}
      >
        <ModalBaoCaoThongKe
          onHandleCancel={handleCancel}
          onHandleOk={isEdit ? update_ThongKe : create_ThongKe}
          isEdit={isEdit}
          isType={isType}
          setIsType={setIsType}
          edit={edit}
          setEdit={setEdit}
          typeTab={typeTab}
          type={type}
        />
      </Modal> */}

      {/* <Modal
        title={"Xem"}
        open={isView}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
        width={window.innerWidth / 2}
      >
        <ModalBaoCaoThongKe
          onHandleCancel={handleCancel}
          // onHandleOk={isEdit ? update_ThongKe : create_ThongKe}
          // isEdit={isEdit}
          isView={isView}
          // isType={isType}
          // setIsType={setIsType}
          edit={view}
          setEdit={setEdit}
          // type={typeRoute}
        />
      </Modal> */}
    </div>
  );
}
