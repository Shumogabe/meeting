import React, { useEffect, useState } from "react";
import { Col, DatePicker, Modal, Pagination, Row, Table } from "antd";
import moment from "moment";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import { HandleTabsUpdatePlan } from "./modalPlan";
const { RangePicker } = DatePicker;

export default function KeHoachHop({ permissions, user, setUser }) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [status, setStatus] = useState(1);
  const [isDeleted, setIsDeleted] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [documentCall, setDocumentCall] = useState(null);
  const [scheduleCal, setScheduleCal] = useState([]);
  const [id, setId] = useState(null);

  const getListPlanUnapproved = (
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted
  ) => {
    new Api()
      .getListPlanUnapproved({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        page: page,
        pageSize: pageSize,
        create: create,
        search: search,
        dateFrom: Helper.isNullOrUndefined(dateFrom) ? "01/01/0001" : dateFrom,
        dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
        isdeleted: false,
      })
      .then((e) => {
        setScheduleCal(e?.data);
        setTotal(e?.total);
      });
  };

  const getListPlanApproved = (
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted
  ) => {
    new Api()
      .getListPlanApproved({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        page: page,
        pageSize: pageSize,
        create: create,
        search: search,
        dateFrom: Helper.isNullOrUndefined(dateFrom) ? "01/01/0001" : dateFrom,
        dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
        isdeleted: false,
      })
      .then((e) => {
        setScheduleCal(e?.data);
        setTotal(e?.total);
      });
  };

  const onSetting = (id) => {
    onHandleCancel();
    if (id) {
      new Api()
        .getPlanScheduleDetail({
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
                  {e?.status === 1 && (
                    <a
                      href
                      role="button"
                      type="button"
                      title="Xem xét"
                      onClick={() => {
                        onSetting(e.id);
                        // setId(e.id);
                      }}
                    >
                      <i className="fas fa-check-double" />
                      Xem xét
                    </a>
                  )}
                  {e?.status === 2 && (
                    <a
                      href
                      role="button"
                      type="button"
                      title="Xem xét"
                      onClick={() => {
                        onSetting(e.id);
                        // setId(e.id);
                      }}
                    >
                      <i className="fas fa-check-double" />
                      Xem xét
                    </a>
                  )}
                </>
              )}
          </div>
        </>
      );
    }
  };

  const onHandleCancel = () => {
    setEdit([]);
    setScheduleId(null);
    //Document
    setDocumentCall([]);
    //Vote
    setOpenEdit(false);
    if (status === 1) {
      getListPlanUnapproved(
        page,
        size,
        user?.id,
        search,
        startTime,
        endTime,
        isDeleted
      );
    }
    if (status === 2) {
      getListPlanApproved(
        page,
        size,
        user?.id,
        search,
        startTime,
        endTime,
        isDeleted
      );
    }
  };

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(user?.id)) {
  //     getListPlanUnapproved(
  //       page,
  //       size,
  //       user?.id,
  //       search,
  //       startTime,
  //       endTime,
  //       isDeleted
  //     );
  //   }
  // }, [user]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(user?.id)) {
      if (status === 1) {
        getListPlanUnapproved(
          page,
          size,
          user?.id,
          search,
          startTime,
          endTime,
          isDeleted
        );
      }
      if (status === 2) {
        getListPlanApproved(
          page,
          size,
          user?.id,
          search,
          startTime,
          endTime,
          isDeleted
        );
      }
    }
  }, [search, startTime, endTime, status, isDeleted, page, size, user]);

  useEffect(() => {
    if (status === 3 && isDeleted === false) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(null);
    }
  }, [status, isDeleted]);

  return (
    <>
      <Row>
        <Col span={12}>
          <ul
            className="nav nav-tabs mb-1"
            id="custom-content-below-tab"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                id="custom-content-below-pending-tab"
                data-toggle="pill"
                href="#custom-content-below-pending"
                role="tab"
                aria-controls="custom-content-below-pending"
                aria-selected="true"
                onClick={() => {
                  setStatus(1);
                }}
                style={{
                  opacity: 0.8,
                }}
              >
                CHỜ DUYỆT
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="custom-content-below-finished-tab"
                data-toggle="pill"
                href="#custom-content-below-finished"
                role="tab"
                aria-controls="custom-content-below-finished"
                aria-selected="false"
                onClick={() => {
                  setStatus(2);
                }}
                style={{
                  opacity: 0.8,
                }}
              >
                ĐÃ DUYỆT
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <div className="tab-content" id="custom-content-below-tabContent">
        <div className="input-group form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tiêu đề kế hoạch họp"
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
              title: "Số/Ký hiệu",
              dataIndex: "symbol",
            },
            {
              title: "Trích yếu",
              dataIndex: "abstract",
            },
            {
              // key: "",
              title: "Ngày ban hành",
              dataIndex: "dateIssued",
              render: (value, record) => (
                <>{moment(value).format("DD-MM-YYYY")}</>
              ),
              // width: "20%",
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
          setOpenEdit(false);
          onHandleCancel();
        }}
        onCancel={() => {
          setOpenEdit(false);
          onHandleCancel();
        }}
        footer={""}
        ok
        width={window.innerWidth / 2}
        // style={{ height: "500px" }}
        zIndex={1038}
      >
        <HandleTabsUpdatePlan
          // contentCall={contentCall}
          // memberCall={memberCall}
          // memberEmailCall={memberEmailCall}
          // documentCall={documentCall}
          id={id}
          edit={edit}
          onHandleCancel={onHandleCancel}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
      </Modal>
    </>
  );
}
