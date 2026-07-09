import React, { useEffect } from "react";
import UploadFile, { handleUpload } from "../../../components/Upload";

export default function Document({
  RemoveDocument,
  docList,
  setDocList,
  user,
  getMeetingDocument,
  scheduleId,
  isUpload,
  fileListUpLoad,
  setFileListUpLoad,
  uploading,
  setUploading,
  openEdit,
  dungLuongToiDaTepTaiLen,
}) {
  useEffect(() => {
    if (scheduleId) {
      setFileListUpLoad([]);
    }
  }, [scheduleId]);

  useEffect(() => {
    if (isUpload === true) {
      handleUpload(
        fileListUpLoad,
        setFileListUpLoad,
        "kehoach",
        setUploading,
        docList,
        scheduleId,
        user,
        getMeetingDocument
      );
      getMeetingDocument(scheduleId);
    }
  }, [isUpload]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <label>Tải file lên</label>
          <br />
        </div>
      </div>
      {/* <Button
        type="primary"
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
      </Button>{" "} */}
      {/* <Button
        type="primary"
        onClick={() => {
          handleUpload(
            fileListUpLoad,
            setFileListUpLoad,
            "kehoach",
            setUploading,
            docList,
            scheduleId,
            user,
            getMeetingDocument
          );
        }}
        disabled={fileListUpLoad.length === 0}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
        icon={<CloudUploadOutlined />}
      >
        {uploading ? "Đang tải lên" : "Tải lên"}
      </Button> */}
      <UploadFile
        setFieldValue={setDocList}
        fileListUpLoad={fileListUpLoad}
        setFileListUpLoad={setFileListUpLoad}
        setDefaultFileList={setDocList}
        defaultFileList={
          docList &&
          docList.map((obj) => {
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
              isDeleted: obj?.isDeleted,
            };
          })
        }
        onRemove={RemoveDocument}
        dungLuongToiDaTepTaiLen={dungLuongToiDaTepTaiLen}
      />
    </>
  );
}
