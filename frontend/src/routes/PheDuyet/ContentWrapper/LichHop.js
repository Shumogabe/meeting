import React, { useEffect, useState } from "react";
import { DatePicker, Modal, Pagination, Table } from "antd";
import moment from "moment";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import { HandleTabsUpdate } from "./modal";
const { RangePicker } = DatePicker;

export default function LichHop({ permissions, user, setUser }) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [meetingData, setMeetingData] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [edit, setEdit] = useState([]);
  const [openEdit, setOpenEdit] = useState(0);
  const [id, setId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [passwordRoom, setPasswordRoom] = useState(null);
  const [scheduleCal, setScheduleCal] = useState([]);
  const [contentCall, setContentCall] = useState([]);
  const [memberCall, setMemberCall] = useState([]);
  const [memberEmailCall, setMemberEmailCall] = useState([]);
  const [documentCall, setDocumentCall] = useState([]);
  const [voteCall, setVoteCall] = useState([]);
  const [url, setUrl] = useState(null);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [status, setStatus] = useState(12);
  const [start, setStart] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const getScheduleByUser = (
    id,
    keySearch,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize
  ) => {
    if (!Helper.isNullOrUndefined(id)) {
      setScheduleCal([]);
      setLoading(true);
      new Api()
        .get_schedule_byStatus({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
          keySearch: keySearch,
          dateFrom: Helper.isNullOrUndefined(dateFrom)
            ? "01/01/0001"
            : dateFrom,
          dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
          status: status,
          start: start,
          isdeleted: isdeleted,
          page: page,
          pageSize: pageSize,
        })
        .then((response) => {
          if (response?.data) {
            setLoading(false);
            setScheduleCal(response?.data);
            setTotal(response?.totalRecords);
          }
        });
    }
  };

  const onSetting = (id) => {
    onHandleCancel();
    if (id) {
      new Api()
        .get_schedule_byId({
          id: id,
        })
        .then((response) => {
          if (response?.data?.id) {
            setId(id);
            setOpenEdit(true);
            setEdit(response?.data);
          } else {
            SwalAlertAllConfiguration({
              title: "Thông báo!",
              text: "Không tìm thấy thông tin phòng họp",
              icon: "warning",
            });
          }
        });
    } else
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Thông tin lịch không tồn tại",
        icon: "warning",
      });
  };

  const renderSwitchUser = (id, e, isOption) => {
    /* let a = 0;
    for (let index = 0; index < JSON.parse(localStorage.getItem('UserInfo')).UserInfo.Role.length; index++) {
      if (JSON.parse(localStorage.getItem('UserInfo')).UserInfo.Role[index]['id'] === 885) {
        a++;
        break;
      }
    } */
    if (isOption) {
      return (
        <>
          {/* <a href={HREF.HopTrucTuyen}>
            <i className="fas fa-video blue" /> Tham gia
          </a>
          <a href="./thiet-lap.html">
            <i className="fas fa-cogs orange" /> Thiết lập
          </a> */}
          <div className="setting-meeting d-flex justify-content-center align-items-center">
            {!Helper.isNullOrUndefined(permissions) &&
              permissions &&
              permissions?.includes(FUNC_PERMISSION.APPROVE) === true && (
                <>
                  <a
                    href
                    role="button"
                    type="button"
                    title="Phê duyệt"
                    onClick={() => {
                      onSetting(e.id);
                      // setId(e.id);
                    }}
                  >
                    <i className="fas fa-check-double" />
                    {/* Phê duyệt */}
                    Xem xét
                  </a>
                </>
              )}
          </div>
        </>
      );
    }
  };

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(user?.id)) {
  //     getScheduleByUser(
  //       user?.id,
  //       "",
  //       null,
  //       null,
  //       status,
  //       start,
  //       isDeleted,
  //       page,
  //       size
  //     );
  //   }
  // }, [user]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(user?.id)) {
      getScheduleByUser(
        user?.id,
        search,
        startTime,
        endTime,
        status,
        start,
        isDeleted,
        page,
        size
      );
    }
  }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);

  useEffect(() => {
    if (status === 3 && start === false && isDeleted === false) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(null);
    }
  }, [status, start, isDeleted]);

  const onHandleCancel = () => {
    setCalendar([]);
    setEdit([]);
    setId(null);
    setScheduleId(null);
    setPasswordRoom(null);
    //Content
    setContentCall([]);
    //Member
    setMemberCall([]);
    setMemberEmailCall([]);
    //Document
    setDocumentCall([]);
    //Vote
    setOpenEdit(false);
    getScheduleByUser(
      user?.id,
      search,
      startTime,
      endTime,
      status,
      start,
      isDeleted,
      page,
      size
    );
  };

  useEffect(() => {
    if (openEdit === false) {
      setId("");
      onHandleCancel();
    }
  }, [openEdit]);

  return (
    <>
      <div className="tab-content" id="custom-content-below-tabContent">
        <div className="input-group form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên hoặc tiêu đề phòng họp"
            aria-label="Từ khóa tìm kiếm"
            aria-describedby="basic-addon2"
            onChange={(e) => setSearch(e.target.value)}
          />
          <RangePicker
            showTime
            placeholder={["Từ", "Đến"]}
            onChange={(dates, dateStrings) => {
              setStartTime(dateStrings[0]);
              setEndTime(dateStrings[1]);
            }}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-default" type="button">
              <i className="fas fa-search info" /> TÌM KIẾM
            </button>
          </div>
        </div>
        <Table
          locale={{
            emptyText: "Không có dữ liệu.",
          }}
          rowSelection={
            selectedRowKeys === null
              ? false
              : {
                  selectedRowKeys,
                  onChange: (newSelectedRowKeys) => {
                    //console.log(
                    //  "selectedRowKeys changed: ",
                    //  newSelectedRowKeys
                    //);
                    setSelectedRowKeys(newSelectedRowKeys);
                  },
                }
          }
          columns={[
            {
              title: "Thời gian",
              dataIndex: "time",
              align: "center",
              width: "10%",
              render: (_, record) => (
                <div className="row">
                  <div className="col-sm-2 padding-top-1">
                    <i className="far fa-clock" />
                  </div>
                  <div className="col-sm-10 align-left">
                    {moment(record.startTime).format("HH:mm")} <br />
                    <span className="date-sm">
                      {moment(record.startTime).format("DD-MM-YYYY")}
                    </span>
                  </div>
                </div>
              ),
            },
            {
              title: "Nội dung",
              dataIndex: "content",
              render: (_, record) => (
                <>
                  {record.roomName}{" "}
                  {record?.start ? (
                    <i
                      className="fas fa-video"
                      style={{
                        color: "#ff0000",
                      }}
                    ></i>
                  ) : (
                    <></>
                  )}
                  <br />
                  <i
                    style={{
                      color: "#6e7680",
                      fontSize: "14px",
                    }}
                  >
                    {record.title}
                  </i>
                </>
              ),
            },
            {
              title: "Chọn",
              dataIndex: "Choose",
              align: "center",
              width: "40%",
              render: (_, record) => (
                <>{renderSwitchUser(user && user?.id, record, true)}</>
              ),
            },
          ]}
          rowKey={"id"}
          dataSource={scheduleCal}
          pagination={false}
          loading={loading}
        />
        <Pagination
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} trên ${total} đối tượng`
          }
          current={page}
          onChange={(page, size) => {
            setPage(page);
            setSize(size);
          }}
          total={total}
        />
      </div>
      <Modal
        title="Phê duyệt"
        centered
        open={openEdit}
        onOk={() => {
          onHandleCancel();
        }}
        onCancel={() => {
          onHandleCancel();
        }}
        footer={""}
        ok
        width={(window.innerWidth * 2) / 3}
        // style={{ height: "500px" }}
        zIndex={1038}
      >
        <HandleTabsUpdate
          // contentCall={contentCall}
          // memberCall={memberCall}
          // memberEmailCall={memberEmailCall}
          // documentCall={documentCall}
          openEdit={openEdit}
          edit={edit}
          id={id}
          onHandleCancel={onHandleCancel}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
      </Modal>
    </>
  );
}
