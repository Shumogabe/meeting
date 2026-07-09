import React, { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Input, Row, Table, Tabs } from "antd";
import Api from "../../../../api";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../config";
import Helper from "../../../../helper/helper";
const { Search } = Input;

export default function Video({
  video,
  setVideo,
  videoList,
  setVideoList,
  videoPostList,
  setVideoPostList,
  videoDeleteList,
  setVideoDeleteList,
  scheduleId,
  user,
  getContentBySchedule,
  getMeetingVideo,
  videoRestoreList,
  setVideoRestoreList,
}) {
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFileListUpLoad([]);
  }, [scheduleId]);

  function upFile(fileList, filePath, docList, scheduleId, user, content) {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });
    new Api()
      .Upload_files_to_bucket({
        // token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
        filePath: filePath,
        formData: formData,
      })
      .then(() => {
        // return SwalAlertAllConfiguration({
        //   title: "Tải tài liệu lên thành công",
        //   icon: "success",
        // });
      });
    docList &&
      docList.map((item, index) =>
        Helper.isNullOrUndefined(
          JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
        )
          ? new Api().create_meeting_video_without({
              data: {
                title: content,
                scheduleId: scheduleId,
                url: filePath,
                originalName: item.name,
                systemName: item.uid,
                type: item.type,
                size: item.size,
                status: 2,
                createdDate: item.lastModifiedDate,
                createdBy: !Helper.isNullOrUndefined(user?.id) ? user?.id : 0,
              },
            })
          : new Api().create_meeting_video({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              data: {
                title: content,
                scheduleId: scheduleId,
                url: filePath,
                originalName: item.name,
                systemName: item.uid,
                type: item.type,
                size: item.size,
                status: 2,
                createdDate: item.lastModifiedDate,
                createdBy: !Helper.isNullOrUndefined(user?.id) ? user?.id : 0,
              },
            })
      );
  }
  return (
    <>
      <Row>
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => {
              getMeetingVideo("", scheduleId);
            }}
            loading={uploading}
            style={{
              marginTop: 16,
            }}
            icon={<ReloadOutlined />}
          >
            Tải lại danh sách
          </Button>{" "}
        </Col>
        <Col span={24}>
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
                        // console.log(value);
                        // getConslusionBySchedule(value, scheduleId);
                        getMeetingVideo(value, scheduleId);
                      }}
                      enterButton
                    />
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Kích thước: " + record.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record.userCreatedBy.userName}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record.modifiedDate}
                            </p>
                          </>
                        ),
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                        },
                        {
                          title: "Tài liệu",
                          dataIndex: "tailieu",
                          render: (e, record) => {
                            return (
                              <>
                                <p
                                  style={{
                                    backgroundColor: "#d9d9d9",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <a
                                    href
                                    onClick={() => {
                                      if (record?.url) {
                                        new Api()
                                          .Get_link_download({
                                            objectKey:
                                              record?.url +
                                              "/" +
                                              record?.originalName,
                                            fileName: record?.originalName,
                                          })
                                          .then((e) => {
                                            // return window.open(
                                            //   e?.data,
                                            //   "_blank"
                                            // );
                                            // return setLink(e?.data);
                                          });
                                      }
                                    }}
                                  >
                                    {record.originalName}
                                  </a>
                                </p>
                              </>
                            );
                          },
                        },
                      ]}
                      dataSource={
                        videoList?.length > 0 &&
                        videoList.filter((item) => item?.isDeleted === false)
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
                        // console.log(value);
                        // getConslusionBySchedule(value, scheduleId);
                        getMeetingVideo(value, scheduleId);
                      }}
                      enterButton
                    />
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Kích thước: " + record.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record.userCreatedBy.userName}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record.modifiedDate}
                            </p>
                          </>
                        ),
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                        },
                        {
                          title: "Tài liệu",
                          dataIndex: "tailieu",
                          render: (e, record) => {
                            return (
                              <>
                                <p
                                  style={{
                                    backgroundColor: "#d9d9d9",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <a
                                    href
                                    onClick={() => {
                                      if (record?.url) {
                                        new Api()
                                          .Get_link_download({
                                            objectKey:
                                              record?.url +
                                              "/" +
                                              record?.originalName,
                                            fileName: record?.originalName,
                                          })
                                          .then((e) => {
                                            // return window.open(
                                            //   e?.data,
                                            //   "_blank"
                                            // );
                                            // return setLink(e?.data);
                                          });
                                      }
                                    }}
                                  >
                                    {record.originalName}
                                  </a>
                                </p>
                              </>
                            );
                          },
                        },
                      ]}
                      dataSource={
                        videoList?.length > 0 &&
                        videoList.filter((item) => item?.isDeleted === true)
                      }
                    />
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
