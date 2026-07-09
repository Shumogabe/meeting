import React, { useEffect, useState } from "react";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Input, Modal, Row, Table, Tabs } from "antd";
import Api from "../../../../../api";
import { SwalAlertAllConfiguration } from "../../../../../components/Swal";
import UploadFile, { handleUpload } from "../../../../../components/Upload";
import { SESSION_STORAGE } from "../../../../../config";
import Helper from "../../../../../helper/helper";
//owner = 1; chủ trì và ủy quyền
export default function MeetingDocument({
  scheduleId,
  user,
  owner,
  marginTopLayout,
  marginRightLayout,
  meetingData,
}) {
  const [docList, setDocList] = useState([]);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState(null);
  const [docPostList, setDocPostList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  const [docRestoreList, setDocRestoreList] = useState([]);
  const [docSendList, setDocSendList] = useState([]);

  // const [pdfUrl, setPdfUrl] = useState("");
  // const [error, setError] = useState("");
  //console.log("Kiểm tra");
  //console.log(owner);
  useEffect(() => {
    setFileListUpLoad([]);
    getMeetingDocument(scheduleId);
  }, [scheduleId]);

  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "tailieu/" + id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((response) => {
        if (response?.data) {
          //console.log("Kiểm tra");
          //console.log(response?.data);
          setDocList(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getMeetingDocument(scheduleId);
  //   }, 5000);
  // }, []);

  const onUpload = () => {
    handleUpload(
      fileListUpLoad,
      setFileListUpLoad,
      "tailieu/" + scheduleId,
      setUploading,
      docList,
      scheduleId,
      user,
      getMeetingDocument
    );
  };

  return (
    <div
      style={{
        margin:
          marginTopLayout +
          marginRightLayout +
          " 0px " +
          (!Helper.isNullOrUndefined(
            document.getElementById("meeting-sidebar")?.offsetWidth
          ) &&
            Number(
              -document.getElementById("meeting-sidebar")?.offsetWidth - 7.5 - 8
              // window.screen.width
            )) +
          "px",
      }}
    >
      <Card
        title="Tài liệu"
        // extra={<a href="#">More</a>}
        style={
          {
            // width: 300,
          }
        }
      >
        {owner === 1 ? (
          <Row>
            <Col span={2}>
              <Button
                onClick={() => {
                  setDocDeleteList([]);
                  setDocRestoreList([]);
                  getMeetingDocument(scheduleId);
                }}
                loading={uploading}
                className="btn-default"
              >
                <i class="fas fa-sync-alt info"></i> Tải lại
              </Button>
            </Col>
            {meetingData?.schedule?.status !== 3 && (
              <Col span={14}>
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
                >
                  <Button
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
                    className="btn-default"
                  >
                    <i class="fas fa-upload"></i> Tải lên
                  </Button>
                </UploadFile>
                {docRestoreList?.length > 0 && (
                  <>
                    <Button
                      onClick={() => {
                        SwalAlertAllConfiguration({
                          title:
                            "Bạn có chắc muốn khôi phục các tài liệu này không?",
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
                              docList.filter(
                                (item) => item?.isDeleted === true
                              ) &&
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
                                fileListUpLoad.filter(
                                  (e) => e?.uid !== file?.id
                                )
                              );
                              if (!Helper.isNullOrUndefined(file?.id)) {
                                new Api()
                                  .restore_document({
                                    token: JSON.parse(
                                      sessionStorage.getItem(SESSION_STORAGE)
                                    )?.access_token,
                                    id: file?.id,
                                  })
                                  .then(() => {
                                    setDocRestoreList([]);
                                    getMeetingDocument(scheduleId);
                                  });
                              }
                              if (i + 1 === docRestoreList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Khôi phục thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            });
                          } else {
                            return false;
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i class="fas fa-trash-restore info"></i> Khôi phục
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
                              docList.filter(
                                (item) => item?.isDeleted === true
                              ) &&
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
                                fileListUpLoad.filter(
                                  (e) => e?.uid !== file?.id
                                )
                              );
                              if (!Helper.isNullOrUndefined(file?.id)) {
                                new Api()
                                  .delete_document({
                                    token: JSON.parse(
                                      sessionStorage.getItem(SESSION_STORAGE)
                                    )?.access_token,
                                    id: file?.id,
                                  })
                                  .then(() => {
                                    setDocRestoreList([]);
                                    getMeetingDocument(scheduleId);
                                  });
                                new Api().Delete_file_bucket({
                                  token: JSON.parse(
                                    sessionStorage.getItem(SESSION_STORAGE)
                                  )?.access_token,
                                  objectName: file?.url + "/" + file?.name,
                                });
                              }
                              if (i + 1 === docRestoreList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Xóa thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            });
                          } else {
                            return false;
                          }
                        });
                      }}
                      className="btn-default"
                      title="Xóa vĩnh viễn"
                    >
                      <i class="fas fa-times danger"></i> Xóa
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
                                fileListUpLoad.filter(
                                  (e) => e?.uid !== file?.id
                                )
                              );
                              if (!Helper.isNullOrUndefined(file?.id)) {
                                new Api()
                                  .remove_document({
                                    token: JSON.parse(
                                      sessionStorage.getItem(SESSION_STORAGE)
                                    )?.access_token,
                                    id: file?.id,
                                  })
                                  .then(() => {
                                    setDocDeleteList([]);
                                    getMeetingDocument(scheduleId);
                                  });
                              }
                              if (i + 1 === docDeleteList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Xóa thành công",
                                  icon: "success",
                                  timer: 1500,
                                });
                              }
                            });
                          } else {
                            return false;
                          }
                        });
                      }}
                      className="btn-default"
                    >
                      <i class="fas fa-trash-alt danger"></i> Xóa
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
                                    setDocDeleteList([]);
                                    getMeetingDocument(scheduleId);
                                  });
                                // xóa phần từ
                                // contentList.splice(
                                //   contentList
                                //     .map((item) => item.key)
                                //     .indexOf(contentDeleteList[index]),
                                //   1
                                // );

                                if (index + 1 === docDeleteList.length) {
                                  SwalAlertAllConfiguration({
                                    title: "Gửi duyệt thành công",
                                    icon: "success",
                                    timer: 1500,
                                  });
                                }
                              }
                            }
                          });
                        }
                      }}
                      className="btn-info"
                    >
                      <i class="fas fa-check info"></i> Gửi duyệt
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
                                if (index + 1 === docSendList.length) {
                                  SwalAlertAllConfiguration({
                                    title: "Hủy gửi duyệt thành công",
                                    icon: "success",
                                    timer: 1500,
                                  });
                                }
                              }
                            }
                          });
                        }
                      }}
                      className="btn-default"
                    >
                      <i class="fas fa-ban danger"></i> Hủy gửi duyệt
                    </Button>
                  </>
                )}
              </Col>
            )}
            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                // tabPosition={"left"}
                items={[
                  {
                    label: `Danh sách tài liệu`,
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
                                  {"Tên file: " + record?.originalName}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                  }}
                                >
                                  {"Kích thước: " + record?.size + " bytes"}
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
                                  {"Người tạo: " +
                                    record?.user?.ten_day_du +
                                    " - " +
                                    record?.user?.ten_dangnhap}
                                </p>
                                <p
                                  style={{
                                    margin: 0,
                                  }}
                                >
                                  {"Thời gian: " + record?.modifiedDate}
                                </p>
                              </>
                            ),
                          }}
                          columns={[
                            {
                              title: "Tên tài liệu",
                              dataIndex: "title",
                              render: (e, record) => (
                                <>
                                  {meetingData?.schedule?.status !== 3 ? (
                                    <RenderTitle e={e} record={record} />
                                  ) : (
                                    e
                                  )}
                                </>
                              ),
                            },
                            {
                              title: "Chọn",
                              dataIndex: "tailieu",
                              render: (e, record) => {
                                return (
                                  <>
                                    {!record?.isDocumentType &&
                                      record?.url &&
                                      record?.originalName && (
                                        <>
                                          {record?.originalName
                                            ?.toLowerCase()
                                            ?.includes("pdf") && (
                                            <>
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
                                                        fileName:
                                                          record?.originalName,
                                                        isdownload: false,
                                                      })
                                                      .then((e) => {
                                                        // return window.open(e?.data, "_blank");
                                                        // return setLink(e?.data);
                                                      });
                                                  }
                                                }}
                                              >
                                                <i className="fas fa-eye info"></i>{" "}
                                                {window.innerWidth > 992 &&
                                                  "Xem"}
                                              </a>{" "}
                                            </>
                                          )}
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
                                                    fileName:
                                                      record?.originalName,
                                                    isdownload: true,
                                                  })
                                                  .then((e) => {
                                                    // return window.open(e?.data, "_blank");
                                                    // return setLink(e?.data);
                                                  });
                                              }
                                            }}
                                          >
                                            <i className="fas fa-download info"></i>{" "}
                                            {window.innerWidth > 992 &&
                                              "Tải về"}
                                          </a>
                                        </>
                                      )}
                                    {/* <a
                                      href
                                      onClick={() => {
                                        //console.log("Kiểm tra");
                                        //console.log(record);
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
                                      {record?.originalName
                                        ?.toLowerCase()
                                        ?.includes("pdf") ||
                                      record?.originalName
                                        ?.toLowerCase()
                                        ?.includes("docx") ? (
                                        <>
                                          <i className="fas fa-eye info"></i>{" "}
                                          Xem
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-download info"></i>{" "}
                                          Tải về
                                        </>
                                      )}
                                    </a> */}
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
                ]}
              />
            </Col>
          </Row>
        ) : (
          <>
            <Button
              type="info"
              onClick={() => {
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
                      {"Tên file: " + record?.originalName}
                    </p>
                    <p
                      style={{
                        margin: 0,
                      }}
                    >
                      {"Kích thước: " + record?.size + " bytes"}
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
                      {"Người tạo: " +
                        record?.user?.ten_day_du +
                        " - " +
                        record?.user?.ten_dangnhap}
                    </p>
                    <p
                      style={{
                        margin: 0,
                      }}
                    >
                      {"Thời gian: " + record?.modifiedDate}
                    </p>
                  </>
                ),
              }}
              columns={[
                {
                  title: "Tên tài liệu",
                  dataIndex: "title",
                  // render: (e, record) => {
                  //   return (
                  //     <span
                  //       style={{ cursor: "pointer" }}
                  //     >
                  //       {record?.originalName}
                  //     </span>
                  //   );
                  // },
                },
                {
                  title: "Chọn",
                  dataIndex: "tailieu",
                  render: (e, record) => {
                    return (
                      <>
                        {!record?.isDocumentType &&
                          record?.url &&
                          record?.originalName && (
                            <>
                              {record?.originalName
                                ?.toLowerCase()
                                ?.includes("pdf") && (
                                <>
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
                                            isdownload: false,
                                          })
                                          .then((e) => {
                                            // return window.open(e?.data, "_blank");
                                            // return setLink(e?.data);
                                          });
                                      }
                                    }}
                                  >
                                    <i className="fas fa-eye info"></i>{" "}
                                    {window.innerWidth > 992 && "Xem"}
                                  </a>{" "}
                                </>
                              )}
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
                                        isdownload: true,
                                      })
                                      .then((e) => {
                                        // return window.open(e?.data, "_blank");
                                        // return setLink(e?.data);
                                      });
                                  }
                                }}
                              >
                                <i className="fas fa-download info"></i>{" "}
                                {window.innerWidth > 992 && "Tải về"}
                              </a>
                            </>
                          )}
                        {/* <a
                          href
                          onClick={() => {
                            if (record?.url) {
                              new Api()
                                .Get_link_download({
                                  objectKey:
                                    record?.url + "/" + record?.originalName,
                                  fileName: record?.originalName,
                                })
                                .then((e) => {
                                  // return window.open(e?.data, "_blank");
                                  // return setLink(e?.data);
                                });
                            }
                          }}
                        >
                          {record?.originalName
                            ?.toLowerCase()
                            ?.includes("pdf") ||
                          record?.originalName
                            ?.toLowerCase()
                            ?.includes("docx") ? (
                            <>
                              <i className="fas fa-eye info"></i> Xem
                            </>
                          ) : (
                            <>
                              <i className="fas fa-download info"></i> Tải về
                            </>
                          )}
                        </a> */}
                      </>
                    );
                  },
                },
              ]}
              dataSource={
                docList?.length > 0 &&
                docList.filter(
                  (item) => item?.isDeleted === false && item?.createdBy > 0
                )
              }
            />
          </>
        )}
      </Card>
    </div>
  );
}

const RenderTitle = ({ e, record, showModal }) => {
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
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
            setError("");
          }
        }}
        onPressEnter={(e) => {
          if (Helper.isNullOrUndefined(e.target.value)) {
            return setError("Không được để trống");
          }
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
          setError("");
        }}
        // onClick={showModal}
      />
      {!Helper.isNullOrUndefined(warning) && (
        <Alert message={warning} type="warning" showIcon closable />
      )}
      {!Helper.isNullOrUndefined(error) && (
        <Alert message={error} type="error" showIcon />
      )}
    </>
  );
};
