import React, { useEffect, useState } from "react";
import { Alert, Modal, Tabs } from "antd";
import moment from "moment";
import Api from "../../../api";
import {
  SwalAlertAllConfiguration,
  SwalDismissReasonTimer,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
} from "../../../components/Swal";
import { HREF } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";

import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import dayjs from "dayjs";
import ScrollbarsCustum from "../../../components/ScrollbarsCustum";
import { CLIENT_ID, SESSION_STORAGE } from "../../../config";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
let timerInterval;

export default function JoinRoom({ language, setLoading }) {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const onLogin = () => {
    if (Helper.isNullOrUndefined(roomName))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Tên phòng họp không được để trống",
        timer: 3000,
      });
    else {
      setLoading(true);
      new Api().get_schedule_byRoomName({ room: roomName }).then((response) => {
        if (!Helper.isNullOrUndefined(response?.data?.id)) {
          if (
            moment(response?.data?.endTime).valueOf() < moment().valueOf() ||
            response?.data?.status === 3
          ) {
            setLoading(false);
            return SwalAlertAllConfiguration({
              title: "Thông báo!",
              text: "Phòng họp đã kết thúc!",
              icon: "warning",
              timer: 3000,
            });
          } else if (response?.data?.status === 1) {
            setLoading(false);
            return SwalAlertAllConfiguration({
              icon: "warning",
              title: "Phòng họp chưa được phê duyệt!",
              timer: 3000,
            });
          } else if (!response?.data?.start) {
            setLoading(false);
            return SwalAlertAllConfiguration({
              icon: "warning",
              title: "Phòng họp chưa được bắt đầu!",
              timer: 3000,
            });
          } else {
            // setLoading(false);
            SwalAlertAllConfiguration({
              toast: true,
              title: "Thông báo",
              html: `Vui lòng chờ sau <b id="time-waiting-to-join-room"></b> giây`,
              icon: "success",
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
              didOpen: () => {
                SwalIsLoading();
                const timer = SwalGetPopup().querySelector(
                  "b#time-waiting-to-join-room"
                );
                timerInterval = setInterval(() => {
                  timer.textContent = `${SwalGetTimerLeft()}`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((resultChild) => {
              /* Read more about handling dismissals below */
              // setTimeout(function () {
              //   //code goes here
              //   window.location.href =(
              //     HREF.HopTrucTuyen + "/" + result?.value
              //   );
              // }, 3000);
              if (resultChild.dismiss === SwalDismissReasonTimer()) {
                // console.log("I was closed by the timer");
                window.location.href = HREF.HopTrucTuyen + "/" + roomName;
              }
            });
            // return alert(3);
          }
        } else {
          setLoading(false);
          return SwalAlertAllConfiguration({
            title: "Phòng họp không tồn tại!",
            icon: "warning",
            timer: 3000,
          });
        }
      });
    }
  };
  return (
    <>
      <div className="section join-room-area">
        <div className="join-submit">
          <div className="row">
            <div className="col-md-3">
              <h5 className="title">
                {/* Vào phòng họp */}
                {language?.JOINROOM?.TITLE}
              </h5>
            </div>
            <div className="col-md-5">
              <div className="input-group input-group-sm">
                <input
                  id="input-join-room-area"
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên phòng họp"
                  style={{ zIndex: 1 }}
                  value={roomName}
                  onChange={(e) => {
                    setRoomName(e.target.value);
                  }}
                />
                <span className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-orange btn-flat"
                    disabled={Helper.isNullOrUndefined(roomName)}
                    onClick={() => onLogin()}
                    style={{ borderRadius: "0 5px 5px 0" }}
                  >
                    <i className="fas fa-video" /> {/* THAM GIA */}
                    {language?.JOINROOM?.BTNJOIN}
                  </button>
                </span>
                {/* <span
                  className="input-group-append"
                  style={{ paddingLeft: "20px" }}
                >
                  <button
                    type="button"
                    className="btn btn-orange btn-flat"
                    // disabled={Helper.isNullOrUndefined(roomName)}
                    // onClick={() => onLogin()}
                    style={{ borderRadius: "5px" }}
                    onClick={() => setOpen(true)}
                  >
                    <i className="fas fa-concierge-bell"></i> Đăng ký dịch vụ
                  </button>
                </span> */}
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group input-group-sm">
                <span
                  className="input-group-append"
                  style={{ paddingLeft: "20px" }}
                >
                  <button
                    type="button"
                    className="btn btn-orange btn-flat"
                    // disabled={Helper.isNullOrUndefined(roomName)}
                    // onClick={() => onLogin()}
                    style={{ borderRadius: "5px" }}
                    onClick={() => setOpen(true)}
                  >
                    <i className="fas fa-edit"></i> Đăng ký dịch vụ
                    {/* <i className="fas fa-concierge-bell"></i> Đăng ký dịch vụ */}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title=""
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={window.innerWidth / 2}
        style={{ minWidth: window.innerWidth / 2 }}
        cancelText="Thoát"
        okText="Đồng ý"
        okButtonProps={{ style: { display: "none" } }}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Đăng ký cấp phát dịch vụ",
              children: <DangKyDichVu loai_dang_ky="DangKyCapPhatDichVu" />,
            },
            {
              key: "2",
              label: "Đăng ký hủy dịch vụ",
              children: <DangKyDichVu loai_dang_ky="DangKyHuyDichVu" />,
            },
            {
              key: "3",
              label: "Đăng ký cấp phát bổ sung dịch vụ",
              children: (
                <DangKyDichVu loai_dang_ky="DangKyCapPhatBoSungDichVu" />
              ),
            },
          ]}
          onChange={(key) => {
            console.log(key);
          }}
        />
      </Modal>
    </>
  );
}

