import React from "react";
import ReactSelect from "react-select";
import Api from "../../../api";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";

export default function ChairMan({
  chairManOptions,
  chairMan,
  setChairMan,
  GetList_User,
  shareRoleOptions,
  shareRole,
  setShareRole,
  scheduleId,
  user,
}) {
  return (
    <div className="row">
      <div className="col-md-6">
        <div className="row form-group">
          <div className="col-md-2">
            <label className="mt-1">Chủ trì</label>
            <b className="text-danger">(*)</b>
          </div>
          <div className="col-md">
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
                setChairMan(chairMan);
                if (chairMan !== null) {
                  new Api().schedule_chairMan({
                    token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                      ?.access_token,
                    id: scheduleId,
                    data: {
                      chairMan: chairMan?.id,
                      createdDate: new Date(),
                      createdBy: user?.id,
                    },
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
          </div>
        </div>
        {!Helper.isNullOrUndefined(chairMan) && (
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Đơn vị</th>
                <th className="align-center">Chọn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{chairMan?.fullName}</td>
                <td>{chairMan?.email}</td>
                <td>{chairMan?.phoneNumber}</td>
                <td>{chairMan?.organ?.title}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setChairMan(null);
                      new Api().schedule_chairMan({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        id: scheduleId,
                        data: {
                          chairMan: 0,
                          createdDate: new Date(),
                          createdBy: user?.id,
                        },
                      });
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="col-md-6">
        <div className="row form-group">
          <div className="col-md-2">
            <label className="mt-1">Ủy quyền</label>
          </div>
          <div className="col-md">
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
                setShareRole(shareRole);
                if (shareRole !== null) {
                  new Api().schedule_shareRole({
                    token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                      ?.access_token,
                    id: scheduleId,
                    data: {
                      sharedRole: shareRole?.id,
                      createdDate: new Date(),
                      createdBy: user?.id,
                    },
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
          </div>
        </div>

        {!Helper.isNullOrUndefined(shareRole) && (
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Đơn vị</th>
                <th className="align-center">Chọn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{shareRole?.fullName}</td>
                <td>{shareRole?.email}</td>
                <td>{shareRole?.phoneNumber}</td>
                <td>{shareRole?.organ?.title}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setShareRole(null);
                      new Api().schedule_shareRole({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        id: scheduleId,
                        data: {
                          sharedRole: 0,
                          createdDate: new Date(),
                          createdBy: user?.id,
                        },
                      });
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
