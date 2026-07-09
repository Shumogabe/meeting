import React, { useEffect, useState } from "react";
import { DatePicker, Pagination, Table } from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/vi";
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
import { dayOfWeek, formatDayOfWeek } from "../../../helper/datetime";
import { Theme } from "../../../theme";
const { RangePicker } = DatePicker;
moment.locale("vi");
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
  const [allScheduleCal, setAllScheduleCal] = useState([]);
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
  const [status, setStatus] = useState(3);
  const [start, setStart] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const [timeWeek, setTimeWeek] = useState(new Date());

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
      setLoading(false);
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
            setTotal(response?.total);
          }
        });
    }
  };
  const getAllScheduleByUser = (
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
      setAllScheduleCal([]);
      setLoading(false);
      new Api()
        .get_schedule_byUserIdFilterMonre({
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
            setAllScheduleCal(response?.data);
            setTotal(response?.total);
          }
        });
    }
  };

  const onChangeStart = (id, start, token) => {
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
              text: response.message,
              icon: "success",
            });
            start
              ? onMeeting(id)
              : // window.location.reload();
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

  const onMeeting = (id) => {
    if (id) {
      return axios
        .all([
          new Api().get_schedule_byId({
            id: id,
          }),
          new Api().get_content_byScheduleId({
            id: id,
            pageSize: 999999,
            pageNumber: 1,
          }),
          new Api().get_document_byFileUrl({
            url: "tailieu/" + id,
            pageSize: 999999,
            pageNumber: 1,
          }),
          new Api().get_member_byScheduleId({
            id: id,
          }),
          new Api().get_voted_byScheduleId({
            id: id,
          }),
          new Api().get_votes_byScheduleId({
            search: "",
            id: id,
            pageSize: 999999,
            pageNumber: 1,
          }),
        ])
        .then(
          axios.spread((resp1, resp2, resp3, resp4, resp5, resp6) => {
            if (resp1?.data) {
              setMeetingData({
                schedule: resp1?.data,
                content: resp1?.data?.meetingContent,
                document: resp1?.data?.meetingDocument,
                member: resp4?.data,
                voted: resp5?.data,
                votes: resp1?.data?.meetingVotes,
              });
              localStorage.setItem("meeting_data", JSON.stringify(meetingData));
              window.location.href =
                HREF.HopTrucTuyen +
                "/" +
                (resp1 &&
                resp1?.data &&
                resp1?.data?.status === 2 &&
                resp1?.data?.start === true
                  ? resp1?.data?.roomName
                  : resp1?.data?.id);
            } else {
              SwalAlertAllConfiguration({
                title: "Thông báo",
                text: "Không lấy được dữ liệu",
                icon: "warning",
              });
            }
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
            getScheduleByUser(
              user?.id,
              search,
              startTime,
              endTime,
              status === 2 ? 1 : status === 1 && 2,
              start,
              isDeleted,
              page,
              size
            );
            SwalAlertTimeRedirect({
              title: "Thông báo",
              text: status === 2 ? "Xác nhận thành công!" : "Đã hủy xác nhận",
              timer: 0,
              redirect: HREF.LichHop,
              icon: "success",
            });
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
              text: "Không tìm thấy thông tin phòng họp",
              icon: "warning",
            });
          }
        });
    } else
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Thông tin lịch không tồn tại",
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
        text: "Không tìm thấy thông tin phòng họp",
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
                    text: response.message,
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response.message,
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
        title: "Thông báo! Nội dung không tồn tại",
        text: "",
        icon: "warning",
      });
    }
  };

  const onRestore = (id) => {
    if (id) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn khôi phục lịch họp?",
        text: "Khi bạn nhấn 'Đồng ý' lịch sẽ được khôi phục!",
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
                    text: response.message,
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response.message,
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
        title: "Thông báo! Nội dung không tồn tại",
        text: "",
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
                    text: response.message,
                    timer: 0,
                    redirect: HREF.LichHop,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response.message,
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
        title: "Thông báo! Nội dung không tồn tại",
        text: "",
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
            {e?.start === true ? (
              <>
                <a
                  href
                  role="button"
                  className={`ml-1 mr-1`}
                  onClick={() => {
                    if (
                      (e?.chairMan === id || e?.sharedRole === id) &&
                      e?.start === false
                    ) {
                      onChangeStart(e?.id, true);
                    } else if (e?.start) {
                      onMeeting(e?.id);
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
                  <i className={`fas fa-video blue fa-1x`} /> Tham gia
                </a>
                {(() => {
                  if (
                    (e?.chairMan === id || e?.sharedRole === id) &&
                    e?.start === true
                  ) {
                    return (
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
                                  onChangeStart(e?.id, false, res);
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
                    );
                  }
                })()}
              </>
            ) : (
              <>
                {(() => {
                  if (
                    (e?.chairMan === id || e?.sharedRole === id) &&
                    e?.isDeleted === false
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
                            e?.status !== 1
                          ) {
                            userManager.getUser().then((res) => {
                              onChangeStart(e?.id, true, res);
                            });
                          } else if (e?.start) {
                            onMeeting(e?.id);
                          } else {
                            if (e?.status === 1) {
                              SwalAlertAllConfiguration({
                                title: "Thông báo!",
                                text: "Phòng họp chưa được phê duyệt",
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
                        title={"Bắt đầu" + (e?.status === 3 && " lại")}
                      >
                        <i className="fab fa-chromecast fa-1x" /> Bắt đầu
                        {e?.status === 3 && " lại"}
                      </a>
                    );
                  }
                })()}
              </>
            )}
            {/* {e?.isPublished === false &&
            e?.start === false &&
            e?.status !== 3 ? (
              <div className="dropdown ml-1 mr-1">
                <a
                  href
                  role="button"
                  className="dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  title="Xác nhận"
                >
                  <i className="fas fa-bars fa-1x"></i>
                  <i className="fas fa-check-double" />
                  Xác nhận
                </a>
                <div className="dropdown-menu"></div>
              </div>
            ) : null} */}
            {e?.isPublished === false &&
            e?.start === false &&
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
            {e?.isDeleted === false && e?.start === true && (
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
                    href +
                    HREF.HopTrucTuyen +
                    "/" +
                    (e && e?.status === 2 && e?.start === true
                      ? e?.roomName
                      : e?.id)
                  }
                  value=${
                    href +
                    HREF.HopTrucTuyen +
                    "/" +
                    (e && e?.status === 2 && e?.start === true
                      ? e?.roomName
                      : e?.id)
                  }
                >`,
                    showCancelButton: true,
                    confirmButtonText: "Lấy đường dẫn",
                    cancelButtonText: "Thoát",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigator.clipboard.writeText(
                        href +
                          HREF.HopTrucTuyen +
                          "/" +
                          (e && e?.status === 2 && e?.start === true
                            ? e?.roomName
                            : e?.id)
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
                <i className="fas fa-link blue fa-1x" /> Đường dẫn
              </a>
            )}
            {e?.chairMan === id ||
            e?.sharedRole === id ||
            e?.createdBy === id ||
            (permissions && permissions?.includes(FUNC_PERMISSION.SCHEDULE)) ? (
              <>
                {(e?.status !== 3 || e?.isDeleted === false) && (
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
                    <a
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => onDelete(e?.id)}
                    >
                      <i className="fas fa-trash-alt red"></i> Xóa
                    </a>
                  </>
                )}
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
                    <a
                      role="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => onRemove(e?.id)}
                    >
                      <i className="fas fa-times-circle red"></i> Xóa vĩnh viễn
                    </a>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      );
    }
  };

  const getCurrentWeekDates = () => {
    const startOfWeek = moment().startOf("isoWeek"); // Lấy Thứ 2 đầu tuần
    return Array.from({ length: 7 }, (_, index) =>
      startOfWeek.clone().add(index, "days")
    );
  };
  useEffect(() => {
    if (!Helper.isNullOrUndefined(user)) {
      getScheduleByUser(
        user?.id,
        "",
        null,
        null,
        status,
        start,
        isDeleted,
        page,
        size
      );
    }
  }, [user]);

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(user)) {
  //     getScheduleByUser(
  //       user?.id,
  //       search,
  //       startTime,
  //       endTime,
  //       status,
  //       start,
  //       isDeleted,
  //       page,
  //       size
  //     );
  //   }
  // }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);
  useEffect(() => {
    const currentWeekDates = getCurrentWeekDates();
    const dateFrom = currentWeekDates[0].format("YYYY-MM-DD");
    const dateTo = currentWeekDates[6].format("YYYY-MM-DD");

    getScheduleByUser(
      user?.id,
      "",
      dateFrom,
      dateTo,
      status,
      start,
      isDeleted,
      page,
      size
    );
  }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);
  useEffect(() => {
    const currentWeekDates = getCurrentWeekDates();
    const dateFrom = currentWeekDates[0].format("YYYY-MM-DD");
    const dateTo = currentWeekDates[6].format("YYYY-MM-DD");

    getAllScheduleByUser(
      user?.id,
      "",
      dateFrom,
      dateTo,
      status,
      start,
      isDeleted,
      page,
      size
    );
  }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);
  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(user)) {
  //     getAllScheduleByUser(
  //       user?.id,
  //       search,
  //       startTime,
  //       endTime,
  //       status,
  //       start,
  //       isDeleted,
  //       page,
  //       size
  //     );
  //   }
  // }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);

  useEffect(() => {
    if (status === 3 && start === false && isDeleted === false) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(null);
    }
  }, [status, start, isDeleted]);

  const onHandleCancel = () => {
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
      status,
      start,
      isDeleted,
      page,
      size
    );
    getAllScheduleByUser(
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
    <div className="content-wrapper margin-top-10">
      {/* Content Header (Page header) */}
      <div id="content-header" className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Lịch họp</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href={HREF.TrangChu}>
                    <i className="fas fa-home" />
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href={HREF.LichHop}>Lịch công tác</a>
                </li>
                <li className="breadcrumb-item active">Lịch họp</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info">
            <div className="card-body">
              {openEdit === false && openAdd === false && (
                <>
                  <ul
                    className="nav nav-tabs mb-1"
                    id="custom-content-below-tab"
                    role="tablist"
                  >
                    <li className="nav-item nav-item-schedule">
                      <a
                        className="nav-link nav-link-schedule active"
                        id="custom-content-below-meeting-tab"
                        data-toggle="pill"
                        href="#custom-content-below-schedule"
                        role="tab"
                        aria-controls="custom-content-below-schedule"
                        aria-selected="false"
                        onClick={() => {
                          setStatus(3);
                          setStart(false);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "normal",
                        }}
                      >
                        <i className="far fa-calendar-alt"></i> LỊCH CÔNG TÁC
                      </a>
                    </li>
                    <li className="nav-item nav-item-schedule">
                      <a
                        className="nav-link nav-link-schedule"
                        id="custom-content-below-meeting-tab"
                        data-toggle="pill"
                        href="#custom-content-below-my-schedule"
                        role="tab"
                        aria-controls="custom-content-below-my-schedule"
                        aria-selected="false"
                        onClick={() => {
                          setStatus(3);
                          setStart(false);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "normal",
                        }}
                      >
                        <i className="far fa-user"></i> LỊCH CỦA TÔI
                      </a>
                    </li>
                  </ul>
                  <div
                    className="tab-content"
                    id="custom-content-below-tabContent"
                  >
                    <div
                      id="custom-content-below-schedule"
                      className="tab-pane active"
                    >
                      <table className="table table-bordered text-center">
                        <thead>
                          <tr>
                            <th scope="col" className="align-middle">
                              THỨ / NGÀY
                            </th>
                            <th scope="col" className="align-middle">
                              LÃNH ĐẠO
                            </th>
                            <th scope="col" className="align-middle">
                              THỜI GIAN
                            </th>
                            <th
                              scope="col"
                              // colSpan={2}
                              className="align-middle"
                            >
                              NỘI DUNG CÔNG VIỆC
                            </th>
                            <th scope="col" className="align-middle">
                              ĐỊA ĐIỂM
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayOfWeek(timeWeek).map((list, index) => {
                            let a = 0;
                            if (scheduleCal) {
                              scheduleCal.map((item, i) => {
                                if (
                                  moment(item?.startTime).format(
                                    "YYYY-MM-DD"
                                  ) === moment(list).format("YYYY-MM-DD")
                                ) {
                                  // rowSpan.push(i);
                                  a++;
                                }
                              });
                            }
                            return (
                              <>
                                <tr
                                  key={index}
                                  className={
                                    formatDayOfWeek(list) ===
                                      formatDayOfWeek(timeWeek) &&
                                    moment(list).format("DD-MM-YYYY") ===
                                      moment(timeWeek).format("DD-MM-YYYY")
                                      ? "bg-2165AE"
                                      : ""
                                  }
                                  style={{
                                    background:
                                      formatDayOfWeek(list) ===
                                        formatDayOfWeek(timeWeek) &&
                                      moment(list).format("DD-MM-YYYY") ===
                                        moment(new Date()).format("DD-MM-YYYY")
                                        ? Theme.theme().css.background.color
                                        : "",
                                    color:
                                      formatDayOfWeek(list) ===
                                        formatDayOfWeek(timeWeek) &&
                                      moment(list).format("DD-MM-YYYY") ===
                                        moment(new Date()).format("DD-MM-YYYY")
                                        ? Theme.theme().css.color.color
                                        : "",
                                  }}
                                >
                                  <td
                                    rowSpan={a > 0 && a + 1}
                                    style={{ width: "10%" }}
                                  >
                                    <div className="row">
                                      <div className="col-12 text-center">
                                        {formatDayOfWeek(list)}
                                      </div>
                                      <div className="col-12">
                                        {moment(list).format("DD-MM-YYYY")}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {scheduleCal ? (
                                  <>
                                    {scheduleCal.map((item, i, arr) => {
                                      // rowSpan.push(i)
                                      return (
                                        <>
                                          {moment(item?.startTime).format(
                                            "YYYY-MM-DD"
                                          ) ===
                                            moment(list).format(
                                              "YYYY-MM-DD"
                                            ) && (
                                            <tr key={i}>
                                              <td
                                                style={{
                                                  width: "8%",
                                                }}
                                              >
                                                {item?.userChairMan?.ten_day_du}
                                              </td>
                                              <td
                                                style={{
                                                  width: "8%",
                                                }}
                                              >
                                                {moment(item?.startTime).format(
                                                  "HH"
                                                ) +
                                                  "h" +
                                                  moment(
                                                    item?.startTime
                                                  ).format("mm")}
                                              </td>
                                              <td
                                                style={{
                                                  textAlign: "left",
                                                }}
                                              >
                                                <strong>{item?.title}</strong>
                                                <br />
                                                <div
                                                  dangerouslySetInnerHTML={{
                                                    __html: item?.content,
                                                  }}
                                                ></div>
                                              </td>
                                              <td
                                                style={{
                                                  justifyContent: "center",
                                                  alignContent: "center",
                                                  alignItems: "center",
                                                }}
                                              >
                                                {item?.place}
                                                <br />
                                                <i class="fas fa-video info"></i>{" "}
                                                <a href={item?.roomName}>
                                                  {" "}
                                                  Trực tuyến
                                                </a>
                                              </td>
                                            </tr>
                                          )}
                                        </>
                                      );
                                    })}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                      <button
                        type="button"
                        class="btn btn-secondary"
                        onClick={() =>
                          setTimeWeek(
                            new Date(timeWeek.setDate(timeWeek.getDate() - 7))
                          )
                        }
                      >
                        <i className="fas fa-arrow-left"></i>
                      </button>{" "}
                      <button
                        type="button"
                        class="btn btn-secondary"
                        onClick={() => setTimeWeek(new Date())}
                      >
                        {" "}
                        Hiện tại{" "}
                      </button>{" "}
                      <button
                        type="button"
                        class="btn btn-secondary"
                        onClick={() =>
                          setTimeWeek(
                            new Date(timeWeek.setDate(timeWeek.getDate() + 7))
                          )
                        }
                      >
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                    <div
                      id="custom-content-below-my-schedule"
                      className="tab-pane"
                    >
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        className="custom-table-bordered"
                        columns={[
                          {
                            title: "Thứ/Ngày",
                            dataIndex: "time",
                            align: "center",
                            width: "10%",
                            render: (_, record) => (
                              <div className="">
                                {moment(record?.startTime).format("DD/MM/YYYY")}
                              </div>
                            ),
                          },
                          {
                            title: "Lãnh đạo",
                            align: "center",
                            dataIndex: "content",
                            render: (_, record) => (
                              <>{record?.userChairMan?.ten_day_du}</>
                            ),
                          },
                          {
                            title: "Thời gian",
                            dataIndex: "time",
                            align: "center",
                            width: "7%",
                            render: (_, record) => (
                              <div className="">
                                {moment(record?.startTime).format("HH[h]mm")}
                              </div>
                            ),
                          },
                          {
                            title: "Nội dung công việc",
                            dataIndex: "content",
                            align: "center",
                            width: "40%",
                            render: (_, record) => (
                              <div className="align-left">
                                <strong>{record?.title}</strong>
                                <br />
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: record?.content,
                                  }}
                                ></div>
                              </div>
                            ),
                          },
                          {
                            title: "Địa điểm",
                            align: "center",
                            dataIndex: "content",
                            render: (_, record) => (
                              <div className="align-left">
                                {record?.place}
                                <br />
                                <i class="fas fa-video info"></i>{" "}
                                <a href={record?.roomName}> Trực tuyến</a>
                              </div>
                            ),
                          },
                        ]}
                        rowKey={"date"}
                        dataSource={allScheduleCal}
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
                  <h5>Thêm mới</h5>
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
