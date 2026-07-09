import React from "react";
import { Table } from "antd";
import Helper from "../../../helper/helper";
import Api from "../../../api";
import { SESSION_STORAGE } from "../../../config";
import ReactSelect from "react-select";

export default function ChairMan({
  chairManOptions,
  chairMan,
  setChairMan,
  GetList_User,
  shareRoleOptions,
  shareRole,
  setShareRole,
  id,
  user,
}) {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row form-group">
          <div className="col-md-2">
            <label className="mt-1">Chủ trì</label>
          </div>
          <div className="col-md"></div>
        </div>
        {!Helper.isNullOrUndefined(chairMan) && (
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
        )}
      </div>
      <div className="col-md-12">
        <div className="row form-group">
          <div className="col-md-2">
            <label className="mt-1">Ủy quyền</label>
          </div>
          <div className="col-md">
            <ReactSelect
              name="chairMan"
              placeholder="-- Tìm kiếm tên ủy quyền --"
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
                    id: id,
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
        )}
      </div>
    </div>
  );
}
