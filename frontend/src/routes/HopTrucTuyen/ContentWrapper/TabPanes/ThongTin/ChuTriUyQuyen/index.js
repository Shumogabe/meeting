import React, { useEffect, useState } from "react";
import { Table } from "antd";
import ReactSelect from "react-select";
import Api from "../../../../../../api";
import { SwalAlertAllConfiguration } from "../../../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../../../config";
import Helper from "../../../../../../helper/helper";
let timeoutUser;
let currentValueUser;
export default function ChuTriUyQuyen({
  scheduleId,
  meetingData,
  owner,
  user,
}) {
  const [chairMan, setChairMan] = useState(meetingData?.schedule?.userChairMan);
  const [chairManOptions, setChairManOptions] = useState([]);
  const [shareRole, setShareRole] = useState(
    meetingData?.schedule?.userShareRole
  );
  const [shareRoleOptions, setShareRoleOptions] = useState([]);
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
            if (obj === 1) setChairManOptions(dataOption);
            if (obj === 2) setShareRoleOptions(dataOption);
          }
        })
        .catch((err) =>
          SwalAlertAllConfiguration({
            title: "Thông báo!",
            text: err?.message,
            icon: "warning",
          })
        );
    };
    if (value === null) {
      if (obj === 1) setChairManOptions([]);
      if (obj === 2) setShareRoleOptions([]);
    } else {
      timeoutUser = setTimeout(fake, 800);
    }
  };
  useEffect(() => {
    setChairMan(meetingData?.schedule?.userChairMan);
  }, [meetingData?.schedule?.userChairMan]);
  useEffect(() => {
    setShareRole(meetingData?.schedule?.userShareRole);
  }, [meetingData?.schedule?.userShareRole]);
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="row form-group">
            <div className="col-md-2">
              <label className="mt-1">Chủ trì</label>
            </div>
            <div className="col-md"></div>
          </div>
          {owner === 1 && (
            <ReactSelect
              name="chairMan"
              placeholder="-- Chọn chủ trì --"
              isClearable={true}
              isSearchable={true}
              options={chairManOptions}
              defaultValue={
                !Helper.isNullOrUndefined(chairMan) ? chairMan : null
              }
              getOptionLabel={(option) => (
                <>
                  {option.ten_day_du + " - "}
                  <b>{option.ten_dangnhap}</b>
                </>
              )}
              getOptionValue={({ id }) => id}
              onChange={(chairMan) => {
                // alert(JSON.stringify(chairMan));
                setChairMan([chairMan]);
                if (chairMan !== null) {
                  new Api()
                    .schedule_chairMan({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      id: scheduleId,
                      data: {
                        chairMan: chairMan?.id,
                        createdDate: new Date(),
                        createdBy: user?.id,
                      },
                    })
                    .then(() => {
                      SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Thêm thành công",
                        timer: 2000,
                        icon: "success",
                      });
                    });
                }
              }}
              onInputChange={(inputText, meta) => {
                if (
                  meta.action !== "input-blur" &&
                  meta.action !== "menu-close"
                ) {
                  GetList_User(inputText, 1);
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
          )}
          {!Helper.isNullOrUndefined(meetingData?.schedule?.userChairMan) && (
            <Table
              locale={{
                emptyText: "Không có dữ liệu.",
              }}
              columns={[
                {
                  title: "Họ tên",
                  dataIndex: "ten_day_du",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                },
                {
                  title: "Số điện thoại",
                  dataIndex: "so_dien_thoai",
                },
                {
                  title: "Đơn vị",
                  dataIndex: "donvi",
                  render: (_, record) => record?.thong_tin_don_vi?.ten,
                },
              ]}
              dataSource={[chairMan]}
            />
            // <table className="table table-bordered table-hover">
            //   <thead>
            //     <tr>
            //       <th>Họ tên</th>
            //       <th>Email</th>
            //       <th>Số điện thoại</th>
            //       <th>Đơn vị</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     <tr>
            //       <td>{meetingData?.schedule?.userChairMan?.fullName}</td>
            //       <td>{meetingData?.schedule?.userChairMan?.email}</td>
            //       <td>{meetingData?.schedule?.userChairMan?.phoneNumber}</td>
            //       <td>{meetingData?.schedule?.userChairMan?.organ?.title}</td>
            //     </tr>
            //   </tbody>
            // </table>
          )}
        </div>
        <div className="col-md-12">
          <div className="row form-group">
            <div className="col-md-2">
              <label className="mt-1">Ủy quyền</label>
            </div>
            <div className="col-md"></div>
          </div>
          {owner === 1 && (
            <ReactSelect
              name="chairMan"
              placeholder="-- Chọn ủy quyền --"
              isClearable={true}
              isSearchable={true}
              options={shareRoleOptions}
              defaultValue={
                !Helper.isNullOrUndefined(shareRole) ? shareRole : undefined
              }
              getOptionLabel={(option) => (
                <>
                  {option.ten_day_du + " - "}
                  <b>{option.ten_dangnhap}</b>
                </>
              )}
              getOptionValue={({ id }) => id}
              onChange={(shareRole) => {
                // alert(JSON.stringify(shareRole));
                setShareRole([shareRole]);
                if (shareRole !== null) {
                  new Api()
                    .schedule_shareRole({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      id: scheduleId,
                      data: {
                        sharedRole: shareRole?.id,
                        createdDate: new Date(),
                        createdBy: user?.id,
                      },
                    })
                    .then(() => {
                      SwalAlertAllConfiguration({
                        title: "Thông báo",
                        text: "Thêm thành công",
                        timer: 2000,
                        icon: "success",
                      });
                    });
                }
              }}
              onInputChange={(inputText, meta) => {
                if (
                  meta.action !== "input-blur" &&
                  meta.action !== "menu-close"
                ) {
                  GetList_User(inputText, 2);
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
          )}
          {!Helper.isNullOrUndefined(meetingData?.schedule?.userShareRole) && (
            <Table
              locale={{
                emptyText: "Không có dữ liệu.",
              }}
              columns={[
                {
                  title: "Họ tên",
                  dataIndex: "ten_day_du",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                },
                {
                  title: "Số điện thoại",
                  dataIndex: "so_dien_thoai",
                },
                {
                  title: "Đơn vị",
                  dataIndex: "donvi",
                  render: (_, record) => record?.thong_tin_don_vi?.ten,
                },
              ]}
              dataSource={[shareRole]}
            />
            // <table className="table table-bordered table-hover">
            //   <thead>
            //     <tr>
            //       <th>Họ tên</th>
            //       <th>Email</th>
            //       <th>Số điện thoại</th>
            //       <th>Đơn vị</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     <tr>
            //       <td>{meetingData?.schedule?.userShareRole?.fullName}</td>
            //       <td>{meetingData?.schedule?.userShareRole?.email}</td>
            //       <td>{meetingData?.schedule?.userShareRole?.phoneNumber}</td>
            //       <td>{meetingData?.schedule?.userShareRole?.organ?.title}</td>
            //     </tr>
            //   </tbody>
            // </table>
          )}
        </div>
      </div>
    </>
  );
}
