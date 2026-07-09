import React, { useEffect, useState } from "react";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import UploadFile, { handleUpload } from "../../../components/Upload";

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
      <Button
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
      </Button>{" "}
      <Button
        type="primary"
        onClick={() => {
          handleUpload(
            fileListUpLoad,
            setFileListUpLoad,
            "sukien/" + scheduleId,
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
      </Button>
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
            };
          })
        }
        onRemove={RemoveDocument}
      />
    </>
  );
}
