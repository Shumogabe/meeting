import React, { useEffect, useState } from "react";
import { DatePicker, Pagination, Table } from "antd";

import axios from "axios";
import moment from "moment";
import Api from "../../../api";
import { HandleTabs } from "../../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalAlertTimeRedirect,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import { HandleTabsUpdate } from "./modal";
const { RangePicker } = DatePicker;

export default function ContentWrapper({
  title,
  openAdd,
  setOpenAdd,
  onCloseModal,
  permissions,
  user,
  setUser,
}) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [meetingData, setMeetingData] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [edit, setEdit] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [id, setId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [passwordRoom, setPasswordRoom] = useState(null);
  const [scheduleCal, setScheduleCal] = useState([]);
  const [contentCall, setContentCall] = useState([]);
  const [memberCall, setMemberCall] = useState([]);
  const [memberEmailCall, setMemberEmailCall] = useState([]);
  const [documentCall, setDocumentCall] = useState([]);
  const [videoCall, setVideoCall] = useState([]);
  const [voteCall, setVoteCall] = useState([]);
  const [url, setUrl] = useState(null);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(PAGE_CURRENT);
  const [size, setSize] = useState(PAGE_SIZE);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [status, setStatus] = useState(2);
  const [start, setStart] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  //
  const [yeuCauQuyTrinhPheDuyet, setYeuCauQuyTrinhPheDuyet] = useState(1);

  const getScheduleByUser = (
    id,
    keySearch,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize
  ) => {
    if (!Helper.isNullOrUndefined(id)) {
      setScheduleCal([]);
      setLoading(true);
      new Api()
        .get_schedule_byUserIdFilter({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
          keySearch: keySearch,
          dateFrom: Helper.isNullOrUndefined(dateFrom)
            ? "01/01/0001"
            : dateFrom,
          dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
          status: status,
          start: start,
          isdeleted: isdeleted,
          page: page,
          pageSize: pageSize,
        })
        .then((response) => {
          if (response?.data) {
            setLoading(false);
            setScheduleCal(response?.data);
            setTotal(response?.totalRecords);
          }
        });
    }
  };

  const onChangeStart = (data, id, start, token) => {
    if (id) {
      let changeStart = {
        start: start,
        modifiedDate: new Date(),
        modifiedBy: user && user?.id,
      };
      new Api().schedule_status({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: id,
        data: {
          status: start ? 2 : 3,
          modifiedBy: user && user?.id,
          modifiedDate: new Date(),
        },
      });
      return new Api()
        .schedule_start({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
          data: changeStart,
        })
        .then((response) => {
          if (response) {
            SwalAlertAllConfiguration({
              title: "Thông báo",
              text: start ? "Bắt đầu thành công" : "Kết thúc thành công",
              icon: "success",
            });
            onHandleCancel();
          } else
            SwalAlertTimeRedirect({
              title: "Thông báo! ",
              text: response?.message,
              timer: 0,
              redirect: HREF.LichHop,
              icon: "warning",
            });
        });
    }
  };

  const onMeeting = (data) => {
    if (data?.id) {
      return axios
        .all([
          new Api().get_member_byScheduleId({
            id: data?.id,
          }),
          new Api().get_voted_byScheduleId({
            id: data?.id,
          }),
          new Api().getPlanScheduleId({
            id: data?.id,
          }),
        ])
        .then(
          axios.spread((resp1, resp2, resp3) => {
            let res = {
              schedule: data,
              content: data?.meetingContent,
              document: data?.meetingDocument,
              member: resp1?.data,
              voted: resp2?.data,
              votes: data?.meetingVotes,
              plan: resp3?.data,
            };
            new Api()
              .log_ql_thamgiaphonghop({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                data: {
                  tai_khoan: user?.ten_dangnhap,
                  noi_dung:
                    user?.ten_dangnhap +
                    " tham gia phòng họp " +
                    data?.roomName,
                  loai_hoatdong: "Tham gia",
                  chuc_nang: "Thêm mới",
                },
              })
              .then(() => {
                window.location.href = HREF.HopTrucTuyen + "/" + data?.roomName;
              });
          })
        );
    }
  };

  const onChangeStatus = (id, status) => {
    if (id && status > 0) {
      return new Api()
        .schedule_status({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
          data: {
            status: status,
            modifiedDate: new Date(),
            modifiedBy: user && user?.id,
          },
        })
        .then((response) => {
          if (response) {
            SwalAlertTimeRedirect({
              title: "Thông báo",
              text: status === 2 ? "Xác nhận thành công!" : "Đã hủy xác nhận",
              timer: 0,
              redirect: HREF.LichHop,
              icon: "success",
            });
            onHandleCancel();
          } else
            SwalAlertTimeRedirect({
              title: "Thông báo! ",
              text: response.message,
              timer: 0,
              redirect: HREF.LichHop,
              icon: "warning",
            });
        });
    }
  };

  const onSetting = (id) => {
    onHandleCancel();
    if (id) {
      new Api()
        .get_schedule_byId({
          id: id,
        })
        .then((response) => {
          if (response?.data?.id) {
            setCalendar(response?.data);
            setEdit(response?.data);
            setId(id);
            setScheduleId(id);
            setPasswordRoom(response?.data?.password);
            //Content
            // getContentBySchedule(id);
            setContentCall(response?.data?.meetingContent);
            //Member
            // getMeetingMember(id);
            setMemberCall(response?.data?.MeetingMemberInside);
            setMemberEmailCall(response?.data?.MeetingMemberOutside);
            //Document
            // getMeetingDocument(id);
            setDocumentCall(response?.data?.meetingDocument);
            //Video
            // getMeetingVideo(id);
            setVideoCall(response?.data?.meetingVideo);
            //Vote
            // getMeetingVote(id);
            setVoteCall(response?.data?.meetingVote);
            setOpenEdit(true);
          } else {
            SwalAlertAllConfiguration({
              title: "Thông báo!",
              text: "Không tìm thấy thông tin lịch họp",
              icon: "warning",
            });
          }
        });
    } else
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Lịch họp không tồn tại",
        icon: "warning",
      });
  };

  const onEdit = (id) => {
    if (id) {
      new Api()
        .get_schedule_byId({
          id: id,
        })
        .then((response) => {
          if (response?.data?.id) {
            setEdit(response.data);
            setId(id);
          }
        });
    } else {
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Không tìm thấy thông tin lịch họp",
        icon: "warning",
      });
    }
  };

  const onDelete = (id) => {
    if (id) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn xóa lịch họp?",
        text: "Khi bạn nhấn 'Đồng ý' lịch sẽ bị xóa!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
        preConfirm: async (login) => {
          try {
            return new Api()
              .schedule_delete({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                id: id,
                data: {
                  deletedBy: user && user?.id,
                  deletedDate: new Date(),
                },
              })
              .then((response) => {
                if (response) {
                  getScheduleByUser(
                    user?.id,
                    search,
                    startTime,
                    endTime,
                    status,
                    start,
                    isDeleted,
                    page,
                    size
                  );
                  SwalAlertAllConfiguration({
                    title: "Thông báo",
                    text: "Xóa thành công",
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response?.message,
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "warning",
                  });
              });
          } catch (error) {
            SwalShowValidationMessage(`
            Request failed: ${error}
          `);
          }
        },
        allowOutsideClick: () => !SwalIsLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Nội dung không tồn tại",
        icon: "warning",
      });
    }
  };

  const onRestore = (id) => {
    if (id) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn khôi phục lịch họp?",
        text: "Khi bạn nhấn 'Đồng ý' lịch họp sẽ được khôi phục!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
        preConfirm: async (login) => {
          try {
            return new Api()
              .schedule_restore({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                id: id,
                data: {
                  modifiedBy: user && user?.id,
                  modifiedDate: new Date(),
                },
              })
              .then((response) => {
                if (response) {
                  getScheduleByUser(
                    user?.id,
                    search,
                    startTime,
                    endTime,
                    status,
                    start,
                    isDeleted,
                    page,
                    size
                  );
                  SwalAlertAllConfiguration({
                    title: "Thông báo",
                    text: "Khôi phục thành công",
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response?.message,
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "warning",
                  });
              });
          } catch (error) {
            SwalShowValidationMessage(`
            Request failed: ${error}
          `);
          }
        },
        allowOutsideClick: () => !SwalIsLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Nội dung không tồn tại",
        icon: "warning",
      });
    }
  };

  const onRemove = (id) => {
    if (id) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn xóa vĩnh viễn lịch họp?",
        text: "Khi bạn nhấn 'Đồng ý' lịch sẽ được xóa vĩnh viễn!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
        preConfirm: async (login) => {
          try {
            return new Api()
              .schedule_remove({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                id: id,
              })
              .then((response) => {
                if (response) {
                  getScheduleByUser(
                    user?.id,
                    search,
                    startTime,
                    endTime,
                    status,
                    start,
                    isDeleted,
                    page,
                    size
                  );
                  SwalAlertAllConfiguration({
                    title: "Thông báo",
                    text: "Xóa thành công",
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response?.message,
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "warning",
                  });
              });
          } catch (error) {
            SwalShowValidationMessage(`
            Request failed: ${error}
          `);
          }
        },
        allowOutsideClick: () => !SwalIsLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Nội dung không tồn tại",
        icon: "warning",
      });
    }
  };

  const onGetLink = (roomName) => {
    return setUrl(href + HREF.HopTrucTuyen + "/" + roomName);
  };

  const renderSwitchUser = (id, e, isOption) => {
    /* let a = 0;
    for (let index = 0; index < JSON.parse(localStorage.getItem('UserInfo')).UserInfo.Role.length; index++) {
      if (JSON.parse(localStorage.getItem('UserInfo')).UserInfo.Role[index]['id'] === 885) {
        a++;
        break;
      }
    } */
    if (isOption) {
      return (
        <>
          {/* <a href={HREF.HopTrucTuyen}>
            <i className="fas fa-video blue" /> Tham gia
          </a>
          <a href="./thiet-lap.html">
            <i className="fas fa-cogs orange" /> Thiết lập
          </a> */}
          <div className="setting-meeting d-flex justify-content-center align-items-center">
            <a
              href
              role="button"
              className={`ml-1 mr-1`}
              onClick={() => {
                // if (
                //   (e?.chairMan === id || e?.sharedRole === id) &&
                //   e?.start === false
                // ) {
                //   onChangeStart(e, e?.id, true);
                // } else if (e?.start) {
                onMeeting(e);
                // } else {
                //   SwalAlertAllConfiguration({
                //     title: "Thông báo!",
                //     text: "Phòng họp chưa bắt đầu",
                //     icon: "warning",
                //   });
                // }
              }}
              title="Thông tin phòng họp"
            >
              {/* <i className="fab fa-chromecast " />  */}
              <i className="fas fa-info-circle blue fa-1x"></i> Thông tin phòng
              họp
              {/* <i className={`fas fa-video blue fa-1x`} /> */}
            </a>
            {status === 2 && start === true && isDeleted === false && (
              <>
                <a
                  href
                  role="button"
                  className={`ml-1 mr-1`}
                  onClick={() => {
                    sessionStorage.setItem("thamgiatructuyen", "true");
                    if (
                      (e?.chairMan === id || e?.sharedRole === id) &&
                      e?.start === false
                    ) {
                      onChangeStart(e, e?.id, true);
                    } else if (e?.start) {
                      onMeeting(e);
                    } else {
                      SwalAlertAllConfiguration({
                        title: "Thông báo!",
                        text: "Phòng họp chưa bắt đầu",
                        icon: "warning",
                      });
                    }
                  }}
                  title="Tham gia"
                >
                  {/* <i className="fab fa-chromecast " />  */}
                  <i className={`fas fa-video blue fa-1x`} /> Tham gia trực
                  tuyến
                </a>
                <a
                  href
                  role="button"
                  className="ml-1 mr-1"
                  onClick={() => {
                    // onGetLink(e.roomName);
                    SwalAlertAllConfiguration({
                      title: "Lấy đường dẫn phòng họp",
                      html: `<input
                              type="text"
                              class="form-control"
                              id="room-link"
                              placeholder="Url"
                              aria-label="Url"
                              aria-describedby="button-addon2"
                              name="url"
                              disabled
                              defaultValue=${
                                href + HREF.HopTrucTuyen + "/" + e?.roomName
                              }
                              value=${
                                href + HREF.HopTrucTuyen + "/" + e?.roomName
                              }
                            >`,
                      showCancelButton: true,
                      confirmButtonText: "Lấy đường dẫn",
                      cancelButtonText: "Thoát",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigator?.clipboard?.writeText(
                          href + HREF.HopTrucTuyen + "/" + e?.roomName
                        );
                        SwalAlertAllConfiguration({
                          title: "Đã sao chép đường dẫn thành công",
                          text: "",
                          icon: "success",
                        });
                      }
                    });
                  }}
                  title="Đường dẫn"
                >
                  <i className="fas fa-link blue fa-1x" /> Đường dẫn trực tuyến
                </a>
                {e?.chairMan === id ||
                (e?.sharedRole === id) |
                  (permissions &&
                    permissions?.includes(FUNC_PERMISSION.SCHEDULE)) ? (
                  <>
                    {e?.status !== 3 && e?.isDeleted === false && (
                      <a
                        href
                        role="button"
                        className="ml-1 mr-1"
                        // className="dropdown-item"
                        onClick={() => {
                          onSetting(e.id);
                          // setId(e.id);
                        }}
                      >
                        <i className="fas fa-cogs"></i> Thiết lập
                      </a>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {(() => {
                  if (
                    (e?.chairMan === id || e?.sharedRole === id) &&
                    e?.start === true
                  ) {
                    return (
                      <>
                        <a
                          href
                          role="button"
                          className={`ml-1 mr-1 ${e?.start ? "red" : ""}`}
                          onClick={() => {
                            if (
                              (e?.chairMan === id || e?.sharedRole === id) &&
                              e?.start === true
                            ) {
                              SwalAlertAllConfiguration({
                                title: "Bạn có chắc muốn kết thúc không?",
                                text: "Khi bạn nhấn 'Đồng ý' phòng họp sẽ kết thúc!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Thoát",
                                showLoaderOnConfirm: true,
                                dangerMode: true,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  userManager.getUser().then((res) => {
                                    onChangeStart(e, e?.id, false, res);
                                  });
                                } else {
                                  return false;
                                }
                              });
                            }
                          }}
                          title="Kết thúc"
                        >
                          {/* <i className="fab fa-chromecast fa-1x" /> */}
                          <i className="fas fa-phone-slash fa-1x" />
                          Kết thúc
                        </a>
                      </>
                    );
                  }
                })()}
              </>
            )}
            {status === 1 && start === false && isDeleted === false && (
              <>
                {yeuCauQuyTrinhPheDuyet === "0" &&
                  permissions &&
                  permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true && (
                    <a role="button" href onClick={() => alert(123)}>
                      <i className="fas fa-check-double"></i> Duyệt
                    </a>
                  )}
                {e?.start === false &&
                e?.status === 1 &&
                permissions &&
                permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true ? (
                  <a
                    role="button"
                    href
                    className="ml-1 mr-1"
                    onClick={() => {
                      SwalAlertAllConfiguration({
                        title:
                          "Bạn có chắc muốn " +
                          (e?.status === 1
                            ? "xác nhận"
                            : e?.status === 2 && "hủy xác nhận") +
                          " không?",
                        text:
                          "Khi bạn nhấn 'Đồng ý' sẽ " +
                          (e?.status === 1
                            ? "xác nhận"
                            : e?.status === 2 && "hủy xác nhận") +
                          "!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Thoát",
                        showLoaderOnConfirm: true,
                        dangerMode: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          if (e?.status === 1) {
                            onChangeStatus(e?.id, 2);
                          } else if (e?.status === 2) {
                            onChangeStatus(e?.id, 1);
                          }
                        } else {
                          return false;
                        }
                      });
                    }}
                  >
                    {e?.status === 2 ? (
                      <>
                        <i className="fas fa-times red"></i> Hủy xác nhận
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check green"></i> Xác nhận
                      </>
                    )}
                  </a>
                ) : (
                  <></>
                )}
                {e?.chairMan === id ||
                (e?.sharedRole === id) |
                  (permissions &&
                    permissions?.includes(FUNC_PERMISSION.SCHEDULE)) ? (
                  <>
                    {e?.status !== 3 && e?.isDeleted === false && (
                      <a
                        href
                        role="button"
                        className="ml-1 mr-1"
                        // className="dropdown-item"
                        onClick={() => {
                          onSetting(e.id);
                          // setId(e.id);
                        }}
                      >
                        <i className="fas fa-cogs"></i> Thiết lập
                      </a>
                    )}
                    {e?.start === false && e?.isDeleted === false && (
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
                        {/* <a
                          role="button"
                          className="ml-1 mr-1"
                          // className="dropdown-item"
                          href
                          onClick={() => onDelete(e?.id)}
                        >
                          <i className="fas fa-trash-alt red"></i> Xóa
                        </a> */}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {status === 2 && start === false && isDeleted === false && (
              <>
                {(() => {
                  if (
                    (e?.chairMan === id || e?.sharedRole === id) &&
                    e?.isDeleted === false &&
                    e?.status === 2 &&
                    e?.start === false
                  ) {
                    return (
                      <a
                        href
                        role="button"
                        className={`ml-1 mr-1 ${e?.start ? "blue" : ""}`}
                        onClick={() => {
                          if (
                            (e?.chairMan === id || e?.sharedRole === id) &&
                            e?.start === false &&
                            e?.status === 2
                          ) {
                            userManager.getUser().then((res) => {
                              onChangeStart(e, e?.id, true, res);
                            });
                          } else if (e?.start) {
                            onMeeting(e);
                          } else {
                            if (e?.status === 1) {
                              SwalAlertAllConfiguration({
                                title: "Thông báo!",
                                text: "Phòng họp chưa được xác nhận",
                                icon: "warning",
                              });
                            } else {
                              SwalAlertAllConfiguration({
                                title: "Thông báo!",
                                text: "Phòng họp chưa bắt đầu",
                                icon: "warning",
                              });
                            }
                          }
                        }}
                        title={`Bắt đầu`}
                      >
                        <i className="fab fa-chromecast fa-1x" /> Bắt đầu
                      </a>
                    );
                  }
                })()}
                {e?.start === false &&
                e?.status !== 3 &&
                permissions &&
                permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true ? (
                  <a
                    role="button"
                    href
                    onClick={() => {
                      SwalAlertAllConfiguration({
                        title:
                          "Bạn có chắc muốn " +
                          (e?.status === 1
                            ? "xác nhận"
                            : e?.status === 2 && "hủy xác nhận") +
                          " không?",
                        text:
                          "Khi bạn nhấn 'Đồng ý' sẽ " +
                          (e?.status === 1
                            ? "xác nhận"
                            : e?.status === 2 && "hủy xác nhận") +
                          "!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Thoát",
                        showLoaderOnConfirm: true,
                        dangerMode: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          if (e?.status === 1) {
                            onChangeStatus(e?.id, 2);
                          } else if (e?.status === 2) {
                            onChangeStatus(e?.id, 1);
                          }
                        } else {
                          return false;
                        }
                      });
                    }}
                  >
                    {e?.status === 2 ? (
                      <>
                        <i className="fas fa-times red"></i> Hủy xác nhận
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check green"></i> Xác nhận
                      </>
                    )}
                  </a>
                ) : (
                  <></>
                )}
              </>
            )}
            {status === 3 && start === false && isDeleted === false && (
              <>
                {(() => {
                  if (
                    (e?.chairMan === id || e?.sharedRole === id) &&
                    e?.isDeleted === false &&
                    e?.start === false &&
                    e?.status === 3
                  ) {
                    return (
                      <a
                        href
                        role="button"
                        className={`ml-1 mr-1 ${e?.start ? "blue" : ""}`}
                        onClick={() => {
                          if (
                            (e?.chairMan === id || e?.sharedRole === id) &&
                            e?.start === false &&
                            e?.status === 3
                          ) {
                            if (e?.isPublished === true) {
                              userManager.getUser().then((res) => {
                                onChangeStart(e, e?.id, true, res);
                              });
                            } else {
                              onChangeStatus(e?.id, 1);
                            }
                          }
                        }}
                        title={`Bắt đầu lại`}
                      >
                        <i className="fab fa-chromecast fa-1x" /> Bắt đầu lại
                      </a>
                    );
                  }
                })()}
                {e?.chairMan === id ||
                e?.sharedRole === id ||
                (permissions &&
                  permissions?.includes(FUNC_PERMISSION.SCHEDULE)) ? (
                  <>
                    {e?.start === false && e?.isDeleted === false && (
                      <>
                        {/* <a
                          role="button"
                          className="ml-1 mr-1"
                          // className="dropdown-item"
                          href
                          onClick={() => onDelete(e?.id)}
                        >
                          <i className="fas fa-trash-alt red"></i> Xóa
                        </a> */}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {isDeleted === true && (
              <>
                {e?.chairMan === id ||
                e?.sharedRole === id ||
                (permissions &&
                  permissions?.includes(FUNC_PERMISSION.SCHEDULE)) ? (
                  <>
                    {e?.isDeleted === true && (
                      <>
                        <a
                          role="button"
                          className="ml-1 mr-1"
                          // className="dropdown-item"
                          href
                          onClick={() => onRestore(e?.id)}
                        >
                          <i className="fas fa-trash-restore"></i> Khôi phục
                        </a>
                        {/* <a
                          role="button"
                          className="ml-1 mr-1"
                          // className="dropdown-item"
                          href
                          onClick={() => onRemove(e?.id)}
                        >
                          <i className="fas fa-times-circle red"></i> Xóa vĩnh
                          viễn
                        </a> */}
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </>
      );
    }
  };

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(user?.id)) {
  //     getScheduleByUser(
  //       user?.id,
  //       "",
  //       null,
  //       null,
  //       status,
  //       start,
  //       isDeleted,
  //       page,
  //       size
  //     );
  //   }
  // }, [user]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(user?.id)) {
      getScheduleByUser(
        user?.id,
        search,
        startTime,
        endTime,
        status,
        start,
        isDeleted,
        page,
        size
      );
    }
    new Api()
      .LayRaThietLapCauHinh("tl_ch_lichhop", "YeuCauQuyTrinhPheDuyet")
      .then((res) => {
        if (res.code === 200) {
          setYeuCauQuyTrinhPheDuyet(res?.data?.giatri);
        }
      });
  }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);

  useEffect(() => {
    if (status === 3 && start === false && isDeleted === false) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(null);
    }
  }, [status, start, isDeleted]);

  const onHandleCancel = () => {
    setStatus(2);
    setStart(true);
    setIsDeleted(false);
    setCalendar([]);
    setEdit([]);
    setId(null);
    setScheduleId(null);
    setPasswordRoom(null);
    //Content
    setContentCall([]);
    //Member
    setMemberCall([]);
    setMemberEmailCall([]);
    //Document
    setDocumentCall([]);
    //Video
    setVideoCall([]);
    //Vote
    setOpenEdit(false);
    getScheduleByUser(
      user?.id,
      search,
      startTime,
      endTime,
      2,
      true,
      false,
      page,
      size
    );
  };

  useEffect(() => {
    if (openEdit === false) {
      onHandleCancel();
    }
  }, [openEdit]);

  useEffect(() => {
    if (openAdd === true) {
      setOpenEdit(false);
    }
  }, [openAdd]);

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
                  <a href={HREF.LichHop}>{title}</a>
                </li>
                <li className="breadcrumb-item active">Lịch họp</li>
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
              {openEdit === false && openAdd === false && (
                <>
                  <ul
                    className="nav nav-tabs mb-1"
                    id="custom-content-below-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className={
                          status === 2 && start === true && isDeleted === false
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="custom-content-below-meeting-tab"
                        data-toggle="pill"
                        href="#custom-content-below-meeting"
                        role="tab"
                        aria-controls="custom-content-below-meeting"
                        aria-selected="false"
                        onClick={() => {
                          setStatus(2);
                          setStart(true);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "large",
                        }}
                      >
                        ĐANG HỌP
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={
                          status === 1 && start === false && isDeleted === false
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="custom-content-below-pending-tab"
                        data-toggle="pill"
                        href="#custom-content-below-pending"
                        role="tab"
                        aria-controls="custom-content-below-pending"
                        aria-selected="true"
                        onClick={() => {
                          setStatus(1);
                          setStart(false);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "large",
                        }}
                      >
                        CHỜ DUYỆT
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={
                          status === 2 && start === false && isDeleted === false
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="custom-content-below-pending-tab"
                        data-toggle="pill"
                        href="#custom-content-below-pending"
                        role="tab"
                        aria-controls="custom-content-below-pending"
                        aria-selected="true"
                        onClick={() => {
                          setStatus(2);
                          setStart(false);
                          setIsDeleted(false);
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
                        className={
                          status === 3 && start === false && isDeleted === false
                            ? "nav-link active"
                            : "nav-link"
                        }
                        id="custom-content-below-finished-tab"
                        data-toggle="pill"
                        href="#custom-content-below-finished"
                        role="tab"
                        aria-controls="custom-content-below-finished"
                        aria-selected="false"
                        onClick={() => {
                          setStatus(3);
                          setStart(false);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "large",
                        }}
                      >
                        ĐÃ KẾT THÚC
                      </a>
                    </li>
                    {/* <li className="nav-item">
                      <a
                        className={
                          isDeleted === true ? "nav-link active" : "nav-link"
                        }
                        id="custom-content-below-finished-tab"
                        data-toggle="pill"
                        href="#custom-content-below-finished"
                        role="tab"
                        aria-controls="custom-content-below-finished"
                        aria-selected="false"
                        onClick={() => {
                          setIsDeleted(true);
                        }}
                        style={{
                          fontSize: "large",
                        }}
                      >
                        ĐÃ XÓA
                      </a>
                    </li> */}
                  </ul>
                  <div
                    className="tab-content"
                    id="custom-content-below-tabContent"
                  >
                    <div className="input-group form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên hoặc tiêu đề phòng họp"
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
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      // rowSelection={
                      //   selectedRowKeys === null
                      //     ? false
                      //     : {
                      //         selectedRowKeys,
                      //         onChange: (newSelectedRowKeys) => {
                      //           //console.log(
                      //           //  "selectedRowKeys changed: ",
                      //           //  newSelectedRowKeys
                      //           //);
                      //           setSelectedRowKeys(newSelectedRowKeys);
                      //         },
                      //       }
                      // }
                      columns={[
                        {
                          title: "Thời gian bắt đầu",
                          dataIndex: "time",
                          align: "center",
                          width: "15%",
                          render: (_, record) => (
                            <div className="row">
                              <div className="col-sm-2 padding-top-1">
                                <i className="far fa-clock" />
                              </div>
                              <div className="col-sm-10 align-left">
                                {moment(record.startTime).format("HH:mm")}{" "}
                                <br />
                                <span className="date-sm">
                                  {moment(record.startTime).format(
                                    "DD-MM-YYYY"
                                  )}
                                </span>
                              </div>
                            </div>
                          ),
                        },
                        {
                          title: "Nội dung",
                          dataIndex: "content",
                          render: (_, record) => (
                            <>
                              {record.title}{" "}
                              {record?.start ? (
                                <i
                                  className="fas fa-video"
                                  style={{
                                    color: "#ff0000",
                                  }}
                                ></i>
                              ) : (
                                <></>
                              )}
                              <br />
                              <i
                                style={{
                                  color: "#6e7680",
                                  fontSize: "14px",
                                }}
                              >
                                {/* {record.roomName} */}
                                <span
                                  // className="col-md"
                                  // style={{
                                  //   maxHeight: "45vh",
                                  //   overflow: "auto",
                                  // }}
                                  dangerouslySetInnerHTML={{
                                    __html: record?.content,
                                  }}
                                ></span>
                              </i>
                            </>
                          ),
                        },
                        {
                          title: "Chọn",
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
                      onChange={(page, size) => {
                        setPage(page);
                        setSize(size);
                      }}
                      total={total}
                    />
                  </div>
                </>
              )}
              {openEdit === true && openAdd === false && (
                <>
                  <h5>Thiết lập: {edit?.title}</h5>
                  <HandleTabsUpdate
                    contentCall={contentCall}
                    memberCall={memberCall}
                    memberEmailCall={memberEmailCall}
                    documentCall={documentCall}
                    videoCall={videoCall}
                    scheduleId={id}
                    onHandleCancel={onHandleCancel}
                    edit={edit}
                  />
                </>
              )}
              {openAdd === true && openEdit === false && (
                <>
                  <h5>Thêm lịch</h5>
                  <HandleTabs onCloseModal={onCloseModal} />
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
        title="Thiết lập"
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
        <HandleTabsUpdate
          contentCall={contentCall}
          memberCall={memberCall}
          memberEmailCall={memberEmailCall}
          documentCall={documentCall}
          videoCall={videoCall}
          scheduleId={id}
          onHandleCancel={onHandleCancel}
          edit={edit}
        />
      </Modal> */}
    </div>
  );
}
