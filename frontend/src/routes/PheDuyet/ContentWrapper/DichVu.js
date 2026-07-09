import React, { useEffect, useState } from "react";
import { DatePicker, Input, Modal } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Api from "../../../api";
import { columnTiepNhanDangKy } from "../../../components/ListColumn/list.column";
import Message from "../../../components/Message";
import Table from "../../../components/Table";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import { HREF, MESSAGE } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import getAllUrlParams from "../../../services/getAllUrlParams";
import ChiTietDichVu from "./ChiTietDichVu";
const { RangePicker } = DatePicker;

export default function DichVu({ loaiDichVu, permissions, user, setUser }) {
  // const title = "Phê duyệt dịch vụ";
  const hrefPageMain = HREF.PheDuyet;
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

  const [dataLog, setDataLog] = useState([]);
  const [loadingLog, setLoadingLog] = useState(true);
  const [tableParamsLog, setTableParamsLog] = useState({
    pagination: {
      current: PAGE_CURRENT,
      pageSize: PAGE_SIZE,
    },
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [edit, setEdit] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);

  const navigate = useNavigate();

  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);

  useEffect(() => {
    if (
      !Helper.isNullOrUndefined(permissions) &&
      permissions &&
      (permissions?.includes(FUNC_PERMISSION.APPROVE) === true ||
        permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true)
    ) {
      if (
        loaiDichVu?.includes("DangKy") &&
        permissions?.includes(FUNC_PERMISSION.APPROVE)
      ) {
        setTinhTrang("CHỜ DUYỆT");
        // switch (loaiDichVu) {
        //   case "DangKyCapPhatDichVu":
        //     break;
        //   case "DangKyCapPhatBoSungDichVu":
        //     setTinhTrang("CHỜ DUYỆT2");
        //     break;
        //   case "DangKyHuyDichVu":
        //     setTinhTrang("CHỜ DUYỆT3");
        //     break;
        // }
      }
      if (
        !loaiDichVu?.includes("DangKy") &&
        permissions?.includes(FUNC_PERMISSION.SCHEDULE)
      ) {
        setTinhTrang("CHỜ CẤP");
        // switch (loaiDichVu) {
        //   case "CapPhatDichVu":
        //     break;
        //   case "CapPhatBoSungDichVu":
        //     setTinhTrang("CHỜ CẤP2");
        //     break;
        //   case "HuyDichVu":
        //     setTinhTrang("CHỜ CẤP3");
        //     break;
        // }
      }
    }
  }, [permissions, loaiDichVu]);

  useEffect(() => {
    if (typeof tinhTrang !== "number") {
      GetDatas();
    }
  }, [
    JSON.stringify(tableParams),
    JSON.stringify(tableParamsLog),
    JSON.stringify(urlSearch),
    tinhTrang,
    loaiDichVu,
    permissions,
  ]);

  //table
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
  const handleTableChangeLog = (pagination, filters, sorter) => {
    setTableParamsLog({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParamsLog.pagination?.pageSize) {
      setDataLog([]);
    }
  };

  const GetDatas = () => {
    if (
      loaiDichVu?.includes("DangKy") &&
      !Helper.isNullOrUndefined(permissions) &&
      permissions &&
      permissions?.includes(FUNC_PERMISSION.APPROVE) === true
    ) {
      if (tinhTrang === "CHỜ DUYỆT") {
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
                total: res && res?.data?.pagination?.total,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
      }
      if (tinhTrang === "ĐÃ DUYỆT") {
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
                total: res && res?.data?.pagination?.total,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
      }
      if (tinhTrang === "ĐÃ TỪ CHỐI") {
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
                total: res && res?.data?.pagination?.total,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
      }
      // switch (tinhTrang) {
      //   case "CHỜ DUYỆT":
      //     break;
      //   case "ĐÃ DUYỆT":
      //     break;
      //   case "ĐÃ TỪ CHỐI":
      //     break;
      //   default:
      //     break;
      // }
    }
    if (
      !loaiDichVu?.includes("DangKy") &&
      !Helper.isNullOrUndefined(permissions) &&
      permissions &&
      permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true
    ) {
      if (tinhTrang === "CHỜ CẤP") {
        new Api()
          .DanhSachDaDuyet_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            key: "DangKy" + loaiDichVu,
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
                total: res && res?.data?.pagination?.total,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
      }
      if (tinhTrang === "CHỜ HỦY") {
        new Api()
          .DanhSachDaDuyet_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            key: "DangKy" + loaiDichVu,
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
                total: res && res?.data?.pagination?.total,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
      }
      if (tinhTrang !== "CHỜ CẤP" && tinhTrang !== "CHỜ HỦY") {
        new Api()
          .DanhSach_CapDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            pageNumber: tableParams.pagination.current,
            pageSize: tableParams.pagination.pageSize,
            key: loaiDichVu,
            hoatdong:
              tinhTrang === "ĐÃ CẤP" || tinhTrang === "ĐÃ HỦY"
                ? 1
                : tinhTrang === "HỦY CẤP" || tinhTrang === "ĐÃ KHÔI PHỤC"
                ? 2
                : 0,
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
                total: res && res?.data?.pagination?.total,
                // 200 is mock data, you should read it from server
                // total: data.totalCount,
              },
            });
          })
          .catch((err) => Message.error(err.message));
      }
      // switch (tinhTrang) {
      //   case "CHỜ CẤP":

      //     break;
      //   case "CHỜ HỦY":

      //     break;

      //   default:

      //     break;
      // }
      // if (tinhTrang === "CHỜ CẤP" || tinhTrang === "CHỜ HỦY") {
      //   new Api()
      //     .DanhSachDaDuyet_DangKyDichVu({
      //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
      //         ?.access_token,
      //       pageNumber: tableParams.pagination.current,
      //       pageSize: tableParams.pagination.pageSize,
      //       key: "DangKy" + loaiDichVu,
      //       canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
      //         ? strSearch?.canhan
      //         : "",
      //       tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
      //         ? strSearch?.donvi
      //         : "",
      //       tgbatdau: !Helper.isNullOrUndefined(dateFrom)
      //         ? new Date(dateFrom).valueOf()
      //         : 0,
      //       tgketthuc: !Helper.isNullOrUndefined(dateTo)
      //         ? new Date(dateTo).valueOf()
      //         : 0,
      //     })
      //     .then((res) => {
      //       setData(
      //         res &&
      //           res?.data?.data.map((item, index) => ({
      //             ...item,
      //             stt: index + 1,
      //             key: item.id,
      //             id: item.id,
      //           }))
      //       );
      //       setLoading(false);
      //       setTableParams({
      //         ...tableParams,
      //         pagination: {
      //           ...tableParams.pagination,
      //           total: res && res?.data?.pagination?.total,
      //           // 200 is mock data, you should read it from server
      //           // total: data.totalCount,
      //         },
      //       });
      //     })
      //     .catch((err) => Message.error(err.message));
      // } else {
      //   new Api()
      //     .DanhSach_CapDichVu({
      //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
      //         ?.access_token,
      //       pageNumber: tableParams.pagination.current,
      //       pageSize: tableParams.pagination.pageSize,
      //       key: loaiDichVu,
      //       hoatdong:
      //         tinhTrang === "ĐÃ CẤP" || tinhTrang === "ĐÃ HỦY"
      //           ? 1
      //           : tinhTrang === "HỦY CẤP" || tinhTrang === "ĐÃ KHÔI PHỤC"
      //           ? 2
      //           : 0,
      //       canhan: !Helper.isNullOrUndefined(strSearch?.canhan)
      //         ? strSearch?.canhan
      //         : "",
      //       tochuc: !Helper.isNullOrUndefined(strSearch?.donvi)
      //         ? strSearch?.donvi
      //         : "",
      //       dateFrom: !Helper.isNullOrUndefined(dateFrom)
      //         ? new Date(dateFrom).valueOf()
      //         : 0,
      //       dateTo: !Helper.isNullOrUndefined(dateTo)
      //         ? new Date(dateTo).valueOf()
      //         : 0,
      //     })
      //     .then((res) => {
      //       setData(
      //         res &&
      //           res?.data?.data.map((item, index) => ({
      //             ...item,
      //             stt: index + 1,
      //             key: item.id,
      //             id: item.id,
      //           }))
      //       );
      //       setLoading(false);
      //       setTableParams({
      //         ...tableParams,
      //         pagination: {
      //           ...tableParams.pagination,
      //           total: res && res?.data?.pagination?.total,
      //           // 200 is mock data, you should read it from server
      //           // total: data.totalCount,
      //         },
      //       });
      //     })
      //     .catch((err) => Message.error(err.message));
      // }
    }
  };

  const onDelete_onRecover = (id, row) => {
    new Api()
      .XoaKhoiPhuc_ThongTinDangKyDichVu({
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
        if (res) {
          if (row?.isDeleted === false) {
            Message.success(MESSAGE.REMOVE_SUCCESS);
          } else {
            Message.success("Khôi phục thành công");
          }
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

  const onHandleCancel = () => {
    setEdit([]);
    setScheduleId(null);
    setOpenEdit(false);
    GetDatas();
    // document.title = title;
    if (window.location.href.includes("/chi-tiet?id=")) {
      const url = window.location.pathname;
      const extractedUrl = url.split("/chi-tiet")[0];
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
    <>
      <ul className="nav nav-tabs" id="custom-tabs-four-tab" role="tablist">
        {loaiDichVu?.includes("DangKy") &&
          !Helper.isNullOrUndefined(permissions) &&
          permissions &&
          permissions?.includes(FUNC_PERMISSION.APPROVE) === true && (
            <>
              <li className="nav-item">
                <a
                  className={
                    "nav-link" + (tinhTrang === "CHỜ DUYỆT" ? " active" : "")
                  }
                  id="custom-tabs-four-cho-duyet-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-cho-duyet"
                  role="tab"
                  aria-controls="custom-tabs-four-cho-duyet"
                  aria-selected="true"
                  onClick={() => setTinhTrang("CHỜ DUYỆT")}
                  style={{
                    opacity: 0.8,
                  }}
                >
                  CHỜ DUYỆT
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    "nav-link" + (tinhTrang === "ĐÃ DUYỆT" ? " active" : "")
                  }
                  id="custom-tabs-four-da-duyet-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-da-duyet"
                  role="tab"
                  aria-controls="custom-tabs-four-da-duyet"
                  aria-selected="false"
                  onClick={() => setTinhTrang("ĐÃ DUYỆT")}
                  style={{
                    opacity: 0.8,
                  }}
                >
                  ĐÃ DUYỆT
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    "nav-link" + (tinhTrang === "ĐÃ TỪ CHỐI" ? " active" : "")
                  }
                  id="custom-tabs-four-da-tu-choi-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-da-tu-choi"
                  role="tab"
                  aria-controls="custom-tabs-four-da-tu-choi"
                  aria-selected="false"
                  onClick={() => setTinhTrang("ĐÃ TỪ CHỐI")}
                  style={{
                    opacity: 0.8,
                  }}
                >
                  ĐÃ TỪ CHỐI
                </a>
              </li>
            </>
          )}

        {!loaiDichVu?.includes("DangKy") &&
          !Helper.isNullOrUndefined(permissions) &&
          permissions &&
          permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true && (
            <>
              <li className="nav-item">
                <a
                  className={
                    "nav-link" +
                    (tinhTrang === "CHỜ CẤP" || tinhTrang === "CHỜ HỦY"
                      ? " active"
                      : "")
                  }
                  id="custom-tabs-four-cho-cap-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-cho-cap"
                  role="tab"
                  aria-controls="custom-tabs-four-cho-cap"
                  aria-selected="false"
                  onClick={() =>
                    setTinhTrang(
                      loaiDichVu === "HuyDichVu" ? "CHỜ HỦY" : "CHỜ CẤP"
                    )
                  }
                  style={{
                    opacity: 0.8,
                  }}
                >
                  {loaiDichVu === "HuyDichVu" ? "CHỜ HỦY" : "CHỜ CẤP"}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    "nav-link" +
                    (tinhTrang === "ĐÃ CẤP" || tinhTrang === "ĐÃ HỦY"
                      ? " active"
                      : "")
                  }
                  id="custom-tabs-four-da-cap-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-da-cap"
                  role="tab"
                  aria-controls="custom-tabs-four-da-cap"
                  aria-selected="false"
                  onClick={() =>
                    setTinhTrang(
                      loaiDichVu === "HuyDichVu" ? "ĐÃ HỦY" : "ĐÃ CẤP"
                    )
                  }
                  style={{
                    opacity: 0.8,
                  }}
                >
                  {loaiDichVu === "HuyDichVu" ? "ĐÃ HỦY" : "ĐÃ CẤP"}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    "nav-link" +
                    (tinhTrang === "HỦY CẤP" || tinhTrang === "ĐÃ KHÔI PHỤC"
                      ? " active"
                      : "")
                  }
                  id="custom-tabs-four-huy-cap-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-huy-cap"
                  role="tab"
                  aria-controls="custom-tabs-four-huy-cap"
                  aria-selected="false"
                  onClick={() =>
                    setTinhTrang(
                      loaiDichVu === "HuyDichVu" ? "ĐÃ KHÔI PHỤC" : "HỦY CẤP"
                    )
                  }
                  style={{
                    opacity: 0.8,
                  }}
                >
                  {loaiDichVu === "HuyDichVu" ? "ĐÃ KHÔI PHỤC" : "HỦY CẤP"}
                </a>
              </li>
            </>
          )}
      </ul>
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
              size="large"
              style={{ width: "100%" }}
              allowClear={true}
              showTime
              placeholder={["Từ", "Đến"]}
              format="DD/MM/YYYY"
              dateFormat="DD/MM/YYYY"
              value={[
                Number(dateFrom) ? dayjs(dateFrom) : null,
                Number(dateTo) ? dayjs(dateTo) : null,
              ]}
              onChange={(dates, dateStrings) => {
                // setStartTime(dateStrings[0]);
                // setEndTime(dateStrings[1]);
                if (dates) {
                  setDateFrom(dates[0] ? dates[0]?.valueOf() : null);
                  setDateTo(dates[1] ? dates[1]?.valueOf() : null);
                }
              }}
            />
          </div>
        </div>
        <div className="col-md-12 text-center">
          <button className="btn btn-default" onClick={() => GetDatas()}>
            <i className="fas fa-search" /> Tìm kiếm
          </button>
        </div>
      </div>
      <Table
        columns={columnTiepNhanDangKy({
          href: hrefPageMain,
          isDeleted: isDeleted,
          onDelete_onRecover: onDelete_onRecover,
          onDelete: onDelete,
          onUpdate: onUpdate,
          setOpenEdit: setOpenEdit,
          loaiDichVu: loaiDichVu,
          setDetail: setDetail,
          tinhTrang: tinhTrang,
        })}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        // title={title}
      />
      <Modal
        title={"Xem xét"}
        centered
        open={openEdit}
        onOk={() => {
          setOpenEdit(false);
          onHandleCancel();
        }}
        onCancel={() => {
          setOpenEdit(false);
          onHandleCancel();
        }}
        footer={""}
        ok
        width={window.innerWidth / 2}
        // style={{ height: "500px" }}
        zIndex={1038}
      >
        {openEdit === true && (
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
            permissions={permissions}
            user={user}
            setUser={setUser}
          />
        )}
      </Modal>
    </>
  );
}
