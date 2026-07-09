import React, { useRef, useState } from "react";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Space, Table } from "antd";
import axios from "axios";
import Highlighter from "react-highlight-words";
import ReactSelect from "react-select";
import Api from "../../../../../../api";
import { SwalAlertAllConfiguration } from "../../../../../../components/Swal";
import {
  PAGE_CURRENT,
  PAGE_SIZE,
  SESSION_STORAGE,
} from "../../../../../../config";
import Helper from "../../../../../../helper/helper";
let timeoutUser;
let currentValueUser;
export default function ThanhPhan({
  meetingData,
  scheduleSidebar,
  apiRef,
  owner,
  user,
}) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Làm nổi bật
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (dataIndex.includes("?.")) {
        var dataIndexAr = dataIndex.split("?.");
        var dataIndexArr = record[dataIndexAr[0]];

        for (let index = 1; index < dataIndexAr?.length; index++) {
          dataIndexArr = dataIndexArr[dataIndexAr[index]];
        }
        //console.log(
        //  dataIndexArr.toString().toLowerCase().includes(value.toLowerCase())
        //);
        return dataIndexArr
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        //console.log(
        //  record[dataIndex]
        //    .toString()
        //    .toLowerCase()
        //    .includes(value.toLowerCase())
        //);
        return record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text?.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //
  //member
  const [memberList, setMemberList] = useState(
    meetingData?.memberInside?.map((item, index) => ({
      ...item,
      key: item?.id,
      fullName: item?.user?.ten_day_du,
      userName: item?.user?.ten_dangnhap,
    }))
  );
  const [memberDeleteList, setMemberDeleteList] = useState([]);
  const [member, setMember] = useState(null);
  const [memberOptions, setMemberOptions] = useState([]);
  const [memberEmailList, setMemberEmailList] = useState(
    meetingData?.memberOutside?.map((item, index) => ({
      ...item,
      key: item?.id,
      email: item?.email,
    }))
  );
  const [memberEmailDeleteList, setMemberEmailDeleteList] = useState([]);
  const [memberEmail, setMemberEmail] = useState(null);
  const [memberEmailOptions, setMemberEmailOptions] = useState([]);
  const [errorMember, setErrorMember] = useState(false);
  const [pageInside, setPageInside] = useState({
    pageSize: 10,
    pageCurrent: 1,
    total: 0,
  });
  const [pageOutside, setPageOutside] = useState({
    pageSize: 10,
    pageCurrent: 1,
    total: 0,
  });
  //
  const GetList_User = (value, obj) => {
    if (timeoutUser) {
      clearTimeout(timeoutUser);
      timeoutUser = null;
    }
    currentValueUser = value;
    const fake = () => {
      new Api()
        .get_user_bySearch({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            tu_khoa: value,
            page: 1,
            limit: 10,
          },
        })
        .then((res) => {
          if (currentValueUser === value) {
            const dataOption =
              res &&
              res?.records?.map((item) => ({
                ...item,
                value: item?.id,
                label: item?.ten_day_du + " - " + item?.ten_dangnhap,
              }));
            if (obj === 4) setMemberOptions(dataOption);
            if (obj === 5) setMemberEmailOptions(dataOption);
          }
        })
        .catch((err) =>
          SwalAlertAllConfiguration({
            title: "Thông báo!",
            text: err.message,
            icon: "warning",
          })
        );
    };
    if (value === null) {
      if (obj === 4) setMemberOptions([]);
      if (obj === 5) setMemberEmailOptions([]);
    } else {
      timeoutUser = setTimeout(fake, 800);
    }
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
            setMemberList(
              resp1?.data.map((item, index) => ({
                ...item,
                key: item?.id,
                fullName: item?.user?.ten_day_du,
                userName: item?.user?.ten_dangnhap,
              }))
            );
          }
          if (resp2?.data) {
            setMemberEmailList(
              resp2?.data.map((item, index) => ({
                ...item,
                key: item?.id,
                email: item?.email,
              }))
            );
          }
        })
      );
  };
  return (
    <>
      {owner === 1 ? (
        <Row>
          <Col span={window.innerWidth > 1023 ? 16 : 24}>
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
                          {meetingData?.schedule?.status !== 3 && (
                            <>
                              <div className="form-control p-0">
                                <ReactSelect
                                  name="member"
                                  placeholder="Nhập họ tên hoặc tài khoản để tìm kiếm"
                                  isClearable={true}
                                  isSearchable={true}
                                  options={memberOptions}
                                  defaultValue={
                                    !Helper.isNullOrUndefined(member)
                                      ? member
                                      : null
                                  }
                                  value={
                                    !Helper.isNullOrUndefined(member)
                                      ? member
                                      : null
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
                                  getMeetingMember(meetingData?.schedule?.id);
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
                                        scheduleId: meetingData?.schedule?.id,
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
                                        getMeetingMember(
                                          meetingData?.schedule?.id
                                        );
                                        if (
                                          !Helper.isNullOrUndefined(
                                            member?.email
                                          )
                                        ) {
                                          setMember(null);
                                          setMemberOptions([]);
                                        }
                                      }
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
                                  if (
                                    Helper.isNullOrUndefined(memberDeleteList)
                                  )
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
                                              sessionStorage.getItem(
                                                SESSION_STORAGE
                                              )
                                            )?.access_token,
                                            id: memberDeleteList[index],
                                          })
                                          .then((e) => {
                                            if (e) {
                                              getMeetingMember(
                                                meetingData?.schedule?.id
                                              );
                                              let list = memberList;
                                              // setMemberList([]);
                                              setMemberDeleteList([]);
                                            }
                                          });
                                        if (
                                          index + 1 ===
                                          memberDeleteList.length
                                        ) {
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
                                  if (
                                    Helper.isNullOrUndefined(memberDeleteList)
                                  )
                                    return SwalAlertAllConfiguration({
                                      title: "Thông báo",
                                      text: "Bạn chưa chọn đại biểu",
                                      icon: "warning",
                                    });
                                  SwalAlertAllConfiguration({
                                    title:
                                      "Bạn có chắc muốn hủy xác nhận không?",
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
                                              sessionStorage.getItem(
                                                SESSION_STORAGE
                                              )
                                            )?.access_token,
                                            id: memberDeleteList[index],
                                          })
                                          .then((e) => {
                                            if (e) {
                                              getMeetingMember(
                                                meetingData?.schedule?.id
                                              );
                                              let list = memberList;
                                              // setMemberList([]);
                                              setMemberDeleteList([]);
                                            }
                                          });
                                        if (
                                          index + 1 ===
                                          memberDeleteList.length
                                        ) {
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
                                <i className="fas fa-ban danger"></i> Hủy xác
                                nhận
                              </Button>
                              <Button
                                style={{
                                  marginRight: 16,
                                }}
                                onClick={() => {
                                  if (
                                    Helper.isNullOrUndefined(memberDeleteList)
                                  )
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
                                              sessionStorage.getItem(
                                                SESSION_STORAGE
                                              )
                                            )?.access_token,
                                            id: memberDeleteList[index],
                                          })
                                          .then((e) => {
                                            if (e) {
                                              getMeetingMember(
                                                meetingData?.schedule?.id
                                              );
                                              let list = memberList;
                                              setMemberList([]);
                                              setMemberDeleteList([]);
                                            }
                                          });
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
                            </>
                          )}
                          <Table
                            locale={{
                              emptyText: "Chưa có thông tin đại biểu.",
                            }}
                            rowSelection={
                              meetingData?.schedule?.status !== 3 && {
                                selectedRowKeys: memberDeleteList,
                                onChange: (selectedRowKeys, selectedRows) => {
                                  setMemberDeleteList(selectedRowKeys);
                                },
                              }
                            }
                            columns={[
                              {
                                title: "Họ tên",
                                dataIndex: "fullName",
                                ...getColumnSearchProps("fullName"),
                                sorter: (a, b) =>
                                  a.fullName.length - b.fullName.length,
                              },
                              {
                                title: "Đơn vị",
                                dataIndex: "thong_tin_don_vi",
                                ...getColumnSearchProps(
                                  "user?.thong_tin_don_vi?.ten"
                                ),
                                sorter: (a, b) =>
                                  a?.user?.thong_tin_don_vi?.ten?.length -
                                  b?.user?.thong_tin_don_vi?.ten?.length,
                                render: (_, record) =>
                                  record?.user?.thong_tin_don_vi?.ten,
                              },
                              {
                                title: "Tài khoản",
                                dataIndex: "userName",
                                ...getColumnSearchProps("userName"),
                                sorter: (a, b) =>
                                  a.userName.length - b.userName.length,
                              },
                              {
                                title: "Email",
                                dataIndex: "email",
                                ...getColumnSearchProps("email"),
                                sorter: (a, b) =>
                                  a.email.length - b.email.length,
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
                                  return (
                                    <>{e ? "Đã xác nhận" : "Chờ xác nhận"}</>
                                  );
                                },
                              },
                            ]}
                            dataSource={memberList?.length > 0 && memberList}
                          />
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
                          {meetingData?.schedule?.status !== 3 && (
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
                                  getMeetingMember(meetingData?.schedule?.id);
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
                                      icon: "warning",
                                      title: "Bạn nhập email!",
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
                                        scheduleId: meetingData?.schedule?.id,
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
                                        getMeetingMember(
                                          meetingData?.schedule?.id
                                        );
                                        if (
                                          !Helper.isNullOrUndefined(memberEmail)
                                        ) {
                                          setMemberEmail("");
                                        }
                                      }
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
                                  if (
                                    Helper.isNullOrUndefined(
                                      memberEmailDeleteList
                                    )
                                  )
                                    return SwalAlertAllConfiguration({
                                      title: "Thông báo",
                                      text: "Bạn chưa chọn đại biểu",
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
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: memberEmailDeleteList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          getMeetingMember(
                                            meetingData?.schedule?.id
                                          );
                                          let list = memberList;
                                          setMemberList([]);
                                          setMemberEmailDeleteList([]);
                                        }
                                      });
                                    if (
                                      index + 1 ===
                                      memberEmailDeleteList.length
                                    ) {
                                      SwalAlertAllConfiguration({
                                        title: "Xác nhận thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
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
                                  if (
                                    Helper.isNullOrUndefined(
                                      memberEmailDeleteList
                                    )
                                  )
                                    return SwalAlertAllConfiguration({
                                      title: "Thông báo",
                                      text: "Bạn chưa chọn đại biểu",
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
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: memberEmailDeleteList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          getMeetingMember(
                                            meetingData?.schedule?.id
                                          );
                                          let list = memberList;
                                          setMemberList([]);
                                          setMemberEmailDeleteList([]);
                                        }
                                      });
                                    if (
                                      index + 1 ===
                                      memberEmailDeleteList.length
                                    ) {
                                      SwalAlertAllConfiguration({
                                        title: "Hủy xác nhận thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
                                }}
                                className="btn-default"
                              >
                                <i className="fas fa-ban danger"></i> Hủy xác
                                nhận
                              </Button>
                              <Button
                                style={{
                                  marginRight: 16,
                                }}
                                onClick={() => {
                                  if (
                                    Helper.isNullOrUndefined(
                                      memberEmailDeleteList
                                    )
                                  )
                                    return SwalAlertAllConfiguration({
                                      title: "Thông báo",
                                      text: "Bạn chưa chọn đại biểu",
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
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: memberEmailDeleteList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          getMeetingMember(
                                            meetingData?.schedule?.id
                                          );
                                          let list = memberEmailList;
                                          setMemberEmailList([]);
                                          setMemberEmailDeleteList([]);
                                        }
                                      });
                                  }
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
                            </>
                          )}
                          <Table
                            locale={{
                              emptyText: "Không có dữ liệu.",
                            }}
                            rowSelection={
                              meetingData?.schedule?.status !== 3 && {
                                selectedRowKeys: memberEmailDeleteList,
                                onChange: (selectedRowKeys, selectedRows) => {
                                  setMemberEmailDeleteList(selectedRowKeys);
                                },
                              }
                            }
                            columns={[
                              {
                                title: "Email",
                                dataIndex: "email",
                                ...getColumnSearchProps("email"),
                                sorter: (a, b) =>
                                  a.email.length - b.email.length,
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
                                  return (
                                    <>{e ? "Đã xác nhận" : "Chờ xác nhận"}</>
                                  );
                                },
                              },
                            ]}
                            dataSource={
                              memberEmailList?.length > 0 && memberEmailList
                            }
                          />
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={window.innerWidth > 1023 ? 1 : 0}></Col>
          <Col span={window.innerWidth > 1023 ? 7 : 24}>
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
                      Thành phần đang tham gia
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
                      <div className="row mb-2"></div>
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        columns={[
                          {
                            title: "Tên hiển thị",
                            dataIndex: "displayName",
                            ...getColumnSearchProps("displayName"),
                            sorter: (a, b) =>
                              a.fullName.length - b.fullName.length,
                            // render: (_, record) => <>{record?.displayName}</>,
                          },
                          // {
                          //   title: "Tài khoản",
                          //   dataIndex: "userName",
                          //   sorter: (a, b) =>
                          //     a.userName.length - b.userName.length,
                          //   render: (_, record) => <>{record?.user?.userName}</>,
                          // },
                          // {
                          //   title: "Email",
                          //   dataIndex: "email",
                          //   ...getColumnSearchProps("email"),
                          //   sorter: (a, b) =>
                          //     a.fullName.length - b.fullName.length,
                          // },
                        ]}
                        dataSource={
                          scheduleSidebar?.participants?.length > 0 &&
                          scheduleSidebar?.participants
                        }
                      />
                    </>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col span={window.innerWidth > 1023 ? 16 : 24}>
            <Button
              type="primary"
              style={{
                marginRight: 16,
              }}
              onClick={() => {
                getMeetingMember(meetingData?.schedule?.id);
              }}
              icon={<ReloadOutlined />}
            >
              Tải lại danh sách
            </Button>
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
                      Đại biểu tham gia
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
                      <div className="row mb-2"></div>
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        columns={[
                          {
                            title: "Họ tên",
                            dataIndex: "ten_day_du",
                            ...getColumnSearchProps("user?.ten_day_du"),
                            sorter: (a, b) =>
                              a?.user?.ten_day_du?.length -
                              b?.user?.ten_day_du?.length,
                            render: (_, record) => (
                              <>{record?.user?.ten_day_du}</>
                            ),
                          },
                          {
                            title: "Đơn vị",
                            dataIndex: "thong_tin_don_vi",
                            ...getColumnSearchProps(
                              "user?.thong_tin_don_vi?.ten"
                            ),
                            sorter: (a, b) =>
                              a?.user?.thong_tin_don_vi?.ten?.length -
                              b?.user?.thong_tin_don_vi?.ten?.length,
                            render: (_, record) => (
                              <>{record?.user?.thong_tin_don_vi?.ten}</>
                            ),
                          },
                          {
                            title: "Tài khoản",
                            dataIndex: "ten_dangnhap",
                            ...getColumnSearchProps("user?.ten_dangnhap"),
                            sorter: (a, b) =>
                              a.ten_dangnhap.length - b.ten_dangnhap.length,
                            render: (_, record) => (
                              <>{record?.user?.ten_dangnhap}</>
                            ),
                          },
                          {
                            title: "Email",
                            dataIndex: "email",
                            ...getColumnSearchProps("email"),
                            sorter: (a, b) => a.email.length - b.email.length,
                          },
                          // {
                          //   title: "Đã tham gia",
                          //   dataIndex: "check",
                          //   filters: [
                          //     {
                          //       text: "Đã tham gia",
                          //       value: true,
                          //     },
                          //     {
                          //       text: "Chưa tham gia",
                          //       value: false,
                          //     },
                          //   ],
                          //   // specify the condition of filtering result
                          //   // here is that finding the name started with `value`
                          //   onFilter: (value, record) =>
                          //     !Helper.isNullOrUndefined(
                          //       scheduleSidebar?.participants.find(
                          //         (item) => item.email === record?.user?.email
                          //       )
                          //     ) === value,
                          //   render: (_, record) => (
                          //     <>
                          //       {scheduleSidebar?.participants.find(
                          //         (item) => item.email === record?.user?.email
                          //       ) ? (
                          //         <CheckOutlined style={{ color: "green" }} />
                          //       ) : (
                          //         <CloseOutlined style={{ color: "red" }} />
                          //       )}
                          //     </>
                          //   ),
                          // },
                        ]}
                        dataSource={
                          // meetingData?.member?.length > 0 &&
                          // meetingData?.member.filter(
                          //   (item) => item?.userId !== 0
                          // )
                          memberList?.length > 0 && memberList
                        }
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
                      Khách mời
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
                      <div className="row mb-2"></div>
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        columns={[
                          {
                            title: "Email",
                            dataIndex: "email",
                            ...getColumnSearchProps("email"),
                            sorter: (a, b) => a.email.length - b.email.length,
                          },
                          // {
                          //   title: "Đã tham gia",
                          //   dataIndex: "check",
                          //   filters: [
                          //     {
                          //       text: "Đã tham gia",
                          //       value: true,
                          //     },
                          //     {
                          //       text: "Chưa tham gia",
                          //       value: false,
                          //     },
                          //   ],
                          //   // specify the condition of filtering result
                          //   // here is that finding the name started with `value`
                          //   onFilter: (value, record) =>
                          //     !Helper.isNullOrUndefined(
                          //       scheduleSidebar?.participants.find(
                          //         (item) => item.email === record?.email
                          //       )
                          //     ) === value,
                          //   render: (_, record) => (
                          //     <>
                          //       {scheduleSidebar?.participants.find(
                          //         (item) => item.email === record?.email
                          //       ) ? (
                          //         <CheckOutlined style={{ color: "green" }} />
                          //       ) : (
                          //         <CloseOutlined style={{ color: "red" }} />
                          //       )}
                          //     </>
                          //   ),
                          // },
                        ]}
                        dataSource={
                          // meetingData?.member?.length > 0 &&
                          // meetingData?.member.filter(
                          //   (item) => item?.userId === 0
                          // )
                          memberEmailList?.length > 0 && memberEmailList
                        }
                      />
                    </>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={window.innerWidth > 1023 ? 1 : 0}></Col>
          <Col span={window.innerWidth > 1023 ? 7 : 24}>
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
                      Thành phần đang tham gia
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
                      <div className="row mb-2"></div>
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        columns={[
                          {
                            title: "Tên hiển thị",
                            dataIndex: "displayName",
                            ...getColumnSearchProps("displayName"),
                            sorter: (a, b) =>
                              a.fullName.length - b.fullName.length,
                            // render: (_, record) => <>{record?.displayName}</>,
                          },
                          // {
                          //   title: "Tài khoản",
                          //   dataIndex: "userName",
                          //   sorter: (a, b) =>
                          //     a.userName.length - b.userName.length,
                          //   render: (_, record) => <>{record?.user?.userName}</>,
                          // },
                          // {
                          //   title: "Email",
                          //   dataIndex: "email",
                          //   ...getColumnSearchProps("email"),
                          //   sorter: (a, b) =>
                          //     a.fullName.length - b.fullName.length,
                          // },
                        ]}
                        dataSource={
                          scheduleSidebar?.participants?.length > 0 &&
                          scheduleSidebar?.participants
                        }
                      />
                    </>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
