import React, { useEffect, useState } from "react";
import moment from "moment";
import Api from "../../../../../../api";
import Helper from "../../../../../../helper/helper";

export default function KeHoach({ meetingData }) {
  const [docList, setDocList] = useState([]);
  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "kehoach/" + id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((response) => {
        if (response?.data) {
          setDocList(
            response?.data.filter((item) => item?.isDeleted === false)
          );
        }
      });
  };

  useEffect(() => {
    if (!Helper.isNullOrUndefined(meetingData)) {
      getMeetingDocument(meetingData?.plan?.id);
    }
  }, [meetingData]);

  return (
    <>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Tiêu đề</label>
        </div>
        <div className="col-md-10">{meetingData?.schedule?.title}</div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Bắt đầu</label>
        </div>
        <div className="col-md-10">
          {moment(meetingData?.schedule?.startTime).format(
            "DD-MM-YYYY, hh:mm A"
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Kết thúc</label>
        </div>
        <div className="col-md-10">
          {moment(meetingData?.schedule?.endTime).format("DD-MM-YYYY, hh:mm A")}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Nội dung</label>
        </div>
        <div
          className="col-md-10"
          style={{ maxHeight: "45vh", overflow: "auto" }}
          dangerouslySetInnerHTML={{
            __html: meetingData?.schedule.content,
          }}
        ></div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Địa điểm</label>
        </div>
        <div className="col-md-10">{meetingData?.schedule?.place}</div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Tài liệu kế hoạch</label>
        </div>
        {docList?.length > 0 &&
          docList
            .filter((item) => item?.isDeleted === false)
            .map((e, i) => (
              <p
                style={{
                  backgroundColor: "#d9d9d9",
                  borderRadius: "5px",
                }}
              >
                <a
                  href
                  onClick={() => {
                    if (e?.url) {
                      new Api()
                        .Get_link_download({
                          objectKey: e?.url + "/" + e?.originalName,
                          fileName: e?.originalName,
                        })
                        .then((e) => {
                          // return window.open(e?.data, "_blank");
                          // return setLink(e?.data);
                        });
                    }
                  }}
                >
                  {e.originalName}
                </a>
              </p>
            ))}
      </div>
    </>
  );
}
