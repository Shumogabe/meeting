import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Alert, Button, Input, Table, Tabs, Upload } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { CLIENT_ID, SESSION_STORAGE } from "../../../config";
import MyEditor from "../../../helper/ckeditor";
import Helper from "../../../helper/helper";
const { Search } = Input;

const UploadFileConslusion = ({
  setFieldValue,
  fileListUpLoad,
  setFileListUpLoad,
  defaultFileList,
  setDefaultFileList,
  setLink,
  onUpload,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const props = {
    name: "file",
    multiple: false,
    action: "https://" + CLIENT_ID + "/api/upload",
    accept: ".docx,.txt,.doc,.xlsx,.xls,.pptx,.pdf,.rar,.zip",
    onRemove: (file) =>
      // if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      //   // Ok
      //   const index = fileList.indexOf(file);
      //   const newFileList = fileList.slice();
      //   newFileList.splice(index, 1);
      //   setFileList(newFileList);
      // } else {
      //   // Cancel
      //   return false;
      // }
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn xóa tài liệu không?",
        text: "Khi bạn nhấn 'Đồng ý' tài liệu '" + file.name + "' sẽ bị xóa!",
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
          const index = defaultFileList.indexOf(file);
          const newFileList = defaultFileList.slice();
          newFileList.splice(index, 1);
          setDefaultFileList(newFileList);
          setFileListUpLoad(fileListUpLoad.filter((e) => e?.uid !== file?.uid));
          if (!Helper.isNullOrUndefined(file?.id)) {
            new Api().remove_document({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: file?.id,
            });
            new Api().Delete_file_bucket({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              objectName: file?.url + "/" + file?.name,
            });
          }
          SwalAlertAllConfiguration({
            title: "Xóa thành công",
            icon: "success",
            timer: 1500,
          });
        } else {
          return false;
        }
      }),
    beforeUpload: (file) => {
      return false;
    },
    onChange: (info) => {
      if (info.file.status !== "uploading") {
        // alert(JSON.stringify(info?.fileList));
        // alert(JSON.stringify(defaultFileList));

        // setFileListUpLoad([]);
        // setDefaultFileList([]);
        // fileListUpLoad.splice(0, fileListUpLoad.length);
        // defaultFileList.splice(0, defaultFileList.length);
        info?.fileList.splice(0, defaultFileList.length);

        const isValidType = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/x-rar-compressed",
          "application/zip",
          "text/plain",
        ];
        //
        var fileListFilter = info?.fileList?.filter(
          (x) =>
            isValidType.includes(x?.type) ||
            x?.name?.endsWith(".zip") ||
            x?.name?.endsWith(".rar")
        );
        if (fileListFilter.map((file) => file.uid).includes(info.file.uid)) {
          fileListUpLoad.push(info.file);
        }
        //
        // fileListUpLoad.push(info.file);
        setDefaultFileList(fileListFilter);
        setFieldValue(fileListFilter);
      }
    },
    defaultFileList,
    fileList: defaultFileList,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined style={{ color: "red" }} title="Xóa" />,
    },
    onPreview: (file) => {
      //console.log(file);
      if (file?.url) {
        new Api()
          .Get_link_download({
            objectKey: file?.url + "/" + file?.name,
            fileName: file?.name,
          })
          .then((e) => {
            // return window.open(e?.data, "_blank");
            // return setLink(e?.data);
          });
      }
    },
  };
  return (
    <>
      {error && <Alert message={error} type="error" />}
      <i style={{ color: "red" }}>
        Các định dạng cho phép tải lên: docx | txt | doc | xlsx | xls | pptx |
        pdf | rar | zip
      </i>
      <br />
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Chọn tài liệu</Button>
      </Upload>
    </>
  );
};
export default function Conslusion({
  conslusionList,
  setConslusionList,
  conslusionTitle,
  setConslusionTitle,
  conslusionContent,
  setConslusionContent,
  conslusionStatus,
  setConslusionStatus,
  errorConslusion,
  setErrorConslusion,
  docConslusion,
  setDocConslusion,
  docListConslusion,
  setDocListConslusion,
  docPostListConslusion,
  setDocPostListConslusion,
  docDeleteListConslusion,
  setDocDeleteListConslusion,
  scheduleId,
  user,
  getMeetingDocumentConslusion,
  getConslusionBySchedule,
  conslusionDeleteList,
  setConslusionDeleteList,
  conslusionRestoreList,
  setConslusionRestoreList,
  conslusionSendList,
  setConslusionSendList,
}) {
  const [button, setButton] = useState("Thêm mới");
  const [select, setSelect] = useState(null);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [errorSearch, setErrorSearch] = useState("");

  useEffect(() => {
    setFileListUpLoad([]);
  }, [scheduleId]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-md-8">
          <Tabs
            defaultActiveKey="1"
            // tabPosition={"left"}
            items={[
              {
                label: `Danh sách đang cập nhật`,
                key: 1,
                children: (
                  <>
                    <Search
                      placeholder="Nhập tiêu đề tìm kiếm"
                      onSearch={(value) => {
                        if (Helper.isNullOrUndefined(value)) {
                          setErrorSearch("Vui lòng nhập nội dung tìm kiếm");
                        } else {
                          setErrorSearch("");
                          //console.log(value);
                          getConslusionBySchedule(value, scheduleId);
                        }
                      }}
                      enterButton
                    />
                    <i style={{ color: "red" }}>{errorSearch}</i>
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            //console.log(record);
                            setSelect(record);
                            setButton("Sửa");
                            setConslusionTitle(record?.title);
                            setConslusionContent(record?.content);
                            setConslusionStatus(record?.status);
                            setDocListConslusion([
                              {
                                uid: record?.uid ? record?.uid : record?.title,
                                id: record?.id,
                                lastModifiedDate: record?.lastModifiedDate
                                  ? record?.lastModifiedDate
                                  : record?.createdDate,
                                name: record?.originalName
                                  ? record?.originalName
                                  : record?.name,
                                size: record?.size,
                                type: record?.type,
                                status: "done",
                                url: record?.url,
                              },
                            ]);
                          },
                        };
                      }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <p
                            style={{
                              backgroundColor: "#d9d9d9",
                              borderRadius: "5px",
                            }}
                          >
                            <i class="fas fa-download info"></i>{" "}
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        ),
                      }}
                      rowSelection={{
                        selectedRowKeys: conslusionDeleteList,
                        onChange: (selectedRowKeys, selectedRows) => {
                          setConslusionDeleteList(selectedRowKeys);
                        },
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (text) => <>{text}</>,
                        },
                        {
                          title: "Nội dung",
                          dataIndex: "content",
                          render: (_, record) => (
                            <p
                              style={{ margin: 0 }}
                              dangerouslySetInnerHTML={{
                                __html: record.content,
                              }}
                            ></p>
                          ),
                        },
                      ]}
                      dataSource={
                        conslusionList?.length > 0 &&
                        conslusionList.filter(
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
                    <Search
                      placeholder="Nhập tiêu đề tìm kiếm"
                      onSearch={(value) => {
                        if (Helper.isNullOrUndefined(value)) {
                          setErrorSearch("Vui lòng nhập nội dung tìm kiếm");
                        } else {
                          setErrorSearch("");
                          //console.log(value);
                          getConslusionBySchedule(value, scheduleId);
                        }
                      }}
                      enterButton
                    />
                    <i style={{ color: "red" }}>{errorSearch}</i>
                    <Table
                      expandable={{
                        expandedRowRender: (record) => (
                          <p
                            style={{
                              backgroundColor: "#d9d9d9",
                              borderRadius: "5px",
                            }}
                          >
                            <i class="fas fa-download info"></i>{" "}
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        ),
                      }}
                      rowSelection={{
                        selectedRowKeys: conslusionSendList,
                        onChange: (selectedRowKeys, selectedRows) => {
                          setConslusionSendList(selectedRowKeys);
                        },
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (text) => <>{text}</>,
                        },
                        {
                          title: "Nội dung",
                          dataIndex: "content",
                          render: (_, record) => (
                            <p
                              style={{ margin: 0 }}
                              dangerouslySetInnerHTML={{
                                __html: record.content,
                              }}
                            ></p>
                          ),
                        },
                      ]}
                      dataSource={
                        conslusionList?.length > 0 &&
                        conslusionList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 1
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: "Danh sách đã duyệt",
                key: 3,
                children: (
                  <>
                    <Search
                      placeholder="Nhập tiêu đề tìm kiếm"
                      onSearch={(value) => {
                        if (Helper.isNullOrUndefined(value)) {
                          setErrorSearch("Vui lòng nhập nội dung tìm kiếm");
                        } else {
                          setErrorSearch("");
                          //console.log(value);
                          getConslusionBySchedule(value, scheduleId);
                        }
                      }}
                      enterButton
                    />
                    <i style={{ color: "red" }}>{errorSearch}</i>
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <p
                            style={{
                              backgroundColor: "#d9d9d9",
                              borderRadius: "5px",
                            }}
                          >
                            <i class="fas fa-download info"></i>{" "}
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        ),
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (text) => <>{text}</>,
                        },
                        {
                          title: "Nội dung",
                          dataIndex: "content",
                          render: (_, record) => (
                            <p
                              style={{ margin: 0 }}
                              dangerouslySetInnerHTML={{
                                __html: record.content,
                              }}
                            ></p>
                          ),
                        },
                      ]}
                      dataSource={
                        conslusionList?.length > 0 &&
                        conslusionList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 2
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: "Danh sách từ chối",
                key: 4,
                children: (
                  <>
                    <Search
                      placeholder="Nhập tiêu đề tìm kiếm"
                      onSearch={(value) => {
                        if (Helper.isNullOrUndefined(value)) {
                          setErrorSearch("Vui lòng nhập nội dung tìm kiếm");
                        } else {
                          setErrorSearch("");
                          //console.log(value);
                          getConslusionBySchedule(value, scheduleId);
                        }
                      }}
                      enterButton
                    />
                    <i style={{ color: "red" }}>{errorSearch}</i>
                    <Table
                      expandable={{
                        expandedRowRender: (record) => (
                          <p
                            style={{
                              backgroundColor: "#d9d9d9",
                              borderRadius: "5px",
                            }}
                          >
                            <i class="fas fa-download info"></i>{" "}
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        ),
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (text) => <>{text}</>,
                        },
                        {
                          title: "Nội dung",
                          dataIndex: "content",
                          render: (_, record) => (
                            <p
                              style={{ margin: 0 }}
                              dangerouslySetInnerHTML={{
                                __html: record.content,
                              }}
                            ></p>
                          ),
                        },
                      ]}
                      dataSource={
                        conslusionList?.length > 0 &&
                        conslusionList.filter(
                          (item) =>
                            item?.isDeleted === false && item?.status === 3
                        )
                      }
                    />
                  </>
                ),
              },
              {
                label: "Danh sách đã xóa",
                key: 5,
                children: (
                  <>
                    <Search
                      placeholder="Nhập tiêu đề tìm kiếm"
                      onSearch={(value) => {
                        if (Helper.isNullOrUndefined(value)) {
                          setErrorSearch("Vui lòng nhập nội dung tìm kiếm");
                        } else {
                          setErrorSearch("");
                          //console.log(value);
                          getConslusionBySchedule(value, scheduleId);
                        }
                      }}
                      enterButton
                    />
                    <i style={{ color: "red" }}>{errorSearch}</i>
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      expandable={{
                        expandedRowRender: (record) => (
                          <p
                            style={{
                              backgroundColor: "#d9d9d9",
                              borderRadius: "5px",
                            }}
                          >
                            <i class="fas fa-download info"></i>{" "}
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        ),
                      }}
                      rowSelection={{
                        selectedRowKeys: conslusionRestoreList,
                        onChange: (selectedRowKeys, selectedRows) => {
                          setConslusionRestoreList(selectedRowKeys);
                        },
                      }}
                      columns={[
                        {
                          title: "Tiêu đề",
                          dataIndex: "title",
                          render: (text) => <>{text}</>,
                        },
                        {
                          title: "Nội dung",
                          dataIndex: "content",
                          render: (_, record) => (
                            <p
                              style={{ margin: 0 }}
                              dangerouslySetInnerHTML={{
                                __html: record.content,
                              }}
                            ></p>
                          ),
                        },
                      ]}
                      dataSource={
                        conslusionList?.length > 0 &&
                        conslusionList.filter(
                          (item) => item?.isDeleted === true
                        )
                      }
                    />
                  </>
                ),
              },
            ]}
          />
        </div>
        <div className="col-md-4">
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">
                Tiêu đề
                <b className="text-danger">(*)</b>{" "}
                {Helper.isNullOrUndefined(conslusionTitle) &&
                  errorConslusion && (
                    <b>
                      <i className="text-danger">Chưa có tiêu đề</i>
                    </b>
                  )}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <Input
                placeholder="Nhập tiêu đề"
                size="large"
                // style={{ width: '100%' }}
                defaultValue={conslusionTitle}
                value={conslusionTitle}
                onChange={(e) => {
                  setConslusionTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">
                Nội dung
                <b className="text-danger">(*)</b>{" "}
                {Helper.isNullOrUndefined(conslusionContent) &&
                  errorConslusion && (
                    <b>
                      <i className="text-danger">Chưa có nội dung</i>
                    </b>
                  )}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <MyEditor
                handleChange={(data) => {
                  setConslusionContent(data);
                }}
                data={conslusionContent}
                // {...state}
              />
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <UploadFileConslusion
                setFieldValue={setDocListConslusion}
                fileListUpLoad={fileListUpLoad}
                setFileListUpLoad={setFileListUpLoad}
                setDefaultFileList={setDocListConslusion}
                defaultFileList={
                  docListConslusion &&
                  docListConslusion.map((obj) => {
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
              />
            </div>
          </div>

          <div className="button-list">
            <Button
              onClick={() => {
                getConslusionBySchedule("", scheduleId);
              }}
              loading={uploading}
              style={{
                marginTop: 16,
              }}
            >
              <i class="fas fa-sync-alt info"></i> Tải lại
            </Button>{" "}
            {button === "Sửa" && (
              <Button
                className="btn-default"
                onClick={() => {
                  setSelect(null);
                  setButton("Thêm mới");
                  setConslusionTitle(null);
                  setConslusionContent("");
                }}
              >
                <i class="fas fa-sync-alt info"></i> Làm mới
              </Button>
            )}
            <Button
              onClick={() => {
                if (Helper.isNullOrUndefined(conslusionTitle))
                  return setErrorConslusion(true);
                if (Helper.isNullOrUndefined(conslusionContent))
                  return setErrorConslusion(true);
                if (button === "Thêm mới") {
                  const formData = new FormData();
                  fileListUpLoad.forEach((file) => {
                    formData.append("files", file);
                  });
                  docListConslusion?.length > 0 &&
                    new Api()
                      .Upload_files_to_bucket({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        filePath: "ketluan/" + scheduleId,
                        formData: formData,
                      })
                      .then(() => {
                        setUploading(false);
                        setFileListUpLoad([]);
                        getMeetingDocumentConslusion(scheduleId);
                        // return SwalAlertAllConfiguration({
                        //   title: "Tải tài liệu lên thành công",
                        //   icon: "success",
                        // });
                      });
                  docListConslusion?.length > 0
                    ? docListConslusion.map((item, index) =>
                        new Api()
                          .create_meeting_Conslusion({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            data: {
                              title:
                                conslusionTitle + " - " + Number(index + 1),
                              content: conslusionContent,
                              scheduleId: scheduleId,
                              url: "ketluan/" + scheduleId,
                              originalName: item.name,
                              systemName: item.uid,
                              type: item.type,
                              size: item.size,
                              status: 0,
                              createdDate: item.lastModifiedDate,
                              createdBy: !Helper.isNullOrUndefined(user?.id)
                                ? user?.id
                                : 0,
                            },
                          })
                          .then((e) => {
                            if (e) {
                              setErrorConslusion(false);
                              setConslusionTitle(null);
                              setConslusionContent("");
                              setDocListConslusion([]);
                              setSelect(null);
                              setButton("Thêm mới");
                              getConslusionBySchedule("", scheduleId);
                            }
                            if (index + 1 === docListConslusion.length) {
                              SwalAlertAllConfiguration({
                                title: "Thông báo",
                                text: "Thêm mới thành công",
                                timer: 2000,
                                icon: "success",
                              });
                            }
                          })
                      )
                    : new Api()
                        .create_meeting_Conslusion({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          data: {
                            title: conslusionTitle,
                            content: conslusionContent,
                            scheduleId: scheduleId,
                            url: "",
                            originalName: "",
                            systemName: "",
                            type: "",
                            size: 0,
                            status: 0,
                            createdDate: new Date(),
                            createdBy: !Helper.isNullOrUndefined(user?.id)
                              ? user?.id
                              : 0,
                          },
                        })
                        .then((e) => {
                          if (e) {
                            setErrorConslusion(false);
                            setConslusionTitle(null);
                            setConslusionContent("");
                            setDocListConslusion([]);
                            setSelect(null);
                            setButton("Thêm mới");
                            getConslusionBySchedule("", scheduleId);
                            SwalAlertAllConfiguration({
                              title: "Thông báo",
                              text: "Thêm mới thành công",
                              timer: 2000,
                              icon: "success",
                            });
                          }
                        });
                }
                if (button === "Sửa") {
                  const formData = new FormData();
                  fileListUpLoad.forEach((file) => {
                    formData.append("files", file);
                  });
                  docListConslusion?.length > 0 &&
                    new Api()
                      .Upload_files_to_bucket({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        filePath: "ketluan/" + scheduleId,
                        formData: formData,
                      })
                      .then(() => {
                        setUploading(false);
                        setFileListUpLoad([]);
                        getMeetingDocumentConslusion(scheduleId);
                        // return SwalAlertAllConfiguration({
                        //   title: "Tải tài liệu lên thành công",
                        //   icon: "success",
                        // });
                      });
                  docListConslusion?.length > 0
                    ? docListConslusion.map((item, index) =>
                        new Api()
                          .update_meeting_Conslusion({
                            token: JSON.parse(
                              sessionStorage.getItem(SESSION_STORAGE)
                            )?.access_token,
                            id: select?.id,
                            data: {
                              title: conslusionTitle,
                              content: conslusionContent,
                              scheduleId: scheduleId,
                              url: "ketluan/" + scheduleId,
                              originalName: item.name,
                              systemName: item.uid,
                              type: item.type,
                              size: item.size,
                              status: conslusionStatus,
                              modifiedDate: new Date(),
                              modifiedBy: user?.id,
                            },
                          })
                          .then((e) => {
                            if (e) {
                              getConslusionBySchedule("", scheduleId);
                              setErrorConslusion(false);
                              setConslusionTitle(null);
                              setConslusionContent("");
                              setDocListConslusion([]);
                              setSelect(null);
                              setButton("Thêm mới");
                            }
                            if (index + 1 === docListConslusion.length) {
                              SwalAlertAllConfiguration({
                                title: "Thông báo",
                                text: "Sửa thành công",
                                timer: 2000,
                                icon: "success",
                              });
                            }
                          })
                      )
                    : new Api()
                        .update_meeting_Conslusion({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: select?.id,
                          data: {
                            title: conslusionTitle,
                            content: conslusionContent,
                            scheduleId: scheduleId,
                            url: "",
                            originalName: "",
                            systemName: "",
                            type: "",
                            size: 0,
                            status: conslusionStatus,
                            modifiedDate: new Date(),
                            modifiedBy: user?.id,
                          },
                        })
                        .then((e) => {
                          if (e) {
                            setErrorConslusion(false);
                            setConslusionTitle(null);
                            setConslusionContent("");
                            setDocListConslusion([]);
                            setSelect(null);
                            setButton("Thêm mới");
                            getConslusionBySchedule("", scheduleId);
                            SwalAlertAllConfiguration({
                              title: "Thông báo",
                              text: "Sửa thành công",
                              timer: 2000,
                              icon: "success",
                            });
                          }
                        });
                }
              }}
            >
              {button}
            </Button>
            {conslusionDeleteList?.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    //console.log(conslusionDeleteList);
                    if (conslusionDeleteList?.length > 0) {
                      SwalAlertAllConfiguration({
                        title: "Bạn có chắc muốn xóa không?",
                        text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa!",
                        icon: "warning",
                        showCancelButton: true,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Thoát",
                        dangerMode: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          for (
                            let index = 0;
                            index < conslusionDeleteList.length;
                            index++
                          ) {
                            new Api()
                              .remove_meeting_Conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionDeleteList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setErrorConslusion(false);
                                  setConslusionDeleteList([]);
                                  getConslusionBySchedule("", scheduleId);
                                  SwalAlertAllConfiguration({
                                    title: "Thông báo",
                                    text: "Xóa thành công",
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
                  className="btn-default"
                >
                  <i class="fas fa-trash-alt danger"></i> Xóa
                </Button>
                <Button
                  onClick={() => {
                    //console.log(conslusionDeleteList);
                    if (conslusionDeleteList?.length > 0) {
                      SwalAlertAllConfiguration({
                        title: "Bạn có chắc muốn gửi duyệt không?",
                        text: "Khi bạn nhấn 'Đồng ý' sẽ gửi!",
                        icon: "warning",
                        showCancelButton: true,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Thoát",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          for (
                            let index = 0;
                            index < conslusionDeleteList.length;
                            index++
                          ) {
                            new Api()
                              .sendapprove_meeting_conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionDeleteList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setErrorConslusion(false);
                                  setConslusionDeleteList([]);
                                  getConslusionBySchedule("", scheduleId);
                                  SwalAlertAllConfiguration({
                                    title: "Thông báo",
                                    text: "Gửi duyệt thành công",
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
                          // setErrorConslusion(false);
                          // setConslusionDeleteList([]);
                          // getConslusionBySchedule("", scheduleId);
                          // SwalAlertAllConfiguration({
                          //   title: "Thông báo",
                          //   text: "Gửi duyệt thành công",
                          //   timer: 2000,
                          //   icon: "success",
                          // });
                        }
                      });
                    }
                  }}
                  className="btn-default"
                >
                  <i class="fas fa-check info"></i> Gửi duyệt
                </Button>
              </>
            )}
            {conslusionRestoreList?.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    //console.log(conslusionRestoreList);
                    if (conslusionRestoreList?.length > 0) {
                      SwalAlertAllConfiguration({
                        title: "Bạn có chắc muốn khôi phục không?",
                        text: "Khi bạn nhấn 'Đồng ý' sẽ được khôi phục!",
                        icon: "warning",
                        showCancelButton: true,
                        showLoaderOnConfirm: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Thoát",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          for (
                            let index = 0;
                            index < conslusionRestoreList.length;
                            index++
                          ) {
                            new Api()
                              .restore_meeting_Conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionRestoreList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setErrorConslusion(false);
                                  setConslusionRestoreList([]);
                                  getConslusionBySchedule("", scheduleId);
                                  SwalAlertAllConfiguration({
                                    title: "Thông báo",
                                    text: "Khôi phục thành công",
                                    timer: 2000,
                                    icon: "success",
                                  });
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
                  className="btn-default"
                >
                  <i class="fas fa-trash-restore info"></i> Khôi phục
                </Button>
                <Button
                  onClick={() => {
                    //console.log(conslusionRestoreList);
                    if (conslusionRestoreList?.length > 0) {
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
                            index < conslusionRestoreList.length;
                            index++
                          ) {
                            new Api()
                              .delete_meeting_Conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionRestoreList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setErrorConslusion(false);
                                  setConslusionRestoreList([]);
                                  getConslusionBySchedule("", scheduleId);
                                  SwalAlertAllConfiguration({
                                    title: "Thông báo",
                                    text: "Xóa thành công",
                                    timer: 2000,
                                    icon: "success",
                                  });
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
                  className="btn-default"
                >
                  <i class="fas fa-times danger"></i> Xóa
                </Button>
              </>
            )}
            {conslusionSendList?.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    //console.log(conslusionSendList);
                    if (conslusionSendList?.length > 0) {
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
                            index < conslusionSendList.length;
                            index++
                          ) {
                            new Api()
                              .unsendapprove_meeting_conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionSendList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setErrorConslusion(false);
                                  setConslusionSendList([]);
                                  getConslusionBySchedule("", scheduleId);
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
                  className="btn-default"
                >
                  <i class="fas fa-ban danger"></i> Hủy gửi duyệt
                </Button>
              </>
            )}
            {errorConslusion && (
              <b>
                <i className="text-danger">{errorConslusion}</i>
              </b>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
