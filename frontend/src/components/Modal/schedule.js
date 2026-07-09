import React, { useState } from "react";
import { DatePicker, Input } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import ReactSelect from "react-select";
import MyEditor from "../../helper/ckeditor";
import { range } from "../../helper/datetime";
import Helper from "../../helper/helper";
import { HREF } from "../../constants/dictionaries";
import CustomSwitch from "../Switch";
import Api from "../../api";
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
  optionsMeetingServerDefault,
  setServer,
  place,
  setPlace,
  roomName,
  setRoomName,
  setErrorRoomName,
  errorRoomName,
  type,
  optionsMeetingType,
  setType,
}) {
  const [roomname, setRoomname] = useState("");
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Tên cuộc họp
                <b className="text-danger">(*)</b>{" "}
                {Helper.isNullOrUndefined(title) && errorSchedule && (
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
                style={{ width: "100%" }}
                defaultValue={title}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Thời gian
                <b className="text-danger">(*)</b>{" "}
                {(Helper.isNullOrUndefined(startTime) ||
                  Helper.isNullOrUndefined(endTime)) &&
                  errorSchedule && (
                    <b>
                      <i className="text-danger">Chưa có thời gian</i>
                    </b>
                  )}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <RangePicker
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
                // disabledDate={(current) => {
                //   // Can not select days before today and today
                //   return current && current < moment().startOf("day");
                // }}
                // disabledTime={(current, type) => {
                //   if (type === "start") {
                //     return {
                //       disabledHours: () =>
                //         dayjs.isDayjs(current) &&
                //         current.format("DD/MM/YYYY") ===
                //           moment().format("DD/MM/YYYY")
                //           ? range(0, Number(moment().format("HH")))
                //           : [],
                //       disabledMinutes: () =>
                //         dayjs.isDayjs(current) &&
                //         current.format("DD/MM/YYYY") ===
                //           moment().format("DD/MM/YYYY") &&
                //         current.format("HH") === moment().format("HH")
                //           ? range(0, Number(moment().format("mm")))
                //           : [],
                //       // disabledSeconds: () =>
                //       //   dayjs.isDayjs(current) &&
                //       //   current.format("DD/MM/YYYY") ===
                //       //     moment().format("DD/MM/YYYY") &&
                //       //   current.format("HH") === moment().format("HH") &&
                //       //   current.format("mm") === moment().format("mm")
                //       //     ? range(0, Number(moment().format("ss")))
                //       //     : [],
                //     };
                //   }
                //   if (type === "end") {
                //     return {
                //       disabledHours: () =>
                //         dayjs.isDayjs(current) &&
                //         current.format("DD/MM/YYYY") ===
                //           moment().format("DD/MM/YYYY")
                //           ? range(0, Number(moment().format("HH")))
                //           : [],
                //       disabledMinutes: () =>
                //         dayjs.isDayjs(current) &&
                //         current.format("DD/MM/YYYY") ===
                //           moment().format("DD/MM/YYYY") &&
                //         current.format("HH") === moment().format("HH")
                //           ? range(0, Number(moment().format("mm")))
                //           : [],
                //       // disabledSeconds: () =>
                //       //   dayjs.isDayjs(current) &&
                //       //   current.format("DD/MM/YYYY") ===
                //       //     moment().format("DD/MM/YYYY") &&
                //       //   current.format("HH") === moment().format("HH") &&
                //       //   current.format("mm") === moment().format("mm")
                //       //     ? range(0, Number(moment().format("ss")))
                //       //     : [],
                //     };
                //   }
                // }}
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
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>
            Nội dung cuộc họp
            <b className="text-danger">(*)</b>{" "}
            {Helper.isNullOrUndefined(content) && errorSchedule && (
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
              setContent(data);
            }}
            data={content}
            // {...state}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">
                Máy chủ
                <b className="text-danger">(*)</b>{" "}
                {Helper.isNullOrUndefined(server) && errorSchedule && (
                  <b>
                    <i className="text-danger">Chưa chọn máy chủ</i>
                  </b>
                )}
              </label>
            </div>
            <div className="col-md">
              {!Helper.isNullOrUndefined(optionsMeetingServer) && (
                <ReactSelect
                  name="server"
                  placeholder="-- Chọn máy chủ --"
                  isClearable={true}
                  isSearchable={true}
                  options={optionsMeetingServer}
                  defaultValue={
                    !Helper.isNullOrUndefined(optionsMeetingServerDefault)
                      ? optionsMeetingServerDefault
                      : null
                  }
                  getOptionLabel={({ title }) => title}
                  getOptionValue={({ id }) => id}
                  onChange={(server) => {
                    setServer(server);
                  }}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">Địa điểm phòng họp</label>
            </div>
            <div className="col-md">
              <Input
                placeholder="Nhập địa điểm họp"
                size="large"
                style={{ width: "100%" }}
                defaultValue={place}
                value={place}
                onChange={(e) => {
                  setPlace(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">
                Tên phòng họp trực tuyến
                <b className="text-danger">(*)</b>
                {Helper.isNullOrUndefined(roomName) && errorSchedule && (
                  <b>
                    <i className="text-danger">Chưa có tên phòng họp</i>
                  </b>
                )}
              </label>
              <span className="mt-1" style={{ float: "right" }}>
                Tạo tự động
                <CustomSwitch
                  defaultChecked={false}
                  onChange={(e) => {
                    if (e && Helper.isNullOrUndefined(roomname)) {
                      new Api().get_RoomName().then((e) => {
                        setRoomname(e?.data);
                        setRoomName(e?.data);
                      });
                    } else if (e && !Helper.isNullOrUndefined(roomname)) {
                      setRoomName(roomname);
                    } else {
                      setRoomName("");
                    }
                  }}
                />
              </span>
            </div>
            <div className="col-md">
              <Input
                placeholder="Nhập tên phòng họp"
                size="large"
                style={{ width: "100%" }}
                defaultValue={roomName}
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setErrorRoomName(false);
                }}
              />
            </div>
            {errorRoomName && (
              <div className="alert alert-danger" role="alert">
                Tên phòng họp không được chứ các kí tự khoảng trắng, dấu câu và
                kí tự đặc biệt
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">
                Loại hình cuộc họp
                <b className="text-danger">(*)</b>{" "}
                {Helper.isNullOrUndefined(type) && errorSchedule && (
                  <b>
                    <i className="text-danger">Chưa có loại hình cuộc họp</i>
                  </b>
                )}
              </label>
            </div>
            <div className="col-md">
              {!Helper.isNullOrUndefined(optionsMeetingType) && (
                <>
                  {window.location.pathname.startsWith(HREF.SuKien) ? (
                    <ReactSelect
                      name="type"
                      placeholder="-- Chọn loại hình cuộc họp --"
                      isClearable={true}
                      isSearchable={true}
                      getOptionLabel={({ title }) => title}
                      getOptionValue={({ id }) => id}
                      options={optionsMeetingType}
                      isDisabled={window.location.pathname.startsWith(
                        HREF.SuKien
                      )}
                      defaultValue={
                        !Helper.isNullOrUndefined(optionsMeetingType[0])
                          ? optionsMeetingType[0]
                          : null
                      }
                      value={optionsMeetingType[3]}
                      onChange={(type) => {
                        setType(type);
                      }}
                    />
                  ) : (
                    <ReactSelect
                      name="type"
                      placeholder="-- Chọn loại hình cuộc họp --"
                      isClearable={true}
                      isSearchable={true}
                      getOptionLabel={({ title }) => title}
                      getOptionValue={({ id }) => id}
                      options={optionsMeetingType}
                      isDisabled={window.location.pathname.startsWith(
                        HREF.SuKien
                      )}
                      defaultValue={
                        !Helper.isNullOrUndefined(optionsMeetingType[0])
                          ? optionsMeetingType[0]
                          : null
                      }
                      onChange={(type) => {
                        setType(type);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
