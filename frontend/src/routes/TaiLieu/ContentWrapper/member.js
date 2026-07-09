import React from "react";
import { Button, Table } from "antd";
import ReactSelect from "react-select";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";

export default function Member({
  memberOptions,
  member,
  setMember,
  GetList_User,
  setMemberList,
  memberList,
  user,
  setMemberOptions,
  memberDeleteList,
  setMemberDeleteList,
  memberEmail,
  setMemberEmail,
  setMemberEmailList,
  memberEmailList,
  memberEmailDeleteList,
  setMemberEmailDeleteList,
  roomName,
  pass,
  getMeetingMember,
  scheduleId,
  startTime,
  errorMember,
  setErrorMember,
}) {
  return (
    <>
      <div id="accordion">
        <div className="card ">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <div
                className="btn btn-link collapsed card-title font-weight-bold"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                Thêm đại biểu tham gia
              </div>
            </h5>
          </div>
          <div
            id="collapseOne"
            className=""
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div className="card-body">
              <>
                <div className="form-control p-0">
                  <ReactSelect
                    name="member"
                    placeholder="- Nhập tên tài khoản hoặc họ tên để tìm kiếm đại biểu -"
                    isClearable={true}
                    isSearchable={true}
                    options={memberOptions}
                    defaultValue={
                      !Helper.isNullOrUndefined(member) ? member : null
                    }
                    value={!Helper.isNullOrUndefined(member) ? member : null}
                    getOptionLabel={(option) => (
                      <>
                        {option.ten_day_du + " - "}
                        <b>{option.ten_dangnhap}</b>
                      </>
                    )}
                    getOptionValue={({ id }) => id}
                    onChange={(member) => {
                      setMember(member);
                    }}
                    onInputChange={(inputText, meta) => {
                      if (
                        meta.action !== "input-blur" &&
                        meta.action !== "menu-close"
                      ) {
                        GetList_User(inputText, 4);
                      }
                    }}
                    filterOption={null}
                    noOptionsMessage={(obj) => {
                      if (obj?.inputValue.trim().length === 0) {
                        return null;
                      }
                      return "Không tìm thấy tên";
                    }}
                  />
                </div>
                <div className="row mb-2"></div>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    getMeetingMember(scheduleId);
                  }}
                >
                  Tải lại danh sách
                </Button>
                <Button
                  type="primary"
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(member))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    // setMemberList([
                    //   {
                    //     key: moment().unix(), //contentList?.length + 1,
                    //     scheduleId: null,
                    //     userId: member?.id,
                    //     fullName: member?.fullName,
                    //     userName: member?.userName,
                    //     email: member?.email,
                    //     activated: true,
                    //     createdDate: new Date(),
                    //     createdBy: user?.id,
                    //   },
                    //   ...memberList,
                    // ]);
                    // setMember(null);
                    // setMemberOptions([]);
                    new Api()
                      .create_meeting_member({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        data: {
                          scheduleId: scheduleId,
                          userId: member?.id,
                          fullName: member?.ten_day_du,
                          userName: member?.ten_dangnhap,
                          email: member?.email,
                          activated: true,
                          createdDate: new Date(),
                          createdBy: user?.id,
                        },
                      })
                      .then((e) => {
                        if (e) {
                          getMeetingMember(scheduleId);
                          if (!Helper.isNullOrUndefined(member?.email)) {
                            setMember(null);
                            setMemberOptions([]);
                          }
                        }
                      });
                  }}
                >
                  Thêm
                </Button>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberDeleteList))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    for (
                      let index = 0;
                      index < memberDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .remove_meeting_member({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: memberDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            getMeetingMember(scheduleId);
                            let list = memberList;
                            setMemberList([]);
                            setMemberDeleteList([]);
                          }
                        });
                    }
                  }}
                  className="btn-danger"
                >
                  Xóa
                </Button>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberDeleteList))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    for (
                      let index = 0;
                      index < memberDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .activated_meeting_member({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: memberDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            getMeetingMember(scheduleId);
                            let list = memberList;
                            setMemberList([]);
                            setMemberDeleteList([]);
                          }
                        });
                    }
                  }}
                  className="btn-info"
                >
                  Xác nhận
                </Button>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberDeleteList))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    for (
                      let index = 0;
                      index < memberDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .deactivated_meeting_member({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: memberDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            getMeetingMember(scheduleId);
                            let list = memberList;
                            setMemberList([]);
                            setMemberDeleteList([]);
                          }
                        });
                    }
                  }}
                  className="btn-warning"
                >
                  Hủy xác nhận
                </Button>
                <div className="row mb-2"></div>
                {errorMember && (
                  <b>
                    <i className="text-danger">{errorMember}</i>
                  </b>
                )}
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  rowSelection={{
                    selectedRowKeys: memberDeleteList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setMemberDeleteList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Họ tên",
                      dataIndex: "fullName",
                      sorter: (a, b) => a.fullName.length - b.fullName.length,
                    },
                    {
                      title: "Tài khoản",
                      dataIndex: "userName",
                      sorter: (a, b) => a.userName.length - b.userName.length,
                    },
                    {
                      title: "Email",
                      dataIndex: "email",
                      sorter: (a, b) => a.email.length - b.email.length,
                    },
                    {
                      title: "Tình trạng xác nhận",
                      dataIndex: "activated",
                      filters: [
                        {
                          text: "Đã xác nhận",
                          value: true,
                        },
                        {
                          text: "Chưa xác nhận",
                          value: false,
                        },
                      ],
                      onFilter: (value, record) => record.activated === value,
                      render: (e, record) => {
                        return <>{e ? "Đã xác nhận" : "Chưa xác nhận"}</>;
                      },
                    },
                  ]}
                  dataSource={memberList?.length > 0 && memberList}
                />
              </>
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <div
                className="btn btn-link collapsed card-title font-weight-bold"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Thêm khách mời
              </div>
            </h5>
          </div>
          <div
            id="collapseTwo"
            className=""
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div className="card-body">
              <>
                <div className="form-control p-0">
                  <input
                    value={memberEmail}
                    placeholder="Nhập email thành phần"
                    className="form-control"
                    name="member"
                    onChange={(e) => {
                      setMemberEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="row mb-2"></div>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    getMeetingMember(scheduleId);
                  }}
                >
                  Tải lại danh sách
                </Button>
                <Button
                  type="primary"
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberEmail))
                      return SwalAlertAllConfiguration({
                        icon: "warning",
                        title: "Chưa nhập email!",
                      });
                    if (
                      !Helper.isNullOrUndefined(memberEmail) &&
                      Helper.isNullOrUndefined(
                        memberEmail.match(
                          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        )
                      )
                    )
                      return SwalAlertAllConfiguration({
                        icon: "warning",
                        title: "Email không đúng định dạng!",
                      });
                    // if (
                    //   memberEmail ===
                    //   chairManOptions.email
                    // ) {
                    //   return SwalAlertAllConfiguration({
                    //     title: "Thông báo! ",
                    //     text: "Đây là chủ trì phòng họp",
                    //     icon: "warning",
                    //   });
                    // }
                    // setMemberEmailList([
                    //   {
                    //     key: moment().unix(), //contentList?.length + 1,
                    //     scheduleId: null,
                    //     userId: "",
                    //     fullName: "",
                    //     userName: "",
                    //     email: memberEmail,
                    //     activated: true,
                    //     createdDate: new Date(),
                    //     createdBy: user?.id,
                    //   },
                    //   ...memberEmailList,
                    // ]);
                    // setMemberEmail("");
                    new Api()
                      .create_meeting_member({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        data: {
                          scheduleId: scheduleId,
                          userId: 0,
                          fullName: "",
                          userName: "",
                          email: memberEmail,
                          activated: true,
                          createdDate: new Date(),
                          createdBy: user?.id,
                        },
                      })
                      .then((e) => {
                        if (e) {
                          getMeetingMember(scheduleId);
                          if (!Helper.isNullOrUndefined(memberEmail)) {
                            setMemberEmail("");
                          }
                        }
                      });
                  }}
                >
                  Thêm
                </Button>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberEmailDeleteList))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    for (
                      let index = 0;
                      index < memberEmailDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .remove_meeting_member({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: memberEmailDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            getMeetingMember(scheduleId);
                            let list = memberEmailList;
                            setMemberEmailList([]);
                            setMemberEmailDeleteList([]);
                          }
                        });
                    }
                  }}
                  className="btn-danger"
                >
                  Xóa
                </Button>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberEmailDeleteList))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    for (
                      let index = 0;
                      index < memberEmailDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .activated_meeting_member({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: memberEmailDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            getMeetingMember(scheduleId);
                            let list = memberList;
                            setMemberList([]);
                            setMemberEmailDeleteList([]);
                          }
                        });
                    }
                  }}
                  className="btn-info"
                >
                  Xác nhận
                </Button>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    if (Helper.isNullOrUndefined(memberEmailDeleteList))
                      return SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn đại biểu",
                        icon: "warning",
                      });
                    for (
                      let index = 0;
                      index < memberEmailDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .deactivated_meeting_member({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: memberEmailDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            getMeetingMember(scheduleId);
                            let list = memberList;
                            setMemberList([]);
                            setMemberEmailDeleteList([]);
                          }
                        });
                    }
                  }}
                  className="btn-warning"
                >
                  Hủy xác nhận
                </Button>
                <div className="row mb-2"></div>
                {errorMember && (
                  <b>
                    <i className="text-danger">{errorMember}</i>
                  </b>
                )}
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  rowSelection={{
                    selectedRowKeys: memberEmailDeleteList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setMemberEmailDeleteList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Email",
                      dataIndex: "email",
                      sorter: (a, b) => a.email.length - b.email.length,
                    },
                    {
                      title: "Tình trạng xác nhận",
                      dataIndex: "activated",
                      filters: [
                        {
                          text: "Đã xác nhận",
                          value: true,
                        },
                        {
                          text: "Chưa xác nhận",
                          value: false,
                        },
                      ],
                      onFilter: (value, record) => record.activated === value,
                      render: (e, record) => {
                        return <>{e ? "Đã xác nhận" : "Chưa xác nhận"}</>;
                      },
                    },
                  ]}
                  dataSource={memberEmailList?.length > 0 && memberEmailList}
                />
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
