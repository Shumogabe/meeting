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
import Api from "../../../../api";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../config";
import Helper from "../../../../helper/helper";
const { Search } = Input;

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
    console.log(addOption);
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
    console.log(...addOption.slice(0, id));
    console.log(...addOption.slice(id + 1, addOption.length));
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
                SwalAlertAllConfiguration({
                  title: "Thông báo",
                  text: "Thêm mới thành công",
                  timer: 2000,
                  icon: "success",
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
                SwalAlertAllConfiguration({
                  title: "Thông báo",
                  text: "Sửa thành công",
                  timer: 2000,
                  icon: "success",
                });
              });
          }
        });
    }
  };

  return (
    <Row>
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
        <Tabs
          defaultActiveKey="1"
          // tabPosition={"left"}
          items={[
            {
              label: `Danh sách`,
              key: 1,
              children: (
                <>
                  <Search
                    placeholder="Nhập tiêu đề tìm kiếm"
                    onSearch={(value) => {
                      console.log(value);
                      getMeetingVote(value, scheduleId);
                    }}
                    enterButton
                  />
                  <Table
                    locale={{
                      emptyText: "Không có dữ liệu.",
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
                </>
              ),
            },
            {
              label: `Danh sách đã xóa`,
              key: 2,
              children: (
                <>
                  <Search
                    placeholder="Nhập tiêu đề tìm kiếm"
                    onSearch={(value) => {
                      console.log(value);
                      getMeetingVote(value, scheduleId);
                    }}
                    enterButton
                  />
                  <Table
                    locale={{
                      emptyText: "Không có dữ liệu.",
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
                </>
              ),
            },
          ]}
        />
      </Col>
    </Row>
  );
}
