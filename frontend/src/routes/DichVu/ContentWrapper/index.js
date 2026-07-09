import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Api from "../../../api";
import { columnQuanLyDichVu } from "../../../components/ListColumn/list.column";
import Message from "../../../components/Message";
import Table from "../../../components/Table";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import { HREF, MESSAGE } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";
import getAllUrlParams from "../../../services/getAllUrlParams";
import { Theme } from "../../../theme";
import ChiTietDichVu from "../../PheDuyet/ContentWrapper/ChiTietDichVu";
import { DangKyDichVu } from "../../TrangChu/JoinRoom";
const { RangePicker } = DatePicker;

export default function ContentWrapper({
  title,
  breadcrumb,
  loaiDichVu,
  permissions,
  user,
  setUser,
}) {
  // const { auth, quyen } = props;
  // const title = "Quản lý cấp dịch vụ";
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [edit, setEdit] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const hrefPageMain =
    loaiDichVu === "DangKyCapPhatDichVu"
      ? HREF.DANG_KY_CAP_DICH_VU
      : loaiDichVu === "DangKyCapPhatBoSungDichVu"
      ? HREF.DANG_KY_DOI_DICH_VU
      : loaiDichVu === "DangKyHuyDichVu"
      ? HREF.DANG_KY_HUY_DICH_VU
      : "";
  const isDeleted = window.location.search === "?deleted";
  const [urlSearch, setUrlSearch] = useState(
    getAllUrlParams(window.location.href)
  );

  const [detail, setDetail] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: PAGE_CURRENT,
      pageSize: PAGE_SIZE,
    },
  });
  const [tinhTrang, setTinhTrang] = useState(1);
  const [strSearch, setStrSearch] = useState(urlSearch.strsearch);
  const [dateFrom, setDateFrom] = useState(urlSearch.datefrom);
  const [dateTo, setDateTo] = useState(urlSearch.dateto);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = title;
    //console.log(urlSearch);
    GetDatas();
  }, [JSON.stringify(tableParams), JSON.stringify(urlSearch), tinhTrang]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const GetDatas = () => {
    switch (tinhTrang) {
      case 1:
        new Api()
          .DanhSachChuaDuyet_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            key: loaiDichVu,
            canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
              ? strSearch?.canhan
              : "",
            tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
              ? strSearch?.donvi
              : "",
            tgbatdau: !Helper.isNullOrUndefined(dateFrom)
              ? new Date(dateFrom).valueOf()
              : 0,
            tgketthuc: !Helper.isNullOrUndefined(dateTo)
              ? new Date(dateTo).valueOf()
              : 0,
            isDeleted: isDeleted,
          })
          .then((res) => {
            setData(
              res &&
                res?.data?.data.map((item, index) => ({
                  ...item,
                  stt: index + 1,
                  key: item.id,
                  id: item.id,
                }))
            );
            setLoading(false);
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total: res && res?.data?.totalRecords,
                // pageSize: res && res?.data?.pageSize,
                // current: res && res?.data?.pageNumber,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
        break;
      case 2:
        new Api()
          .DanhSachDaDuyet_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            key: loaiDichVu,
            canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
              ? strSearch?.canhan
              : "",
            tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
              ? strSearch?.donvi
              : "",
            tgbatdau: !Helper.isNullOrUndefined(dateFrom)
              ? new Date(dateFrom).valueOf()
              : 0,
            tgketthuc: !Helper.isNullOrUndefined(dateTo)
              ? new Date(dateTo).valueOf()
              : 0,
            isDeleted: isDeleted,
          })
          .then((res) => {
            setData(
              res &&
                res?.data?.data.map((item, index) => ({
                  ...item,
                  stt: index + 1,
                  key: item.id,
                  id: item.id,
                }))
            );
            setLoading(false);
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total: res && res?.data?.totalRecords,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
        break;
      case 3:
        new Api()
          .DanhSachTuChoi_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            key: loaiDichVu,
            canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
              ? strSearch?.canhan
              : "",
            tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
              ? strSearch?.donvi
              : "",
            tgbatdau: !Helper.isNullOrUndefined(dateFrom)
              ? new Date(dateFrom).valueOf()
              : 0,
            tgketthuc: !Helper.isNullOrUndefined(dateTo)
              ? new Date(dateTo).valueOf()
              : 0,
            isDeleted: isDeleted,
          })
          .then((res) => {
            setData(
              res &&
                res?.data?.data.map((item, index) => ({
                  ...item,
                  stt: index + 1,
                  key: item.id,
                  id: item.id,
                }))
            );
            setLoading(false);
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total: res && res?.data?.totalRecords,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
        break;
      case 4:
        new Api()
          .DanhSach_CapDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            key: loaiDichVu.replace("DangKy", ""),
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
              ? strSearch?.canhan
              : "",
            tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
              ? strSearch?.donvi
              : "",
            dateFrom: !Helper.isNullOrUndefined(dateFrom)
              ? new Date(dateFrom).valueOf()
              : 0,
            dateTo: !Helper.isNullOrUndefined(dateTo)
              ? new Date(dateTo).valueOf()
              : 0,
            isDeleted: isDeleted,
            hoatdong: 1,
          })
          .then((res) => {
            setData(
              res &&
                res?.data?.data.map((item, index) => ({
                  ...item,
                  stt: index + 1,
                  key: item.id,
                  id: item.id,
                }))
            );
            setLoading(false);
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total: res && res?.data?.totalRecords,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
        break;
      case 5:
        new Api()
          .DanhSach_CapDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            key: loaiDichVu.replace("DangKy", ""),
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
              ? strSearch?.canhan
              : "",
            tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
              ? strSearch?.donvi
              : "",
            dateFrom: !Helper.isNullOrUndefined(dateFrom)
              ? new Date(dateFrom).valueOf()
              : 0,
            dateTo: !Helper.isNullOrUndefined(dateTo)
              ? new Date(dateTo).valueOf()
              : 0,
            isDeleted: isDeleted,
            hoatdong: 2,
          })
          .then((res) => {
            setData(
              res &&
                res?.data?.data.map((item, index) => ({
                  ...item,
                  stt: index + 1,
                  key: item.id,
                  id: item.id,
                }))
            );
            setLoading(false);
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total: res && res?.data?.totalRecords,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
        break;
      default:
        break;
    }
  };

  const onDelete_onRecover = (id, row) => {
    new Api()
      .HuyDuyet_DangKyDichVu({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: id,
        key: loaiDichVu,
      })
      .then((res) => {
        if (res) {
          Message.success("Hủy thành công");
          GetDatas();
        }
      })
      .catch((err) => Message.error(err.message));
  };

  const onDelete = (id, row) => {
    new Api()
      .XoaVinhVien_ThongTinDangKyDichVu({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: id,
        data: {
          ...row,
          deletedBy: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.profile?.sub,
        },
      })
      .then((res) => {
        Message.success(MESSAGE.REMOVE_SUCCESS);
        GetDatas();
      })
      .catch((err) => Message.error(err.message));
  };

  const onUpdate = (data) => {
    new Api()
      .Update_ThongTinDangKyDichVu({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: data?.id,
        data: {
          ...data,
          email:
            JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.sub +
            "@monre.gov.vn",
          tinhTrang: data?.tinhTrang === 1 ? 2 : 1,
        },
      })
      .then((res) => {
        Message.success("Đăng ký thành công");
        GetDatas();
      })
      .catch((err) => {
        Message.error(err.message);
      });
  };

  useEffect(() => {}, []);

  const onHandleCancel = () => {
    setEdit([]);
    setScheduleId(null);
    setOpenEdit(false);
    setOpenView(false);
    setDetail();
    GetDatas();
    document.title = title;
    if (window.location.href.includes("/cap-nhat?id=")) {
      const url = window.location.pathname;
      const extractedUrl = url.split("/cap-nhat")[0];
      // window.location.href =(extractedUrl);
      navigate(extractedUrl);
    }
    if (window.location.href.includes("/chi-tiet?id=")) {
      const url = window.location.pathname;
      const extractedUrl = url.split("/chi-tiet")[0];
      // window.location.href =(extractedUrl);
      navigate(extractedUrl);
    }
  };

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
                  <a href={HREF.PheDuyet}>{title}</a>
                </li>
                <li className="breadcrumb-item active">{breadcrumb}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info meeting-calendar">
            <div className="card-body">
              <ul
                className="nav nav-tabs mb-1"
                id="custom-content-below-tab"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className={tinhTrang === 1 ? "nav-link active" : "nav-link"}
                    id="custom-tabs-four-da-gui-duyet-tab"
                    data-toggle="pill"
                    href="#custom-tabs-four-da-gui-duyet"
                    role="tab"
                    aria-controls="custom-tabs-four-da-gui-duyet"
                    aria-selected="true"
                    onClick={() => setTinhTrang(1)}
                    style={{
                      fontSize: "large",
                    }}
                  >
                    ĐÃ GỬI DUYỆT
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={tinhTrang === 2 ? "nav-link active" : "nav-link"}
                    id="custom-tabs-four-da-duyet-tab"
                    data-toggle="pill"
                    href="#custom-tabs-four-da-duyet"
                    role="tab"
                    aria-controls="custom-tabs-four-da-duyet"
                    aria-selected="false"
                    onClick={() => setTinhTrang(2)}
                    style={{
                      fontSize: "large",
                    }}
                  >
                    ĐÃ DUYỆT
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={tinhTrang === 3 ? "nav-link active" : "nav-link"}
                    id="custom-tabs-four-da-huy-tab"
                    data-toggle="pill"
                    href="#custom-tabs-four-da-huy"
                    role="tab"
                    aria-controls="custom-tabs-four-da-huy"
                    aria-selected="false"
                    onClick={() => setTinhTrang(3)}
                    style={{
                      fontSize: "large",
                    }}
                  >
                    ĐÃ HỦY
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="custom-tabs-four-da-cap-tab"
                    data-toggle="pill"
                    href="#custom-tabs-four-da-cap"
                    role="tab"
                    aria-controls="custom-tabs-four-da-cap"
                    aria-selected="false"
                    onClick={() => setTinhTrang(4)}
                    style={{
                      fontSize: "large",
                    }}
                  >
                    ĐÃ CẤP
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="custom-tabs-four-da-huy-cap-tab"
                    data-toggle="pill"
                    href="#custom-tabs-four-da-huy-cap"
                    role="tab"
                    aria-controls="custom-tabs-four-da-huy-cap"
                    aria-selected="false"
                    onClick={() => setTinhTrang(5)}
                    style={{
                      fontSize: "large",
                    }}
                  >
                    ĐÃ HỦY CẤP
                  </a>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right mb-1">
                <li className="nav-item" style={{ textAlign: "right" }}>
                  <Button
                    size="large"
                    type="primary"
                    style={{
                      backgroundColor: Theme.theme().css.background.color,
                    }}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setOpenEdit(true);
                    }}
                  >
                    Thêm mới
                  </Button>
                </li>
              </ul>
              <div className="tab-content" id="custom-content-below-tabContent">
                <div className="row pb-3">
                  <div className="col-md-7">
                    <div className="row form-group">
                      <Input
                        type="text"
                        placeholder="Tìm kiếm tên cá nhân"
                        allowClear={true}
                        style={{ width: "50%" }}
                        onChange={(e) => {
                          if (e?.type) {
                            setStrSearch((prevState) => ({
                              ...prevState,
                              canhan: e.target.value,
                            }));
                          }
                        }}
                        value={strSearch?.canhan}
                        defaultValue={strSearch?.canhan}
                        size="large"
                      />
                      <Input
                        type="text"
                        placeholder="Tìm kiếm tên đơn vị"
                        allowClear={true}
                        style={{ width: "50%" }}
                        onChange={(e) => {
                          if (e?.type) {
                            setStrSearch((prevState) => ({
                              ...prevState,
                              donvi: e.target.value,
                            }));
                          }
                        }}
                        value={strSearch?.donvi}
                        defaultValue={strSearch?.donvi}
                        size="large"
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="row form-group">
                      <RangePicker
                        style={{ width: "100%" }}
                        size="large"
                        showTime
                        placeholder={["Từ", "Đến"]}
                        format="DD/MM/YYYY"
                        dateFormat="DD/MM/YYYY"
                        allowClear={true}
                        value={[
                          Number(dateFrom) ? dayjs(dateFrom) : null,
                          Number(dateTo) ? dayjs(dateTo) : null,
                        ]}
                        onChange={(dates, dateString) => {
                          if (dates) {
                            setDateFrom(dates[0] ? dates[0]?.valueOf() : null);
                            setDateTo(dates[1] ? dates[1]?.valueOf() : null);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 text-center">
                    <button
                      className="btn btn-default"
                      onClick={() => GetDatas()}
                    >
                      <i className="fas fa-search" /> Tìm kiếm
                    </button>
                  </div>
                </div>
                <Table
                  columns={columnQuanLyDichVu({
                    href: hrefPageMain,
                    isDeleted: isDeleted,
                    onDelete_onRecover: onDelete_onRecover,
                    onDelete: onDelete,
                    onUpdate: onUpdate,
                    setOpenEdit: setOpenEdit,
                    setOpenView: setOpenView,
                    loaiDichVu: loaiDichVu,
                    setDetail: setDetail,
                    tinhTrang: tinhTrang,
                  })}
                  dataSource={data}
                  pagination={tableParams.pagination}
                  loading={loading}
                  onChange={handleTableChange}
                  title={title}
                />
              </div>
            </div>
            {/* /.card */}
          </div>
          {/* /.card */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}

      <Modal
        title=""
        centered
        open={openEdit}
        onOk={() => setOpenEdit(false)}
        onCancel={() => onHandleCancel(false)}
        width={window.innerWidth / 2}
        style={{ minWidth: window.innerWidth / 2 }}
        cancelText="Thoát"
        okText="Sửa"
        okButtonProps={{ style: { display: "none" } }}
      >
        <DangKyDichVu
          onHandleCancel={onHandleCancel}
          loai_dang_ky={loaiDichVu}
          tinhTrang={tinhTrang}
          detail={detail}
          openEdit={openEdit}
        />
      </Modal>
      <Modal
        title=""
        centered
        open={openView}
        onOk={() => setOpenView(false)}
        onCancel={() => onHandleCancel(false)}
        width={window.innerWidth / 2}
        style={{ minWidth: window.innerWidth / 2 }}
        cancelText="Thoát"
        // okText="Đồng ý"
        okButtonProps={{ style: { display: "none" } }}
      >
        <ChiTietDichVu
          edit={edit}
          onHandleCancel={onHandleCancel}
          setScheduleId={setScheduleId}
          scheduleId={
            window.location.search.slice(1).split("&")[0].split("=")[1]
          }
          tinhTrang={tinhTrang}
          loaiDichVu={loaiDichVu}
          detail={detail}
        />
      </Modal>
    </div>
  );
}
