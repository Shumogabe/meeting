import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Modal, Pagination, Row, Table } from "antd";
import axios from "axios";
import moment from "moment";
import Api from "../../../api";
import {
  SwalAlertAllConfiguration,
  SwalAlertTimeRedirect,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import { HandleTabsUpdate } from "../../LapLich/ContentWrapper/modal";
import { PlusOutlined } from "@ant-design/icons";
import { Theme } from "../../../theme";
import { HandleTabs } from "../../../components/Modal";
import { HandleTabsDetail } from "./detail/detail";
const { RangePicker } = DatePicker;
let timerInterval;

export default function ContentWrapper({ title, permissions, user, setUser }) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [meetingData, setMeetingData] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [edit, setEdit] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
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
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [status, setStatus] = useState(2);
  const [start, setStart] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

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
        .get_schedule_byTypeId({
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
              redirect: HREF.SuKien,
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
            url: "sukien/" + id,
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
              redirect: HREF.SuKien,
              icon: "success",
            });
          } else
            SwalAlertTimeRedirect({
              title: "Thông báo! ",
              text: response.message,
              timer: 0,
              redirect: HREF.SuKien,
              icon: "warning",
            });
        });
    }
  };

  const getContentBySchedule = (id) => {
    new Api()
      .get_content_byScheduleId({ id: id, pageSize: 999999, pageNumber: 1 })
      .then((res) => {
        if (res?.data) {
          setContentCall(res?.data);
        }
      });
  };

  const getMeetingMember = (id) => {
    return axios
      .all([
        new Api().get_schedule_byInside({
          pageSize: PAGE_SIZE,
          pageNumber: PAGE_CURRENT,
          id: id,
        }),
        new Api().get_schedule_byOutside({
          pageSize: PAGE_SIZE,
          pageNumber: PAGE_CURRENT,
          id: id,
        }),
      ])
      .then(
        axios.spread((resp1, resp2) => {
          if (resp1?.data) {
            setMemberCall(resp1?.data);
          }
          if (resp2?.data) {
            setMemberEmailCall(resp2?.data);
          }
        })
      );
  };

  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "sukien/" + id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((response) => {
        if (response?.data) {
          setDocumentCall(response?.data);
        }
      });
  };

  const getMeetingVote = (id) => {
    // new Api()
    //   .get_votes_byScheduleId({
    //     id: id,
    //   })
    //   .then((response) => {
    //     if (response.data != null) {
    //       // this.setState({
    //       //   vote_call: response.data,
    //       //   voteid: response.data[0]['id'],
    //       // });
    //     }
    //     new Api()
    //       .get_voted_byVoteId({
    //         id: this.state.voteid,
    //       })
    //       .then((response) => {
    //         if (response.data != null) {
    //           // this.setState({
    //           //   voted: response.data,
    //           // });
    //         }
    //         // this.state.vote_data = {
    //         //   votes: this.state.vote_call,
    //         //   voted: this.state.voted,
    //         // };
    //       });
    //   });
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
            setOpenView(false);
            setOpenAdd(false);
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

  const onView = (id) => {
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
            setOpenView(true);
            setOpenEdit(false);
            setOpenAdd(false);
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
                    redirect: HREF.SuKien,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response.message,
                    timer: 0,
                    redirect: HREF.SuKien,
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
                    redirect: HREF.SuKien,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response.message,
                    timer: 0,
                    redirect: HREF.SuKien,
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
                    redirect: HREF.SuKien,
                    icon: "success",
                  });
                } else
                  SwalAlertAllConfiguration({
                    title: "Thông báo! ",
                    text: response.message,
                    timer: 0,
                    redirect: HREF.SuKien,
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
                  permissions="button"
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
                        permissions="button"
                        className={`ml-1 mr-1 ${e?.start ? "red" : ""}`}
                        onClick={() => {
                          if (
                            (e?.chairMan === id || e?.sharedRole === id) &&
                            e?.start === true
                          ) {
                            userManager.getUser().then((res) => {
                              onChangeStart(e?.id, false, res);
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
                    e?.isDeleted === false &&
                    e?.status !== 1
                  ) {
                    return (
                      <a
                        href
                        permissions="button"
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
                        title={`Bắt đầu ${e?.status === 3 ? " lại" : ""}`}
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
                  permissions="button"
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
                permissions="button"
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
            <a
              href
              permissions="button"
              className="ml-1 mr-1"
              // className="dropdown-item"
              onClick={() => {
                onView(e.id);
                // setId(e.id);
              }}
            >
              <i className="fas fa-eye blue"></i> Chi tiết
            </a>
            {e?.chairMan === id ||
            e?.sharedRole === id ||
            e?.createdBy === id ||
            (permissions && permissions?.includes(FUNC_PERMISSION.SCHEDULE)) ? (
              <>
                {(e?.status !== 3 || e?.isDeleted === false) && (
                  <a
                    href
                    permissions="button"
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
                      permissions="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      onClick={() => onSetting(e.id)}
                    >
                      <i className="fas fa-edit orange"></i> Sửa
                    </a> */}
                    <a
                      permissions="button"
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
                      permissions="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => onRestore(e?.id)}
                    >
                      <i className="fas fa-trash-restore"></i> Khôi phục
                    </a>
                    <a
                      permissions="button"
                      className="ml-1 mr-1"
                      // className="dropdown-item"
                      href
                      onClick={() => onRemove(e?.id)}
                    >
                      <i className="fas fa-eraser red"></i> Xóa vĩnh viễn
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
    // CheckUser().then((user) => {
    // });
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
    setOpenAdd(false);
    setOpenView(false);
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
  };

  useEffect(() => {
    if (openEdit === false) {
      onHandleCancel();
    }
  }, [openEdit]);

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
                  <a href={HREF.SuKien}>{title}</a>
                </li>
                <li className="breadcrumb-item active">Sự kiện</li>
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
              {openView === false &&
                openEdit === false &&
                openAdd === false && (
                  <>
                    <Row>
                      <Col span={12}>
                        <ul
                          className="nav nav-tabs mb-1"
                          id="custom-content-below-tab"
                          permissions="tablist"
                        >
                          <li className="nav-item">
                            <a
                              className="nav-link active"
                              id="custom-content-below-meeting-tab"
                              data-toggle="pill"
                              href="#custom-content-below-meeting"
                              permissions="tab"
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
                              ĐANG TRỰC TUYẾN
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              id="custom-content-below-pending-tab"
                              data-toggle="pill"
                              href="#custom-content-below-pending"
                              permissions="tab"
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
                              ĐANG CHỜ XÁC NHẬN
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              id="custom-content-below-pending-tab"
                              data-toggle="pill"
                              href="#custom-content-below-pending"
                              permissions="tab"
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
                              ĐÃ XÁC NHẬN
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              id="custom-content-below-finished-tab"
                              data-toggle="pill"
                              href="#custom-content-below-finished"
                              permissions="tab"
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
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              id="custom-content-below-finished-tab"
                              data-toggle="pill"
                              href="#custom-content-below-finished"
                              permissions="tab"
                              aria-controls="custom-content-below-finished"
                              aria-selected="false"
                              onClick={() => {
                                setStatus(3);
                                setStart(false);
                                setIsDeleted(true);
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
                          <li
                            className="nav-item"
                            style={{ textAlign: "right" }}
                          >
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
                                  !permissions?.includes(
                                    FUNC_PERMISSION.SCHEDULE
                                  )
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
                                setOpenAdd(true);
                                setOpenEdit(false);
                                setOpenView(false);
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
                        rowSelection={
                          selectedRowKeys === null
                            ? false
                            : {
                                selectedRowKeys,
                                onChange: (newSelectedRowKeys) => {
                                  console.log(
                                    "selectedRowKeys changed: ",
                                    newSelectedRowKeys
                                  );
                                  setSelectedRowKeys(newSelectedRowKeys);
                                },
                              }
                        }
                        columns={[
                          {
                            title: "Thời gian",
                            dataIndex: "time",
                            align: "center",
                            width: "10%",
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
                                {record.roomName}{" "}
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
                                  {record.title}
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
                                {renderSwitchUser(
                                  user && user?.id,
                                  record,
                                  true
                                )}
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
              {openEdit === true && openAdd === false && openView === false && (
                <>
                  <h5>Sửa: {edit?.title}</h5>
                  <HandleTabsUpdate
                    contentCall={contentCall}
                    memberCall={memberCall}
                    memberEmailCall={memberEmailCall}
                    documentCall={documentCall}
                    scheduleId={id}
                    onHandleCancel={onHandleCancel}
                    user={user}
                    setUser={setUser}
                    edit={edit}
                  />
                </>
              )}
              {openAdd === true && openEdit === false && openView === false && (
                <>
                  <h5>Thêm mới</h5>
                  <HandleTabs
                    onCloseModal={() => {
                      setOpenAdd(false);
                      onHandleCancel();
                    }}
                  />
                </>
              )}
              {openView === true && openEdit === false && openAdd === false && (
                <>
                  <h5>Xem: {edit?.title}</h5>
                  <HandleTabsDetail
                    contentCall={contentCall}
                    memberCall={memberCall}
                    memberEmailCall={memberEmailCall}
                    documentCall={documentCall}
                    scheduleId={id}
                    onHandleCancel={onHandleCancel}
                    user={user}
                    setUser={setUser}
                    edit={edit}
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
        title="Sửa"
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
          scheduleId={id}
          onHandleCancel={onHandleCancel}
          user={user}
          setUser={setUser}
        />
      </Modal> */}
    </div>
  );
}
