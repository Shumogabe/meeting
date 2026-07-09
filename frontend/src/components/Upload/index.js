import React, { useState } from "react";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, Button, Upload } from "antd";
import Api from "../../api";
import { CLIENT_ID, SESSION_STORAGE } from "../../config";
import Helper from "../../helper/helper";
import { SwalAlertAllConfiguration } from "../Swal";
import { HREF } from "../../constants/dictionaries";

export const handleUpload = (
  fileList,
  setFileListUpLoad,
  filePath,
  setUploading,
  docList,
  scheduleId,
  user,
  getMeetingDocument,
  content
) => {
  if (fileList.length > 0) {
    const formData = new FormData();
    fileList?.forEach((file) => {
      formData.append("files", file);
    });
    setUploading(true);
    // Append each selected file to the FormData object
    // console.log(fileList);
    //console.log(filePath);
    // console.log(docList);
    // return false;
    // You can use any AJAX library you like
    new Api()
      .Upload_files_to_bucket({
        // token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
        filePath: filePath,
        formData: formData,
      })
      .then(() => {
        setFileListUpLoad([]);
        // return SwalAlertAllConfiguration({
        //   title: "Tải tài liệu lên thành công",
        //   icon: "success",
        // });
      })
      .catch(() => {
        setUploading(false);
        // return SwalAlertAllConfiguration({
        //   title: "Tải tài liệu lên thất bại",
        //   icon: "error",
        // });
      })
      .finally(() => {
        setUploading(false);
        // setFileListUpLoad([]);
        // getMeetingDocument(scheduleId);
        // return SwalAlertAllConfiguration({
        //   title: "Tải tài liệu lên thành công",
        //   icon: "success",
        // });
      });
  }
  //Bổ sung điều kiện kiểm tra url
  //Nếu url là họp trực tuyến
  if (
    window.location.pathname.startsWith(HREF.HopTrucTuyen) &&
    !filePath.includes("traodoichiasetailieu/")
  ) {
    docList &&
      docList.map((item, index) =>
        new Api()
          .create_meeting_document_with_approve({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              title: item.uid,
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
          .then(() => {
            getMeetingDocument(scheduleId);
          })
      );
  } else {
    if (docList?.length === 0 && filePath?.includes("traodoichiasetailieu/")) {
      if (
        Helper.isNullOrUndefined(
          JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
        )
      ) {
        new Api()
          .create_meeting_chat_without({
            data: {
              content: content,
              scheduleId: scheduleId,
              url: filePath,
              originalName: null,
              systemName: null,
              type: null,
              size: 0,
              status: 2,
              createdDate: new Date(),
              createdBy: !Helper.isNullOrUndefined(user?.id) ? user?.id : 0,
            },
          })
          .then(() => {
            getMeetingDocument(scheduleId);
          });
      } else {
        new Api()
          .create_meeting_chat({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              content: content,
              scheduleId: scheduleId,
              url: filePath,
              originalName: null,
              systemName: null,
              type: null,
              size: 0,
              status: 2,
              createdDate: new Date(),
              createdBy: !Helper.isNullOrUndefined(user?.id) ? user?.id : 0,
            },
          })
          .then(() => {
            getMeetingDocument(scheduleId);
          });
      }
    }
    docList &&
      docList?.map((item, index) =>
        filePath?.includes("traodoichiasetailieu/")
          ? Helper.isNullOrUndefined(
              JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
            )
            ? new Api()
                .create_meeting_chat_without({
                  data: {
                    content: content,
                    scheduleId: scheduleId,
                    url: filePath,
                    originalName: item.name,
                    systemName: item.uid,
                    type: item.type,
                    size: item.size,
                    status: 2,
                    createdDate: item.lastModifiedDate,
                    createdBy: !Helper.isNullOrUndefined(user?.id)
                      ? user?.id
                      : 0,
                  },
                })
                .then(() => {
                  getMeetingDocument(scheduleId);
                })
            : new Api()
                .create_meeting_chat({
                  token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                    ?.access_token,
                  data: {
                    content: content,
                    scheduleId: scheduleId,
                    url: filePath,
                    originalName: item.name,
                    systemName: item.uid,
                    type: item.type,
                    size: item.size,
                    status: 2,
                    createdDate: item.lastModifiedDate,
                    createdBy: !Helper.isNullOrUndefined(user?.id)
                      ? user?.id
                      : 0,
                  },
                })
                .then(() => {
                  getMeetingDocument(scheduleId);
                })
          : Helper.isNullOrUndefined(
              JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
            )
          ? new Api()
              .create_meeting_document_without({
                data: {
                  title: item.uid,
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
              .then(() => {
                getMeetingDocument(scheduleId);
              })
          : new Api()
              .create_meeting_document({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
                data: {
                  title: item.uid,
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
              .then(() => {
                getMeetingDocument(scheduleId);
              })
      );
  }
};

const UploadFile = ({
  setFieldValue,
  fileListUpLoad,
  setFileListUpLoad,
  defaultFileList,
  setDefaultFileList,
  setLink,
  onUpload,
  accept,
  children,
  dungLuongToiDaTepTaiLen,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const props = {
    name: "file",
    multiple: true,
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
            new Api().delete_document({
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
      // const isValidType = [
      //   "application/pdf",
      //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      //   "application/msword",
      //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //   "application/vnd.ms-excel",
      //   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      //   "application/x-rar-compressed",
      //   "application/zip",
      //   "text/plain",
      // ].includes(file.type);
      // if (!isValidType) {
      //   message.error(
      //     "Các định dạng cho phép tải lên: docx | txt | doc | xlsx | xls | pptx | pdf | rar | zip!"
      //   );
      // }
      // return isValidType;
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
        if (Number(dungLuongToiDaTepTaiLen) > 0) {
          fileListFilter = info?.fileList?.filter(
            (x) => x?.size < Number(dungLuongToiDaTepTaiLen)
          );
        }
        if (fileListFilter.map((file) => file.uid).includes(info.file.uid)) {
          fileListUpLoad.push(info.file);
        }
        //
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
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Chọn tài liệu</Button>
        {children}
        <br />
        <i style={{ color: "red" }}>
          Các định dạng cho phép tải lên: docx | txt | doc | xlsx | xls | pptx |
          pdf | rar | zip
          <br />
          Tệp không được lớn hơn {dungLuongToiDaTepTaiLen} bytes
        </i>
      </Upload>
    </>
  );
};
export default UploadFile;
