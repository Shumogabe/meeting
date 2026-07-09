import React from "react";
import { Button, Pagination, Table } from "antd";
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
  pageInside,
  pageOutside,
  setPageInside,
  setPageOutside,
}) {
  return (
    <>
      <div id="accordion">
        <div className="row">
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header" id="headingTwo">
                <h5 className="mb-0">Đại biểu tham gia</h5>
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
                        placeholder="Nhập họ tên hoặc tài khoản để tìm kiếm"
                        isClearable={true}
                        isSearchable={true}
                        options={memberOptions}
                        defaultValue={
                          !Helper.isNullOrUndefined(member) ? member : null
                        }
                        value={
                          !Helper.isNullOrUndefined(member) ? member : null
                        }
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
                          return "Không tìm thấy người dùng";
                        }}
                      />
                    </div>
                    <div className="row mb-2"></div>
                    <Button
                      className="btn-default"
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        getMeetingMember(scheduleId);
                      }}
                    >
                      <i class="fas fa-sync-alt info"></i> Tải lại
                    </Button>
                    <Button
                      type="default"
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
                              setMember(null);
                              setMemberOptions([]);
                            }
                            SwalAlertAllConfiguration({
                              title: "Thêm thành công",
                              icon: "success",
                              timer: 1500,
                            });
                          });
                      }}
                    >
                      <i className="fas fa-plus info"></i> Thêm
                    </Button>
                    <Button
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberDeleteList))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Bạn chưa chọn đại biểu",
                            icon: "warning",
                          });
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn xác nhận không?",
                          text: "Khi bạn nhấn 'Đồng ý' sẽ xác nhận!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
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
                              if (index + 1 === memberDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Xác nhận thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            }
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i className="fas fa-check info"></i> Xác nhận
                    </Button>
                    <Button
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberDeleteList))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Bạn chưa chọn đại biểu",
                            icon: "warning",
                          });
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn hủy xác nhận không?",
                          text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy xác nhận!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
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
                              if (index + 1 === memberDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Hủy xác nhận thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            }
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i className="fas fa-ban danger"></i> Hủy xác nhận
                    </Button>
                    <Button
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberDeleteList))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Bạn chưa chọn đại biểu",
                            icon: "warning",
                          });
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn xóa không?",
                          text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
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
                              if (index + 1 === memberDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Xóa thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            }
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i className="fas fa-trash-alt danger"></i> Xóa
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
                          sorter: (a, b) =>
                            a.fullName.length - b.fullName.length,
                        },
                        {
                          title: "Đơn vị",
                          dataIndex: "thong_tin_don_vi",
                          // sorter: (a, b) =>
                          //   a.thong_tin_don_vi.ten.length -
                          //   b.thong_tin_don_vi.ten.length,
                          render: (_, record) =>
                            record?.user?.thong_tin_don_vi?.ten,
                        },
                        {
                          title: "Tài khoản",
                          dataIndex: "userName",
                          sorter: (a, b) =>
                            a.userName.length - b.userName.length,
                        },
                        {
                          title: "Email",
                          dataIndex: "email",
                          sorter: (a, b) => a.email.length - b.email.length,
                        },
                        {
                          title: "Tình trạng",
                          dataIndex: "activated",
                          filters: [
                            {
                              text: "Đã xác nhận",
                              value: true,
                            },
                            {
                              text: "Chờ xác nhận",
                              value: false,
                            },
                          ],
                          onFilter: (value, record) =>
                            record.activated === value,
                          render: (e, record) => {
                            return <>{e ? "Đã xác nhận" : "Chờ xác nhận"}</>;
                          },
                        },
                      ]}
                      dataSource={memberList?.length > 0 && memberList}
                      // pagination={false}
                    />
                    {/* <Pagination
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} trên ${total} đối tượng`
                      }
                      current={pageInside.pageCurrent}
                      onChange={(page, size) => {
                        setPageInside((prevState) => ({
                          ...prevState,
                          pageCurrent: page,
                          pageSize: size,
                        }));
                      }}
                      total={pageInside.total}
                    /> */}
                  </>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header" id="headingTwo">
                <h5 className="mb-0">Khách mời</h5>
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
                        placeholder="Nhập email"
                        className="form-control"
                        name="member"
                        onChange={(e) => {
                          setMemberEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div className="row mb-2"></div>
                    <Button
                      className="btn-default"
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        getMeetingMember(scheduleId);
                      }}
                    >
                      <i className="fas fa-sync-alt info"></i> Tải lại
                    </Button>
                    <Button
                      className="btn-default"
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberEmail))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Chưa nhập email",
                            icon: "warning",
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
                            title: "Thông báo",
                            text: "Email chưa đúng định dạng",
                            icon: "warning",
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
                              setMemberEmail("");
                            }
                            SwalAlertAllConfiguration({
                              title: "Thêm thành công",
                              icon: "success",
                              timer: 1500,
                            });
                          });
                      }}
                    >
                      <i className="fas fa-plus info"></i> Thêm
                    </Button>
                    <Button
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberEmailDeleteList))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Bạn chưa chọn khách mời",
                            icon: "warning",
                          });
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn xác nhận không?",
                          text: "Khi bạn nhấn 'Đồng ý' sẽ xác nhận!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
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
                                    setMemberEmailList([]);
                                    setMemberEmailDeleteList([]);
                                  }
                                });
                              if (index + 1 === memberEmailDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Xác nhận thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            }
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i className="fas fa-check info"></i> Xác nhận
                    </Button>
                    <Button
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberEmailDeleteList))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Bạn chưa chọn khách mời",
                            icon: "warning",
                          });
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn hủy xác nhận không?",
                          text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy xác nhận!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
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
                                    setMemberEmailList([]);
                                    setMemberEmailDeleteList([]);
                                  }
                                });
                              if (index + 1 === memberEmailDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Hủy xác nhận thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            }
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i className="fas fa-ban danger"></i> Hủy xác nhận
                    </Button>
                    <Button
                      style={{
                        marginRight: 16,
                      }}
                      onClick={() => {
                        if (Helper.isNullOrUndefined(memberEmailDeleteList))
                          return SwalAlertAllConfiguration({
                            title: "Thông báo",
                            text: "Bạn chưa chọn khách mời",
                            icon: "warning",
                          });
                        SwalAlertAllConfiguration({
                          title: "Bạn có chắc muốn xóa không?",
                          text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Đồng ý",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          dangerMode: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
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
                              if (index + 1 === memberEmailDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Xóa thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            }
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i className="fas fa-trash-alt danger"></i> Xóa
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
                          title: "Tình trạng",
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
                          onFilter: (value, record) =>
                            record.activated === value,
                          render: (e, record) => {
                            return <>{e ? "Đã xác nhận" : "Chờ xác nhận"}</>;
                          },
                        },
                      ]}
                      dataSource={
                        memberEmailList?.length > 0 && memberEmailList
                      }
                      // pagination={false}
                    />
                    {/* <Pagination
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} trên ${total} đối tượng`
                      }
                      current={pageOutside.pageCurrent}
                      onChange={(page, size) => {
                        setPageOutside((prevState) => ({
                          ...prevState,
                          pageCurrent: page,
                          pageSize: size,
                        }));
                      }}
                      total={pageOutside.total}
                    /> */}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
