import React from "react";
import { Button, DatePicker, Table, Tabs } from "antd";
import dayjs from "dayjs";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
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
  id,
  contentRestoreList,
  setContentRestoreList,
}) {
  return (
    <>
      {/* {console.log(contentList)} */}
      <Tabs
        defaultActiveKey="1"
        // tabPosition={"left"}
        items={[
          {
            label: `Danh sách chờ duyệt`,
            key: 1,
            children: (
              <>
                <Button
                  onClick={() => {
                    //console.log(contentDeleteList);
                    if (contentDeleteList?.length > 0) {
                      SwalAlertAllConfiguration({
                        title:
                          "Bạn có chắc muốn phê duyệt các chương trình này không?",
                        text: "Khi bạn nhấn 'Đồng ý' các chương trình này sẽ được phê duyệt!",
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
                              .approve_meeting_content({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: contentDeleteList[index],
                                data: {
                                  modifiedDate: new Date(),
                                },
                              })
                              .then((e) => {
                                if (e) {
                                  setContentDeleteList([]);
                                  getContentBySchedule(id);
                                }
                              });
                            if (index + 1 === contentDeleteList.length) {
                              SwalAlertAllConfiguration({
                                title: "Phê duyệt thành công",
                                icon: "success",
                                timer: 1500,
                              });
                            }
                          }
                        } else {
                          return false;
                        }
                      });
                    } else {
                      SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn chương trình",
                        icon: "warning",
                      });
                    }
                  }}
                  className="btn-info"
                  style={{
                    marginBottom: 16,
                    marginRight: 16,
                  }}
                >
                  Phê duyệt
                </Button>
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
                    },
                  ]}
                  dataSource={
                    contentList?.length > 0 &&
                    contentList
                      .filter(
                        (item) =>
                          item?.status === 1 && item?.isDeleted === false
                      )
                      .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                  }
                  onChange={(pagination, filters, sorter, extra) => {
                    setSortedInfo(sorter);
                  }}
                />
              </>
            ),
          },
          {
            label: `Danh sách đã duyệt`,
            key: 2,
            children: (
              <>
                <Button
                  onClick={() => {
                    //console.log(contentRestoreList);
                    if (contentRestoreList?.length > 0) {
                      SwalAlertAllConfiguration({
                        title:
                          "Bạn có chắc muốn hủy duyệt các chương trình này không?",
                        text: "Khi bạn nhấn 'Đồng ý' các chương trình này sẽ bị hủy duyệt!",
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
                              .sendapprove_meeting_content({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: contentRestoreList[index],
                                data: {
                                  modifiedDate: new Date(),
                                },
                              })
                              .then((e) => {
                                if (e) {
                                  setContentRestoreList([]);
                                  getContentBySchedule(id);
                                }
                              });
                            if (index + 1 === contentRestoreList.length) {
                              SwalAlertAllConfiguration({
                                title: "Hủy duyệt thành công",
                                icon: "success",
                                timer: 1500,
                              });
                            }
                          }
                        } else {
                          return false;
                        }
                      });
                    } else {
                      SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Chưa chọn chương trình",
                        icon: "warning",
                      });
                    }
                  }}
                  className="btn-danger"
                  style={{
                    marginBottom: 16,
                    marginRight: 16,
                  }}
                >
                  Hủy duyệt
                </Button>
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
                  rowSelection={{
                    selectedRowKeys: contentRestoreList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setContentRestoreList(selectedRowKeys);
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
                    },
                  ]}
                  dataSource={
                    contentList?.length > 0 &&
                    contentList
                      .filter(
                        (item) =>
                          item?.status === 2 && item?.isDeleted === false
                      )
                      .sort((a, b) => a.thoigianbatdau - b.thoigianbatdau)
                  }
                  onChange={(pagination, filters, sorter, extra) => {
                    setSortedInfo(sorter);
                  }}
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
}
