import React from "react";
import { Button, Table, Tabs, Upload } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";

export default function Conslusion({
  conslusionList,
  setErrorConslusion,
  docListConslusion,
  id,
  conslusionDeleteList,
  setConslusionDeleteList,
  getConslusionBySchedule,
  conslusionRestoreList,
  setConslusionRestoreList,
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
                    //console.log(conslusionDeleteList);
                    if (conslusionDeleteList?.length > 0) {
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
                            index < conslusionDeleteList.length;
                            index++
                          ) {
                            new Api()
                              .approve_meeting_Conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionDeleteList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setConslusionDeleteList([]);
                                  getConslusionBySchedule("", id);
                                }
                              });
                            if (index + 1 === conslusionDeleteList.length) {
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
                      <p
                        style={{
                          backgroundColor: "#d9d9d9",
                          borderRadius: "5px",
                        }}
                      >
                        <i class="fas fa-download info"></i>{" "}
                        <a
                          href
                          onClick={() => {
                            if (record?.url) {
                              new Api()
                                .Get_link_download({
                                  objectKey:
                                    record?.url + "/" + record?.originalName,
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
                    ),
                  }}
                  rowSelection={{
                    selectedRowKeys: conslusionDeleteList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setConslusionDeleteList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      render: (text) => <>{text}</>,
                    },
                    {
                      title: "Nội dung",
                      dataIndex: "content",
                      render: (_, record) => (
                        <p
                          style={{ margin: 0 }}
                          dangerouslySetInnerHTML={{
                            __html: record.content,
                          }}
                        ></p>
                      ),
                    },
                  ]}
                  dataSource={
                    conslusionList?.length > 0 &&
                    conslusionList.filter(
                      (item) => item?.status === 1 && item?.isDeleted === false
                    )
                  }
                />
              </>
            ),
          },
          {
            label: "Danh sách đã duyệt",
            key: 2,
            children: (
              <>
                <Button
                  onClick={() => {
                    //console.log(conslusionRestoreList);
                    if (conslusionRestoreList?.length > 0) {
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
                            index < conslusionRestoreList.length;
                            index++
                          ) {
                            new Api()
                              .unapprove_meeting_Conslusion({
                                token: JSON.parse(
                                  sessionStorage.getItem(SESSION_STORAGE)
                                )?.access_token,
                                id: conslusionRestoreList[index],
                              })
                              .then((e) => {
                                if (e) {
                                  setConslusionRestoreList([]);
                                  getConslusionBySchedule("", id);
                                }
                              });
                            if (index + 1 === conslusionRestoreList.length) {
                              SwalAlertAllConfiguration({
                                title: "Hủy phê duyệt thành công",
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
                      <p
                        style={{
                          backgroundColor: "#d9d9d9",
                          borderRadius: "5px",
                        }}
                      >
                        <i class="fas fa-download info"></i>{" "}
                        <a
                          href
                          onClick={() => {
                            if (record?.url) {
                              new Api()
                                .Get_link_download({
                                  objectKey:
                                    record?.url + "/" + record?.originalName,
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
                    ),
                  }}
                  rowSelection={{
                    selectedRowKeys: conslusionRestoreList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setConslusionRestoreList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      render: (text) => <>{text}</>,
                    },
                    {
                      title: "Nội dung",
                      dataIndex: "content",
                      render: (_, record) => (
                        <p
                          style={{ margin: 0 }}
                          dangerouslySetInnerHTML={{
                            __html: record.content,
                          }}
                        ></p>
                      ),
                    },
                  ]}
                  dataSource={
                    conslusionList?.length > 0 &&
                    conslusionList.filter(
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
