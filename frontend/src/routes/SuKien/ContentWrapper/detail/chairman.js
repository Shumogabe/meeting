import React from "react";
import ReactSelect from "react-select";
import Api from "../../../../api";
import { SESSION_STORAGE } from "../../../../config";
import Helper from "../../../../helper/helper";

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
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <label className="mt-1">Chủ trì</label>
            <b className="text-danger">(*)</b>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{chairMan?.ten_day_du}</td>
                <td>{chairMan?.email}</td>
                <td>{chairMan?.so_dien_thoai}</td>
                <td>{chairMan?.thong_tin_don_vi?.ten}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <label className="mt-1">Ủy quyền</label>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{shareRole?.ten_day_du}</td>
                <td>{shareRole?.email}</td>
                <td>{shareRole?.so_dien_thoai}</td>
                <td>{shareRole?.thong_tin_don_vi?.ten}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
