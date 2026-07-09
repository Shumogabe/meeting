import React, { useState } from "react";
import { Checkbox, Col, Input, Radio, Row, Space, Table } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";

export default function Vote({ scheduleId, user, voteList, getMeetingVote }) {
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
    addOption.forEach((element, index) => {
      if (Helper.isNullOrUndefined(element?.title)) {
        return SwalAlertAllConfiguration({
          title: "Thông báo",
          text: "Nội dung biểu quyết số " + (index + 1) + " chưa có nội dung!",
          icon: "warning",
        });
      }
    });
    if (select === null) {
      new Api()
        .create_meeting_votes({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            title: title,
            status: true,
            type: type,
            end: false,
            scheduleId: scheduleId,
            createdDate: new Date(),
            createdBy: user?.id,
          },
        })
        .then((e) => {
          if (e) {
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
            status: true,
            type: type,
            end: false,
            modifiedDate: new Date(),
            modifiedBy: user?.id,
          },
        })
        .then((e) => {
          if (e) {
            new Api().remove_meeting_voted({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: select?.id,
            });
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
                });
            });
          }
        });
    }
  };
  const onDeleteVotes = (id) => {
    if (!Helper.isNullOrUndefined(id)) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn xóa biểu quyết này không?",
        text: "Khi bạn nhấn 'Đồng ý' biểu quyết sẽ bị xóa vĩnh viễn!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
      }).then((result) => {
        if (result.isConfirmed) {
          new Api()
            .remove_meeting_voted({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: id,
            })
            .then((e) => {
              new Api()
                .remove_meeting_votes({
                  token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                    ?.access_token,
                  id: id,
                })
                .then((e) => {
                  getMeetingVote("", scheduleId);
                });
            });
        }
        // else {
        //   SwalAlertAllConfiguration({
        //     title: "Thông báo! Bạn đã hủy thao tác",
        //     text: "",
        //     icon: "warning",
        //   });
        // }
      });
    } else {
      SwalAlertAllConfiguration({
        title: "Thông báo! Nội dung không tồn tại",
        text: "",
        icon: "warning",
      });
    }
  };

  const endVote = (e) => {
    new Api()
      .meeting_votes_end({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE)).access_token,
        id: e?.id,
        data: {
          end: !e?.end,
          modifiedDate: new Date(),
          modifiedBy: user?.id,
        },
      })
      .then((e) => {
        getMeetingVote("", scheduleId);
        SwalAlertAllConfiguration({
          title: "Kết thúc biểu quyết thành công",
          icon: "success",
        });
      });
  };
  return (
    <Row>
      <Col span={12}>
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
      <Col span={12}>
        <label>Danh sách biểu quyết</label>
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
              title: "",
              render: (e) => (
                <>
                  <a
                    href
                    className="btn btn-sm btn-default btn-delete"
                    onClick={() => endVote(e)}
                  >
                    {e?.end ? (
                      <>
                        <i className="fas fa-play"></i> Bắt đầu
                      </>
                    ) : (
                      <>
                        <i className="fas fa-pause"></i> Kết thúc
                      </>
                    )}
                  </a>
                  <a
                    href
                    className="btn btn-sm btn-default btn-delete"
                    onClick={() => onDeleteVotes(e?.id)}
                  >
                    <i className="fas fa-trash-alt red"></i> Xóa
                  </a>
                </>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              button: true,
            },
          ]}
          dataSource={voteList?.length > 0 && voteList}
        />
      </Col>
    </Row>
  );
}
