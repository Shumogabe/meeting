import React from "react";
import { Button, Table, Tabs } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";

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
  docRestoreList,
  setDocRestoreList,
  id,
  user,
  getContentBySchedule,
  getMeetingDocument,
}) {
  return (
    <>
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
                    if (docDeleteList?.length > 0) {
                      SwalAlertAllConfiguration({
                        title:
                          "Bạn có chắc muốn phê duyệt các tài liệu này không?",
                        text: "Khi bạn nhấn 'Đồng ý' các tài liệu này sẽ được phê duyệt!",
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
                            index < docDeleteList.length;
                            index++
                          ) {
                            new Api()
                              .approve_meeting_document({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: docDeleteList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setDocDeleteList([]);
                                  getMeetingDocument(id);
                                }
                              });
                            if (index + 1 === docDeleteList.length) {
                              SwalAlertAllConfiguration({
                                title: "Thông báo",
                                text: "Phê duyệt thành công",
                                timer: 2000,
                                icon: "success",
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
                        text: "Chưa chọn tài liệu",
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
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Kích thước: " + record.size}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Loại tài liệu: " + record.type}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Tình trạng: " +
                            (record.status === 0 ? "chưa duyệt" : "đã duyệt")}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Người tải tài liệu lên: " +
                            record.user.ten_day_du +
                            " - " +
                            record.user.ten_dangnhap}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Thời gian tải tài liệu lên: " + record.modifiedDate}
                        </p>
                      </>
                    ),
                  }}
                  rowSelection={{
                    selectedRowKeys: docDeleteList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setDocDeleteList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                    },
                    {
                      title: "Tài liệu",
                      dataIndex: "tailieu",
                      render: (e, record) => {
                        return (
                          <>
                            <p
                              style={{
                                backgroundColor: "#d9d9d9",
                                borderRadius: "5px",
                              }}
                            >
                              <a
                                href
                                onClick={() => {
                                  if (record?.url) {
                                    new Api()
                                      .Get_link_download({
                                        objectKey:
                                          record?.url +
                                          "/" +
                                          record?.originalName,
                                        fileName: record?.originalName,
                                      })
                                      .then((e) => {
                                        // return window.open(e?.data, "_blank");
                                        // return setLink(e?.data);
                                      });
                                  }
                                }}
                              >
                                {record.originalName}
                              </a>
                            </p>
                          </>
                        );
                      },
                    },
                  ]}
                  dataSource={
                    docList?.length > 0 &&
                    docList.filter(
                      (item) => item?.status === 1 && item?.isDeleted === false
                    )
                  }
                />
              </>
            ),
          },
          {
            label: `Danh sách đã duyệt`,
            key: 2,
            children: (
              <>
                <>
                  <Button
                    onClick={() => {
                      if (docRestoreList?.length > 0) {
                        SwalAlertAllConfiguration({
                          title:
                            "Bạn có chắc muốn hủy duyệt các tài liệu này không?",
                          text: "Khi bạn nhấn 'Đồng ý' các tài liệu này sẽ bị hủy duyệt!",
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
                              index < docRestoreList.length;
                              index++
                            ) {
                              new Api()
                                .sendapprove_meeting_document({
                                  token: JSON.parse(
                                    sessionStorage.getItem(SESSION_STORAGE)
                                  )?.access_token,
                                  id: docRestoreList[index],
                                })
                                .then((e) => {
                                  if (e) {
                                    setDocRestoreList([]);
                                    getMeetingDocument(id);
                                  }
                                });
                              if (index + 1 === docRestoreList.length) {
                                SwalAlertAllConfiguration({
                                  title: "Thông báo",
                                  text: "Hủy duyệt thành công",
                                  timer: 2000,
                                  icon: "success",
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
                          text: "Chưa chọn tài liệu",
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
                </>
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  expandable={{
                    expandedRowRender: (record) => (
                      <>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Kích thước: " + record.size}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Loại tài liệu: " + record.type}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Tình trạng: " +
                            (record.status === 0 ? "chưa duyệt" : "đã duyệt")}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Người tải tài liệu lên: " +
                            record.user.ten_day_du +
                            " - " +
                            record.user.ten_dangnhap}
                        </p>
                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          {"Thời gian tải tài liệu lên: " + record.modifiedDate}
                        </p>
                      </>
                    ),
                  }}
                  rowSelection={{
                    selectedRowKeys: docRestoreList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setDocRestoreList(selectedRowKeys);
                      // docRestoreList.filter(
                      //   (item) => selectedRows.indexOf(item) !== 1
                      // );
                      // for (let i = 0; i < selectedRows.length; i++) {
                      //   if (docRestoreList[i] !== selectedRows[i]) {
                      //     return;
                      //   }
                      // }
                      // docRestoreList.map((e,i)=>{
                      //   if(selectedRows.filter((item)=>item.id === e.id).length === 0){
                      //     docRestoreList.push()
                      //   }
                      // })
                      // selectedRows.map((e, i) => {
                      //   if (
                      //     docRestoreList.length > 0 &&
                      //     docRestoreList.filter((item) => item.id === e.id)
                      //       .length === 0
                      //   ) {
                      //     setDocRestoreList([...docRestoreList, e]);
                      //   }
                      // });
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                    },
                    {
                      title: "Tài liệu",
                      dataIndex: "tailieu",
                      render: (e, record) => {
                        return (
                          <>
                            <p
                              style={{
                                backgroundColor: "#d9d9d9",
                                borderRadius: "5px",
                              }}
                            >
                              <a
                                href
                                onClick={() => {
                                  if (record?.url) {
                                    new Api()
                                      .Get_link_download({
                                        objectKey:
                                          record?.url +
                                          "/" +
                                          record?.originalName,
                                        fileName: record?.originalName,
                                      })
                                      .then((e) => {
                                        // return window.open(e?.data, "_blank");
                                        // return setLink(e?.data);
                                      });
                                  }
                                }}
                              >
                                {record.originalName}
                              </a>
                            </p>
                          </>
                        );
                      },
                    },
                  ]}
                  dataSource={
                    docList?.length > 0 &&
                    docList.filter(
                      (item) => item?.status === 2 && item?.isDeleted === false
                    )
                  }
                />
              </>
            ),
          },
        ]}
      />
    </>
  );
}
