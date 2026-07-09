import React, { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Table, Tabs } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import ReactSelect from "react-select";
import Api from "../../../../../../api";
import { SwalAlertAllConfiguration } from "../../../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../../../config";
import MyEditor from "../../../../../../helper/ckeditor";
import { range } from "../../../../../../helper/datetime";
import Helper from "../../../../../../helper/helper";
const { RangePicker } = DatePicker;
let timeoutUser;
let currentValueUser;
export default function ChuongTrinh({ scheduleId, meetingData, owner, user }) {
  const [sortedInfo, setSortedInfo] = useState({});
  const [contentList, setContentList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [button, setButton] = useState("Thêm mới");
  const [select, setSelect] = useState(null);
  //
  //content
  const [contentDeleteList, setContentDeleteList] = useState([]);
  const [contentRestoreList, setContentRestoreList] = useState([]);
  const [contentSendList, setContentSendList] = useState([]);
  const [sortedType, setSortedType] = useState(true);
  const [contentTitle, setContentTitle] = useState(null);
  const [contentStartTime, setContentStartTime] = useState(null);
  const [contentEndTime, setContentEndTime] = useState(null);
  const [contentPresenter, setContentPresenter] = useState(null);
  const [contentPresenterOptions, setContentPresenterOptions] = useState([]);
  const [contentContent, setContentContent] = useState(null);
  const [errorContent, setErrorContent] = useState(false);
  const [contentStartOpen, setContentStartOpen] = useState(false);
  const [contentEndOpen, setContentEndOpen] = useState(false);
  //

  useEffect(() => {
    if (!Helper.isNullOrUndefined(meetingData?.content)) {
      setContentList(
        meetingData?.content.map((item, index) => ({
          ...item,
          key: item?.id,
          thoigianbatdau: dayjs(item?.startTime),
          thoigianketthuc: dayjs(item?.endTime),
          nguoithuyettrinh: item?.userPresenters?.ten_day_du
            ? item?.userPresenters?.ten_day_du
            : item?.userPresenters?.ten_dangnhap,
        }))
      );
    }
  }, [meetingData?.content]);

  const getContentBySchedule = (id) => {
    new Api()
      .get_content_byScheduleId({ id: id, pageNumber: 1, pageSize: 999999 })
      .then((res) => {
        if (res?.data) {
          setContentList(
            res?.data.map((item, index) => ({
              ...item,
              key: item?.id,
              thoigianbatdau: dayjs(item?.startTime),
              thoigianketthuc: dayjs(item?.endTime),
              nguoithuyettrinh: item?.userPresenters?.ten_day_du
                ? item?.userPresenters?.ten_day_du
                : item?.userPresenters?.ten_dangnhap,
            }))
          );
        }
      });
  };

  const GetList_User = (value, obj) => {
    if (timeoutUser) {
      clearTimeout(timeoutUser);
      timeoutUser = null;
    }
    currentValueUser = value;
    const fake = () => {
      new Api()
        .get_user_bySearch({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            tu_khoa: value,
            page: 1,
            limit: 10,
          },
        })
        .then((res) => {
          if (currentValueUser === value) {
            const dataOption =
              res &&
              res?.records?.map((item) => ({
                ...item,
                value: item?.id,
                label: item?.ten_day_du + " - " + item?.ten_dangnhap,
              }));
            if (obj === 3) setContentPresenterOptions(dataOption);
          }
        })
        .catch((err) =>
          SwalAlertAllConfiguration({
            title: "Thông báo!",
            text: err.message,
            icon: "warning",
          })
        );
    };
    if (value === null) {
      if (obj === 3) setContentPresenterOptions([]);
    } else {
      timeoutUser = setTimeout(fake, 800);
    }
  };

  return (
    <>
      {owner === 1 ? (
        <>
          <div className="row mb-2">
            <div
              className={
                meetingData?.schedule?.status !== 3 ? "col-md-9" : "col-md-12"
              }
            >
              <Tabs
                defaultActiveKey="1"
                // tabPosition={"left"}
                items={[
                  {
                    label: `Danh sách đang cập nhật`,
                    key: 1,
                    children: (
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
                              setContentStartTime(
                                dayjs(record?.thoigianbatdau)
                              );
                              setContentEndTime(dayjs(record?.thoigianketthuc));
                              setContentPresenter(record?.userPresenters);
                              setContentContent(record?.content_);
                            },
                          };
                        }}
                        expandable={{
                          expandedRowRender: (record) => (
                            <>
                              <b>Nội dung: </b>
                              <p
                                style={{ margin: 0 }}
                                dangerouslySetInnerHTML={{
                                  __html: record.content_,
                                }}
                              ></p>
                            </>
                          ),
                        }}
                        rowSelection={
                          meetingData?.schedule?.status !== 3 && {
                            selectedRowKeys: contentDeleteList,
                            onChange: (selectedRowKeys, selectedRows) => {
                              setContentDeleteList(selectedRowKeys);
                            },
                          }
                        }
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
                              dayjs(a.thoigianbatdau).unix() -
                              dayjs(b.thoigianbatdau).unix(),
                            sortOrder:
                              sortedInfo.columnKey === "thoigianbatdau"
                                ? sortedInfo.order
                                : null,
                            render: (text, record) => (
                              <>
                                {record.thoigianbatdau.format("HH:mm")} -{" "}
                                {record.thoigianketthuc.format("HH:mm")}
                              </>
                            ),
                          },
                          {
                            title: "Người thuyết trình",
                            dataIndex: "nguoithuyettrinh",
                            render: (_, record) =>
                              record?.userPresenters?.ten_day_du
                                ? record?.userPresenters?.ten_day_du
                                : record?.userPresenters?.ten_dangnhap,
                          },
                        ]}
                        dataSource={
                          contentList?.length > 0 &&
                          contentList
                            .filter(
                              (item) =>
                                item?.isDeleted === false && item?.status === 0
                            )
                            .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                        }
                        onChange={(pagination, filters, sorter, extra) => {
                          setSortedInfo(sorter);
                        }}
                      />
                    ),
                  },
                  {
                    label: `Danh sách đã xóa`,
                    key: 2,
                    children: (
                      <Table
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
                        rowSelection={
                          meetingData?.schedule?.status !== 3 && {
                            selectedRowKeys: contentRestoreList,
                            onChange: (selectedRowKeys, selectedRows) => {
                              setContentRestoreList(selectedRowKeys);
                            },
                          }
                        }
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
                              dayjs(a.thoigianbatdau).unix() -
                              dayjs(b.thoigianbatdau).unix(),
                            sortOrder:
                              sortedInfo.columnKey === "thoigianbatdau"
                                ? sortedInfo.order
                                : null,
                            render: (text, record) => (
                              <>
                                {record.thoigianbatdau.format("HH:mm")} -{" "}
                                {record.thoigianketthuc.format("HH:mm")}
                              </>
                            ),
                          },
                          {
                            title: "Người thuyết trình",
                            dataIndex: "nguoithuyettrinh",
                            render: (_, record) =>
                              record?.userPresenters?.ten_day_du
                                ? record?.userPresenters?.ten_day_du
                                : record?.userPresenters?.ten_dangnhap,
                          },
                        ]}
                        dataSource={
                          contentList?.length > 0 &&
                          contentList
                            .filter((item) => item?.isDeleted === true)
                            .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                        }
                        onChange={(pagination, filters, sorter, extra) => {
                          setSortedInfo(sorter);
                        }}
                      />
                    ),
                  },
                  {
                    label: `Danh sách chờ duyệt`,
                    key: 3,
                    children: (
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
                        }}
                        expandable={{
                          expandedRowRender: (record) => (
                            <>
                              <b>Nội dung: </b>
                              <p
                                style={{ margin: 0 }}
                                dangerouslySetInnerHTML={{
                                  __html: record.content_,
                                }}
                              ></p>
                            </>
                          ),
                        }}
                        rowSelection={
                          meetingData?.schedule?.status !== 3 && {
                            selectedRowKeys: contentSendList,
                            onChange: (selectedRowKeys, selectedRows) => {
                              setContentSendList(selectedRowKeys);
                            },
                          }
                        }
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
                              dayjs(a.thoigianbatdau).unix() -
                              dayjs(b.thoigianbatdau).unix(),
                            sortOrder:
                              sortedInfo.columnKey === "thoigianbatdau"
                                ? sortedInfo.order
                                : null,
                            render: (text, record) => (
                              <>
                                {record.thoigianbatdau.format("HH:mm")} -{" "}
                                {record.thoigianketthuc.format("HH:mm")}
                              </>
                            ),
                          },
                          {
                            title: "Người thuyết trình",
                            dataIndex: "nguoithuyettrinh",
                            render: (_, record) =>
                              record?.userPresenters?.ten_day_du
                                ? record?.userPresenters?.ten_day_du
                                : record?.userPresenters?.ten_dangnhap,
                          },
                        ]}
                        dataSource={
                          contentList?.length > 0 &&
                          contentList
                            .filter(
                              (item) =>
                                item?.isDeleted === false && item?.status === 1
                            )
                            .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                        }
                        onChange={(pagination, filters, sorter, extra) => {
                          setSortedInfo(sorter);
                        }}
                      />
                    ),
                  },
                  {
                    label: `Danh sách đã duyệt`,
                    key: 4,
                    children: (
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
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
                        columns={[
                          {
                            title: "Tiêu đề",
                            dataIndex: "title",
                            render: (text) => <>{text}</>,
                            width: "50%",
                          },
                          {
                            title: "Thời gian",
                            dataIndex: "thoigianbatdau",
                            // defaultSortOrder: 'descend',
                            sorter: (a, b) =>
                              dayjs(a.thoigianbatdau).unix() -
                              dayjs(b.thoigianbatdau).unix(),
                            sortOrder:
                              sortedInfo.columnKey === "thoigianbatdau"
                                ? sortedInfo.order
                                : null,
                            render: (text, record) => (
                              <>
                                {record.thoigianbatdau.format("HH:mm")} -{" "}
                                {record.thoigianketthuc.format("HH:mm")}
                              </>
                            ),
                          },
                          {
                            title: "Người thuyết trình",
                            dataIndex: "nguoithuyettrinh",
                            render: (_, record) =>
                              record?.userPresenters?.ten_day_du
                                ? record?.userPresenters?.ten_day_du
                                : record?.userPresenters?.ten_dangnhap,
                          },
                        ]}
                        dataSource={
                          contentList?.length > 0 &&
                          contentList
                            .filter(
                              (item) =>
                                item?.isDeleted === false && item?.status === 2
                            )
                            .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                        }
                        onChange={(pagination, filters, sorter, extra) => {
                          setSortedInfo(sorter);
                        }}
                      />
                    ),
                  },
                  {
                    label: `Danh sách từ chối`,
                    key: 5,
                    children: (
                      <Table
                        locale={{
                          emptyText: "Không có dữ liệu.",
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
                              dayjs(a.thoigianbatdau).unix() -
                              dayjs(b.thoigianbatdau).unix(),
                            sortOrder:
                              sortedInfo.columnKey === "thoigianbatdau"
                                ? sortedInfo.order
                                : null,
                            render: (text, record) => (
                              <>
                                {record.thoigianbatdau.format("HH:mm")} -{" "}
                                {record.thoigianketthuc.format("HH:mm")}
                              </>
                            ),
                          },
                          {
                            title: "Người thuyết trình",
                            dataIndex: "nguoithuyettrinh",
                            render: (_, record) =>
                              record?.userPresenters?.ten_day_du
                                ? record?.userPresenters?.ten_day_du
                                : record?.userPresenters?.ten_dangnhap,
                          },
                        ]}
                        dataSource={
                          contentList?.length > 0 &&
                          contentList
                            .filter(
                              (item) =>
                                item?.isDeleted === false && item?.status === 3
                            )
                            .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                        }
                        onChange={(pagination, filters, sorter, extra) => {
                          setSortedInfo(sorter);
                        }}
                      />
                    ),
                  },
                ]}
              />
            </div>
            {meetingData?.schedule?.status !== 3 && (
              <div className="col-md-3">
                <div class="card card-info card-outline">
                  <div class="card-header">
                    <h3 class="card-title">
                      <i class="fas fa-clock info"></i> Thêm chương trình
                    </h3>
                  </div>
                  <div class="card-body">
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label className="mt-1">
                          Tiêu đề
                          <b className="text-danger">(*)</b>{" "}
                          {Helper.isNullOrUndefined(contentTitle) &&
                            errorContent && (
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
                            dayjs.isDayjs(meetingData?.schedule?.startTime)
                              ? meetingData?.schedule?.startTime
                              : dayjs(meetingData?.schedule?.startTime),
                            dayjs.isDayjs(meetingData?.schedule?.endTime)
                              ? meetingData?.schedule?.endTime
                              : dayjs(meetingData?.schedule?.endTime),
                          ]}
                          defaultValue={[contentStartTime, contentEndTime]}
                          value={[contentStartTime, contentEndTime]}
                          // disabledDate={(current) => {
                          //   return (
                          //     current <
                          //       dayjs(meetingData?.schedule?.startTime).startOf(
                          //         "day"
                          //       ) ||
                          //     current >
                          //       dayjs(meetingData?.schedule?.endTime).endOf("day")
                          //   );
                          // }}
                          // disabledTime={(current, type) => {
                          //   if (type === "start") {
                          //     return {
                          //       disabledHours: () =>
                          //         dayjs.isDayjs(current) &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(
                          //             meetingData?.schedule?.startTime
                          //           ).format("DD/MM/YYYY") &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(meetingData?.schedule?.endTime).format(
                          //             "DD/MM/YYYY"
                          //           )
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.endTime
                          //                 ).format("HH")
                          //               )
                          //             ).concat(
                          //               range(
                          //                 Number(
                          //                   dayjs(
                          //                     meetingData?.schedule?.endTime
                          //                   ).format("HH")
                          //                 ) + 1,
                          //                 24
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.startTime
                          //               ).format("DD/MM/YYYY")
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.startTime
                          //                 ).format("HH")
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.endTime
                          //               ).format("DD/MM/YYYY")
                          //           ? range(
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.endTime
                          //                 ).format("HH")
                          //               ) + 1,
                          //               24
                          //             )
                          //           : [],
                          //       disabledMinutes: () =>
                          //         dayjs.isDayjs(current) &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(
                          //             meetingData?.schedule?.startTime
                          //           ).format("DD/MM/YYYY") &&
                          //         current.format("HH") ===
                          //           dayjs(
                          //             meetingData?.schedule?.startTime
                          //           ).format("HH") &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(meetingData?.schedule?.endTime).format(
                          //             "DD/MM/YYYY"
                          //           ) &&
                          //         current.format("HH") ===
                          //           dayjs(meetingData?.schedule?.endTime).format(
                          //             "HH"
                          //           )
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.startTime
                          //                 ).format("mm")
                          //               )
                          //             ).concat(
                          //               range(
                          //                 Number(
                          //                   dayjs(
                          //                     meetingData?.schedule?.endTime
                          //                   ).format("mm")
                          //                 ) + 1,
                          //                 60
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.startTime
                          //               ).format("DD/MM/YYYY") &&
                          //             current.format("HH") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.startTime
                          //               ).format("HH")
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.startTime
                          //                 ).format("mm")
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.endTime
                          //               ).format("DD/MM/YYYY") &&
                          //             current.format("HH") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.endTime
                          //               ).format("HH")
                          //           ? range(
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.endTime
                          //                 ).format("mm")
                          //               ) + 1,
                          //               60
                          //             )
                          //           : [],
                          //       // disabledSeconds: () =>
                          //       //   dayjs.isDayjs(current) &&
                          //       //   current.format("DD/MM/YYYY") ===
                          //       //     dayjs(meetingData?.schedule?.startTime).format(
                          //       //       "DD/MM/YYYY"
                          //       //     ) &&
                          //       //   current.format("HH") ===
                          //       //     dayjs(meetingData?.schedule?.startTime).format(
                          //       //       "HH"
                          //       //     ) &&
                          //       //   current.format("mm") ===
                          //       //     dayjs(meetingData?.schedule?.startTime).format(
                          //       //       "mm"
                          //       //     ) &&
                          //       //   current.format("DD/MM/YYYY") ===
                          //       //     dayjs(meetingData?.schedule?.endTime).format(
                          //       //       "DD/MM/YYYY"
                          //       //     ) &&
                          //       //   current.format("HH") ===
                          //       //     dayjs(meetingData?.schedule?.endTime).format(
                          //       //       "HH"
                          //       //     ) &&
                          //       //   current.format("mm") ===
                          //       //     dayjs(meetingData?.schedule?.endTime).format("mm")
                          //       //     ? range(
                          //       //         0,
                          //       //         Number(
                          //       //           dayjs(
                          //       //             meetingData?.schedule?.startTime
                          //       //           ).format("ss")
                          //       //         )
                          //       //       ).concat(
                          //       //         range(
                          //       //           Number(
                          //       //             dayjs(
                          //       //               meetingData?.schedule?.endTime
                          //       //             ).format("ss")
                          //       //           ) + 1,
                          //       //           60
                          //       //         )
                          //       //       )
                          //       //     : dayjs.isDayjs(current) &&
                          //       //       current.format("DD/MM/YYYY") ===
                          //       //         dayjs(
                          //       //           meetingData?.schedule?.startTime
                          //       //         ).format("DD/MM/YYYY") &&
                          //       //       current.format("HH") ===
                          //       //         dayjs(
                          //       //           meetingData?.schedule?.startTime
                          //       //         ).format("HH") &&
                          //       //       current.format("mm") ===
                          //       //         dayjs(
                          //       //           meetingData?.schedule?.startTime
                          //       //         ).format("mm")
                          //       //     ? range(
                          //       //         0,
                          //       //         Number(
                          //       //           dayjs(
                          //       //             meetingData?.schedule?.startTime
                          //       //           ).format("ss")
                          //       //         )
                          //       //       )
                          //       //     : dayjs.isDayjs(current) &&
                          //       //       current.format("DD/MM/YYYY") ===
                          //       //         dayjs(meetingData?.schedule?.endTime).format(
                          //       //           "DD/MM/YYYY"
                          //       //         ) &&
                          //       //       current.format("HH") ===
                          //       //         dayjs(meetingData?.schedule?.endTime).format(
                          //       //           "HH"
                          //       //         ) &&
                          //       //       current.format("mm") ===
                          //       //         dayjs(meetingData?.schedule?.endTime).format(
                          //       //           "mm"
                          //       //         )
                          //       //     ? range(
                          //       //         Number(
                          //       //           dayjs(
                          //       //             meetingData?.schedule?.endTime
                          //       //           ).format("ss")
                          //       //         ) + 1,
                          //       //         60
                          //       //       )
                          //       //     : [],
                          //     };
                          //   }
                          //   if (type === "end") {
                          //     return {
                          //       disabledHours: () =>
                          //         dayjs.isDayjs(current) &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(
                          //             meetingData?.schedule?.startTime
                          //           ).format("DD/MM/YYYY") &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(meetingData?.schedule?.endTime).format(
                          //             "DD/MM/YYYY"
                          //           )
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.endTime
                          //                 ).format("HH")
                          //               )
                          //             ).concat(
                          //               range(
                          //                 Number(
                          //                   dayjs(
                          //                     meetingData?.schedule?.endTime
                          //                   ).format("HH")
                          //                 ) + 1,
                          //                 24
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.startTime
                          //               ).format("DD/MM/YYYY")
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.startTime
                          //                 ).format("HH")
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.endTime
                          //               ).format("DD/MM/YYYY")
                          //           ? range(
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.endTime
                          //                 ).format("HH")
                          //               ) + 1,
                          //               24
                          //             )
                          //           : [],
                          //       disabledMinutes: () =>
                          //         dayjs.isDayjs(current) &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(
                          //             meetingData?.schedule?.startTime
                          //           ).format("DD/MM/YYYY") &&
                          //         current.format("HH") ===
                          //           dayjs(
                          //             meetingData?.schedule?.startTime
                          //           ).format("HH") &&
                          //         current.format("DD/MM/YYYY") ===
                          //           dayjs(meetingData?.schedule?.endTime).format(
                          //             "DD/MM/YYYY"
                          //           ) &&
                          //         current.format("HH") ===
                          //           dayjs(meetingData?.schedule?.endTime).format(
                          //             "HH"
                          //           )
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.startTime
                          //                 ).format("mm")
                          //               )
                          //             ).concat(
                          //               range(
                          //                 Number(
                          //                   dayjs(
                          //                     meetingData?.schedule?.endTime
                          //                   ).format("mm")
                          //                 ) + 1,
                          //                 60
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.startTime
                          //               ).format("DD/MM/YYYY") &&
                          //             current.format("HH") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.startTime
                          //               ).format("HH")
                          //           ? range(
                          //               0,
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.startTime
                          //                 ).format("mm")
                          //               )
                          //             )
                          //           : dayjs.isDayjs(current) &&
                          //             current.format("DD/MM/YYYY") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.endTime
                          //               ).format("DD/MM/YYYY") &&
                          //             current.format("HH") ===
                          //               dayjs(
                          //                 meetingData?.schedule?.endTime
                          //               ).format("HH")
                          //           ? range(
                          //               Number(
                          //                 dayjs(
                          //                   meetingData?.schedule?.endTime
                          //                 ).format("mm")
                          //               ) + 1,
                          //               60
                          //             )
                          //           : [],
                          //       // disabledSeconds: () =>
                          //       //   dayjs.isDayjs(current) &&
                          //       //   current.format("DD/MM/YYYY") ===
                          //       //     dayjs(meetingData?.schedule?.startTime).format(
                          //       //       "DD/MM/YYYY"
                          //       //     ) &&
                          //       //   current.format("HH") ===
                          //       //     dayjs(meetingData?.schedule?.startTime).format(
                          //       //       "HH"
                          //       //     ) &&
                          //       //   current.format("mm") ===
                          //       //     dayjs(meetingData?.schedule?.startTime).format(
                          //       //       "mm"
                          //       //     ) &&
                          //       //   current.format("DD/MM/YYYY") ===
                          //       //     dayjs(meetingData?.schedule?.endTime).format(
                          //       //       "DD/MM/YYYY"
                          //       //     ) &&
                          //       //   current.format("HH") ===
                          //       //     dayjs(meetingData?.schedule?.endTime).format(
                          //       //       "HH"
                          //       //     ) &&
                          //       //   current.format("mm") ===
                          //       //     dayjs(meetingData?.schedule?.endTime).format("mm")
                          //       //     ? range(
                          //       //         0,
                          //       //         Number(
                          //       //           dayjs(
                          //       //             meetingData?.schedule?.startTime
                          //       //           ).format("ss")
                          //       //         )
                          //       //       ).concat(
                          //       //         range(
                          //       //           Number(
                          //       //             dayjs(
                          //       //               meetingData?.schedule?.endTime
                          //       //             ).format("ss")
                          //       //           ) + 1,
                          //       //           60
                          //       //         )
                          //       //       )
                          //       //     : dayjs.isDayjs(current) &&
                          //       //       current.format("DD/MM/YYYY") ===
                          //       //         dayjs(
                          //       //           meetingData?.schedule?.startTime
                          //       //         ).format("DD/MM/YYYY") &&
                          //       //       current.format("HH") ===
                          //       //         dayjs(
                          //       //           meetingData?.schedule?.startTime
                          //       //         ).format("HH") &&
                          //       //       current.format("mm") ===
                          //       //         dayjs(
                          //       //           meetingData?.schedule?.startTime
                          //       //         ).format("mm")
                          //       //     ? range(
                          //       //         0,
                          //       //         Number(
                          //       //           dayjs(
                          //       //             meetingData?.schedule?.startTime
                          //       //           ).format("ss")
                          //       //         )
                          //       //       )
                          //       //     : dayjs.isDayjs(current) &&
                          //       //       current.format("DD/MM/YYYY") ===
                          //       //         dayjs(meetingData?.schedule?.endTime).format(
                          //       //           "DD/MM/YYYY"
                          //       //         ) &&
                          //       //       current.format("HH") ===
                          //       //         dayjs(meetingData?.schedule?.endTime).format(
                          //       //           "HH"
                          //       //         ) &&
                          //       //       current.format("mm") ===
                          //       //         dayjs(meetingData?.schedule?.endTime).format(
                          //       //           "mm"
                          //       //         )
                          //       //     ? range(
                          //       //         Number(
                          //       //           dayjs(
                          //       //             meetingData?.schedule?.endTime
                          //       //           ).format("ss")
                          //       //         ) + 1,
                          //       //         60
                          //       //       )
                          //       //     : [],
                          //     };
                          //   }
                          // }}
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
                    <div className="row form-group">
                      <div className="col-md-12">
                        <label className="mt-1">
                          Nội dung
                          {/* <b className="text-danger">(*)</b>{" "}
                          {Helper.isNullOrUndefined(contentContent) &&
                            errorContent && (
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
                        if (
                          !dayjs.isDayjs(
                            dayjs(meetingData?.schedule?.startTime)
                          ) ||
                          !dayjs.isDayjs(dayjs(meetingData?.schedule?.endTime))
                        )
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
                              token: JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE)
                              )?.access_token,
                              data: {
                                key: moment().unix(), //contentList?.length + 1,
                                title: contentTitle,
                                scheduleId: scheduleId,
                                thoigianbatdau: contentStartTime,
                                thoigianketthuc: contentEndTime,
                                startTime: contentStartTime.format(
                                  "YYYY-MM-DDTHH:mm:ss"
                                ),
                                endTime: contentEndTime.format(
                                  "YYYY-MM-DDTHH:mm:ss"
                                ),
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
                              token: JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE)
                              )?.access_token,
                              id: select?.id,
                              data: {
                                title: contentTitle,
                                content_: contentContent,
                                startTime: contentStartTime.format(
                                  "YYYY-MM-DDTHH:mm:ss"
                                ),
                                endTime: contentEndTime.format(
                                  "YYYY-MM-DDTHH:mm:ss"
                                ),
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
                    {contentDeleteList?.length > 0 && (
                      <>
                        <Button
                          onClick={() => {
                            setErrorContent("");
                            //console.log(contentDeleteList);
                            if (contentDeleteList?.length > 0) {
                              SwalAlertAllConfiguration({
                                title: "Bạn có chắc muốn xóa không?",
                                text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa!",
                                icon: "warning",
                                showCancelButton: true,
                                showLoaderOnConfirm: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Thoát",
                                dangerMode: true,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  for (
                                    let index = 0;
                                    index < contentDeleteList.length;
                                    index++
                                  ) {
                                    new Api()
                                      .remove_content({
                                        token: JSON.parse(
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: contentDeleteList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          setContentDeleteList([]);
                                          getContentBySchedule(scheduleId);
                                        }
                                      });
                                    if (
                                      index + 1 ===
                                      contentDeleteList.length
                                    ) {
                                      SwalAlertAllConfiguration({
                                        title: "Xóa thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
                                }
                              });
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
                            setErrorContent("");
                            //console.log(contentDeleteList);
                            if (contentDeleteList?.length > 0) {
                              SwalAlertAllConfiguration({
                                title: "Bạn có chắc muốn gửi duyệt không?",
                                text: "Khi bạn nhấn 'Đồng ý' sẽ được gửi duyệt!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Thoát",
                                showLoaderOnConfirm: true,
                                dangerMode: true,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  for (
                                    let index = 0;
                                    index < contentDeleteList.length;
                                    index++
                                  ) {
                                    new Api()
                                      .sendapprove_meeting_content({
                                        token: JSON.parse(
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: contentDeleteList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          setContentDeleteList([]);
                                          getContentBySchedule(scheduleId);
                                        }
                                      });
                                    if (
                                      index + 1 ===
                                      contentDeleteList.length
                                    ) {
                                      SwalAlertAllConfiguration({
                                        title: "Gửi duyệt thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
                                }
                              });
                            }
                          }}
                          className="btn-info"
                          style={{
                            marginBottom: 16,
                            marginRight: 16,
                          }}
                        >
                          Gửi duyệt
                        </Button>
                      </>
                    )}
                    {contentRestoreList?.length > 0 && (
                      <>
                        <Button
                          onClick={() => {
                            setErrorContent("");
                            //console.log(contentRestoreList);
                            if (contentRestoreList?.length > 0) {
                              SwalAlertAllConfiguration({
                                title: "Bạn có chắc muốn khôi phục không?",
                                text: "Khi bạn nhấn 'Đồng ý' sẽ được khôi phục!",
                                icon: "warning",
                                showCancelButton: true,
                                showLoaderOnConfirm: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Thoát",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  for (
                                    let index = 0;
                                    index < contentRestoreList.length;
                                    index++
                                  ) {
                                    new Api()
                                      .restore_content({
                                        token: JSON.parse(
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: contentRestoreList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          setContentRestoreList([]);
                                          getContentBySchedule(scheduleId);
                                        }
                                      });
                                    if (
                                      index + 1 ===
                                      contentRestoreList.length
                                    ) {
                                      SwalAlertAllConfiguration({
                                        title: "Khôi phục thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
                                }
                              });
                            }
                          }}
                          className="btn-info"
                          style={{
                            marginBottom: 16,
                            marginRight: 16,
                          }}
                        >
                          Khôi phục
                        </Button>
                        <Button
                          onClick={() => {
                            setErrorContent("");
                            //console.log(contentRestoreList);
                            if (contentRestoreList?.length > 0) {
                              SwalAlertAllConfiguration({
                                title: "Bạn có chắc muốn xóa vĩnh viễn không?",
                                text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa vĩnh viễn!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Thoát",
                                showLoaderOnConfirm: true,
                                dangerMode: true,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  for (
                                    let index = 0;
                                    index < contentRestoreList.length;
                                    index++
                                  ) {
                                    new Api()
                                      .delete_content({
                                        token: JSON.parse(
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: contentRestoreList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          setContentRestoreList([]);
                                          getContentBySchedule(scheduleId);
                                        }
                                      });
                                    if (
                                      index + 1 ===
                                      contentRestoreList.length
                                    ) {
                                      SwalAlertAllConfiguration({
                                        title: "Xóa thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
                                }
                              });
                            }
                          }}
                          className="btn-danger"
                          style={{
                            marginBottom: 16,
                            marginRight: 16,
                          }}
                        >
                          Xóa vĩnh viễn
                        </Button>
                      </>
                    )}
                    {contentSendList?.length > 0 && (
                      <>
                        <Button
                          onClick={() => {
                            setErrorContent("");
                            //console.log(contentSendList);
                            if (contentSendList?.length > 0) {
                              SwalAlertAllConfiguration({
                                title: "Bạn có chắc muốn hủy gửi duyệt không?",
                                text: "Khi bạn nhấn 'Đồng ý' sẽ được hủy gửi duyệt!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Đồng ý",
                                cancelButtonText: "Thoát",
                                showLoaderOnConfirm: true,
                                dangerMode: true,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  for (
                                    let index = 0;
                                    index < contentSendList.length;
                                    index++
                                  ) {
                                    new Api()
                                      .unsendapprove_meeting_content({
                                        token: JSON.parse(
                                          sessionStorage.getItem(
                                            SESSION_STORAGE
                                          )
                                        )?.access_token,
                                        id: contentSendList[index],
                                      })
                                      .then((e) => {
                                        if (e) {
                                          setContentSendList([]);
                                          getContentBySchedule(scheduleId);
                                        }
                                      });
                                    if (index + 1 === contentSendList.length) {
                                      SwalAlertAllConfiguration({
                                        title: "Hủy gửi duyệt thành công",
                                        icon: "success",
                                        timer: 1500,
                                      });
                                    }
                                  }
                                }
                              });
                            }
                          }}
                          className="btn-info"
                          style={{
                            marginBottom: 16,
                            marginRight: 16,
                          }}
                        >
                          Hủy gửi duyệt
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        setContentRestoreList([]);
                        setContentRestoreList([]);
                        getContentBySchedule(scheduleId);
                      }}
                      color="default"
                      variant="outlined"
                      style={{
                        marginBottom: 16,
                        marginRight: 16,
                      }}
                    >
                      Tải lại danh sách
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
                    {errorContent && (
                      <b>
                        <i className="text-danger">{errorContent}</i>
                      </b>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Button
            type="primary"
            onClick={() => {
              getContentBySchedule(scheduleId);
            }}
            loading={uploading}
            // style={{
            //   marginTop: 16,
            // }}
            icon={<ReloadOutlined />}
          >
            Tải lại danh sách
          </Button>{" "}
          <Table
            locale={{
              emptyText: "Không có dữ liệu.",
            }}
            expandable={{
              expandedRowRender: (record) => (
                <>
                  <u>
                    <b>Nội dung:</b>
                  </u>
                  <p
                    style={{ margin: 0 }}
                    dangerouslySetInnerHTML={{
                      __html: record.content_,
                    }}
                  ></p>
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
                title: "Thời gian",
                dataIndex: "thoigianbatdau",
                // defaultSortOrder: 'descend',
                sorter: (a, b) =>
                  dayjs(a.thoigianbatdau).unix() -
                  dayjs(b.thoigianbatdau).unix(),
                sortOrder:
                  sortedInfo.columnKey === "thoigianbatdau"
                    ? sortedInfo.order
                    : null,
                render: (text, record) => (
                  <>
                    {record?.thoigianbatdau.format("HH:mm")} -{" "}
                    {record?.thoigianketthuc.format("HH:mm")}
                  </>
                ),
              },
              {
                title: "Người thuyết trình",
                dataIndex: "nguoithuyettrinh",
                render: (_, record) =>
                  record?.userPresenters?.ten_day_du
                    ? record?.userPresenters?.ten_day_du
                    : record?.userPresenters?.ten_dangnhap,
              },
            ]}
            dataSource={
              contentList?.length > 0 &&
              contentList
                .filter(
                  (item) => item?.isDeleted === false && item?.status === 2
                )
                .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
            }
            onChange={(pagination, filters, sorter, extra) => {
              setSortedInfo(sorter);
            }}
          />
        </>
      )}
    </>
  );
}
