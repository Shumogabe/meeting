import React from "react";
import ReactSelect from "react-select";
import Helper from "../../helper/helper";

export default function Sharerole({
  chairManOptions,
  chairMan,
  setChairMan,
  GetList_User,
  shareRoleOptions,
  shareRole,
  setShareRole,
}) {
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">Chủ trì</label>
              <b className="text-danger">(*)</b>
            </div>
            <div className="col-md">
              <ReactSelect
                name="chairMan"
                placeholder="-- Tìm kiếm chủ trì --"
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
                  setChairMan(chairMan);
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
                  <td>{chairMan?.ten_day_du}</td>
                  <td>{chairMan?.email}</td>
                  <td>{chairMan?.so_dien_thoai}</td>
                  <td>{chairMan?.thong_tin_don_vi?.ten}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setChairMan(null);
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
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <label className="mt-1">Ủy quyền</label>
            </div>
            <div className="col-md">
              <ReactSelect
                name="chairMan"
                placeholder="-- Tìm kiếm ủy quyền --"
                isClearable={true}
                isSearchable={true}
                options={shareRoleOptions}
                defaultValue={
                  !Helper.isNullOrUndefined(shareRole) ? shareRole : null
                }
                getOptionLabel={(option) => (
                  <>
                    {option.ten_day_du + " - "}
                    <b>{option.ten_dangnhap}</b>
                  </>
                )}
                getOptionValue={({ id }) => id}
                onChange={(shareRole) => {
                  setShareRole(shareRole);
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
                  <td>{shareRole?.ten_day_du}</td>
                  <td>{shareRole?.email}</td>
                  <td>{shareRole?.so_dien_thoai}</td>
                  <td>{shareRole?.thong_tin_don_vi?.ten}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setShareRole(null);
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
    </>
  );
}
