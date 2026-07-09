import React, { useLayoutEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import Api from "../../../api";
import ScrollbarsCustum from "../../../components/ScrollbarsCustum";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

export default function ChiTietDichVu({
  edit,
  onHandleCancel,
  setScheduleId,
  scheduleId,
  tinhTrang,
  detail,
  loaiDichVu,
}) {
  const [title, setTitle] = useState();
  const [hrefPageMain, setHrefPageMain] = useState();

  const [data, setData] = useState();

  const [doc, setDoc] = useState("");
  const [docList, setDocList] = useState([]);
  const [docPostList, setDocPostList] = useState([]);
  const [fieldValue, setFieldValue] = useState([]);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [listDonVi, setListDonVi] = useState([]);

  // const scrollBarRefTrangChuJoinRoom = useRef();
  const [form] = Form.useForm();

  useLayoutEffect(() => {}, []);

  const PheDuyet = (id) => {
    SwalAlertAllConfiguration({
      title: "Bạn có chắc muốn phê duyệt không?",
      text: "Khi bạn nhấn 'Đồng ý' sẽ phê duyệt!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Thoát",
      showLoaderOnConfirm: true,
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        new Api()
          .Duyet_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            key: loaiDichVu,
            id: id,
          })
          .then((e) => {
            onHandleCancel();
          });
        SwalAlertAllConfiguration({
          title: "Phê duyệt thành công",
          icon: "success",
          timer: 1500,
        });
      } else {
        return false;
      }
    });
  };

  const TuChoi = (id) => {
    SwalAlertAllConfiguration({
      title: "Bạn có chắc muốn từ chối không?",
      text: "Khi bạn nhấn 'Đồng ý' sẽ từ chối!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Thoát",
      showLoaderOnConfirm: true,
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        new Api()
          .HuyDuyet_DangKyDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            key: loaiDichVu,
            id: id,
          })
          .then((e) => {
            onHandleCancel();
          });
        SwalAlertAllConfiguration({
          title: "Từ chối thành công",
          icon: "success",
          timer: 1500,
        });
      } else {
        return false;
      }
    });
  };

  const CapPhat = (values) => {
    SwalAlertAllConfiguration({
      title:
        "Bạn có chắc muốn " +
        (loaiDichVu === "HuyDichVu" ? "hủy dịch vụ" : "cấp phát") +
        " không?",
      text:
        "Khi bạn nhấn 'Đồng ý' sẽ " +
        (loaiDichVu === "HuyDichVu" ? "hủy dịch vụ" : "cấp phát") +
        "!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Thoát",
      showLoaderOnConfirm: true,
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        values.id_DangKy = detail?.id;
        values.donVi = detail?.donVi;
        values.ngayBatDau = detail?.ngayBatDau;
        values.ngayKetThuc = detail?.ngayKetThuc;
        values.taiKhoan = Helper.isNullOrUndefined(values?.taiKhoan)
          ? ""
          : values?.taiKhoan.join(",");
        values.mayChu = Helper.isNullOrUndefined(values?.mayChu)
          ? ""
          : values?.mayChu;
        values.hoatDong = 1;
        new Api()
          .Them_CapDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            key: loaiDichVu,
            data: values,
          })
          .then((e) => {
            form.resetFields();
            onHandleCancel();
            SwalAlertAllConfiguration({
              title: "Cấp phát thành công",
              icon: "success",
              timer: 1500,
            });
          });
      } else {
        return false;
      }
    });
  };

  const HuyCap = () => {
    SwalAlertAllConfiguration({
      title:
        "Bạn có chắc muốn " +
        (loaiDichVu === "HuyDichVu" ? "khôi phục" : "hủy cấp") +
        " không?",
      text:
        "Khi bạn nhấn 'Đồng ý' sẽ " +
        (loaiDichVu === "HuyDichVu" ? "khôi phục" : "hủy cấp") +
        "!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Thoát",
      showLoaderOnConfirm: true,
      dangerMode: true,
    }).then((result) => {
      if (result.isConfirmed) {
        new Api()
          .Them_CapDichVu({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            key: loaiDichVu,
            data: {
              id_DangKy: detail?.id,
              donVi: detail?.donVi,
              ngayBatDau: detail?.ngayBatDau,
              ngayKetThuc: detail?.ngayKetThuc,
              taiKhoan: "",
              mayChu: "",
              hoatDong: 2,
            },
          })
          .then((e) => {
            form.resetFields();
            onHandleCancel();
            SwalAlertAllConfiguration({
              title: "Hủy cấp thành công",
              icon: "success",
              timer: 1500,
            });
          });
      } else {
        return false;
      }
    });
  };

  let timeout;
  let currentValue;
  const get_user_bySearch = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    const fake = () => {
      new Api()
        .get_user_bySearch({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            tu_khoa: currentValue,
          },
        })
        .then((e) => {
          callback(e?.records);
        });
    };
    if (value) {
      timeout = setTimeout(fake, 300);
    } else {
      callback([]);
    }
  };

  return (
    <>
      <ScrollbarsCustum
        // ref={scrollBarRefPheDuyetContentWrapperChiTietDichVu}
        style={{
          height: window.innerHeight / 2,
          maxHeight: window.innerHeight / 2 + "px",
          //           height: 300,
          // maxHeight: 300,
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <Form
          // labelCol={{
          //   span: 6,
          // }}
          // wrapperCol={{
          //   span: 14,
          // }}
          // layout="horizontal"
          form={form}
          fields={data}
          style={
            {
              // maxWidth: window.innerWidth / 3,
            }
          }
          layout={"vertical"}
          onFinish={(values) => {
            CapPhat(values);
          }}
          onFinishFailed={(errorInfo) => {
            if (fileListUpLoad.length <= 0) {
              setError("Vui lòng tải lên file!");
            } else {
              setError(null);
            }
            //console.log("Failed:", errorInfo);
          }}
        >
          <Row>
            <Col span={detail?.status === 2 ? 12 : 24}>
              <p style={{ textAlign: "center" }}>
                <b>Đơn đăng ký</b>
              </p>
              <p>
                <b>Tên đơn vị: </b>
                <span>{detail?.donVi}</span>
              </p>
              <p>
                <b>Nội dung: </b>
                <span>{detail?.noiDung}</span>
              </p>
              <p>
                <b>Thời gian đăng ký: </b>
                <span>
                  {moment(detail?.ngayBatDau * 1000).format("DD/MM/YYYY")} -{" "}
                  {moment(detail?.ngayKetThuc * 1000).format("DD/MM/YYYY")}
                </span>
              </p>
              <p>
                <b>Số lượng tài khoản: </b>
                <span>{detail?.soLuongTaiKhoan}</span>
              </p>
              <p>
                <b>Tệp tin đính kèm: </b>
                <span>
                  <a
                    style={{ textDecoration: "underline", color: "blue" }}
                    href
                    onClick={() => {
                      if (detail?.tepTin) {
                        new Api().Get_link_download({
                          objectKey: detail?.tepTin,
                          fileName:
                            detail?.tepTin.split("/")[
                              detail?.tepTin?.split("/")?.length - 1
                            ],
                        });
                        // .then((e) => {
                        //   // return window.open(e?.data, "_blank");
                        //   // return setLink(e?.data);
                        // });
                      }
                    }}
                  >
                    {
                      detail?.tepTin.split("/")[
                        detail?.tepTin?.split("/")?.length - 1
                      ]
                    }
                    {}
                  </a>
                </span>
              </p>
            </Col>
            <Col
              span={detail?.status === 2 ? 12 : 0}
              style={{
                borderLeft: detail?.status === 2 && "1px solid",
                paddingLeft: "10px",
              }}
            >
              <p style={{ textAlign: "center" }}>
                <b>{loaiDichVu === "HuyDichVu" ? "Hủy dịch vụ" : "Cấp phát"}</b>
              </p>
              <p>
                <b>Tên đơn vị: </b>
                <span>{detail?.donVi}</span>
              </p>
              <p>
                <b>Thời gian đăng ký: </b>
                <span>
                  {moment(detail?.ngayBatDau * 1000).format("DD/MM/YYYY")} -{" "}
                  {moment(detail?.ngayKetThuc * 1000).format("DD/MM/YYYY")}
                </span>
              </p>
              {loaiDichVu !== "HuyDichVu" && (
                <>
                  <Form.Item
                    label="Tài khoản"
                    name="taiKhoan"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập !",
                    //   },
                    // ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      onSearch={(e) => get_user_bySearch(e, setListDonVi)}
                      placeholder="Tìm kiếm tên tài khoản"
                      // filterOption={false}
                      // defaultActiveFirstOption={false}
                      notFoundContent={null}
                    >
                      {listDonVi.map((e) => (
                        <Option value={e?.ten_dangnhap}>
                          {e?.ten_day_du + " - " + e?.ten_dangnhap}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Máy chủ"
                    name="mayChu"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Vui lòng nhập !",
                    //   },
                    // ]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
          <Form.Item
            // wrapperCol={{
            //   offset: 9,
            //   span: 16,
            // }}
            style={{ textAlign: "center" }}
          >
            {window.location.pathname === HREF.PheDuyet && (
              <>
                {detail?.status === 1 && (
                  <>
                    <Button type="primary" onClick={() => PheDuyet(detail?.id)}>
                      Phê duyệt
                    </Button>{" "}
                    <Button danger onClick={() => TuChoi(detail?.id)}>
                      Từ chối
                    </Button>
                  </>
                )}
                {detail?.status === 2 && (
                  <>
                    <Button type="primary" htmlType="submit">
                      {loaiDichVu === "HuyDichVu" ? "Hủy dịch vụ" : "Cấp phát"}
                    </Button>{" "}
                    <Button danger onClick={() => HuyCap()}>
                      {loaiDichVu === "HuyDichVu" ? "Khôi phục" : "Hủy cấp"}
                    </Button>
                  </>
                )}
              </>
            )}
          </Form.Item>
        </Form>
      </ScrollbarsCustum>
    </>
  );
}
