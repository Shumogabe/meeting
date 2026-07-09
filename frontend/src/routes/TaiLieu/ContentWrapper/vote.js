import React, { useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";

export default function Vote({
  scheduleId,
  user,
  voteList,
  getMeetingVote,
  votesDeleteList,
  setVotesDeleteList,
  votesRestoreList,
  setVotesRestoreList,
}) {
  const [button, setButton] = useState("Tạo biểu quyết");
  const [select, setSelect] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(true);
  const [addOption, setAddOption] = useState([
    {
      title: "",
    },
    {
      title: "",
    },
  ]);
  const onChangeTitle = (e) => {
    setTitle(e?.target?.value);
  };
  const onAddOption = () => {
    let option = {
      title: "",
    };
    addOption.push(option);
    setAddOption([...addOption]);
    //console.log(addOption);
  };
  const onRemoveOption = (id) => {
    if (addOption?.length <= 2) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Không thể tạo bình chọn ít hơn 2 lựa chọn",
        icon: "warning",
      });
    }
    if (id === null || id === "" || id === undefined) {
      return;
    }
    setAddOption([
      ...addOption.slice(0, id),
      ...addOption.slice(id + 1, addOption.length),
    ]);
    //console.log(...addOption.slice(0, id));
    //console.log(...addOption.slice(id + 1, addOption.length));
  };
  const onWrite = () => {
    if (Helper.isNullOrUndefined(title)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo",
        text: "Chủ đề biểu quyết không được để trống!",
        icon: "warning",
      });
    }
    if (JSON.stringify(addOption).includes(`{"title":""}`)) {
      addOption.map((element, index) => {
        if (Helper.isNullOrUndefined(element?.title)) {
          return SwalAlertAllConfiguration({
            title: "Thông báo",
            text:
              "Nội dung biểu quyết số " + (index + 1) + " chưa có nội dung!",
            icon: "warning",
          });
        }
      });
      return false;
    }
    if (select === null) {
      new Api()
        .create_meeting_votes({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            title: title,
            status: false,
            type: type,
            end: true,
            scheduleId: scheduleId,
            createdDate: new Date(),
            createdBy: user?.id,
          },
        })
        .then((e) => {
          if (e?.data) {
            new Api()
              .get_meeting_votes_byTitle({
                title: title,
                scheduleid: scheduleId,
              })
              .then((res) => {
                addOption.forEach((element) => {
                  new Api()
                    .create_meeting_voted({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      data: {
                        title: element?.title,
                        voteId: res?.data?.id,
                        createdDate: new Date(),
                        createdBy: user?.id,
                        isCreatedByAd: true,
                      },
                    })
                    .then((e) => {
                      getMeetingVote("", scheduleId);
                      setTitle("");
                      setType(true);
                      setAddOption([
                        {
                          title: "",
                        },
                        {
                          title: "",
                        },
                      ]);
                      setSelect(null);
                      setButton("Tạo biểu quyết");
                    });
                });
              });
          }
        });
    } else {
      new Api()
        .edit_meeting_votes({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: select?.id,
          data: {
            title: title,
            scheduleId: scheduleId,
            status: select?.status,
            type: type,
            end: select?.end,
            modifiedDate: new Date(),
            modifiedBy: user?.id,
          },
        })
        .then((e) => {
          if (e?.data) {
            new Api()
              .remove_meeting_voted({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                id: select?.id,
              })
              .then((e) => {
                addOption.forEach((element) => {
                  new Api()
                    .create_meeting_voted({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      data: {
                        title: element?.title,
                        voteId: select?.id,
                        createdDate: new Date(),
                        createdBy: user?.id,
                        isCreatedByAd: true,
                      },
                    })
                    .then((e) => {
                      getMeetingVote("", scheduleId);
                      setTitle("");
                      setType(true);
                      setAddOption([
                        {
                          title: "",
                        },
                        {
                          title: "",
                        },
                      ]);
                      setSelect(null);
                      setButton("Tạo biểu quyết");
                    });
                });
              });
          }
        });
    }
  };

  return (
    <Row>
      <Col span={24}>
        <div className="row">
          <div className="col-md-12">
            <label>Chủ đề biểu quyết</label>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <input
              value={title}
              className="form-control"
              name="title"
              placeholder="Nhập chủ đề biểu quyết"
              onChange={(e) => onChangeTitle(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <label>Nội dung biểu quyết</label>
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            {addOption.map((item, index) => (
              <div className="input-group mb-3" key={index}>
                <Input
                  addonBefore={index + 1}
                  size="large"
                  placeholder={"Nội dung " + (index + 1)}
                  addonAfter={
                    <a
                      href
                      // className="btn btn-outline-secondary"
                      // type="button"
                      onClick={() => onRemoveOption(index)}
                    >
                      <i className="fas fa-trash-alt red"></i>
                    </a>
                  }
                  value={item?.title}
                  // defaultValue={item?.title}
                  onChange={(e) => {
                    let g = addOption[index];
                    g["title"] = e?.target?.value;
                    if (index === -1) {
                      // handle error
                      //console.log("no match");
                    } else
                      setAddOption([
                        ...addOption.slice(0, index),
                        g,
                        ...addOption.slice(index + 1),
                      ]);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary border border-0"
              onClick={() => onAddOption()}
            >
              + Thêm nội dung biểu quyết
            </button>
          </div>
        </div>
        <label>Hình thức biểu quyết</label>
        <Radio.Group
          onChange={(e) => {
            //console.log("radio checked", e.target.value);
            setType(e.target.value);
          }}
          value={type}
        >
          <Space direction="vertical">
            <Radio value={false}>
              <span style={{ fontWeight: "initial" }}>
                Chọn một{" "}
                <i>(Cho phép người dùng chỉ chọn một trong số các lựa chọn)</i>
              </span>
            </Radio>
            <Radio value={true}>
              <span style={{ fontWeight: "initial" }}>
                Chọn nhiều{" "}
                <i>
                  (Cho phép người dùng chọn một hoặc nhiều tùy chọn trong số các
                  lựa chọn)
                </i>
              </span>
            </Radio>
          </Space>
        </Radio.Group>
        <div className="row">
          <div className="col-md-12 align-center">
            {/* <button
                type="button"
                className="btn btn-primary border border-0"
                onClick={() => onAddOption()}
              >
                + Thêm nội dung biểu quyết
              </button> */}
            <button
              type="button"
              className="btn btn-primary border border-0"
              onClick={() => onWrite()}
            >
              <i className="fas fa-edit"></i> {button}
            </button>
            {button === "Sửa biểu quyết" && (
              <button
                type="button"
                className="btn btn-info border border"
                onClick={() => {
                  setTitle("");
                  setButton("Tạo biểu quyết");
                  setAddOption([
                    {
                      title: "",
                    },
                    {
                      title: "",
                    },
                  ]);
                  setSelect(null);
                  setType(true);
                }}
              >
                <i className="fas fa-plus"></i> Làm mới
              </button>
            )}
          </div>
        </div>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => {
            getMeetingVote("", scheduleId);
          }}
          // loading={uploading}
          style={{
            marginTop: 16,
          }}
          icon={<ReloadOutlined />}
        >
          Tải lại danh sách
        </Button>{" "}
        {votesDeleteList?.length > 0 && (
          <>
            <Button
              onClick={() => {
                //console.log(votesDeleteList);
                if (votesDeleteList?.length > 0) {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn duyệt không?",
                    text: "Khi bạn nhấn 'Đồng ý' sẽ được duyệt!",
                    icon: "warning",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      for (
                        let index = 0;
                        index < votesDeleteList.length;
                        index++
                      ) {
                        new Api()
                          .meeting_votes_status({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: votesDeleteList[index],
                            data: {
                              status: true,
                              modifiedDate: new Date(),
                              modifiedBy: user?.id,
                            },
                          })
                          .then((e) => {
                            if (e) {
                              setVotesDeleteList([]);
                              getMeetingVote("", scheduleId);
                            }
                          });
                        // xóa phần từ
                        // contentList.splice(
                        //   contentList
                        //     .map((item) => item.key)
                        //     .indexOf(contentDeleteList[index]),
                        //   1
                        // );
                      }
                    }
                  });
                }
              }}
              className="btn-info"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Phê duyệt
            </Button>
            <Button
              onClick={() => {
                //console.log(votesDeleteList);
                if (votesDeleteList?.length > 0) {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn hủy duyệt không?",
                    text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy duyệt!",
                    icon: "warning",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      for (
                        let index = 0;
                        index < votesDeleteList.length;
                        index++
                      ) {
                        new Api()
                          .meeting_votes_status({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: votesDeleteList[index],
                            data: {
                              status: false,
                              modifiedDate: new Date(),
                              modifiedBy: user?.id,
                            },
                          })
                          .then((e) => {
                            if (e) {
                              setVotesDeleteList([]);
                              getMeetingVote("", scheduleId);
                            }
                          });
                        // xóa phần từ
                        // contentList.splice(
                        //   contentList
                        //     .map((item) => item.key)
                        //     .indexOf(contentDeleteList[index]),
                        //   1
                        // );
                      }
                    }
                  });
                }
              }}
              className="btn-warning"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Hủy duyệt
            </Button>
            <Button
              onClick={() => {
                //console.log(votesDeleteList);
                if (votesDeleteList?.length > 0) {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn kích hoạt không?",
                    text: "Khi bạn nhấn 'Đồng ý' sẽ được kích hoạt!",
                    icon: "warning",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      for (
                        let index = 0;
                        index < votesDeleteList.length;
                        index++
                      ) {
                        new Api()
                          .meeting_votes_end({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: votesDeleteList[index],
                            data: {
                              end: false,
                              modifiedDate: new Date(),
                              modifiedBy: user?.id,
                            },
                          })
                          .then((e) => {
                            if (e) {
                              setVotesDeleteList([]);
                              getMeetingVote("", scheduleId);
                            }
                          });
                        // xóa phần từ
                        // contentList.splice(
                        //   contentList
                        //     .map((item) => item.key)
                        //     .indexOf(contentDeleteList[index]),
                        //   1
                        // );
                      }
                    }
                  });
                }
              }}
              className="btn-info"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Kich hoạt
            </Button>
            <Button
              onClick={() => {
                //console.log(votesDeleteList);
                if (votesDeleteList?.length > 0) {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn hủy kích hoạt không?",
                    text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy kích hoạt!",
                    icon: "warning",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      for (
                        let index = 0;
                        index < votesDeleteList.length;
                        index++
                      ) {
                        new Api()
                          .meeting_votes_end({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: votesDeleteList[index],
                            data: {
                              end: true,
                              modifiedDate: new Date(),
                              modifiedBy: user?.id,
                            },
                          })
                          .then((e) => {
                            if (e) {
                              setVotesDeleteList([]);
                              getMeetingVote("", scheduleId);
                            }
                          });
                        // xóa phần từ
                        // contentList.splice(
                        //   contentList
                        //     .map((item) => item.key)
                        //     .indexOf(contentDeleteList[index]),
                        //   1
                        // );
                      }
                    }
                  });
                }
              }}
              className="btn-warning"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Hủy kích hoạt
            </Button>
          </>
        )}
        {votesDeleteList?.length > 0 && (
          <Button
            onClick={() => {
              //console.log(votesDeleteList);
              if (votesDeleteList?.length > 0) {
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
                      index < votesDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .remove_meeting_votes({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            setVotesDeleteList([]);
                            getMeetingVote("", scheduleId);
                          }
                        });
                      // xóa phần từ
                      // contentList.splice(
                      //   contentList
                      //     .map((item) => item.key)
                      //     .indexOf(contentDeleteList[index]),
                      //   1
                      // );
                    }
                  }
                });
              }
            }}
            className="btn-danger"
            style={{
              marginBottom: 16,
              marginRight: 16,
            }}
          >
            Xóa
          </Button>
        )}
        {votesRestoreList?.length > 0 && (
          <>
            <Button
              onClick={() => {
                //console.log(votesRestoreList);
                if (votesRestoreList?.length > 0) {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn khôi phục không?",
                    text: "Khi bạn nhấn 'Đồng ý' sẽ được khôi phục!",
                    icon: "warning",
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      for (
                        let index = 0;
                        index < votesRestoreList.length;
                        index++
                      ) {
                        new Api()
                          .restore_meeting_votes({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: votesRestoreList[index],
                          })
                          .then((e) => {
                            if (e) {
                              setVotesRestoreList([]);
                              getMeetingVote("", scheduleId);
                            }
                          });
                        // xóa phần từ
                        // contentList.splice(
                        //   contentList
                        //     .map((item) => item.key)
                        //     .indexOf(contentRestoreList[index]),
                        //   1
                        // );
                      }
                    }
                  });
                }
              }}
              className="btn-info"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Khôi phục
            </Button>
            <Button
              onClick={() => {
                //console.log(votesRestoreList);
                if (votesRestoreList?.length > 0) {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn xóa vĩnh viễn không?",
                    text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa vĩnh viễn!",
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
                        index < votesRestoreList.length;
                        index++
                      ) {
                        new Api()
                          .delete_meeting_votes({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: votesRestoreList[index],
                          })
                          .then((e) => {
                            if (e) {
                              setVotesRestoreList([]);
                              getMeetingVote("", scheduleId);
                            }
                          });
                        // xóa phần từ
                        // contentList.splice(
                        //   contentList
                        //     .map((item) => item.key)
                        //     .indexOf(contentRestoreList[index]),
                        //   1
                        // );
                      }
                    }
                  });
                }
              }}
              className="btn-danger"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Xóa vĩnh viễn
            </Button>
          </>
        )}
        <Tabs
          defaultActiveKey="1"
          // tabPosition={"left"}
          items={[
            {
              label: `Danh sách`,
              key: 1,
              children: (
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        //console.log(record);
                        setSelect(record);
                        setButton("Sửa biểu quyết");
                        setTitle(record?.title);
                        setAddOption(record?.meetingvoted);
                        setType(record?.type);
                      },
                    };
                  }}
                  rowSelection={{
                    selectedRowKeys: votesDeleteList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setVotesDeleteList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      sorter: (a, b) => a.title.length - b.title.length,
                    },
                    {
                      title: "Nội dung biểu quyết",
                      // dataIndex: "meetingvoted",
                      render: (e) => (
                        <>
                          <Row>
                            {e?.meetingvoted.map((element) => (
                              <Col span={24}>
                                {e.type === true ? (
                                  <Checkbox value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Checkbox>
                                ) : (
                                  <Radio value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Radio>
                                )}
                              </Col>
                            ))}
                          </Row>

                          {/* {JSON.stringify(e)} */}
                        </>
                      ),
                    },
                    {
                      title: "Tình trạng",
                      // dataIndex: "status",
                      render: (e) => {
                        return (
                          <>
                            {(e?.status ? "Đã duyệt" : "Chưa duyệt") +
                              " | " +
                              (e?.end
                                ? "Tạm dừng biểu quyết"
                                : "Đang biểu quyết")}
                            {/* {JSON.stringify(e)} */}
                          </>
                        );
                      },
                    },
                  ]}
                  dataSource={
                    voteList?.length > 0 &&
                    voteList.filter((item) => item?.isDeleted === false)
                  }
                />
              ),
            },
            {
              label: `Danh sách đã xóa`,
              key: 2,
              children: (
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  rowSelection={{
                    selectedRowKeys: votesRestoreList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setVotesRestoreList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      sorter: (a, b) => a.title.length - b.title.length,
                    },
                    {
                      title: "Nội dung biểu quyết",
                      // dataIndex: "meetingvoted",
                      render: (e) => (
                        <>
                          <Row>
                            {e?.meetingvoted.map((element) => (
                              <Col span={24}>
                                {e.type === true ? (
                                  <Checkbox value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Checkbox>
                                ) : (
                                  <Radio value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Radio>
                                )}
                              </Col>
                            ))}
                          </Row>

                          {/* {JSON.stringify(e)} */}
                        </>
                      ),
                    },
                  ]}
                  dataSource={
                    voteList?.length > 0 &&
                    voteList.filter((item) => item?.isDeleted === true)
                  }
                />
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}
