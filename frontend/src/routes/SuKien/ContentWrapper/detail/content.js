import React, { useState } from "react";
import { Button, DatePicker, Input, Table, Tabs } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import ReactSelect from "react-select";
import Api from "../../../../api";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../config";
import MyEditor from "../../../../helper/ckeditor";
import { range } from "../../../../helper/datetime";
import Helper from "../../../../helper/helper";
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
  contentRestoreList,
  setContentRestoreList,
}) {
  const [button, setButton] = useState("Thêm mới");
  const [select, setSelect] = useState(null);
  return (
    <>
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
      <Tabs
        defaultActiveKey="1"
        // tabPosition={"left"}
        items={[
          {
            label: `Danh sách`,
            key: 1,
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
                dataSource={
                  contentList?.length > 0 &&
                  contentList.filter(
                    (item) => item?.isDeleted === false && item?.status === 0
                  )
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
                dataSource={
                  contentList?.length > 0 &&
                  contentList.filter((item) => item?.isDeleted === true)
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
                dataSource={
                  contentList?.length > 0 &&
                  contentList.filter(
                    (item) => item?.isDeleted === false && item?.status === 1
                  )
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
                dataSource={
                  contentList?.length > 0 &&
                  contentList.filter(
                    (item) => item?.isDeleted === false && item?.status === 2
                  )
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
                dataSource={
                  contentList?.length > 0 &&
                  contentList.filter(
                    (item) => item?.isDeleted === false && item?.status === 3
                  )
                }
                onChange={(pagination, filters, sorter, extra) => {
                  setSortedInfo(sorter);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}
