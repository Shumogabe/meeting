import React from "react";
import moment from "moment";
import { SwalAlertAllConfiguration } from "../../../../../../components/Swal";
// import { Button } from "antd";

export default function ThongTin({ meetingData, onHandleCheckRoom }) {
  return (
    <>
      {/* <Button
        className="btn-default"
        style={{
          marginRight: 16,
        }}
        onClick={() => {
          onHandleCheckRoom();
        }}
      >
        <i class="fas fa-sync-alt info"></i> Tải lại
      </Button> */}
      <div className="row form-group">
        <div className="col-md-2">
          <label>Tên cuộc họp</label>
        </div>
        <div className="col-md">{meetingData?.schedule?.title}</div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Tên phòng họp trực tuyến</label>
        </div>
        <div className="col-md">
          {meetingData?.schedule?.roomName
            ? meetingData?.schedule?.roomName
            : meetingData?.schedule?.title}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Thời gian bắt đầu</label>
        </div>
        <div className="col-md">
          {moment(meetingData?.schedule?.startTime).format(
            "DD-MM-YYYY, hh:mm A"
          )}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Thời gian kết thúc</label>
        </div>
        <div className="col-md">
          {moment(meetingData?.schedule?.endTime).format("DD-MM-YYYY, hh:mm A")}
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Nội dung cuộc họp</label>
        </div>
        <div
          className="col-md"
          style={{ maxHeight: "45vh", overflow: "auto" }}
          dangerouslySetInnerHTML={{
            __html: meetingData?.schedule.content,
          }}
        ></div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Địa điểm phòng họp</label>
        </div>
        <div className="col-md">{meetingData?.schedule?.place}</div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <label>Đường dẫn phòng họp trực tuyến</label>
        </div>
        <div className="col-md">
          {/* {window.location.origin +
        "/hop-truc-tuyen/phong-hop/" +
        meetingData?.schedule?.roomName} */}
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="roomLink"
              placeholder="Url"
              disabled
              defaultValue={
                window.location.origin +
                "/hop-truc-tuyen/phong-hop/" +
                meetingData?.schedule?.roomName
              }
              value={
                window.location.origin +
                "/hop-truc-tuyen/phong-hop/" +
                meetingData?.schedule?.roomName
              }
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.origin +
                      "/hop-truc-tuyen/phong-hop/" +
                      meetingData?.schedule?.roomName
                  );
                  SwalAlertAllConfiguration({
                    title: "Sao chép đường dẫn thành công",
                    text: "",
                    icon: "success",
                  });
                }}
              >
                Sao chép
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
