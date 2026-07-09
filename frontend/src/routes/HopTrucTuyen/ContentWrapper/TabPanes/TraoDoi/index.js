import React, { useEffect, useRef, useState } from "react";
import {
  CloudUploadOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import Highlighter from "react-highlight-words";
import Api from "../../../../../api";
import { SwalAlertAllConfiguration } from "../../../../../components/Swal";
import UploadFile, { handleUpload } from "../../../../../components/Upload";
import { SESSION_STORAGE } from "../../../../../config";
import Helper from "../../../../../helper/helper";
import moment from "moment";
import ScrollbarsCustum from "../../../../../components/ScrollbarsCustum";

export default function MeetingChat({
  scheduleId,
  user,
  owner,
  marginTopLayout,
  marginRightLayout,
  meetingData,
}) {
  const [docList, setDocList] = useState([]);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState(null);
  const [docPostList, setDocPostList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  const [docRestoreList, setDocRestoreList] = useState([]);
  const [contentChat, setContentChat] = useState(null);

  useEffect(() => {
    setFileListUpLoad([]);
    getMeetingDocument(scheduleId);
  }, [scheduleId]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Làm nổi bật
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (dataIndex.includes("?.")) {
        var dataIndexAr = dataIndex.split("?.");
        var dataIndexArr = record[dataIndexAr[0]];

        for (let index = 1; index < dataIndexAr?.length; index++) {
          dataIndexArr = dataIndexArr[dataIndexAr[index]];
        }
        console.log(
          dataIndexArr.toString().toLowerCase().includes(value.toLowerCase())
        );
        return dataIndexArr
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        console.log(
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        );
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getMeetingDocument = (id) => {
    return new Api()
      .get_chat_byFileUrl({
        url: "traodoichiasetailieu/" + id,
      })
      .then((response) => {
        if (response?.data) {
          setDocList(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getMeetingDocument(scheduleId);
  //   }, 5000);
  // }, []);

  const onUpload = () => {
    handleUpload(
      fileListUpLoad,
      setFileListUpLoad,
      "traodoichiasetailieu/" + scheduleId,
      setUploading,
      docList,
      scheduleId,
      user,
      getMeetingDocument
    );
  };

  return (
    <div
      style={{
        margin:
          marginTopLayout +
          marginRightLayout +
          " 0px " +
          (!Helper.isNullOrUndefined(
            document.getElementById("meeting-sidebar")?.offsetWidth
          ) &&
            Number(
              -document.getElementById("meeting-sidebar")?.offsetWidth - 7.5 - 8
              // window.screen.width
            )) +
          "px",
      }}
    >
      <Card
        title={window.innerWidth > 992 && "Trao đổi, chia sẻ tài liệu"}
        // extra={<a href="#">More</a>}
        style={{
          marginTop: window.innerWidth < 992 && "-10px",
        }}
      >
        <Row>
          <Col
            span={24}
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              minHeight: "400px",
              maxHeight: "400px",
            }}
          >
            <div
              style={{
                padding: "10px",
              }}
            >
              <ScrollbarsCustum
                style={{
                  height: "380px",
                }}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
              >
                {docList
                  .filter((item) => item?.isDeleted === false)
                  .sort(
                    (a, b) =>
                      new Date(a?.createdDate) - new Date(b?.createdDate)
                  )
                  .map((item, index) => (
                    <div style={{ textAlign: "end" }}>
                      <p
                        title={
                          "Người gửi: " +
                          item?.userInfo?.ten_day_du +
                          "\nThời gian gửi: " +
                          moment(item?.createdDate).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )
                        }
                        style={{
                          textAlign:
                            user?.id === item?.createdBy ? "end" : "start",
                          // float: user?.id === item?.createdBy && "inline-end",
                          marginBottom: "5px",
                          display:
                            user?.id === item?.createdBy && "inline-block",
                        }}
                      >
                        <div
                          style={{
                            background:
                              user?.id === item?.createdBy
                                ? "#82befb"
                                : "#e3e3e3",
                            borderRadius: "5px",
                            padding: "5px",
                            width: "max-content",
                          }}
                        >
                          {user?.id !== item?.createdBy && (
                            <>
                              <i className="fas fa-user-circle"></i>
                              <i> {item?.userInfo?.ten_day_du}</i>
                              <br />
                            </>
                          )}
                          {" " + item?.content + " "}
                          {/* {user?.id === item?.createdBy && (
                            <i className="fas fa-user-circle"></i>
                          )} */}
                          <br />
                          {item?.originalName && (
                            <span
                              style={{
                                background:
                                  user?.id === item?.createdBy
                                    ? "#82befb"
                                    : "#e3e3e3",
                                borderRadius: "5px",
                                padding: "5px",
                              }}
                            >
                              <i className="fas fa-download info"></i>{" "}
                              <a
                                href
                                onClick={() => {
                                  if (item?.url) {
                                    new Api()
                                      .Get_link_download({
                                        objectKey:
                                          item?.url + "/" + item?.originalName,
                                        fileName: item?.originalName,
                                      })
                                      .then((e) => {
                                        // return window.open(e?.data, "_blank");
                                        // return setLink(e?.data);
                                      });
                                  }
                                }}
                              >
                                {item?.originalName}
                              </a>
                            </span>
                          )}
                          {/* {user?.id !== item?.createdBy && (
                          )} */}
                          <i style={{ fontSize: "8px" }}>
                            {moment(item?.createdDate).format(
                              "DD/MM/YYYY HH[h]mm"
                            )}
                          </i>
                        </div>
                      </p>
                    </div>
                  ))}
              </ScrollbarsCustum>
            </div>
          </Col>
          {meetingData?.schedule?.status !== 3 && (
            <Col span={24}>
              <UploadFile
                setFieldValue={setDocPostList}
                fileListUpLoad={fileListUpLoad}
                setFileListUpLoad={setFileListUpLoad}
                setDefaultFileList={setDocPostList}
                defaultFileList={
                  docPostList &&
                  docPostList.map((obj) => {
                    return {
                      uid: obj?.uid ? obj?.uid : obj?.title,
                      id: obj?.id,
                      lastModifiedDate: obj?.lastModifiedDate
                        ? obj?.lastModifiedDate
                        : obj?.createdDate,
                      name: obj?.originalName ? obj?.originalName : obj?.name,
                      size: obj?.size,
                      type: obj?.type,
                      status: "done",
                      url: obj?.url,
                    };
                  })
                }
              />
              <Space.Compact
                size="large"
                style={{
                  width: "100%",
                }}
              >
                {/* <Input defaultValue="Combine input and button" />
              <Button type="primary">Submit</Button> */}
                <Button
                  className="btn-default"
                  onClick={() => {
                    getMeetingDocument(scheduleId);
                  }}
                  loading={uploading}
                >
                  <i class="fas fa-sync-alt info"></i> Tải lại
                </Button>
                <Input
                  count={{
                    show: true,
                    max: 500,
                  }}
                  placeholder="Nhập nội dung trao đổi"
                  defaultValue={contentChat}
                  value={contentChat}
                  onChange={(e) => {
                    setContentChat(e?.target.value);
                  }}
                  onPressEnter={() => {
                    // return console.log(fileListUpLoad);
                    handleUpload(
                      // contentChat,
                      fileListUpLoad,
                      setFileListUpLoad,
                      "traodoichiasetailieu/" + scheduleId,
                      setUploading,
                      docPostList,
                      scheduleId,
                      user || 0,
                      getMeetingDocument,
                      contentChat
                    );
                    setContentChat(null);
                    setUploading(false);
                    setDocPostList([]);
                    getMeetingDocument(scheduleId);
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    // return console.log(fileListUpLoad);
                    handleUpload(
                      // contentChat,
                      fileListUpLoad,
                      setFileListUpLoad,
                      "traodoichiasetailieu/" + scheduleId,
                      setUploading,
                      docPostList,
                      scheduleId,
                      user || 0,
                      getMeetingDocument,
                      contentChat
                    );
                    setContentChat(null);
                    setUploading(false);
                    setDocPostList([]);
                    getMeetingDocument(scheduleId);
                  }}
                  disabled={Helper.isNullOrUndefined(contentChat)}
                  loading={uploading}
                  icon={<CloudUploadOutlined />}
                >
                  {uploading ? "Đang gửi lên" : "Gửi lên"}
                </Button>
              </Space.Compact>
            </Col>
          )}
        </Row>
      </Card>
    </div>
  );
}

const RenderTitle = ({ e, record }) => {
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  return (
    <>
      {/* {JSON.stringify(record)} */}
      <Input
        defaultValue={record?.title}
        onChange={(e) => {
          // console.log(e.target.value);
          // console.log(record?.title);
          // console.log(e.target.value !== record?.title);
          if (e.target.value !== record?.title) {
            setWarning("Sau khi thay đổi nhấn 'Enter' để cập nhật");
          } else {
            setWarning("");
            setError("");
          }
        }}
        onPressEnter={(e) => {
          if (Helper.isNullOrUndefined(e.target.value)) {
            return setError("Không được để trống");
          }
          new Api().update_meeting_document({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              id: record?.id,
              title: e.target.value,
              scheduleId: record?.scheduleId,
              fileUrl: record?.url,
              fileOriginalName: record?.originalName,
              fileSystemName: record?.systemName,
              fileSize: record?.size,
              fileType: record?.type,
              modifiedDate: new Date(),
              modifiedBy: record?.modifiedBy,
              status: record?.status,
            },
          });
          setWarning("");
          setError("");
        }}
      />
      {!Helper.isNullOrUndefined(warning) && (
        <Alert message={warning} type="warning" showIcon closable />
      )}
      {!Helper.isNullOrUndefined(error) && (
        <Alert message={error} type="error" showIcon />
      )}
    </>
  );
};
