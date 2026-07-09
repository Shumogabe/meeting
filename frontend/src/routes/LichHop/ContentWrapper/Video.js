import React, { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Input, Row, Table, Tabs } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";
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
      {/* <div className="row">
        <div className="col-md-12">
          <label>Tải file lên</label>
          <br />
        </div>
      </div> */}
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
          {/* <Button
            type="primary"
            onClick={() => {
              upFile(
                fileListUpLoad,
                "ghihinhcuochop/" + scheduleId,
                videoPostList,
                scheduleId,
                user,
                "ghihinhcuochop/" + scheduleId
              );
              setVideoPostList([]);
            }}
            disabled={fileListUpLoad.length === 0}
            loading={uploading}
            style={{
              marginTop: 16,
            }}
            icon={<CloudUploadOutlined />}
          >
            {uploading ? "Đang tải lên" : "Tải lên"}
          </Button>{" "} */}
        </Col>
        <Col span={12}>
          {/* <UploadFile
            accept={"video/*"}
            setFieldValue={setVideoPostList}
            fileListUpLoad={fileListUpLoad}
            setFileListUpLoad={setFileListUpLoad}
            setDefaultFileList={setVideoPostList}
            defaultFileList={
              videoPostList &&
              videoPostList.map((obj) => {
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
          /> */}
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
                    {videoDeleteList?.length > 0 && (
                      <Button
                        onClick={() => {
                          SwalAlertAllConfiguration({
                            title:
                              "Bạn có chắc muốn xóa các tài liệu này không?",
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
                                videoList &&
                                videoList.map((obj) => {
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
                              videoDeleteList.map((file, i) => {
                                const index = defaultFileList.indexOf(file);
                                const newFileList = defaultFileList.slice();
                                newFileList.splice(index, 1);
                                setVideoList(newFileList);
                                setFileListUpLoad(
                                  fileListUpLoad.filter(
                                    (e) => e?.uid !== file?.id
                                  )
                                );
                                if (!Helper.isNullOrUndefined(file?.id)) {
                                  new Api().remove_video({
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
                                getMeetingVideo("", scheduleId);
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
                    )}
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
                      rowSelection={{
                        selectedRowKeys: videoDeleteList.map((x) => x.key),
                        onChange: (selectedRowKeys, selectedRows) => {
                          setVideoDeleteList(selectedRows);
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
                    {videoRestoreList?.length > 0 && (
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
                                  videoList.filter(
                                    (item) => item?.isDeleted === true
                                  ) &&
                                  videoList
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
                                videoRestoreList.map((file, i) => {
                                  const index = defaultFileList.indexOf(file);
                                  const newFileList = defaultFileList.slice();
                                  newFileList.splice(index, 1);
                                  setVideoList(newFileList);
                                  setFileListUpLoad(
                                    fileListUpLoad.filter(
                                      (e) => e?.uid !== file?.id
                                    )
                                  );
                                  if (!Helper.isNullOrUndefined(file?.id)) {
                                    new Api().restore_video({
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
                                  getMeetingVideo("", scheduleId);
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
                                  videoList.filter(
                                    (item) => item?.isDeleted === true
                                  ) &&
                                  videoList
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
                                videoRestoreList.map((file, i) => {
                                  const index = defaultFileList.indexOf(file);
                                  const newFileList = defaultFileList.slice();
                                  newFileList.splice(index, 1);
                                  setVideoList(newFileList);
                                  setFileListUpLoad(
                                    fileListUpLoad.filter(
                                      (e) => e?.uid !== file?.id
                                    )
                                  );
                                  if (!Helper.isNullOrUndefined(file?.id)) {
                                    new Api().delete_video({
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
                                  getMeetingVideo("", scheduleId);
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
                      rowSelection={{
                        selectedRowKeys: videoRestoreList.map((x) => x.key),
                        onChange: (selectedRowKeys, selectedRows) => {
                          setVideoRestoreList(selectedRows);
                          // docRestoreList.filter(
                          //   (item) => selectedRows.indexOf(item) !== 1
                          // );
                          // for (let i = 0; i < selectedRows.length; i++) {
                          //   if (docRestoreList[i] !== selectedRows[i]) {
                          //     return;
                          //   }
                          // }
                          // docRestoreList.map((e,i)=>{
                          //   if(selectedRows.filter((item)=>item.id === e.id).length === 0){
                          //     docRestoreList.push()
                          //   }
                          // })
                          // selectedRows.map((e, i) => {
                          //   if (
                          //     docRestoreList.length > 0 &&
                          //     docRestoreList.filter((item) => item.id === e.id)
                          //       .length === 0
                          //   ) {
                          //     setDocRestoreList([...docRestoreList, e]);
                          //   }
                          // });
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

const RenderTitle = ({ e, record }) => {
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
          new Api().update_meeting_video({
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
