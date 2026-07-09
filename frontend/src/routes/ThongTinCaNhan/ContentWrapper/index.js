import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Pagination,
  Select,
  Table,
} from "antd";
import axios from "axios";
import moment from "moment";
import Api from "../../../api";
import { CheckUser, HandleTabs } from "../../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalAlertTimeRedirect,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import { HandleTabsUpdate } from "./modal";
const { RangePicker } = DatePicker;
const { Option } = Select;

let timeoutDonVi;
let currentValueDonVi;
let timeoutChucVu;
let currentValueChucVu;

export default function ContentWrapper({
  title,
  openAdd,
  setOpenAdd,
  onCloseModal,
  permissions,
  user,
  setUser,
}) {
  const [
    choPhepNguoiDungCapNhatThongTinCaNhan,
    setChoPhepNguoiDungCapNhatThongTinCaNhan,
  ] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const [listDonVi, setListDonVi] = useState([]);
  const [listChucVu, setListChucVu] = useState([]);

  const [data, setData] = useState(
    !Helper.isNullOrUndefined(user) && [
      {
        name: ["ten_day_du"],
        value: user?.ten_day_du,
      },
      {
        name: ["so_dien_thoai"],
        value: user?.so_dien_thoai,
      },
      {
        name: ["email"],
        value: user?.email,
      },
      {
        name: ["thong_tin_don_vi"],
        value: user?.thong_tin_don_vi?.ma + "_" + user?.thong_tin_don_vi?.ten,
      },
      {
        name: ["thong_tin_chuc_vu"],
        value: user?.thong_tin_chuc_vu?.ma + "_" + user?.thong_tin_chuc_vu?.ten,
      },
    ]
  );

  const [form] = Form.useForm();

  const get_donvi_bySearch = (value, callback) => {
    if (timeoutDonVi) {
      clearTimeout(timeoutDonVi);
      timeoutDonVi = null;
    }
    currentValueDonVi = value;
    const fake = () => {
      new Api()
        .get_donvi_bySearch({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            tu_khoa: currentValueDonVi,
          },
        })
        .then((e) => {
          callback(e?.records);
        });
    };
    if (value) {
      timeoutDonVi = setTimeout(fake, 300);
    } else {
      timeoutDonVi = setTimeout(fake, 300);
      // callback([]);
    }
  };

  const get_chucvu_bySearch = (value, callback) => {
    if (timeoutChucVu) {
      clearTimeout(timeoutChucVu);
      timeoutChucVu = null;
    }
    currentValueChucVu = value;
    const fake = () => {
      new Api()
        .get_chucvu_bySearch({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            tu_khoa: currentValueChucVu,
          },
        })
        .then((e) => {
          callback(e?.records);
        });
    };
    if (value) {
      timeoutChucVu = setTimeout(fake, 300);
    } else {
      timeoutChucVu = setTimeout(fake, 300);
      // callback([]);
    }
  };

  useEffect(() => {
    if (isEdit === true) {
      form.resetFields();
      get_donvi_bySearch("", setListDonVi);
      get_chucvu_bySearch("", setListChucVu);
      setData(
        !Helper.isNullOrUndefined(user) && [
          {
            name: ["ten_day_du"],
            value: user?.ten_day_du,
          },
          {
            name: ["so_dien_thoai"],
            value: user?.so_dien_thoai,
          },
          {
            name: ["email"],
            value: user?.email,
          },
          {
            name: ["thong_tin_don_vi"],
            value:
              user?.thong_tin_don_vi &&
              user?.thong_tin_don_vi?.ma + "_" + user?.thong_tin_don_vi?.ten,
          },
          {
            name: ["thong_tin_chuc_vu"],
            value:
              user?.thong_tin_chuc_vu &&
              user?.thong_tin_chuc_vu?.ma + "_" + user?.thong_tin_chuc_vu?.ten,
          },
        ]
      );
    }
  }, [isEdit]);

  useEffect(() => {
    new Api()
      .LayRaThietLapCauHinh(
        "tl_ch_nguoidung",
        "ChoPhepNguoiDungCapNhatThongTinCaNhan"
      )
      .then((res) => {
        if (res.code === 200) {
          setChoPhepNguoiDungCapNhatThongTinCaNhan(res?.data?.giatri);
        }
      });
  }, []);

  return (
    <div className="content-wrapper mt-3">
      {/* Content Header (Page header) */}
      <div id="content-header" className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">{title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href={HREF.TrangChu}>
                    <i className="fas fa-home" />
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href={HREF.LichHop}>{title}</a>
                </li>
                <li className="breadcrumb-item active">Thông tin cá nhân</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* /.content-header */}
      {/* Main content */}
      {isEdit === false ? (
        <section className="content">
          <div className="container-fluid">
            <div className="card card-info card-outline">
              <div
                className="card-header ui-sortable-handle"
                style={{ cursor: "move" }}
              >
                <h3 className="card-title">
                  <i className="fas fa-info info" /> THÔNG TIN
                </h3>
              </div>
              <div className="card-body">
                <div className="row form-group">
                  <div className="col-md-2">
                    <label>Họ và tên</label>
                  </div>
                  <div className="col-md-9">{user?.ten_day_du}</div>
                </div>
                <div className="row form-group">
                  <div className="col-md-2">
                    <label>Đơn vị công tác</label>
                  </div>
                  <div className="col-md-9">{user?.thong_tin_don_vi?.ten}</div>
                </div>
                <div className="row form-group">
                  <div className="col-md-2">
                    <label>Chức vụ</label>
                  </div>
                  <div className="col-md-9">{user?.thong_tin_chuc_vu?.ten}</div>
                </div>
                <div className="row form-group">
                  <div className="col-md-2">
                    <label>Điện thoại</label>
                  </div>
                  <div className="col-md-9">{user?.so_dien_thoai}</div>
                  {/*<div class="col-md-1"><a href="#" class="btn btn-sm btn-info"><i class="fas fa-edit"></i> Cập nhật</a></div>*/}
                </div>
                <div className="row form-group">
                  <div className="col-md-2">
                    <label>Email</label>
                  </div>
                  <div className="col-md-9">{user?.email}</div>
                  {/*<div class="col-md-1"><a href="#" class="btn btn-sm btn-info"><i class="fas fa-edit"></i> Cập nhật</a></div>*/}
                </div>
                {choPhepNguoiDungCapNhatThongTinCaNhan === "1" && (
                  <div className="row form-group">
                    <div className="col-md-12 align-center">
                      <a
                        href
                        className="btn btn-sm btn-info"
                        onClick={() => setIsEdit(true)}
                      >
                        <i className="fas fa-edit" /> Sửa
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* /.card */}
          </div>
          {/* /.card */}
        </section>
      ) : (
        <section className="content">
          <div className="container-fluid">
            <div className="card card-info card-outline">
              <div
                className="card-header ui-sortable-handle"
                style={{ cursor: "move" }}
              >
                <h3 className="card-title">
                  <i className="fas fa-edit info" /> SỬA THÔNG TIN
                </h3>
              </div>
              <div className="card-body">
                <Form
                  // wrapperCol={{
                  //   span: 14,
                  // }}
                  // layout="horizontal"
                  fields={data}
                  onFieldsChange={(_, allFields) => {
                    setData(allFields);
                  }}
                  form={form}
                  style={{
                    padding: window.innerWidth <= 700 ? "0" : "0 25%",
                  }}
                  layout={"vertical"}
                  onFinish={(values) => {
                    values.id = user?.id;
                    values.ten_dangnhap =
                      user?.ten_dangnhap ??
                      JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.profile?.sub;
                    values.ma_tochuc = values?.thong_tin_don_vi?.split("_")[0];
                    values.ma_chucvu = values?.thong_tin_chuc_vu?.split("_")[0];
                    values.thoigian_tao = user?.thoigian_tao;
                    values.thong_tin_don_vi = null;
                    values.thong_tin_chuc_vu = null;
                    console.log("Success:", values);

                    new Api()
                      .update_user({
                        token: JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE)
                        )?.access_token,
                        data: values,
                      })
                      .then((res) => {
                        if (res) {
                          SwalAlertAllConfiguration({
                            title: "Thông báo!",
                            text: "Sửa thông tin thành công",
                            icon: "success",
                            timer: 3000,
                          });
                          form.resetFields();
                          CheckUser().then((usr) => {
                            if (Helper.isNullOrUndefined(usr)) {
                            } else {
                              setUser(usr);
                            }
                          });
                          setIsEdit(false);
                        }
                      });
                  }}
                  onFinishFailed={(errorInfo) => {
                    // if (fileListUpLoad.length <= 0) {
                    //   setError("Vui lòng tải lên file!");
                    // } else {
                    //   setError(null);
                    // }
                    console.log("Failed:", errorInfo);
                  }}
                >
                  <Form.Item
                    label=""
                    name="ten_day_du"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập họ tên đầy đủ!",
                    //   },
                    // ]}
                  >
                    <Input
                      size="large"
                      suffix={<i className="fas fa-user" />}
                    />
                  </Form.Item>
                  <Form.Item
                    label=""
                    name="so_dien_thoai"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập số điện thoại!",
                    //   },
                    // ]}
                  >
                    <Input
                      size="large"
                      suffix={<i className="fas fa-phone" />}
                    />
                  </Form.Item>
                  <Form.Item
                    label=""
                    name="email"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập email!",
                    //   },
                    // ]}
                  >
                    <Input
                      size="large"
                      suffix={<i className="fas fa-envelope" />}
                    />
                  </Form.Item>
                  <Form.Item
                    label=""
                    name="thong_tin_don_vi"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập thông tin đơn vị!",
                    //   },
                    // ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      onSearch={(e) => get_donvi_bySearch(e, setListDonVi)}
                      placeholder="Tìm kiếm tên đơn vị"
                      // filterOption={false}
                      // defaultActiveFirstOption={false}
                      notFoundContent={null}
                      suffixIcon={<i className="fas fa-users" />}
                    >
                      {listDonVi.map((e, i) => (
                        <Option value={e?.ma + "_" + e?.ten}>{e?.ten}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label=""
                    name="thong_tin_chuc_vu"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập thông tin chức vụ!",
                    //   },
                    // ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      onSearch={(e) => get_chucvu_bySearch(e, setListChucVu)}
                      placeholder="Tìm kiếm tên chức vụ"
                      // filterOption={false}
                      // defaultActiveFirstOption={false}
                      notFoundContent={null}
                      suffixIcon={<i className="fas fa-cogs" />}
                    >
                      {listChucVu.map((e) => (
                        <Option value={e?.ma + "_" + e?.ten}>{e?.ten}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ textAlign: "center" }}>
                    <Button type="default" onClick={() => setIsEdit(false)}>
                      <i className="fas fa-undo-alt"></i> Quay lại
                    </Button>{" "}
                    <Button type="primary" htmlType="submit">
                      <i className="fas fa-edit" /> Ghi
                    </Button>
                  </Form.Item>
                </Form>
                {/* <form
                  action
                  method="post"
                  className="login-box"
                  style={{ margin: "0 auto" }}
                >
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Họ và tên"
                      value={ten}
                      onChange={(e) => setTen(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-user" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Điện thoại"
                      value={sdt}
                      onChange={(e) => setSdt(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-phone" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-envelope" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <select className="form-control">
                      <option> - Chọn đơn vị - </option>
                      {listDonVi.map((item, index) => (
                        <option> {item?.ten} </option>
                      ))}
                    </select>
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-users" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <select className="form-control">
                      <option> - Chọn chức vụ - </option>
                    </select>
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-cogs" />
                      </div>
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12 align-center">
                      <a
                        href
                        className="btn btn-sm"
                        onClick={() => setIsEdit(false)}
                      >
                        <i className="fas fa-undo-alt"></i> Quay lại
                      </a>{" "}
                      <a
                        href
                        className="btn btn-sm btn-info"
                        onClick={() => {
                          get_donvi_bySearch("", setListDonVi);
                        }}
                      >
                        <i className="fas fa-edit" /> Ghi
                      </a>
                    </div>
                  </div>
                </form> */}
              </div>
            </div>
            {/* /.card */}
          </div>
          {/* /.card */}
        </section>
      )}
    </div>
  );
}
