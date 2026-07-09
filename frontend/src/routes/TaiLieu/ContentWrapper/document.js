import React, { useEffect, useState } from "react";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Input, Row, Table, Tabs } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import UploadFile, { handleUpload } from "../../../components/Upload";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";

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
      <div className="row">
        <div className="col-md-12">
          <label>Tải file lên</label>
          <br />
        </div>
      </div>
      <Row>
        <Col span={12}>
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
          </Button>{" "}
          <Button
            type="primary"
            onClick={() => {
              handleUpload(
                fileListUpLoad,
                setFileListUpLoad,
                "tailieu/" + scheduleId,
                setUploading,
                docPostList,
                scheduleId,
                user,
                getMeetingDocument
              );
              setDocPostList([]);
              setDocDeleteList([]);
              setDocRestoreList([]);
            }}
            disabled={fileListUpLoad.length === 0}
            loading={uploading}
            style={{
              marginTop: 16,
            }}
            icon={<CloudUploadOutlined />}
          >
            {uploading ? "Đang tải lên" : "Tải lên"}
          </Button>{" "}
          {docRestoreList?.length > 0 && (
            <>
              <Button
                onClick={() => {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn khôi phục các tài liệu này không?",
                    text: "Khi bạn nhấn 'Đồng ý' các tài liệu này sẽ được khôi phục!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                    showLoaderOnConfirm: true,
                    dangerMode: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // RemoveDocument()
                      // Ok
                      const defaultFileList =
                        docList.filter((item) => item?.isDeleted === true) &&
                        docList
                          .filter((item) => item?.isDeleted === true)
                          .map((obj) => {
                            return {
                              uid: obj?.uid ? obj?.uid : obj?.title,
                              id: obj?.id,
                              lastModifiedDate: obj?.lastModifiedDate
                                ? obj?.lastModifiedDate
                                : obj?.createdDate,
                              name: obj?.originalName
                                ? obj?.originalName
                                : obj?.name,
                              size: obj?.size,
                              type: obj?.type,
                              status: "done",
                              url: obj?.url,
                            };
                          });
                      docRestoreList.map((file, i) => {
                        const index = defaultFileList.indexOf(file);
                        const newFileList = defaultFileList.slice();
                        newFileList.splice(index, 1);
                        setDocList(newFileList);
                        setFileListUpLoad(
                          fileListUpLoad.filter((e) => e?.uid !== file?.id)
                        );
                        if (!Helper.isNullOrUndefined(file?.id)) {
                          new Api().restore_document({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: file?.id,
                          });
                        }
                        SwalAlertAllConfiguration({
                          title: "Khôi phục thành công",
                          icon: "success",
                          timer: 1500,
                        });
                        setDocRestoreList([]);
                        getMeetingDocument(scheduleId);
                      });
                    } else {
                      return false;
                    }
                  });
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
                  SwalAlertAllConfiguration({
                    title:
                      "Bạn có chắc muốn xóa vĩnh viễn các tài liệu này không?",
                    text: "Khi bạn nhấn 'Đồng ý' các tài liệu này sẽ bị xóa vĩnh viễn!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                    showLoaderOnConfirm: true,
                    dangerMode: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // RemoveDocument()
                      // Ok
                      const defaultFileList =
                        docList.filter((item) => item?.isDeleted === true) &&
                        docList
                          .filter((item) => item?.isDeleted === true)
                          .map((obj) => {
                            return {
                              uid: obj?.uid ? obj?.uid : obj?.title,
                              id: obj?.id,
                              lastModifiedDate: obj?.lastModifiedDate
                                ? obj?.lastModifiedDate
                                : obj?.createdDate,
                              name: obj?.originalName
                                ? obj?.originalName
                                : obj?.name,
                              size: obj?.size,
                              type: obj?.type,
                              status: "done",
                              url: obj?.url,
                            };
                          });
                      docRestoreList.map((file, i) => {
                        const index = defaultFileList.indexOf(file);
                        const newFileList = defaultFileList.slice();
                        newFileList.splice(index, 1);
                        setDocList(newFileList);
                        setFileListUpLoad(
                          fileListUpLoad.filter((e) => e?.uid !== file?.id)
                        );
                        if (!Helper.isNullOrUndefined(file?.id)) {
                          new Api().delete_document({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: file?.id,
                          });
                          new Api().Delete_file_bucket({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            objectName: file?.url + "/" + file?.name,
                          });
                        }
                        SwalAlertAllConfiguration({
                          title: "Xóa thành công",
                          icon: "success",
                          timer: 1500,
                        });
                        setDocRestoreList([]);
                        getMeetingDocument(scheduleId);
                      });
                    } else {
                      return false;
                    }
                  });
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
          {docDeleteList?.length > 0 && (
            <>
              <Button
                onClick={() => {
                  SwalAlertAllConfiguration({
                    title: "Bạn có chắc muốn xóa các tài liệu này không?",
                    text: "Khi bạn nhấn 'Đồng ý' các tài liệu này sẽ bị xóa!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Thoát",
                    showLoaderOnConfirm: true,
                    dangerMode: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // RemoveDocument()
                      // Ok
                      const defaultFileList =
                        docList &&
                        docList.map((obj) => {
                          return {
                            uid: obj?.uid ? obj?.uid : obj?.title,
                            id: obj?.id,
                            lastModifiedDate: obj?.lastModifiedDate
                              ? obj?.lastModifiedDate
                              : obj?.createdDate,
                            name: obj?.originalName
                              ? obj?.originalName
                              : obj?.name,
                            size: obj?.size,
                            type: obj?.type,
                            status: obj?.status,
                            url: obj?.url,
                          };
                        });
                      docDeleteList.map((file, i) => {
                        const index = defaultFileList.indexOf(file);
                        const newFileList = defaultFileList.slice();
                        newFileList.splice(index, 1);
                        setDocList(newFileList);
                        setFileListUpLoad(
                          fileListUpLoad.filter((e) => e?.uid !== file?.id)
                        );
                        if (!Helper.isNullOrUndefined(file?.id)) {
                          new Api().remove_document({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: file?.id,
                          });
                        }
                        SwalAlertAllConfiguration({
                          title: "Xóa thành công",
                          icon: "success",
                          timer: 1500,
                        });
                        setDocDeleteList([]);
                        getMeetingDocument(scheduleId);
                      });
                    } else {
                      return false;
                    }
                  });
                }}
                className="btn-danger"
                style={{
                  marginBottom: 16,
                  marginRight: 16,
                }}
              >
                Xóa
              </Button>
              <Button
                onClick={() => {
                  //console.log(docDeleteList);
                  if (docDeleteList?.length > 0) {
                    SwalAlertAllConfiguration({
                      title: "Bạn có chắc muốn gửi duyệt không?",
                      text: "Khi bạn nhấn 'Đồng ý' sẽ được gửi duyệt!",
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
                          index < docDeleteList.length;
                          index++
                        ) {
                          new Api()
                            .sendapprove_meeting_document({
                              token: JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE)
                              )?.access_token,
                              id: docDeleteList[index]?.id,
                            })
                            .then((e) => {
                              if (e) {
                                setDocDeleteList([]);
                                getMeetingDocument(scheduleId);
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
                Gửi duyệt
              </Button>
            </>
          )}
          {docSendList?.length > 0 && (
            <>
              <Button
                onClick={() => {
                  //console.log(docSendList);
                  if (docSendList?.length > 0) {
                    SwalAlertAllConfiguration({
                      title: "Bạn có chắc muốn hủy gửi duyệt không?",
                      text: "Khi bạn nhấn 'Đồng ý' sẽ hủy gửi duyệt!",
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
                          index < docSendList.length;
                          index++
                        ) {
                          new Api()
                            .unsendapprove_meeting_document({
                              token: JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE)
                              )?.access_token,
                              id: docSendList[index]?.id,
                            })
                            .then((e) => {
                              if (e) {
                                setDocSendList([]);
                                getMeetingDocument(scheduleId);
                                SwalAlertAllConfiguration({
                                  title: "Thông báo",
                                  text: "Hủy gửi duyệt thành công",
                                  timer: 2000,
                                  icon: "success",
                                });
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
                Hủy gửi duyệt
              </Button>
            </>
          )}
        </Col>
        <Col span={12}>
          <UploadFile
            setFieldValue={setDocPostList}
            fileListUpLoad={fileListUpLoad}
            setFileListUpLoad={setFileListUpLoad}
            setDefaultFileList={setDocPostList}
            defaultFileList={
              docPostList &&
              docPostList.map((obj) => {
                return {
                  uid: obj?.uid ? obj?.uid : obj?.title,
                  id: obj?.id,
                  lastModifiedDate: obj?.lastModifiedDate
                    ? obj?.lastModifiedDate
                    : obj?.createdDate,
                  name: obj?.originalName ? obj?.originalName : obj?.name,
                  size: obj?.size,
                  type: obj?.type,
                  status: "done",
                  url: obj?.url,
                };
              })
            }
            onRemove={RemoveDocument}
          />
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
                      rowSelection={{
                        selectedRowKeys: docDeleteList.map((x) => x.key),
                        onChange: (selectedRowKeys, selectedRows) => {
                          setDocDeleteList(selectedRows);
                        },
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (e, record) => (
                            <RenderTitle e={e} record={record} />
                          ),
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
                      rowSelection={{
                        selectedRowKeys: docSendList.map((x) => x.key),
                        onChange: (selectedRowKeys, selectedRows) => {
                          setDocSendList(selectedRows);
                        },
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (e, record) => (
                            <RenderTitle e={e} record={record} />
                          ),
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
                      rowSelection={{
                        selectedRowKeys: docRestoreList.map((x) => x.key),
                        onChange: (selectedRowKeys, selectedRows) => {
                          setDocRestoreList(selectedRows);
                        },
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

const RenderTitle = ({ e, record }) => {
  const [warning, setWarning] = useState("");
  return (
    <>
      {/* {JSON.stringify(record)} */}
      <Input
        defaultValue={record?.title}
        onChange={(e) => {
          //console.log(e.target.value);
          //console.log(record?.title);
          //console.log(e.target.value !== record?.title);
          if (e.target.value !== record?.title) {
            setWarning("Sau khi thay đổi nhấn 'Enter' để cập nhật");
          } else {
            setWarning("");
          }
        }}
        onPressEnter={(e) => {
          new Api().update_meeting_document({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              id: record?.id,
              title: e.target.value,
              scheduleId: record?.scheduleId,
              fileUrl: record?.url,
              fileOriginalName: record?.originalName,
              fileSystemName: record?.systemName,
              fileSize: record?.size,
              fileType: record?.type,
              modifiedDate: new Date(),
              modifiedBy: record?.modifiedBy,
              status: record?.status,
            },
          });
          setWarning("");
        }}
      />
      {!Helper.isNullOrUndefined(warning) && (
        <Alert message={warning} type="warning" showIcon closable />
      )}
    </>
  );
};
