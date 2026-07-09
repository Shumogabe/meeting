import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function Schedule({
  title,
  errorSchedule,
  setTitle,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  content,
  setContent,
  server,
  optionsMeetingServer,
  setServer,
  type,
  optionsMeetingType,
  setType,
  place,
  setPlace,
  roomName,
  setRoomName,
  errorRoomName,
  setErrorRoomName,
}) {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Tiêu đề</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">{title}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Thời gian</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-6">
              {"Từ: " + (startTime && startTime.format("DD/MM/YYYY HH:mm:ss"))}
            </div>
            <div className="col-md-6">
              {"Đến: " + (endTime && endTime.format("DD/MM/YYYY HH:mm:ss"))}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>Nội dung</label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <div
            className="editor"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>
      {roomName ? (
        <div className="row form-group">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <label className="mt-1">Máy chủ</label>
              </div>
              <div className="col-md">{server?.title}</div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <label className="mt-1">Địa điểm</label>
              </div>
              <div className="col-md">{place}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <label className="mt-1">Tên phòng họp</label>
              </div>
              <div className="col-md">{roomName}</div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <label className="mt-1">Loại hình cuộc họp</label>
              </div>
              <div className="col-md">{type?.title}</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <label>Địa điểm</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <div className="col-md">{place}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
