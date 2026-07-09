import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Select, Upload } from "antd";
import Api from "../../../../api";
import ScrollbarsCustum from "../../../../components/ScrollbarsCustum";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";
import { CLIENT_ID, SESSION_STORAGE } from "../../../../config";
import MyEditor from "../../../../helper/ckeditor";
import Helper from "../../../../helper/helper";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

export default function ModalBaoCaoThongKe({
  onHandleCancel,
  onHandleOk,
  isEdit,
  isView,
  isType,
  setIsType,
  edit,
  setEdit,
  typeTab,
  type,
  dungLuongToiDaTepTaiLen,
}) {
  // const scrollBarRefBaoCaoThongKeContentWrapperIncludesModal = useRef();
  //const queryString = window.location.search;

  const urlParams = new URLSearchParams(window.location.search);
  const doituong = urlParams.get("doituong"); //Đối tượng thống kê (loại thống kê)
  const [value, setValue] = useState("calendar-setting-form");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [docList, setDocList] = useState([]);
  const [docPostList, setDocPostList] = useState([]);
  const [fieldValue, setFieldValue] = useState([]);
  const [error, setError] = useState(null);

  const [optionsMeetingServer, setOptionsMeetingServer] = useState([]);
  const [server, setServer] = useState(null);

  useEffect(() => {
    if (edit) {
      setTitle(edit?.title);
      setContent(edit?.content);
      setFileUrl(edit?.fileUrl);
      setDocPostList([]);
      setFileListUpLoad([]);
      setDocList([]);
      setDefaultFileList([]);
    } else {
      setTitle("");
      setContent(""); //Lấy ra bảng thống kê khi nhấn thêm
      setDocPostList([]);
      setFileListUpLoad([]);
      setDocList([]);
      setDefaultFileList([]);
    }
  }, [edit]);

  const onWrite = () => {
    if (type === "Tổng hợp" || edit) {
      if (Helper.isNullOrUndefined(title)) {
        return SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Tiêu đề không được để trống",
          icon: "warning",
        });
      }
      if (Helper.isNullOrUndefined(content)) {
        return SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Nội dung không được để trống",
          icon: "warning",
        });
      }
      if (
        fileListUpLoad.length <= 0 &&
        type === "Tổng hợp" &&
        !edit?.fileUrl &&
        !edit?.fileUrl?.includes("/")
      ) {
        return SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Vui lòng tải lên file",
          icon: "warning",
        });
      }
    }
    if (type !== "Tổng hợp" && !edit) {
      if (Helper.isNullOrUndefined(startTime)) {
        return SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Thời gian bắt đầu không được để trống",
          icon: "warning",
        });
      }
      if (Helper.isNullOrUndefined(endTime)) {
        return SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: "Thời gian kết thúc không được để trống",
          icon: "warning",
        });
      }
    }

    // return console.log({
    //   id: edit?.id,
    //   title: title,
    //   name: isType,
    //   content: content,
    //   fileUrl: edit?.fileUrl,
    // });
    onHandleOk(typeTab, {
      id: server ?? edit?.id,
      title: title,
      name: isType,
      content: content,
      fileUrl:
        !Helper.isNullOrUndefined(fileListUpLoad) && fileListUpLoad[0]?.name
          ? fileListUpLoad[0]?.name
          : edit?.fileUrl,
      isDeleted: false,
      dateFrom: startTime,
      dateTo: endTime,
      // id: server,
    }).then((e) => {
      if (isEdit === true) {
        if (
          !Helper.isNullOrUndefined(fileListUpLoad) &&
          fileListUpLoad[0]?.name
        ) {
          const formData = new FormData();
          fileListUpLoad.forEach((file) => {
            formData.append("file", file);
          });
          new Api()
            .Upload_file_to_bucket({
              filePath: e?.fileUrl,
              formData: formData,
            })
            .then(() => {
              // SwalAlertAllConfiguration({
              //   title: "Thông báo! ",
              //   text: e?.message,
              //   icon: "success",
              // });
              setDocPostList([]);
              setFileListUpLoad([]);
              setDocList([]);
              setDefaultFileList([]);
              setTitle("");
              setContent("");
            });
        } else {
          // SwalAlertAllConfiguration({
          //   title: "Thông báo! ",
          //   text: e?.message,
          //   icon: "success",
          // });
          setDocPostList([]);
          setFileListUpLoad([]);
          setDocList([]);
          setDefaultFileList([]);
          onHandleCancel();
          setTitle("");
          setContent("");
        }
      } else {
        const formData = new FormData();
        fileListUpLoad.forEach((file) => {
          formData.append("file", file);
        });
        new Api()
          .Upload_file_to_bucket({
            filePath: e?.fileUrl,
            formData: formData,
          })
          .then(() => {
            // SwalAlertAllConfiguration({
            //   title: "Thông báo! ",
            //   text: e?.message,
            //   icon: "success",
            // });
            setDocPostList([]);
            setFileListUpLoad([]);
            setDocList([]);
            setDefaultFileList([]);
            setTitle("");
            setContent("");
          });
      }
      setTitle("");
      setContent("");
      onHandleCancel();
      SwalAlertAllConfiguration({
        title: "Thông báo",
        text: isEdit ? "Sửa thành công" : "Thêm thành công",
        timer: 2000,
        icon: "success",
      });
    });
  };

  //Gọi api thống kê, trả về trường nội dung
  useEffect(() => {
    //console.log("Kiểm tra đối tượng ");
    //console.log(doituong);
    if (doituong === "quan-ly-bao-cao-thong-ke-hoi-nghi-hoi-thao") {
      // new Api()
      //   .xuat_ThongKeHoiNghiHoiThao({
      //     token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE)).id_token,
      //   })
      //   .then((e) => {
      //     //console.log("Kiểm tra thống kê hội nghị hội thảo ");
      //     //console.log(e);
      //     setContent(e.data);
      //   });
    } else if (doituong === "quan-ly-bao-cao-thong-ke-diem-diem-cau") {
    } else if (doituong === "quan-ly-thong-ke-tong-so-cuoc-hop-dang-dien-ra") {
    } else if (
      doituong === "quan-ly-thong-ke-tong-so-cuoc-hop-tren-tung-may-chu"
    ) {
    } else if (
      doituong ===
      "quan-ly-thong-ke-so-cuoc-hop-theo-lich-su-tren-tong-the-he-thong"
    ) {
    } else if (
      doituong === "quan-ly-thong-ke-so-cuoc-hop-theo-lich-su-tren-tung-may-chu"
    ) {
    } else if (
      doituong ===
      "quan-ly-thong-ke-tong-so-nguoi-tham-gia-cuoc-hop-dang-dien-ra"
    ) {
    } else if (
      doituong ===
      "quan-ly-thong-ke-tong-so-so-nguoi-tham-gia-cuoc-hop-theo-lich-su"
    ) {
    } else if (
      doituong === "quan-ly-thong-ke-so-nguoi-tham-gia-trong-mot-cuoc-hop"
    ) {
    } else if (
      doituong ===
      "quan-ly-thong-ke-so-cuoc-hop-cua-mot-dai-bieu-tham-gia-den-thoi-diem-hien-tai"
    ) {
    } else if (doituong === "quan-ly-thong-ke-tai-lieu-hop-cac-cuoc-hop") {
    }

    if (doituong.includes("may-chu")) {
      new Api()
        .get_all_meetingServer({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
        })
        .then((response) => {
          if (response?.data)
            setOptionsMeetingServer(
              response?.data?.map((item) => ({
                ...item,
                label: item?.title + " - " + item?.ip,
                value: item?.id,
              }))
            );
        });
    }
    if (
      doituong ===
      "quan-ly-thong-ke-so-cuoc-hop-cua-mot-dai-bieu-tham-gia-den-thoi-diem-hien-tai"
    ) {
      new Api()
        .get_schedule_danhsachthanhvien({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
        })
        .then((response) => {
          if (response?.data)
            setOptionsMeetingServer(
              response?.data?.map((item) => ({
                ...item,
                label: item?.ten_day_du + " - " + item?.ten_dangnhap,
                value: item?.id,
              }))
            );
        });
    }
  }, []);

  return (
    <>
      <>
        <div className="tab-content" id="calendar-setting-tabContent">
          {!isView && !edit && type !== "Tổng hợp" ? (
            <div className="row">
              <div
                className={
                  doituong ===
                    "quan-ly-thong-ke-so-cuoc-hop-cua-mot-dai-bieu-tham-gia-den-thoi-diem-hien-tai" ||
                  doituong?.includes("may-chu")
                    ? "col-md-6"
                    : "col-md-12"
                }
              >
                <div className="row">
                  <div className="col-md-12">
                    <label>
                      Thời gian thống kê
                      {!isView && <b className="text-danger">(*)</b>}
                    </label>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                    <RangePicker
                      allowClear={[true, true]}
                      size="large"
                      style={{ width: "100%" }}
                      placeholder={["Từ", "Đến"]}
                      showTime={{
                        format: "HH:mm",
                        hideDisabledOptions: true,
                      }}
                      defaultValue={[startTime, endTime]}
                      value={[startTime, endTime]}
                      format="DD/MM/YYYY HH:mm"
                      dateFormat="DD/MM/YYYY HH:mm"
                      onChange={(dates, dateString) => {
                        if (dates) {
                          setStartTime(dates[0]); //dates[0] ? dates[0]?.valueOf() : null, //.format('YYYY-MM-DDTHH:mm:ss')
                          setEndTime(dates[1]); //dates[1] ? dates[1]?.valueOf() : null //.format('YYYY-MM-DDTHH:mm:ss')
                        } else {
                          setStartTime(null); //dates[0] ? dates[0]?.valueOf() : null, //.format('YYYY-MM-DDTHH:mm:ss')
                          setEndTime(null); //dates[1] ? dates[1]?.valueOf() : null //.format('YYYY-MM-DDTHH:mm:ss')
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              {doituong ===
                "quan-ly-thong-ke-so-cuoc-hop-cua-mot-dai-bieu-tham-gia-den-thoi-diem-hien-tai" && (
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12">
                      <label>
                        Đại biểu tham gia
                        {!isView && <b className="text-danger">(*)</b>}
                      </label>
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <Select
                        style={{ width: "100%" }}
                        size="large"
                        showSearch
                        placeholder="Tìm kiếm đại biểu tham gia"
                        onSelect={(e) => setServer(e)}
                        filterOption={(input, option) =>
                          (option?.title ?? "")
                            ?.toLowerCase()
                            ?.includes(input?.toLowerCase()) ||
                          (option?.ip ?? "")
                            ?.toLowerCase()
                            ?.includes(input?.toLowerCase())
                        }
                        options={optionsMeetingServer}
                      />
                    </div>
                  </div>
                </div>
              )}
              {doituong?.includes("may-chu") && (
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12">
                      <label>
                        Máy chủ
                        {!isView && <b className="text-danger">(*)</b>}
                      </label>
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      <Select
                        style={{ width: "100%" }}
                        size="large"
                        showSearch
                        placeholder="Tìm kiếm máy chủ"
                        onSelect={(e) => setServer(e)}
                        filterOption={(input, option) =>
                          (option?.title ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase()) ||
                          (option?.ip ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={optionsMeetingServer}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <label>
                        Tiêu đề
                        {!isView && <b className="text-danger">(*)</b>}
                      </label>
                    </div>
                  </div>
                  <div className="row form-group">
                    <div className="col-md-12">
                      {!isView ? (
                        <Input
                          placeholder="Nhập tiêu đề"
                          size="large"
                          style={{ width: "100%" }}
                          defaultValue={title}
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                        />
                      ) : (
                        title
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label>
                    Nội dung
                    {!isView && <b className="text-danger">(*)</b>}
                  </label>
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-12">
                  {!isView ? (
                    <MyEditor
                      handleChange={(data) => {
                        setContent(data);
                      }}
                      data={content}
                      // {...state}
                    />
                  ) : (
                    <p
                      style={{ margin: 0 }}
                      dangerouslySetInnerHTML={{
                        __html: content,
                      }}
                    ></p>
                  )}
                </div>
              </div>
              {type === "Tổng hợp" && (
                <>
                  {(isEdit || isView) && (
                    <p>
                      <span>Tệp đã gửi: </span>
                      {edit?.fileUrl && edit?.fileUrl.includes("/") && (
                        <a
                          style={{
                            textDecoration: "underline",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          href
                          onClick={() => {
                            if (edit?.fileUrl && edit?.fileUrl.includes("/")) {
                              new Api()
                                .Get_link_download({
                                  objectKey: edit?.fileUrl,
                                  fileName:
                                    edit?.fileUrl.split("/")[
                                      edit?.fileUrl?.split("/")?.length - 1
                                    ],
                                })
                                .then((e) => {
                                  // return setLink(e?.data);
                                });
                            }
                          }}
                        >
                          {
                            edit?.fileUrl.split("/")[
                              edit?.fileUrl?.split("/")?.length - 1
                            ]
                          }
                        </a>
                      )}
                    </p>
                  )}
                  {!isView && (
                    <>
                      <div className="row">
                        <div className="col-md-12">
                          <label>
                            Tệp tin đính kèm
                            <b className="text-danger">(*)</b>{" "}
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <i style={{ color: "red" }}>
                            Các định dạng cho phép tải lên: docx | txt | doc |
                            xlsx | xls | pptx | pdf | rar | zip
                            <br />
                            Tệp không được lớn hơn {
                              dungLuongToiDaTepTaiLen
                            }{" "}
                            bytes
                          </i>
                          <br />
                          <Upload
                            multiple={false}
                            action={"https://" + CLIENT_ID + "/api/upload"}
                            accept={
                              ".docx,.txt,.doc,.xlsx,.xls,.pptx,.pdf,.rar,.zip"
                            }
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
                                    fileListUpLoad.filter(
                                      (e) => e?.uid !== file?.uid
                                    )
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
                                //console.log(info.file, info.fileList);
                                //
                                // var fileListFilter = info?.fileList?.filter(
                                //   (x) => isValidType.includes(x?.type)
                                // );
                                var fileListFilter = info?.fileList?.filter(
                                  (x) =>
                                    isValidType.includes(x?.type) ||
                                    x?.name.endsWith(".zip") ||
                                    x?.name.endsWith(".rar")
                                );
                                if (Number(dungLuongToiDaTepTaiLen) > 0) {
                                  fileListFilter = info?.fileList?.filter(
                                    (x) =>
                                      x?.size < Number(dungLuongToiDaTepTaiLen)
                                  );
                                }
                                if (
                                  fileListFilter
                                    .map((file) => file.uid)
                                    .includes(info.file.uid)
                                ) {
                                  fileListUpLoad.push(info.file);
                                }
                                //
                                // fileListUpLoad.push(info.file);
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
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className="row form-group">
          <div className="col-md-12 align-center m-1">
            <Button
              className="btn btn-sm btn-default m-1"
              onClick={() => onWrite()}
              hidden={isView}
            >
              <i className="fas fa-edit blue"></i> Ghi
            </Button>
            <Button
              className="btn btn-sm btn-default m-1"
              data-dismiss="modal"
              onClick={() => onHandleCancel()}
            >
              <i className="fas fa-undo"></i> Quay lại
            </Button>
          </div>
        </div>
      </>
    </>
  );
}
