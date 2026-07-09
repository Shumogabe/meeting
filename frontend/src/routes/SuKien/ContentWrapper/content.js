import React, { useState } from "react";
import { Button, DatePicker, Input, Table } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import ReactSelect from "react-select";
import Api from "../../../api";
import { SESSION_STORAGE } from "../../../config";
import MyEditor from "../../../helper/ckeditor";
import { range } from "../../../helper/datetime";
import Helper from "../../../helper/helper";
const { RangePicker } = DatePicker;

export default function Content({
  startTime,
  endTime,
  contentTitle,
  errorContent,
  setContentTitle,
  contentStartTime,
  contentEndTime,
  setContentStartTime,
  setContentEndTime,
  contentPresenter,
  contentPresenterOptions,
  setContentPresenter,
  GetList_User,
  setErrorContent,
  contentContent,
  setContentList,
  user,
  contentList,
  setContentPresenterOptions,
  setContentContent,
  contentDeleteList,
  setContentDeleteList,
  sortedType,
  setSortedInfo,
  setSortedType,
  sortedInfo,
  roomName,
  pass,
  getContentBySchedule,
  scheduleId,
}) {
  const [button, setButton] = useState("Thêm mới");
  const [select, setSelect] = useState(null);
  return (
    <>
      {!dayjs.isDayjs(startTime) || !dayjs.isDayjs(endTime) ? (
        <b>
          <i className="text-danger">
            Vui lòng chọn thời gian lịch họp trong{" "}
            <span
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() =>
                document.getElementById("calendar-setting-form-tab").click()
              }
            >
              "THÔNG TIN LỊCH"
            </span>{" "}
            trước khi thêm chương trình họp
          </i>
        </b>
      ) : (
        <div className="row mb-2">
          <div className="col-md-6">
            <div className="row form-group">
              <div className="col-md-12">
                <label className="mt-1">
                  Tiêu đề
                  <b className="text-danger">(*)</b>{" "}
                  {Helper.isNullOrUndefined(contentTitle) && errorContent && (
                    <b>
                      <i className="text-danger">Chưa có tiêu đề</i>
                    </b>
                  )}
                </label>
              </div>
              <div className="col-md">
                <Input
                  placeholder="Nhập tiêu đề"
                  size="large"
                  // style={{ width: '100%' }}
                  defaultValue={contentTitle}
                  value={contentTitle}
                  onChange={(e) => {
                    setContentTitle(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label className="mt-1">
                  Thời gian
                  <b className="text-danger">(*)</b>{" "}
                  {(Helper.isNullOrUndefined(contentStartTime) ||
                    Helper.isNullOrUndefined(contentEndTime)) &&
                    errorContent && (
                      <b>
                        <i className="text-danger">Chưa có thời gian</i>
                      </b>
                    )}
                </label>
              </div>
              <div className="col-md">
                <RangePicker
                  allowClear={[true, true]}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder={["Từ", "Đến"]}
                  showTime={{
                    format: "HH:mm",
                    hideDisabledOptions: true,
                  }}
                  defaultPickerValue={[
                    dayjs.isDayjs(startTime) ? startTime : null,
                    dayjs.isDayjs(endTime) ? endTime : null,
                  ]}
                  defaultValue={[contentStartTime, contentEndTime]}
                  value={[contentStartTime, contentEndTime]}
                  disabledDate={(current) => {
                    return (
                      current < startTime.startOf("day") ||
                      current > endTime.endOf("day")
                    );
                  }}
                  disabledTime={(current, type) => {
                    if (type === "start") {
                      return {
                        disabledHours: () =>
                          dayjs.isDayjs(current) &&
                          current.format("DD/MM/YYYY") ===
                            startTime.format("DD/MM/YYYY") &&
                          current.format("DD/MM/YYYY") ===
                            endTime.format("DD/MM/YYYY")
                            ? range(0, Number(endTime.format("HH"))).concat(
                                range(Number(endTime.format("HH")) + 1, 24)
                              )
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                startTime.format("DD/MM/YYYY")
                            ? range(0, Number(startTime.format("HH")))
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                endTime.format("DD/MM/YYYY")
                            ? range(Number(endTime.format("HH")) + 1, 24)
                            : [],
                        disabledMinutes: () =>
                          dayjs.isDayjs(current) &&
                          current.format("DD/MM/YYYY") ===
                            startTime.format("DD/MM/YYYY") &&
                          current.format("HH") === startTime.format("HH") &&
                          current.format("DD/MM/YYYY") ===
                            endTime.format("DD/MM/YYYY") &&
                          current.format("HH") === endTime.format("HH")
                            ? range(0, Number(startTime.format("mm"))).concat(
                                range(Number(endTime.format("mm")) + 1, 60)
                              )
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                startTime.format("DD/MM/YYYY") &&
                              current.format("HH") === startTime.format("HH")
                            ? range(0, Number(startTime.format("mm")))
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                endTime.format("DD/MM/YYYY") &&
                              current.format("HH") === endTime.format("HH")
                            ? range(Number(endTime.format("mm")) + 1, 60)
                            : [],
                        // disabledSeconds: () =>
                        //   dayjs.isDayjs(current) &&
                        //   current.format("DD/MM/YYYY") ===
                        //     startTime.format("DD/MM/YYYY") &&
                        //   current.format("HH") === startTime.format("HH") &&
                        //   current.format("mm") === startTime.format("mm") &&
                        //   current.format("DD/MM/YYYY") ===
                        //     endTime.format("DD/MM/YYYY") &&
                        //   current.format("HH") === endTime.format("HH") &&
                        //   current.format("mm") === endTime.format("mm")
                        //     ? range(0, Number(startTime.format("ss"))).concat(
                        //         range(Number(endTime.format("ss")) + 1, 60)
                        //       )
                        //     : dayjs.isDayjs(current) &&
                        //       current.format("DD/MM/YYYY") ===
                        //         startTime.format("DD/MM/YYYY") &&
                        //       current.format("HH") === startTime.format("HH") &&
                        //       current.format("mm") === startTime.format("mm")
                        //     ? range(0, Number(startTime.format("ss")))
                        //     : dayjs.isDayjs(current) &&
                        //       current.format("DD/MM/YYYY") ===
                        //         endTime.format("DD/MM/YYYY") &&
                        //       current.format("HH") === endTime.format("HH") &&
                        //       current.format("mm") === endTime.format("mm")
                        //     ? range(Number(endTime.format("ss")) + 1, 60)
                        //     : [],
                      };
                    }
                    if (type === "end") {
                      return {
                        disabledHours: () =>
                          dayjs.isDayjs(current) &&
                          current.format("DD/MM/YYYY") ===
                            startTime.format("DD/MM/YYYY") &&
                          current.format("DD/MM/YYYY") ===
                            endTime.format("DD/MM/YYYY")
                            ? range(0, Number(endTime.format("HH"))).concat(
                                range(Number(endTime.format("HH")) + 1, 24)
                              )
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                startTime.format("DD/MM/YYYY")
                            ? range(0, Number(startTime.format("HH")))
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                endTime.format("DD/MM/YYYY")
                            ? range(Number(endTime.format("HH")) + 1, 24)
                            : [],
                        disabledMinutes: () =>
                          dayjs.isDayjs(current) &&
                          current.format("DD/MM/YYYY") ===
                            startTime.format("DD/MM/YYYY") &&
                          current.format("HH") === startTime.format("HH") &&
                          current.format("DD/MM/YYYY") ===
                            endTime.format("DD/MM/YYYY") &&
                          current.format("HH") === endTime.format("HH")
                            ? range(0, Number(startTime.format("mm"))).concat(
                                range(Number(endTime.format("mm")) + 1, 60)
                              )
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                startTime.format("DD/MM/YYYY") &&
                              current.format("HH") === startTime.format("HH")
                            ? range(0, Number(startTime.format("mm")))
                            : dayjs.isDayjs(current) &&
                              current.format("DD/MM/YYYY") ===
                                endTime.format("DD/MM/YYYY") &&
                              current.format("HH") === endTime.format("HH")
                            ? range(Number(endTime.format("mm")) + 1, 60)
                            : [],
                        // disabledSeconds: () =>
                        //   dayjs.isDayjs(current) &&
                        //   current.format("DD/MM/YYYY") ===
                        //     startTime.format("DD/MM/YYYY") &&
                        //   current.format("HH") === startTime.format("HH") &&
                        //   current.format("mm") === startTime.format("mm") &&
                        //   current.format("DD/MM/YYYY") ===
                        //     endTime.format("DD/MM/YYYY") &&
                        //   current.format("HH") === endTime.format("HH") &&
                        //   current.format("mm") === endTime.format("mm")
                        //     ? range(0, Number(startTime.format("ss"))).concat(
                        //         range(Number(endTime.format("ss")) + 1, 60)
                        //       )
                        //     : dayjs.isDayjs(current) &&
                        //       current.format("DD/MM/YYYY") ===
                        //         startTime.format("DD/MM/YYYY") &&
                        //       current.format("HH") === startTime.format("HH") &&
                        //       current.format("mm") === startTime.format("mm")
                        //     ? range(0, Number(startTime.format("ss")))
                        //     : dayjs.isDayjs(current) &&
                        //       current.format("DD/MM/YYYY") ===
                        //         endTime.format("DD/MM/YYYY") &&
                        //       current.format("HH") === endTime.format("HH") &&
                        //       current.format("mm") === endTime.format("mm")
                        //     ? range(Number(endTime.format("ss")) + 1, 60)
                        //     : [],
                      };
                    }
                  }}
                  format="DD/MM/YYYY HH:mm"
                  dateFormat="DD/MM/YYYY HH:mm"
                  onChange={(dates, dateString) => {
                    if (dates) {
                      setContentStartTime(dates[0]); //dates[0] ? dates[0]?.valueOf() : null,
                      setContentEndTime(dates[1]); //dates[1] ? dates[1]?.valueOf() : null
                    } else {
                      setContentStartTime(null); //dates[0] ? dates[0]?.valueOf() : null,
                      setContentEndTime(null); //dates[1] ? dates[1]?.valueOf() : null
                    }
                  }}
                />
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-12">
                <label className="mt-1">
                  Người thuyết trình
                  {/* <b className="text-danger">(*)</b>{" "}
                  {Helper.isNullOrUndefined(contentPresenter) &&
                    errorContent && (
                      <b>
                        <i className="text-danger">
                          Chưa có người thuyết trình
                        </i>
                      </b>
                    )} */}
                </label>
              </div>
              <div className="col-md">
                <ReactSelect
                  name="chairMan"
                  placeholder="- Chọn -"
                  isClearable={true}
                  isSearchable={true}
                  options={contentPresenterOptions}
                  defaultValue={
                    !Helper.isNullOrUndefined(contentPresenter)
                      ? contentPresenter
                      : null
                  }
                  value={
                    !Helper.isNullOrUndefined(contentPresenter)
                      ? contentPresenter
                      : null
                  }
                  getOptionLabel={(option) => (
                    <>
                      {option.ten_day_du + " - "}
                      <b>{option.ten_dangnhap}</b>
                    </>
                  )}
                  getOptionValue={({ id }) => id}
                  onChange={(chairMan) => {
                    setContentPresenter(chairMan);
                  }}
                  onInputChange={(inputText, meta) => {
                    if (
                      meta.action !== "input-blur" &&
                      meta.action !== "menu-close"
                    ) {
                      GetList_User(inputText, 3);
                    }
                  }}
                  filterOption={null}
                  noOptionsMessage={(obj) => {
                    if (obj?.inputValue.trim().length === 0) {
                      return null;
                    }
                    return "Không tìm thấy tên";
                  }}
                />
              </div>
            </div>
            <br />
            {button === "Sửa" && (
              <Button
                type="info"
                className="btn-info"
                style={{
                  marginBottom: 16,
                  marginRight: 16,
                }}
                onClick={() => {
                  setSelect(null);
                  setButton("Thêm mới");
                  setContentTitle(null);
                  setContentStartTime(null);
                  setContentEndTime(null);
                  setContentPresenter(null);
                  setContentContent("");
                }}
              >
                Làm mới
              </Button>
            )}
            <Button
              onClick={() => {
                if (Helper.isNullOrUndefined(contentTitle))
                  return setErrorContent(true);
                if (Helper.isNullOrUndefined(contentStartTime))
                  return setErrorContent(true);
                if (Helper.isNullOrUndefined(contentEndTime))
                  return setErrorContent(true);
                // if (Helper.isNullOrUndefined(contentPresenter))
                //   return setErrorContent(true);
                // if (Helper.isNullOrUndefined(contentContent))
                //   return setErrorContent(true);
                if (!dayjs.isDayjs(startTime) || !dayjs.isDayjs(endTime))
                  return setErrorContent(true);
                // setContentList([
                //   {
                //     key: moment().unix(), //contentList?.length + 1,
                //     title: contentTitle,
                //     scheduleId: "",
                //     thoigianbatdau: contentStartTime,
                //     thoigianketthuc: contentEndTime,
                //     startTime: contentStartTime.format("YYYY-MM-DDTHH:mm:ss"),
                //     endTime: contentEndTime.format("YYYY-MM-DDTHH:mm:ss"),
                //     nguoithuyettrinh: contentPresenter.fullName,
                //     presenters: contentPresenter.id,
                //     content_: contentContent,
                //     createdDate: new Date(),
                //     createdBy: user?.id,
                //   },
                //   ...contentList,
                // ]);
                if (button === "Thêm mới") {
                  new Api()
                    .create_meeting_content({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      data: {
                        key: moment().unix(), //contentList?.length + 1,
                        title: contentTitle,
                        scheduleId: scheduleId,
                        thoigianbatdau: contentStartTime,
                        thoigianketthuc: contentEndTime,
                        startTime: contentStartTime.format(
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                        endTime: contentEndTime.format("YYYY-MM-DDTHH:mm:ss"),
                        nguoithuyettrinh: contentPresenter?.fullName,
                        presenters: contentPresenter?.id,
                        content_: contentContent,
                        createdDate: new Date(),
                        createdBy: user?.id,
                      },
                    })
                    .then((e) => {
                      if (e) {
                        getContentBySchedule(scheduleId);
                        setErrorContent(false);
                        setContentTitle(null);
                        setContentStartTime(null);
                        setContentEndTime(null);
                        setContentPresenterOptions([]);
                        setContentPresenter(null);
                        setContentContent("");
                      }
                    });
                }
                if (button === "Sửa") {
                  new Api()
                    .edit_meeting_content({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      id: select?.id,
                      data: {
                        title: contentTitle,
                        content_: contentContent,
                        startTime: contentStartTime.format(
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                        endTime: contentEndTime.format("YYYY-MM-DDTHH:mm:ss"),
                        presenters: contentPresenter?.id,
                        scheduleId: scheduleId,
                        thoigianbatdau: contentStartTime,
                        thoigianketthuc: contentEndTime,
                        nguoithuyettrinh: contentPresenter?.fullName,
                        modifiedDate: new Date(),
                        modifiedBy: user?.id,
                      },
                    })
                    .then((e) => {
                      if (e) {
                        getContentBySchedule(scheduleId);
                        setErrorContent(false);
                        setContentTitle(null);
                        setContentStartTime(null);
                        setContentEndTime(null);
                        setContentPresenterOptions([]);
                        setContentPresenter(null);
                        setContentContent("");
                      }
                    });
                }
              }}
              type="primary"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              {button}
            </Button>
            <Button
              onClick={() => {
                //console.log(contentDeleteList);
                if (contentDeleteList?.length > 0) {
                  for (
                    let index = 0;
                    index < contentDeleteList.length;
                    index++
                  ) {
                    new Api()
                      .delete_content({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        id: contentDeleteList[index],
                      })
                      .then((e) => {
                        if (e) {
                          getContentBySchedule(scheduleId);
                          setContentDeleteList([]);
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
              }}
              className="btn-danger"
              style={{
                marginBottom: 16,
                marginRight: 16,
              }}
            >
              Xóa
            </Button>
            <Button
              onClick={() => {
                if (sortedType) {
                  setSortedInfo({
                    order: "ascend",
                    columnKey: "thoigianbatdau",
                  });
                  setSortedType(!sortedType);
                } else {
                  setSortedInfo({
                    order: "descend",
                    columnKey: "thoigianbatdau",
                  });
                  setSortedType(!sortedType);
                }
              }}
              className="btn-secondary"
              style={{ marginBottom: 16 }}
            >
              Sắp xếp theo thời gian{" "}
              {!sortedType ? (
                <i className="fas fa-caret-up"></i>
              ) : (
                <i className="fas fa-caret-down"></i>
              )}
            </Button>
          </div>
          <div className="col-md-6">
            <div className="row form-group">
              <div className="col-md-12">
                <label className="mt-1">
                  Nội dung
                  {/* <b className="text-danger">(*)</b>{" "}
                  {Helper.isNullOrUndefined(contentContent) && errorContent && (
                    <b>
                      <i className="text-danger">Chưa có nội dung</i>
                    </b>
                  )} */}
                </label>
              </div>
              <div className="col-md">
                <MyEditor
                  handleChange={(data) => {
                    setContentContent(data);
                  }}
                  data={contentContent ?? ""}
                  // {...state}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {errorContent && (
        <b>
          <i className="text-danger">{errorContent}</i>
        </b>
      )}
      {/* {JSON.stringify(contentList)} */}
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
              setContentTitle(record?.title);
              setContentStartTime(dayjs(record?.thoigianbatdau));
              setContentEndTime(dayjs(record?.thoigianketthuc));
              setContentPresenter(record?.userPresenters);
              setContentContent(record?.content_);
            },
          };
        }}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{ margin: 0 }}
              dangerouslySetInnerHTML={{
                __html: record.content_,
              }}
            ></p>
          ),
        }}
        rowSelection={{
          selectedRowKeys: contentDeleteList,
          onChange: (selectedRowKeys, selectedRows) => {
            setContentDeleteList(selectedRowKeys);
          },
        }}
        columns={[
          {
            title: "Tiêu đề",
            dataIndex: "title",
            render: (text) => <>{text}</>,
          },
          {
            title: "Thời gian",
            dataIndex: "thoigianbatdau",
            // defaultSortOrder: 'descend',
            sorter: (a, b) =>
              dayjs(a.thoigianbatdau).unix() - dayjs(b.thoigianbatdau).unix(),
            sortOrder:
              sortedInfo.columnKey === "thoigianbatdau"
                ? sortedInfo.order
                : null,
            render: (text, record) => (
              <>
                {record.thoigianbatdau.format("DD-MM-YYYY HH:mm")} -{" "}
                {record.thoigianketthuc.format("DD-MM-YYYY HH:mm")}
              </>
            ),
          },
          {
            title: "Người thuyết trình",
            dataIndex: "nguoithuyettrinh",
          },
        ]}
        dataSource={contentList?.length > 0 && contentList}
        onChange={(pagination, filters, sorter, extra) => {
          setSortedInfo(sorter);
        }}
      />
    </>
  );
}
