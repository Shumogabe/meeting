import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Modal, Pagination, Row, Table } from "antd";
import moment from "moment";
import Api from "../../../api";
import {
  SwalAlertAllConfiguration,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
} from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import { Theme } from "../../../theme";
import ModalAdd from "./modalAdd";
import ModalEdit from "./modalEdit";
import { CheckUser } from "../../../components/Modal";
const { RangePicker } = DatePicker;

let timerInterval;

export default function ContentWrapper({ title, permissions, user, setUser }) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [status, setStatus] = useState(0);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [documentCall, setDocumentCall] = useState(null);
  const [scheduleCal, setScheduleCal] = useState([]);

  //tl_ch_kehoach
  const [dungLuongToiDaTepTaiLen, setDungLuongToiDaTepTaiLen] = useState(0);
  const [choPhepCongKhai, setChoPhepCongKhai] = useState(0);
  const [choPhepNguoiLapLichDuyet, setChoPhepNguoiLapLichDuyet] = useState(0);
  //

  const getListPlanScheduleUnapproved = (
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted
  ) => {
    new Api()
      .getListPlanScheduleUnapproved({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        page: page,
        pageSize: pageSize,
        create: create,
        search: search,
        dateFrom: Helper.isNullOrUndefined(dateFrom) ? "01/01/0001" : dateFrom,
        dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
        isdeleted: false,
      })
      .then((e) => {
        setScheduleCal(e?.data);
        setTotal(e?.total);
      });
  };

  const getListPlanScheduleApproved = (
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted
  ) => {
    new Api()
      .getListPlanScheduleApproved({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        page: page,
        pageSize: pageSize,
        create: create,
        search: search,
        dateFrom: Helper.isNullOrUndefined(dateFrom) ? "01/01/0001" : dateFrom,
        dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
        isdeleted: false,
      })
      .then((e) => {
        setScheduleCal(e?.data);
        setTotal(e?.total);
      });
  };

  const getListPlanScheduleDeleted = (
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted
  ) => {
    new Api()
      .getListPlanScheduleDeleted({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        page: page,
        pageSize: pageSize,
        create: create,
        search: search,
        dateFrom: Helper.isNullOrUndefined(dateFrom) ? "01/01/0001" : dateFrom,
        dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
        isdeleted: true,
      })
      .then((e) => {
        setScheduleCal(e?.data);
        setTotal(e?.total);
      });
  };

  const getListPlanScheduleDraft = (
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted
  ) => {
    new Api()
      .getListPlanScheduleDraft({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        page: page,
        pageSize: pageSize,
        create: create,
        search: search,
        dateFrom: Helper.isNullOrUndefined(dateFrom) ? "01/01/0001" : dateFrom,
        dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
        isdeleted: false,
      })
      .then((e) => {
        setScheduleCal(e?.data);
        setTotal(e?.total);
      });
  };

  const onHandleCancel = () => {
    setEdit([]);
    setScheduleId(null);
    //Document
    setDocumentCall([]);
    //Vote
    setOpenEdit(false);
    if (status === 0) {
      getListPlanScheduleDraft(
        page,
        size,
        user?.id,
        search,
        startTime,
        endTime,
        isDeleted
      );
    }
    if (status === 1) {
      getListPlanScheduleUnapproved(
        page,
        size,
        user?.id,
        search,
        startTime,
        endTime,
        isDeleted
      );
    }
    if (status === 2) {
      getListPlanScheduleApproved(
        page,
        size,
        user?.id,
        search,
        startTime,
        endTime,
        isDeleted
      );
    }
    if (status === 3) {
      getListPlanScheduleDeleted(
        page,
        size,
        user?.id,
        search,
        startTime,
        endTime,
        isDeleted
      );
    }
  };

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(user?.id)) {
  //     getListPlanScheduleDraft(
  //       page,
  //       size,
  //       user?.id,
  //       search,
  //       startTime,
  //       endTime,
  //       isDeleted
  //     );
  //   }
  // }, [user]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(user?.id)) {
      if (status === 0) {
        getListPlanScheduleDraft(
          page,
          size,
          user?.id,
          search,
          startTime,
          endTime,
          isDeleted
        );
      }
      if (status === 1) {
        getListPlanScheduleUnapproved(
          page,
          size,
          user?.id,
          search,
          startTime,
          endTime,
          isDeleted
        );
      }
      if (status === 2) {
        getListPlanScheduleApproved(
          page,
          size,
          user?.id,
          search,
          startTime,
          endTime,
          isDeleted
        );
      }
      if (status === 3) {
        getListPlanScheduleDeleted(
          page,
          size,
          user?.id,
          search,
          startTime,
          endTime,
          isDeleted
        );
      }
    }
  }, [search, startTime, endTime, status, isDeleted, page, size, user]);

  useEffect(() => {
    if (status === 3 && isDeleted === false) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(null);
    }
  }, [status, isDeleted]);

  useEffect(() => {
    // CheckUser().then((user) => {
    //   if (Helper.isNullOrUndefined(user)) {
    //   } else {
    //   }
    // });
    new Api()
      .LayRaThietLapCauHinh("tl_ch_kehoach", "DungLuongToiDaTepTaiLen")
      .then((res) => {
        if (res.code === 200) {
          setDungLuongToiDaTepTaiLen(res?.data?.giatri);
        }
      });
    new Api()
      .LayRaThietLapCauHinh("tl_ch_kehoach", "ChoPhepCongKhai")
      .then((res) => {
        if (res.code === 200) {
          setChoPhepCongKhai(res?.data?.giatri);
        }
      });
    new Api()
      .LayRaThietLapCauHinh("tl_ch_kehoach", "ChoPhepNguoiLapLichDuyet")
      .then((res) => {
        if (res.code === 200) {
          setChoPhepNguoiLapLichDuyet(res?.data?.giatri);
        }
      });
  }, []);

  const renderSwitchUser = (id, e, isOption) => {
    if (isOption) {
      return (
        <>
          <div className="setting-meeting d-flex justify-content-center align-items-center">
            {(e?.chairMan === id ||
              e?.sharedRole === id ||
              e?.createdBy === id) && (
              <>
                {e?.status === 0 && status === 0 && (
                  <a
                    href
                    role="button"
                    className="ml-1 mr-1"
                    // className="dropdown-item"
                    onClick={() => {
                      SwalAlertAllConfiguration({
                        title: "Bạn có chắc muốn gửi duyệt không?",
                        text:
                          "Khi bạn nhấn 'Đồng ý' '" +
                          e.symbol +
                          "' sẽ được gửi duyệt!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Thoát",
                        showLoaderOnConfirm: true,
                        dangerMode: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          new Api()
                            .unApprovePlanSchedule({
                              token: JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE)
                              )?.access_token,
                              id: e?.id,
                            })
                            .then((e) => {
                              onHandleCancel();
                              SwalAlertAllConfiguration({
                                title: "Thông báo! ",
                                text: "Gửi duyệt thành công",
                                icon: "success",
                              });
                            });
                        } else {
                          return false;
                        }
                      });
                    }}
                  >
                    <i className="fas fa-check-double blue"></i> Gửi duyệt
                  </a>
                )}
                {e?.status === 1 && status === 1 && (
                  <>
                    <a
                      href
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      onClick={() => {
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn hủy gửi duyệt không?",
                          text:
                            "Khi bạn nhấn 'Đồng ý' '" +
                            e.symbol +
                            "' sẽ được hủy gửi duyệt!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            new Api()
                              .draftPlanSchedule({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: e?.id,
                              })
                              .then((e) => {
                                onHandleCancel();
                                SwalAlertAllConfiguration({
                                  title: "Thông báo! ",
                                  text: "Hủy gửi duyệt thành công",
                                  icon: "success",
                                });
                              });
                          } else {
                            return false;
                          }
                        });
                      }}
                    >
                      <i className="fas fa-times red"></i> Hủy gửi duyệt
                    </a>
                    {choPhepNguoiLapLichDuyet === "1" && (
                      <>
                        <a
                          href
                          role="button"
                          className="ml-1 mr-1"
                          // className="dropdown-item"
                          onClick={() => {
                            SwalAlertAllConfiguration({
                              title: "Bạn có chắc muốn duyệt không?",
                              text:
                                "Khi bạn nhấn 'Đồng ý' '" +
                                e.symbol +
                                "' sẽ được duyệt!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Đồng ý",
                              cancelButtonText: "Thoát",
                              showLoaderOnConfirm: true,
                              dangerMode: true,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                new Api()
                                  .approvePlanSchedule({
                                    token: JSON.parse(
                                      sessionStorage.getItem(SESSION_STORAGE)
                                    )?.access_token,
                                    id: e?.id,
                                  })
                                  .then((e) => {
                                    onHandleCancel();
                                    SwalAlertAllConfiguration({
                                      title: "Thông báo! ",
                                      text: "Duyệt thành công",
                                      icon: "success",
                                    });
                                  });
                              } else {
                                return false;
                              }
                            });
                          }}
                        >
                          <i className="fas fa-check green"></i> Duyệt
                        </a>
                      </>
                    )}
                  </>
                )}
                {e?.status === 2 && status === 2 && choPhepCongKhai === "1" && (
                  <>
                    <a
                      href
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      onClick={() => {
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn công bố không?",
                          text:
                            "Khi bạn nhấn 'Đồng ý' '" +
                            e.symbol +
                            "' sẽ được công bố!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            new Api()
                              .isPublishedPlanSchedule({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: e?.id,
                              })
                              .then((e) => {
                                onHandleCancel();
                                SwalAlertAllConfiguration({
                                  title: "Thông báo! ",
                                  text: "Công bố thành công",
                                  icon: "success",
                                });
                              });
                          } else {
                            return false;
                          }
                        });
                      }}
                    >
                      <i className="fas fa-upload blue"></i> Công bố
                    </a>
                  </>
                )}
                {e?.status !== 3 && status === 0 && (
                  <a
                    href
                    role="button"
                    className="ml-1 mr-1"
                    // className="dropdown-item"
                    onClick={() => {
                      setOpenEdit(true);
                      setScheduleId(e.id);
                      setEdit(true);
                    }}
                  >
                    <i className="fas fa-edit"></i> Sửa
                  </a>
                )}
                {e?.isDeleted === false && status === 0 && (
                  <>
                    {/* <a
                      href
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      onClick={() => onSetting(e.id)}
                    >
                      <i className="fas fa-edit orange"></i> Sửa
                    </a> */}
                    <a
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => {
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn xóa không?",
                          text:
                            "Khi bạn nhấn 'Đồng ý' '" +
                            e.symbol +
                            "' sẽ bị xóa!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            new Api()
                              .removePlanSchedule({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: e?.id,
                              })
                              .then((e) => {
                                onHandleCancel();
                                SwalAlertAllConfiguration({
                                  title: "Xóa thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              });
                          } else {
                            return false;
                          }
                        });
                      }}
                    >
                      <i className="fas fa-trash-alt red"></i> Xóa
                    </a>
                  </>
                )}
                {e?.isDeleted === true && status === 3 && (
                  <>
                    <a
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => {
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn khôi phục không?",
                          text:
                            "Khi bạn nhấn 'Đồng ý' '" +
                            e.symbol +
                            "' sẽ bị khôi phục!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            new Api()
                              .restorePlanSchedule({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: e?.id,
                              })
                              .then((e) => {
                                onHandleCancel();
                                SwalAlertAllConfiguration({
                                  title: "Thông báo! ",
                                  text: "Khôi phục thành công",
                                  icon: "success",
                                });
                              });
                          } else {
                            return false;
                          }
                        });
                      }}
                    >
                      <i className="fas fa-trash-restore"></i> Khôi phục
                    </a>
                    <a
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => {
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn xóa không?",
                          text:
                            "Khi bạn nhấn 'Đồng ý' '" +
                            e.symbol +
                            "' sẽ bị xóa!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            new Api()
                              .deletePlanSchedule({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: e?.id,
                              })
                              .then((e) => {
                                onHandleCancel();
                                SwalAlertAllConfiguration({
                                  title: "Thông báo! ",
                                  text: "Xóa thành công",
                                  icon: "success",
                                });
                              });
                          } else {
                            return false;
                          }
                        });
                      }}
                    >
                      <i className="fas fa-eraser red"></i> Xóa vĩnh viễn
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        </>
      );
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
                  <a href={HREF.KeHoachHop}>{title}</a>
                </li>
                <li className="breadcrumb-item active">Kế hoạch họp</li>
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
              {openEdit === false ? (
                <>
                  <Row>
                    <Col span={12}>
                      <ul
                        className="nav nav-tabs mb-1"
                        id="custom-content-below-tab"
                        role="tablist"
                      >
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            id="custom-content-below-meeting-tab"
                            data-toggle="pill"
                            href="#custom-content-below-meeting"
                            role="tab"
                            aria-controls="custom-content-below-meeting"
                            aria-selected="false"
                            onClick={() => {
                              setStatus(0);
                            }}
                            style={{
                              fontSize: "large",
                            }}
                          >
                            ĐANG CẬP NHẬT
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="custom-content-below-pending-tab1"
                            data-toggle="pill"
                            href="#custom-content-below-pending1"
                            role="tab"
                            aria-controls="custom-content-below-pending1"
                            aria-selected="true"
                            onClick={() => {
                              setStatus(1);
                            }}
                            style={{
                              fontSize: "large",
                            }}
                          >
                            ĐÃ GỬI DUYỆT
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="custom-content-below-finished-tab"
                            data-toggle="pill"
                            href="#custom-content-below-finished"
                            role="tab"
                            aria-controls="custom-content-below-finished"
                            aria-selected="false"
                            onClick={() => {
                              setStatus(2);
                            }}
                            style={{
                              fontSize: "large",
                            }}
                          >
                            ĐÃ DUYỆT
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            id="custom-content-below-finished-tab"
                            data-toggle="pill"
                            href="#custom-content-below-finished"
                            role="tab"
                            aria-controls="custom-content-below-finished"
                            aria-selected="false"
                            onClick={() => {
                              setStatus(3);
                            }}
                            style={{
                              fontSize: "large",
                            }}
                          >
                            ĐÃ XÓA
                          </a>
                        </li>
                      </ul>
                    </Col>
                    <Col span={12}>
                      <ul className="nav navbar-nav navbar-right mb-1">
                        <li className="nav-item" style={{ textAlign: "right" }}>
                          <Button
                            size="large"
                            type="primary"
                            style={{
                              backgroundColor:
                                Theme.theme().css.background.color,
                            }}
                            icon={<PlusOutlined />}
                            onClick={() => {
                              if (
                                !Helper.isNullOrUndefined(permissions) &&
                                permissions &&
                                !permissions?.includes(FUNC_PERMISSION.SCHEDULE)
                              ) {
                                return SwalAlertAllConfiguration({
                                  toast: true,
                                  title: "Thông báo",
                                  text: "Tài khoản bạn không có quyền thao tác! Vui lòng liên hệ quản trị viên",
                                  footer: `Vui lòng chờ sau <b></b> giây`,
                                  icon: "warning",
                                  timer: 3000,
                                  timerProgressBar: true,
                                  showConfirmButton: false,
                                  didOpen: () => {
                                    SwalIsLoading();
                                    const timer =
                                      SwalGetPopup().querySelector("b");
                                    timerInterval = setInterval(() => {
                                      timer.textContent = `${SwalGetTimerLeft()}`;
                                    }, 100);
                                  },
                                  willClose: () => {
                                    clearInterval(timerInterval);
                                  },
                                });
                              }
                              setOpenEdit(true);
                            }}
                          >
                            Thêm mới
                          </Button>
                        </li>
                      </ul>
                    </Col>
                  </Row>
                  <div
                    className="tab-content"
                    id="custom-content-below-tabContent"
                  >
                    <div className="input-group form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tiêu đề kế hoạch họp"
                        aria-label="Từ khóa tìm kiếm"
                        aria-describedby="basic-addon2"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <RangePicker
                        showTime
                        placeholder={["Từ", "Đến"]}
                        onChange={(dates, dateStrings) => {
                          setStartTime(dateStrings[0]);
                          setEndTime(dateStrings[1]);
                        }}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-default"
                          type="button"
                        >
                          <i className="fas fa-search info" /> TÌM KIẾM
                        </button>
                      </div>
                    </div>
                    <Table
                      // rowSelection={
                      //   selectedRowKeys === null
                      //     ? false
                      //     : {
                      //         selectedRowKeys,
                      //         onChange: (newSelectedRowKeys) => {
                      //           console.log(
                      //             "selectedRowKeys changed: ",
                      //             newSelectedRowKeys
                      //           );
                      //           setSelectedRowKeys(newSelectedRowKeys);
                      //         },
                      //       }
                      // }
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      columns={[
                        {
                          title: "Số/Ký hiệu",
                          dataIndex: "symbol",
                        },
                        {
                          title: "Trích yếu",
                          dataIndex: "abstract",
                        },
                        {
                          // key: "",
                          title: "Ngày ban hành",
                          dataIndex: "dateIssued",
                          render: (value, record) => (
                            <>{moment(value).format("DD-MM-YYYY")}</>
                          ),
                          // width: "20%",
                        },
                        {
                          title: "Chọn",
                          hidden:
                            status !== 0 &&
                            status !== 1 &&
                            // status !== 2 &&
                            status !== 3 &&
                            choPhepCongKhai !== "1",
                          dataIndex: "Choose",
                          align: "center",
                          width: "40%",
                          render: (_, record) => (
                            <>
                              {renderSwitchUser(user && user?.id, record, true)}
                            </>
                          ),
                        },
                      ]}
                      rowKey={"id"}
                      dataSource={scheduleCal}
                      pagination={false}
                      loading={loading}
                    />
                    <Pagination
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} trên ${total} đối tượng`
                      }
                      current={page}
                      defaultCurrent={page}
                      onChange={(page, size) => {
                        setPage(page);
                        setSize(size);
                      }}
                      total={total}
                    />
                  </div>
                </>
              ) : (
                <>
                  {!Helper.isNullOrUndefined(edit) ? (
                    <ModalEdit
                      openEdit={openEdit}
                      edit={edit}
                      onHandleCancel={onHandleCancel}
                      scheduleId={scheduleId}
                      documentCall={documentCall}
                      dungLuongToiDaTepTaiLen={dungLuongToiDaTepTaiLen}
                    />
                  ) : (
                    <ModalAdd
                      edit={edit}
                      onHandleCancel={onHandleCancel}
                      setScheduleId={setScheduleId}
                      scheduleId={scheduleId}
                      dungLuongToiDaTepTaiLen={dungLuongToiDaTepTaiLen}
                    />
                  )}
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

      <Modal
        title={!Helper.isNullOrUndefined(edit) ? "Sửa" : "Thêm"}
        centered
        // open={openEdit}
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
        {/* <HandleTabsUpdate
          contentCall={contentCall}
          memberCall={memberCall}
          memberEmailCall={memberEmailCall}
          documentCall={documentCall}
          scheduleId={id}
          onHandleCancel={onHandleCancel}
        /> */}
        {!Helper.isNullOrUndefined(edit) ? (
          <ModalEdit
            edit={edit}
            onHandleCancel={onHandleCancel}
            scheduleId={scheduleId}
            documentCall={documentCall}
          />
        ) : (
          <ModalAdd
            edit={edit}
            onHandleCancel={onHandleCancel}
            setScheduleId={setScheduleId}
            scheduleId={scheduleId}
          />
        )}
      </Modal>
    </div>
  );
}
