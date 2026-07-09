import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Alert, Button, Input, Table, Tabs, Upload } from "antd";
import Api from "../../../../api";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import { CLIENT_ID, SESSION_STORAGE } from "../../../../config";
import MyEditor from "../../../../helper/ckeditor";
import Helper from "../../../../helper/helper";
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
            x?.name.endsWith(".zip") ||
            x?.name.endsWith(".rar")
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
      console.log(file);
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

  useEffect(() => {
    setFileListUpLoad([]);
  }, [scheduleId]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          getConslusionBySchedule("", scheduleId);
        }}
        loading={uploading}
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
            label: `Danh sách đang cập nhật`,
            key: 1,
            children: (
              <>
                <Search
                  placeholder="Nhập tiêu đề tìm kiếm"
                  onSearch={(value) => {
                    console.log(value);
                    getConslusionBySchedule(value, scheduleId);
                  }}
                  enterButton
                />
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        console.log(record);
                        setSelect(record);
                        setButton("Sửa");
                        setConslusionTitle(record?.title);
                        setConslusionContent(record?.content);
                      },
                    };
                  }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        </>
                        <Upload
                          name="file"
                          defaultFileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                          fileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                        ></Upload>
                      </>
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
                      (item) => item?.isDeleted === false && item?.status === 0
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
                    console.log(value);
                    getConslusionBySchedule(value, scheduleId);
                  }}
                  enterButton
                />
                <Table
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
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
                                      // return window.open(e?.data, "_blank");
                                      // return setLink(e?.data);
                                    });
                                }
                              }}
                            >
                              {record.originalName}
                            </a>
                          </p>
                        </>
                        <Upload
                          name="file"
                          defaultFileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                          fileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                        ></Upload>
                      </>
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
                      (item) => item?.isDeleted === false && item?.status === 1
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
                    console.log(value);
                    getConslusionBySchedule(value, scheduleId);
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
                        <Upload
                          name="file"
                          defaultFileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                          fileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                        ></Upload>
                      </>
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
                      (item) => item?.isDeleted === false && item?.status === 2
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
                    console.log(value);
                    getConslusionBySchedule(value, scheduleId);
                  }}
                  enterButton
                />
                <Table
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
                        <Upload
                          name="file"
                          defaultFileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                          fileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                        ></Upload>
                      </>
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
                      (item) => item?.isDeleted === false && item?.status === 3
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
                    console.log(value);
                    getConslusionBySchedule(value, scheduleId);
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
                        <Upload
                          name="file"
                          defaultFileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                          fileList={
                            docListConslusion &&
                            docListConslusion.map((obj) => {
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
                            })
                          }
                        ></Upload>
                      </>
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
                    conslusionList.filter((item) => item?.isDeleted === true)
                  }
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
}