export function DangKyDichVu({
  loai_dang_ky,
  tinhTrang,
  detail,
  onHandleCancel,
  openEdit,
}) {
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

  const [data, setData] = useState(
    !Helper.isNullOrUndefined(detail) && [
      {
        name: ["donVi"],
        value: detail?.donVi,
      },
      {
        name: ["noiDung"],
        value: detail?.noiDung,
      },
      {
        name: ["thoiGian"],
        value: [
          dayjs(
            dayjs(detail?.ngayBatDau * 1000).format("DD/MM/YYYY HH:mm"),
            "DD/MM/YYYY HH:mm"
          ),
          dayjs(
            dayjs(detail?.ngayKetThuc * 1000).format("DD/MM/YYYY HH:mm"),
            "DD/MM/YYYY HH:mm"
          ),
        ],
      },
      {
        name: ["soLuongTaiKhoan"],
        value: detail?.soLuongTaiKhoan,
      },
    ]
  );

  useEffect(() => {
    if (openEdit === true) {
      form.resetFields();
      setDocPostList([]);
      setFileListUpLoad([]);
      setDocList([]);
      setDefaultFileList([]);
    }
    setData(
      !Helper.isNullOrUndefined(detail) && [
        {
          name: ["donVi"],
          value: detail?.donVi,
        },
        {
          name: ["noiDung"],
          value: detail?.noiDung,
        },
        {
          name: ["thoiGian"],
          value: [
            dayjs(
              dayjs(detail?.ngayBatDau * 1000).format("DD/MM/YYYY HH:mm"),
              "DD/MM/YYYY HH:mm"
            ),
            dayjs(
              dayjs(detail?.ngayKetThuc * 1000).format("DD/MM/YYYY HH:mm"),
              "DD/MM/YYYY HH:mm"
            ),
          ],
        },
        {
          name: ["soLuongTaiKhoan"],
          value: detail?.soLuongTaiKhoan,
        },
      ]
    );
  }, [detail]);

  // const scrollBarRefTrangChuJoinRoom = useRef();
  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log(e);
    return e?.fileList;
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
        .get_donvi_bySearch({
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
    <ScrollbarsCustum
      // ref={scrollBarRefTrangChuJoinRoom}
      style={{
        height: window.innerHeight / 2,
        // height: 400,
        maxHeight: window.innerHeight / 2 + "px",
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
        fields={data}
        onFieldsChange={(_, allFields) => {
          setData(allFields);
        }}
        form={form}
        // style={{
        //   maxWidth: 600,
        // }}
        layout={"vertical"}
        onFinish={(values) => {
          if (Helper.isNullOrUndefined(detail)) {
            if (fileListUpLoad.length <= 0) {
              setError("Vui lòng tải lên file!");
            } else {
              setError(null);
              values.ngayBatDau = dayjs(values?.thoiGian[0]).unix();
              values.ngayKetThuc = dayjs(values?.thoiGian[1]).unix();
              console.log(fileListUpLoad);
              console.log(fileListUpLoad[0]?.name);
              console.log("Success:", values);
              values.tepTin = fileListUpLoad[0]?.name;
              new Api()
                .Them_DangKyDichVu({
                  token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                    ?.access_token,
                  key: loai_dang_ky,
                  data: values,
                })
                .then((res) => {
                  if (res) {
                    const formData = new FormData();
                    fileListUpLoad.forEach((file) => {
                      formData.append("file", file);
                    });
                    new Api()
                      .Upload_file_to_bucket({
                        filePath: res?.tepTin,
                        formData: formData,
                      })
                      .then(() => {
                        SwalAlertAllConfiguration({
                          title: "Thông báo! ",
                          text: res?.message,
                          icon: "success",
                          timer: 3000,
                        });
                        form.resetFields();
                        setDocPostList([]);
                        setFileListUpLoad([]);
                        setDocList([]);
                        setDefaultFileList([]);
                      });
                  }
                });
            }
          } else {
            if (
              fileListUpLoad.length <= 0 &&
              Helper.isNullOrUndefined(detail?.tepTin) &&
              Helper.isNullOrUndefined(data?.tepTin)
            ) {
              setError("Vui lòng tải lên file!");
            } else {
              setError(null);
              values.id = detail?.id;
              values.tenDichVu = detail?.tenDichVu;
              values.dienThoai = detail?.dienThoai;
              values.email = detail?.email;
              values.nguoiDangKy = detail?.nguoiDangKy;
              values.ngayDangKy = detail?.ngayDangKy;
              values.nguoiDuyet = detail?.nguoiDuyet;
              values.ngayDuyet = detail?.ngayDuyet;
              values.donVi = detail?.donVi;

              values.ngayBatDau = dayjs(values?.thoiGian[0]).unix();
              values.ngayKetThuc = dayjs(values?.thoiGian[1]).unix();
              console.log(fileListUpLoad);
              console.log(fileListUpLoad[0]?.name);
              console.log("Success:", values);
              values.tepTin =
                !Helper.isNullOrUndefined(fileListUpLoad) &&
                fileListUpLoad[0]?.name
                  ? fileListUpLoad[0]?.name
                  : detail?.tepTin;
              new Api()
                .ChinhSua_DangKyDichVu({
                  token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                    ?.access_token,
                  key: loai_dang_ky,
                  data: values,
                })
                .then((res) => {
                  if (res) {
                    if (values.tepTin !== detail?.tepTin) {
                      const formData = new FormData();
                      fileListUpLoad.forEach((file) => {
                        formData.append("file", file);
                      });
                      new Api()
                        .Upload_file_to_bucket({
                          filePath: res?.tepTin,
                          formData: formData,
                        })
                        .then(() => {
                          SwalAlertAllConfiguration({
                            title: "Thông báo! ",
                            text: res?.message,
                            icon: "success",
                            timer: 3000,
                          });
                          form.resetFields();
                          setDocPostList([]);
                          setFileListUpLoad([]);
                          setDocList([]);
                          setDefaultFileList([]);
                        });
                    } else {
                      SwalAlertAllConfiguration({
                        title: "Thông báo! ",
                        text: res?.message,
                        icon: "success",
                        timer: 3000,
                      });
                      form.resetFields();
                      setDocPostList([]);
                      setFileListUpLoad([]);
                      setDocList([]);
                      setDefaultFileList([]);
                      onHandleCancel();
                    }
                  }
                });
            }
          }
        }}
        onFinishFailed={(errorInfo) => {
          if (fileListUpLoad.length <= 0) {
            setError("Vui lòng tải lên file!");
          } else {
            setError(null);
          }
          console.log("Failed:", errorInfo);
        }}
      >
        {/* <Form.Item
          label="Tên đơn vị"
          name="donVi"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thông tin đơn vị!",
            },
          ]}
        >
          <Select
            showSearch
            onSearch={(e) => get_user_bySearch(e, setListDonVi)}
            placeholder="Tìm kiếm tên đơn vị"
            // filterOption={false}
            // defaultActiveFirstOption={false}
            notFoundContent={null}
          >
            {listDonVi.map((e) => (
              <Option value={e?.ten}>{e?.ten}</Option>
            ))}
          </Select>
        </Form.Item> */}
        <Form.Item
          label="Nội dung"
          name="noiDung"
          // rules={[
          //   {
          //     required: true,
          //     message: "Vui lòng nhập !",
          //   },
          // ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Thời gian đăng ký"
          name="thoiGian"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn khoảng thời gian!",
            },
          ]}
        >
          <RangePicker
            showTime={{
              format: "HH:mm",
              hideDisabledOptions: true,
            }}
            disabledDate={(current) => {
              // Can not select days before today and today
              return current && current < moment().startOf("day");
            }}
            style={{ width: "100%" }}
            placeholder={["Từ", "Đến"]}
            format="DD/MM/YYYY HH:mm"
            dateFormat="DD/MM/YYYY HH:mm"
          />
        </Form.Item>
        <Form.Item
          label="Số lượng tài khoản"
          name="soLuongTaiKhoan"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng tài khoản!",
            },
            {
              type: "number",
              min: 1,
              message: "Vui lòng nhập số lượng tài khoản từ 1 trở lên!",
              transform(value) {
                return Number(value);
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={
            <>
              <span style={{ color: "red", paddingRight: "5px" }}>*</span>Tệp
              tin đính kèm
            </>
          }
          // name="soLuongTaiKhoan"
          // rules={[
          //   {
          //     required: true,
          //     message: "Vui lòng tải lên file!",
          //   },
          // ]}
          // valuePropName="fileList"
          // getValueFromEvent={normFile}
        >
          {!Helper.isNullOrUndefined(detail) && (
            <p>
              <span>Tệp đã gửi: </span>
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
            </p>
          )}
          <Upload
            name="soLuongTaiKhoan"
            // multiple={true}
            action={"https://" + CLIENT_ID + "/api/upload"}
            accept={".docx,.txt,.doc,.xlsx,.xls,.pptx,.pdf,.rar,.zip"}
            // previewFile={(file) => {
            //   console.log("Your upload file:", file);
            //   // Your process logic. Here we just mock to the same file
            //   return fetch(
            //     "https://next.json-generator.com/api/json/get/4ytyBoLK8",
            //     {
            //       method: "POST",
            //       body: file,
            //     }
            //   )
            //     .then((res) => res.json())
            //     .then(({ thumbnail }) => thumbnail);
            // }}
            onRemove={(file) =>
              SwalAlertAllConfiguration({
                title: "Bạn có chắc muốn xóa tài liệu không?",
                text:
                  "Khi bạn nhấn 'Đồng ý' tài liệu '" +
                  file.name +
                  "' sẽ bị xóa!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Thoát",
                showLoaderOnConfirm: true,
                dangerMode: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  // Ok
                  const index = defaultFileList.indexOf(file);
                  const newFileList = defaultFileList.slice();
                  newFileList.splice(index, 1);
                  setDocList(newFileList);
                  setFileListUpLoad(
                    fileListUpLoad.filter((e) => e?.uid !== file?.uid)
                  );
                  SwalAlertAllConfiguration({
                    title: "Xóa thành công",
                    icon: "success",
                    timer: 1500,
                  });
                } else {
                  return false;
                }
              })
            }
            beforeUpload={(file) => {
              return false;
            }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                const isValidType = [
                  "application/pdf",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  "application/x-rar-compressed",
                  "application/zip",
                  "text/plain",
                ];
                //
                console.log(info.file, info.fileList);
                //
                var fileListFilter = info?.fileList?.filter((x) =>
                  isValidType.includes(x?.type)
                );
                // fileListUpLoad.push(info.file);
                if (
                  fileListFilter.map((file) => file.uid).includes(info.file.uid)
                ) {
                  fileListUpLoad.push(info.file);
                }
                setDefaultFileList(fileListFilter);
                setFieldValue(fileListFilter);
                // setFileListUpLoad(info.file);
                if (fileListUpLoad.length <= 0) {
                  setError("Vui lòng tải lên file!");
                } else {
                  setError(null);
                }
              }
            }}
            defaultFileList={defaultFileList}
            fileList={defaultFileList}
          >
            <Button icon={<UploadOutlined />}>Chọn tệp</Button>
          </Upload>
          <br />
          <i style={{ color: "red" }}>
            Các định dạng cho phép tải lên: docx | txt | doc | xlsx | xls | pptx
            | pdf | rar | zip
          </i>
          <br />
          <i style={{ color: "red" }}>
            * Quyết định duyệt danh sách cán bộ được đề nghị cấp tài khoản quản
            lý họp trực tuyến của đơn vị
          </i>
          {error && <Alert message={error} type="error" />}
        </Form.Item>
        <Form.Item
          // wrapperCol={{
          //   offset: 9,
          //   span: 16,
          // }}
          style={{ textAlign: "center" }}
        >
          <Button type="primary" htmlType="submit">
            {!Helper.isNullOrUndefined(detail) ? "Chỉnh sửa" : "Gửi đăng ký"}
          </Button>
        </Form.Item>
      </Form>
    </ScrollbarsCustum>
  );
}
