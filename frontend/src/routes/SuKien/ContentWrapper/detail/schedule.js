import React from "react";
import { Button, DatePicker, Input } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import ReactSelect from "react-select";
import MyEditor from "../../../../helper/ckeditor";
import { range } from "../../../../helper/datetime";
import Helper from "../../../../helper/helper";
import { HREF } from "../../../../constants/dictionaries";
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
  onWrite,
  onHandleCancel,
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
            <div className="col-md-12">
              {/* {JSON.stringify(startTime)} */}
              {moment(startTime).format("DD/MM/YYYY HH:mm") +
                " - " +
                moment(endTime).format("DD/MM/YYYY HH:mm")}
              {/* <RangePicker
                allowClear={[true, true]}
                size="large"
                style={{ width: "100%" }}
                placeholder={["Từ", "Đến"]}
                showTime={{
                  format: "HH:mm",
                  hideDisabledOptions: true,
                }}
                defaultValue={[startTime, endTime]}
                value={[startTime, endTime]}
                disabledDate={(current) => {
                  // Can not select days before today and today
                  return current && current < moment().startOf("day");
                }}
                disabledTime={(current, type) => {
                  if (type === "start") {
                    return {
                      disabledHours: () =>
                        dayjs.isDayjs(current) &&
                        current.format("DD/MM/YYYY") ===
                          moment().format("DD/MM/YYYY")
                          ? range(0, Number(moment().format("HH")))
                          : [],
                      disabledMinutes: () =>
                        dayjs.isDayjs(current) &&
                        current.format("DD/MM/YYYY") ===
                          moment().format("DD/MM/YYYY") &&
                        current.format("HH") === moment().format("HH")
                          ? range(0, Number(moment().format("mm")))
                          : [],
                      // disabledSeconds: () =>
                      //   dayjs.isDayjs(current) &&
                      //   current.format("DD/MM/YYYY") ===
                      //     moment().format("DD/MM/YYYY") &&
                      //   current.format("HH") === moment().format("HH") &&
                      //   current.format("mm") === moment().format("mm")
                      //     ? range(0, Number(moment().format("ss")))
                      //     : [],
                    };
                  }
                  if (type === "end") {
                    return {
                      disabledHours: () =>
                        dayjs.isDayjs(current) &&
                        current.format("DD/MM/YYYY") ===
                          moment().format("DD/MM/YYYY")
                          ? range(0, Number(moment().format("HH")))
                          : [],
                      disabledMinutes: () =>
                        dayjs.isDayjs(current) &&
                        current.format("DD/MM/YYYY") ===
                          moment().format("DD/MM/YYYY") &&
                        current.format("HH") === moment().format("HH")
                          ? range(0, Number(moment().format("mm")))
                          : [],
                      // disabledSeconds: () =>
                      //   dayjs.isDayjs(current) &&
                      //   current.format("DD/MM/YYYY") ===
                      //     moment().format("DD/MM/YYYY") &&
                      //   current.format("HH") === moment().format("HH") &&
                      //   current.format("mm") === moment().format("mm")
                      //     ? range(0, Number(moment().format("ss")))
                      //     : [],
                    };
                  }
                }}
                format="DD/MM/YYYY HH:mm"
                dateFormat="DD/MM/YYYY HH:mm"
                onChange={(dates, dateString) => {
                  if (dates) {
                    setStartTime(dates[0]); //dates[0] ? dates[0]?.valueOf() : null, //.format('YYYY-MM-DDTHH:mm:ss')
                    setEndTime(dates[1]); //dates[1] ? dates[1]?.valueOf() : null //.format('YYYY-MM-DDTHH:mm:ss')
                  } else {
                    setStartTime(null); //dates[0] ? dates[0]?.valueOf() : null, //.format('YYYY-MM-DDTHH:mm:ss')
                    setEndTime(null); //dates[1] ? dates[1]?.valueOf() : null //.format('YYYY-MM-DDTHH:mm:ss')
                  }
                }}
              /> */}
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
          <span
            style={{ margin: 0 }}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          ></span>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <div className="row form-group">
            <div className="col-md-12">
              <label className="mt-1">Máy chủ</label>
            </div>
            <div className="col-md">
              {!Helper.isNullOrUndefined(server)
                ? server?.title
                : !Helper.isNullOrUndefined(optionsMeetingServer[0])
                ? optionsMeetingServer[0]?.title
                : null}
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <label className="mt-1">Địa điểm</label>
            </div>
            <div className="col-md">{place}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row form-group">
            <div className="col-md-12">
              <label className="mt-1">Tên phòng họp</label>
            </div>
            <div className="col-md">{roomName}</div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <label className="mt-1">Loại hình cuộc họp</label>
            </div>
            <div className="col-md">
              {window.location.pathname.startsWith(HREF.SuKien) &&
              !Helper.isNullOrUndefined(type)
                ? type?.title
                : !Helper.isNullOrUndefined(optionsMeetingType[0])
                ? optionsMeetingType[0]?.title
                : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
