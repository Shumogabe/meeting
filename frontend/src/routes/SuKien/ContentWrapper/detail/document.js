import React, { useEffect, useState } from "react";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Input, Row, Table, Tabs } from "antd";
import Api from "../../../../api";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import UploadFile, { handleUpload } from "../../../../components/Upload";
import { SESSION_STORAGE } from "../../../../config";
import Helper from "../../../../helper/helper";

export default function Document({
  InsertDocument,
  RemoveDocument,
  doc,
  setDoc,
  docList,
  setDocList,
  docPostList,
  setDocPostList,
  docDeleteList,
  setDocDeleteList,
  scheduleId,
  user,
  getContentBySchedule,
  getMeetingDocument,
  docRestoreList,
  setDocRestoreList,
  docSendList,
  setDocSendList,
}) {
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFileListUpLoad([]);
  }, [scheduleId]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Button
            type="primary"
            onClick={() => {
              setDocDeleteList([]);
              setDocRestoreList([]);
              getMeetingDocument(scheduleId);
            }}
            loading={uploading}
            style={{
              marginTop: 16,
            }}
            icon={<ReloadOutlined />}
          >
            Tải lại danh sách
          </Button>
        </Col>
        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            // tabPosition={"left"}
            items={[
              {
                label: `Danh sách đang cập nhật`,
                key: 1,
                children: (
                  <>
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
                              {"Kích thước: " + record?.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record?.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record?.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record?.user?.ten_day_du +
                                " - " +
                                record?.user?.ten_dangnhap}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record?.modifiedDate}
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
                        docList?.length > 0 &&
                        docList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 0
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: `Danh sách chờ duyệt`,
                key: 2,
                children: (
                  <>
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
                              {"Kích thước: " + record?.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record?.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record?.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record?.user?.ten_day_du +
                                " - " +
                                record?.user?.ten_dangnhap}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record?.modifiedDate}
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
                        docList?.length > 0 &&
                        docList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 1
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: `Danh sách đã duyệt`,
                key: 3,
                children: (
                  <>
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
                              {"Kích thước: " + record?.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record?.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record?.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record?.user?.ten_day_du +
                                " - " +
                                record?.user?.ten_dangnhap}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record?.modifiedDate}
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
                        docList?.length > 0 &&
                        docList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 2
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: `Danh sách từ chối`,
                key: 4,
                children: (
                  <>
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
                              {"Kích thước: " + record?.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record?.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record?.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record?.user?.ten_day_du +
                                " - " +
                                record?.user?.ten_dangnhap}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record?.modifiedDate}
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
                        docList?.length > 0 &&
                        docList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 3
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: `Danh sách đã xóa`,
                key: 5,
                children: (
                  <>
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
                              {"Kích thước: " + record?.size}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Loại tài liệu: " + record?.type}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Tình trạng: " +
                                (record?.status === 0
                                  ? "chưa duyệt"
                                  : "đã duyệt")}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Người tải tài liệu lên: " +
                                record?.user?.ten_day_du +
                                " - " +
                                record?.user?.ten_dangnhap}
                            </p>
                            <p
                              style={{
                                margin: 0,
                              }}
                            >
                              {"Thời gian tải tài liệu lên: " +
                                record?.modifiedDate}
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
                        docList?.length > 0 &&
                        docList.filter((item) => item?.isDeleted === true)
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
