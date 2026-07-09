import React, { useState } from "react";
import { Modal } from "antd";
import moment from "moment";
import Api from "../../../api";
import {
  CheckUser,
  HandleCreateRoom,
  HandleLogout,
  HandleTabs,
} from "../../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalDismissReasonTimer,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { SESSION_STORAGE, href_be_qtht, href_fe_qtht } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import { Theme } from "../../../theme";
import "./css.css";
import { Placeholder } from "react-bootstrap";

let timerInterval;

export default function Navbar({
  setLang,
  lang,
  language,
  permissions,
  user,
  setUser,
}) {
  const [openAdd, setOpenAdd] = useState(false);
  const onCloseModal = () => {
    setOpenAdd(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-info bg-white">
        <div className="container">
          <a className="navbar-brand" href={HREF.TrangChu}>
            <img
              className="site-logo"
              src={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
              alt=""
            />
            <span className="site-name">
              {/* CMEETING */}
              {language?.NAVBAR?.SITE_NAME}
            </span>
            <br />
            <span className="site-slogan" style={{ paddingTop: "5px" }}>
              {/* HỆ THỐNG HỌP TRỰC TUYẾN */}
              {language?.NAVBAR?.SITE_SLOGAN}
            </span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
            <span className="navbar-toggler-icon" />
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
            <ul className="form-inline navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href={HREF.Support}
                  style={{ textTransform: "unset", marginRight: 5 }}
                >
                  <i className="fas fa-question"></i>{" "}
                  {language?.NAVBAR?.SUPPORT}
                </a>
              </li>
              {!Helper.isNullOrUndefined(user) && (
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href={HREF.LichHop}
                    style={{ textTransform: "unset", marginRight: 5 }}
                  >
                    <i className="fas fa-calendar"></i>{" "}
                    {language?.NAVBAR?.CALENDAR}
                  </a>
                </li>
              )}
              <li className="nav-item">
                <a
                  style={{ textTransform: "unset" }}
                  className="nav-link active d-none"
                  href
                  onClick={() => {
                    SwalAlertAllConfiguration({
                      title: "Tham gia phòng họp",
                      html: "Nhập tên phòng họp",
                      footer: `<b><i className"text-danger">
                    Tên phòng họp không được chứ các kí tự khoảng trắng, dấu câu và kí tự đặc biệt
                  </i></b>`,
                      input: "text",
                      inputAttributes: {
                        autocapitalize: "off",
                      },
                      showCancelButton: true,
                      confirmButtonText: "Tham gia",
                      cancelButtonText: "Thoát",
                      showLoaderOnConfirm: true,
                      preConfirm: async (login) => {
                        try {
                          if (Helper.isNullOrUndefined(login))
                            return SwalShowValidationMessage(
                              "Tên phòng họp không được để trống",
                            );
                          else {
                            return new Api()
                              .get_schedule_byRoomName({ room: login })
                              .then((response) => {
                                if (
                                  response &&
                                  !Helper.isNullOrUndefined(response?.data?.id)
                                ) {
                                  if (response?.data?.status === 1) {
                                    SwalShowValidationMessage(
                                      "Phòng họp chưa được phê duyệt!",
                                    );
                                  } else if (
                                    moment(response?.data?.endTime).valueOf() <
                                      moment().valueOf() ||
                                    response?.data?.status === 3
                                  ) {
                                    SwalShowValidationMessage(
                                      "Phòng họp đã kết thúc!",
                                    );
                                  } else if (!response?.data?.start) {
                                    SwalShowValidationMessage(
                                      "Phòng họp chưa được bắt đầu!",
                                    );
                                  } else {
                                    return login;
                                  }
                                } else {
                                  SwalShowValidationMessage(
                                    "Phòng họp không tồn tại!",
                                  );
                                }
                              });
                          }
                        } catch (error) {
                          SwalShowValidationMessage(`Request failed: ${error}`);
                        }
                      },
                      allowOutsideClick: () => !SwalIsLoading(),
                    }).then((result) => {
                      if (result.isConfirmed) {
                        SwalAlertAllConfiguration({
                          toast: true,
                          title: "Thông báo",
                          text: result?.value?.message
                            ? result?.value?.message
                            : "Tạo thành công!",
                          footer: `Vui lòng chờ sau <b></b> giây`,
                          icon: "success",
                          timer: 2000,
                          timerProgressBar: true,
                          showConfirmButton: false,
                          didOpen: () => {
                            SwalIsLoading();
                            const timer = SwalGetPopup().querySelector("b");
                            timerInterval = setInterval(() => {
                              timer.textContent = `${SwalGetTimerLeft()}`;
                            }, 100);
                          },
                          willClose: () => {
                            clearInterval(timerInterval);
                          },
                        }).then((resultChild) => {
                          if (
                            resultChild.dismiss === SwalDismissReasonTimer()
                          ) {
                            window.location.href =
                              HREF.HopTrucTuyen + "/" + result?.value;
                          }
                        });
                      }
                    });
                  }}
                >
                  <i className="fas fa-video" /> {/* THAM GIA */}
                  {language?.NAVBAR?.JOIN}
                </a>
              </li>
              <li className="nav-item">
                {Helper.isNullOrUndefined(
                  sessionStorage.getItem(SESSION_STORAGE),
                ) ? (
                  <a className="btn btn-signin" href={HREF.DangNhap}>
                    <i className="fas fa-sign-in-alt" /> {/* Đăng nhập */}
                    {language?.NAVBAR?.LOGIN}
                  </a>
                ) : (
                  <div className="dropdown">
                    <a
                      href
                      className="btn btn-signin dropdown-toggle"
                      id="dropdownMenuButton1"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      title={
                        (user && user?.ten_day_du) ||
                        (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                          ?.profile?.username
                          ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                              ?.profile?.username
                          : JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE),
                              )?.profile?.sub.includes("@monre.gov.vn")
                            ? JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE),
                              )?.profile?.sub.replace("@monre.gov.vn", "")
                            : JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE),
                              )?.profile?.sub)
                      }
                    >
                      <i className="fas fa-user" />{" "}
                      {(user && user?.ten_day_du) ||
                        (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                          ?.profile?.username
                          ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                              ?.profile?.username
                          : JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE),
                              )?.profile?.sub.includes("@monre.gov.vn")
                            ? JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE),
                              )?.profile?.sub.replace("@monre.gov.vn", "")
                            : JSON.parse(
                                sessionStorage.getItem(SESSION_STORAGE),
                              )?.profile?.sub)}
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {permissions &&
                        permissions?.includes(FUNC_PERMISSION.SYSTEM_ADMIN) ===
                          true && (
                          <a
                            id="button-control-sidebar-dark"
                            className="dropdown-item"
                            href={href_fe_qtht}
                            role="button"
                          >
                            Quản trị hệ thống
                          </a>
                        )}
                      <a
                        href={HREF.ThongTinCaNhan}
                        className="dropdown-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => {}}
                      >
                        {/* Đăng xuất */}
                        {language?.NAVBAR?.INFO}
                      </a>
                      <a
                        href
                        className="dropdown-item"
                        onClick={() => {
                          HandleLogout("logout");
                        }}
                      >
                        {/* Đăng xuất */}
                        {language?.NAVBAR?.LOGOUT}
                      </a>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal
        className="modal-add-schedule-home"
        title="Thêm lịch họp"
        centered
        open={openAdd}
        onOk={() => setOpenAdd(false)}
        onCancel={() => setOpenAdd(false)}
        footer={""}
        ok
        width={(window.innerWidth * 2) / 3}
      >
        <HandleTabs onCloseModal={onCloseModal} />
      </Modal>
    </>
  );
}
