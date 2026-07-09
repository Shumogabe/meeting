import React, { useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import Api from "../../api";
import Message from "../../components/Message";
import ScrollbarsCustum from "../../components/ScrollbarsCustum";
import { SESSION_STORAGE } from "../../config";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";

export default function Xem({
  edit,
  onHandleCancel,
  setScheduleId,
  scheduleId,
}) {
  // const scrollBarRefDichVuXem = useRef();
  const [title, setTitle] = useState();
  const [hrefPageMain, setHrefPageMain] = useState();

  const [dichVu, setDichVu] = useState("");
  const [dichVuUrl, setDichVuUrl] = useState("");

  const [data, setData] = useState({});
  //   const [thongSoMayChu, setThongSoMayChu] = useState([]);
  //   const [thongSoMayChuDaCap, setThongSoMayChuDaCap] = useState([]);

  useLayoutEffect(() => {
    GetDatas();
    var tite;
    switch (
      window.location.pathname
        .replace("/cac-don-vi", "")
        .replace("/chi-tiet", "")
    ) {
      case HREF.DANG_KY_CAP_DICH_VU:
        setDichVu("cấp");
        setDichVuUrl("cap");
        tite = "Đăng ký cấp dịch vụ";
        setHrefPageMain(HREF.DANG_KY_CAP_DICH_VU);
        break;
      case HREF.DANG_KY_DOI_DICH_VU:
        setDichVu("đổi");
        setDichVuUrl("doi");
        tite = "Đăng ký đổi dịch vụ";
        setHrefPageMain(HREF.DANG_KY_DOI_DICH_VU);
        break;
      case HREF.DANG_KY_HUY_DICH_VU:
        setDichVu("hủy");
        setDichVuUrl("huy");
        tite = "Đăng ký hủy dịch vụ";
        setHrefPageMain(HREF.DANG_KY_HUY_DICH_VU);
        break;
      case "/quan-ly-dang-ky/xet-duyet-dang-ky/tiep-nhan-dang-ky":
        setDichVu("tiếp nhận");
        setDichVuUrl("tiep-nhan");
        tite = "dịch vụ";
        setHrefPageMain(HREF.TIEP_NHAN_DANG_KY);
        break;
      case "/quan-ly-dang-ky/xet-duyet-dang-ky/phe-duyet-dang-ky":
        setDichVu("phê duyệt");
        setDichVuUrl("phe-duyet");
        tite = "dịch vụ";
        setHrefPageMain(HREF.PHE_DUYET_DANG_KY);
        break;
      case "/quan-ly-dang-ky/xet-duyet-dang-ky/cap-dang-ky":
        setDichVu("cấp đăng ký");
        setDichVuUrl("cap-dang-ky");
        tite = "dịch vụ";
        setHrefPageMain(HREF.CAP_DANG_KY);
        break;
      case "/tra-cuu-dich-vu":
        setDichVu("tra cứu dịch vụ");
        setDichVuUrl("tra-cuu-dich-vu");
        tite = "dịch vụ";
        setHrefPageMain(HREF.TRA_CUU_DICH_VU);
        break;
      case "/quan-ly-dich-vu-da-huy":
        setDichVu("Quản lý dịch vụ đã hủy");
        setDichVuUrl("quan-ly-dich-vu-da-huy");
        tite = "dịch vụ";
        setHrefPageMain(HREF.QUAN_LY_DICH_VU_DA_HUY);
        break;
      default:
        window.location.href = "/";
        break;
    }
    setTitle(tite);
    document.title = `Xem ${tite}`;
  }, []);

  const GetDatas = () => {
    new Api()
      .Get_ThongTinDangKyDichVu({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: window.location.search.slice(1).split("&")[0].split("=")[1],
      })
      .then((res) => {
        if (res && !Helper.isNullOrUndefined(res?.thongTinDangKy)) {
          setData(res && res?.thongTinDangKy);
          if (
            res?.thongTinDangKy?.loaiDichVu === 2 ||
            res?.thongTinDangKy?.loaiDichVu === 3
          ) {
            GetDichVuDaCap(res?.thongTinDangKy?.iD_ThongTinDangKyDichVu);
          }
        }
        // if (res && res?.thongTinThongSoKyThuat.length > 0)
        //   setThongSoMayChu(res && res?.thongTinThongSoKyThuat);
        Get_ThongTinDonVi(
          res?.thongTinDangKy?.donViQuanTriVanHanh,
          res?.thongTinDangKy?.donViChuQuan
        );
      })
      .catch((err) => Message.error(err.message));
  };

  const Get_ThongTinDonVi = (donViQuanTriVanHanh, donViChuQuan) => {
    if (
      !Helper.isNullOrUndefined(donViQuanTriVanHanh) &&
      donViQuanTriVanHanh !== 0
    ) {
      new Api()
        .Get_ThongTinDonVi({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: donViQuanTriVanHanh,
        })
        .then((res) => {
          setData((pre) => ({
            ...pre,
            donViQuanTriVanHanh: res?.data?.ten_day_du,
          }));
        });
    }
    if (!Helper.isNullOrUndefined(donViChuQuan) && donViChuQuan !== 0) {
      new Api()
        .Get_ThongTinDonVi({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: donViChuQuan,
        })
        .then((res) => {
          setData((pre) => ({ ...pre, donViChuQuan: res?.data?.ten_day_du }));
        });
    }
  };

  const GetDichVuDaCap = (id) => {
    if (!Helper.isNullOrUndefined(id)) {
      new Api()
        .Get_ThongTinDangKyDichVu({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
        })
        .then((res) => {
          if (res && res?.thongTinDangKy) {
            setData((pre) => ({
              ...pre,
              iD_ThongTinDangKyDichVu: res?.thongTinDangKy?.tieuDe,
            }));
          }
          //   if (res && res?.thongTinThongSoKyThuat.length > 0)
          //     setThongSoMayChuDaCap(res && res?.thongTinThongSoKyThuat);
        });
    }
  };

  const OnClick = (tinhtrang) => {
    new Api()
      .Update_ThongTinDangKyDichVu({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: data?.id,
        data: {
          ...data,
          tinhTrang: tinhtrang,
        },
      })
      .then((res) => {
        switch (tinhtrang) {
          case 7:
            Message.success("Đã cấp dịch vụ");
            break;
          case 8:
            Message.success("Đã hủy cấp dịch vụ");
            break;
          case 4:
            Message.success("Đã khôi phục");
            break;
          default:
            Message.success("Sửa thành công");
            break;
        }
        window.location.href = window.location.pathname
          .replace("/sua", "")
          .replace("/xem", "");
      })
      .catch((err) => {
        Message.error(err.message);
      });
  };

  return (
    <>
      <ScrollbarsCustum
        // ref={scrollBarRefDichVuXem}
        style={{
          height: window.innerHeight / 2,
          maxHeight: window.innerHeight / 2 + "px",
          //           height: 400,
          // maxHeight: "400px",
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        {data?.tinhTrang === 3 && (
          <div className="col-md-12">
            <div className="row form-group">
              <div className="col-md-12">
                <label>Yêu cầu bổ sung</label>
              </div>
              <div className="col-md-12">
                {!Helper.isNullOrUndefined(data?.yKienPhanHoi) && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.yKienPhanHoi,
                    }}
                  ></div>
                )}
                {!Helper.isNullOrUndefined(data?.yKienLanhDao) && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.yKienLanhDao,
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="card card-info card-outline card-outline-tabs">
          <div className="card-header p-0 border-bottom-0">
            <ul
              className="nav nav-tabs"
              id="custom-tabs-four-tab"
              role="tablist"
            >
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="custom-tabs-four-thong-tin-chung-tab"
                  data-toggle="pill"
                  href="#custom-tabs-four-thong-tin-chung"
                  role="tab"
                  aria-controls="custom-tabs-four-thong-tin-chung"
                  aria-selected="true"
                >
                  THÔNG TIN CHUNG
                </a>
              </li>
              {/* <li className="nav-item">
                      <a
                        className="nav-link"
                        id="custom-tabs-four-thong-so-may-chu-tab"
                        data-toggle="pill"
                        href="#custom-tabs-four-thong-so-may-chu"
                        role="tab"
                        aria-controls="custom-tabs-four-thong-so-may-chu"
                        aria-selected="true"
                      >
                        THÔNG SỐ MÁY CHỦ
                      </a>
                    </li> */}
            </ul>
          </div>
          <div className="card-body">
            <div
              className="tab-content form-group"
              id="custom-tabs-four-tabContent"
            >
              <div
                className="tab-pane fade show active"
                id="custom-tabs-four-thong-tin-chung"
                role="tabpanel"
                aria-labelledby="custom-tabs-four-thong-tin-chung-tab"
              >
                {/*The task */}
                {data && (
                  <div className="row">
                    {(data?.loaiDichVu === 2 || data?.loaiDichVu === 3) && (
                      <div className="col-md-12">
                        <div className="row form-group">
                          <div className="col-md-12">
                            <label>Dịch vụ đã cấp</label>
                          </div>
                          <div className="col-md-12">
                            {data?.iD_ThongTinDangKyDichVu}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Tiêu đề</label>
                        </div>
                        <div className="col-md-12">{data?.tieuDe}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Số điện thoại liên hệ</label>
                        </div>
                        <div className="col-md-12">{data?.dienThoai}</div>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Tên hệ thống thông tin</label>
                        </div>
                        <div className="col-md-12">
                          {data?.tenHeThongThongTin}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Tên dự án</label>
                        </div>
                        <div className="col-md-12">{data?.tenDuAn}</div>
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Đơn vị chủ quản</label>
                        </div>
                        <div className="col-md-12">{data?.donViChuQuan}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Đơn vị quản trị vận hành</label>
                        </div>
                        <div className="col-md-12">
                          {data?.donViQuanTriVanHanh}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Ngày kết thúc sử dụng</label>
                        </div>
                        <div className="col-md-12">
                          {data?.ngayKetThucSuDung
                            ? moment(Number(data?.ngayKetThucSuDung)).format(
                                "DD/MM/YYYY"
                              )
                            : null}
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Cấp độ hệ thống thông tin</label>
                        </div>
                        <div className="col-md-12">
                          {data?.capDoHeThongThongTin}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Cán bộ kỹ thuật</label>{" "}
                        </div>
                        <div className="col-md-12">{data?.canBoKyThuat}</div>
                      </div>
                    </div> */}
                    <div className="col-md-12">
                      <div className="row form-group">
                        <div className="col-md-12">
                          <label>Nội dung</label>
                        </div>
                        <div className="col-md-12">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data?.ghiChu,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* <div
                      className="tab-pane fade"
                      id="custom-tabs-four-thong-so-may-chu"
                      role="tabpanel"
                      aria-labelledby="custom-tabs-four-thong-so-may-chu-tab"
                    >
                      <div className="row">
                        {(data?.loaiDichVu === 2 || data?.loaiDichVu === 3) && (
                          <div className="col-6">
                            <p>
                              <b>Thông số máy chủ đã cấp</b>
                            </p>
                            {thongSoMayChuDaCap.map((item, index) => {
                              return (
                                <div className="card bg-info">
                                  <div
                                    className="card-header border-0"
                                    style={{ margin: "-9px" }}
                                  >
                                    <h3
                                      className="card-title"
                                      style={{
                                        textTransform: "uppercase",
                                        padding: "0.7rem 0.5rem 0.3rem",
                                      }}
                                    >
                                      <i className="far fa-calendar-alt" />{" "}
                                      Thông số máy chủ {index + 1}
                                    </h3>
                                    <div className="card-tools">
                                      <button
                                        type="button"
                                        className="btn btn-info btn-sm"
                                        data-card-widget="collapse"
                                      >
                                        <i className="fas fa-minus" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="card-body bg-white">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>CPU</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.cpu} core
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>RAM</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.ram} GB
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Ổ cứng</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.oCung} GB
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Hệ điều hành</label>
                                          </div>
                                          <div className="col-md-10">
                                            <GetThongTinHeDieuHanh
                                              id={item?.heDieuHanh}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Băng thông upload</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.upload} Mbps
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Băng thông download</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.download} Mbps
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Số lượng IPv4</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.countIPv4}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="row form-group">
                                          <div className="col-md-2">
                                            <label>Số lượng IPv6</label>
                                          </div>
                                          <div className="col-md-10">
                                            {item?.countIPv6}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="row form-group">
                                          <div className="col-md-1">
                                            <label>Phần mềm</label>
                                          </div>
                                          <div className="col-md-11">
                                            {item?.phanMem}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-12">
                                        <div className="row form-group">
                                          <div className="col-md-1">
                                            <label>Ghi chú</label>
                                          </div>
                                          <div className="col-md-11">
                                            {item?.ghiChu}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div
                          className={
                            data?.loaiDichVu === 2 || data?.loaiDichVu === 3
                              ? "col-6"
                              : "col-12"
                          }
                        >
                          {(data?.loaiDichVu === 2 ||
                            data?.loaiDichVu === 3) && (
                            <p>
                              <b>
                                Thông số máy chủ {dichVu}
                                dịch vụ
                              </b>
                            </p>
                          )}
                          {thongSoMayChu.map((item, index) => {
                            return (
                              <div className="card bg-info">
                                <div
                                  className="card-header border-0"
                                  style={{ margin: "-9px" }}
                                >
                                  <h3
                                    className="card-title"
                                    style={{
                                      textTransform: "uppercase",
                                      padding: "0.7rem 0.5rem 0.3rem",
                                    }}
                                  >
                                    <i className="far fa-calendar-alt" /> Thông
                                    số máy chủ {index + 1}
                                  </h3>
                                  <div className="card-tools">
                                    <button
                                      type="button"
                                      className="btn btn-info btn-sm"
                                      data-card-widget="collapse"
                                    >
                                      <i className="fas fa-minus" />
                                    </button>
                                  </div>
                                </div>
                                <div className="card-body bg-white">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>CPU</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.cpu} core
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>RAM</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.ram} GB
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>Ổ cứng</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.oCung} GB
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>Hệ điều hành</label>
                                        </div>
                                        <div className="col-md-10">
                                          <GetThongTinHeDieuHanh
                                            id={item?.heDieuHanh}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>Băng thông upload</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.upload} Mbps
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>Băng thông download</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.download} Mbps
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>Số lượng IPv4</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.countIPv4}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="row form-group">
                                        <div className="col-md-2">
                                          <label>Số lượng IPv6</label>
                                        </div>
                                        <div className="col-md-10">
                                          {item?.countIPv6}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="row form-group">
                                        <div className="col-md-1">
                                          <label>Phần mềm</label>
                                        </div>
                                        <div className="col-md-11">
                                          {item?.phanMem}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="row form-group">
                                        <div className="col-md-1">
                                          <label>Ghi chú</label>
                                        </div>
                                        <div className="col-md-11">
                                          {item?.ghiChu}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div> */}
            </div>
          </div>
          {/* /.card */}
        </div>
        <div className="col-md-12 align-center">
          {data?.tinhTrang === 4 && (
            <button
              type="button"
              className="btn btn-default"
              onClick={() => OnClick(7)}
            >
              <i className="fas fa-share blue" /> CẤP DỊCH VỤ
            </button>
          )}
          {data?.tinhTrang === 7 && (
            <button
              type="button"
              className="btn btn-default"
              onClick={() => OnClick(8)}
            >
              <i className="fas fa-share blue" /> HỦY CẤP DỊCH VỤ
            </button>
          )}
          {data?.tinhTrang === 8 && (
            <button
              type="button"
              className="btn btn-default"
              onClick={() => OnClick(4)}
            >
              <i className="fas fa-share blue" /> KHÔI PHỤC
            </button>
          )}
        </div>
      </ScrollbarsCustum>
    </>
  );
}

export function GetThongTinHeDieuHanh(props) {
  const { id } = props;

  const [dataHeDieuHanh, setDataHeDieuHanh] = useState();
  useEffect(() => {
    if (!Helper.isNullOrUndefined(id))
      new Api()
        .Get_ThongTinHeDieuHanh({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
        })
        .then((res) => {
          setDataHeDieuHanh(res?.data?.ten);
        });
  }, []);
  return <>{dataHeDieuHanh}</>;
}
