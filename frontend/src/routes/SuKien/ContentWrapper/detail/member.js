import React from "react";
import { Button, Table } from "antd";
import ReactSelect from "react-select";
import Api from "../../../../api";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../config";
import Helper from "../../../../helper/helper";

export default function Member({
  memberOptions,
  member,
  setMember,
  GetList_User,
  setMemberList,
  memberList,
  user,
  setMemberOptions,
  memberDeleteList,
  setMemberDeleteList,
  memberEmail,
  setMemberEmail,
  setMemberEmailList,
  memberEmailList,
  memberEmailDeleteList,
  setMemberEmailDeleteList,
  roomName,
  pass,
  getMeetingMember,
  scheduleId,
  startTime,
  errorMember,
  setErrorMember,
}) {
  return (
    <>
      <div id="accordion">
        <div className="card ">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <div
                className="btn btn-link collapsed card-title font-weight-bold"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                Đại biểu tham gia
              </div>
            </h5>
          </div>
          <div
            id="collapseOne"
            className=""
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div className="card-body">
              <>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    getMeetingMember(scheduleId);
                  }}
                >
                  Tải lại danh sách
                </Button>
                <div className="row mb-2"></div>
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  columns={[
                    {
                      title: "Họ tên",
                      dataIndex: "fullName",
                      sorter: (a, b) => a.fullName.length - b.fullName.length,
                    },
                    {
                      title: "Tài khoản",
                      dataIndex: "userName",
                      sorter: (a, b) => a.userName.length - b.userName.length,
                    },
                    {
                      title: "Email",
                      dataIndex: "email",
                      sorter: (a, b) => a.email.length - b.email.length,
                    },
                    {
                      title: "Tình trạng xác nhận",
                      dataIndex: "activated",
                      filters: [
                        {
                          text: "Đã xác nhận",
                          value: true,
                        },
                        {
                          text: "Chưa xác nhận",
                          value: false,
                        },
                      ],
                      onFilter: (value, record) => record.activated === value,
                      render: (e, record) => {
                        return <>{e ? "Đã xác nhận" : "Chưa xác nhận"}</>;
                      },
                    },
                  ]}
                  dataSource={memberList?.length > 0 && memberList}
                />
              </>
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <div
                className="btn btn-link collapsed card-title font-weight-bold"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Khách mời
              </div>
            </h5>
          </div>
          <div
            id="collapseTwo"
            className=""
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div className="card-body">
              <>
                <Button
                  style={{
                    marginRight: 16,
                  }}
                  onClick={() => {
                    getMeetingMember(scheduleId);
                  }}
                >
                  Tải lại danh sách
                </Button>
                <div className="row mb-2"></div>
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  columns={[
                    {
                      title: "Email",
                      dataIndex: "email",
                      sorter: (a, b) => a.email.length - b.email.length,
                    },
                    {
                      title: "Tình trạng xác nhận",
                      dataIndex: "activated",
                      filters: [
                        {
                          text: "Đã xác nhận",
                          value: true,
                        },
                        {
                          text: "Chưa xác nhận",
                          value: false,
                        },
                      ],
                      onFilter: (value, record) => record.activated === value,
                      render: (e, record) => {
                        return <>{e ? "Đã xác nhận" : "Chưa xác nhận"}</>;
                      },
                    },
                  ]}
                  dataSource={memberEmailList?.length > 0 && memberEmailList}
                />
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
