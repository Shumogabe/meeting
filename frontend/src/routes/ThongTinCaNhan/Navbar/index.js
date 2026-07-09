import React from "react";
import { Modal } from "antd";
import moment from "moment";
import Api from "../../../api";
import {
  CheckUser,
  HandleCreateRoom,
  HandleLogout,
} from "../../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalDismissReasonTimer,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { SESSION_STORAGE, href_be_qtht } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";

let timerInterval;

export default function Navbar({ language, setOpenAdd, permissions }) {
  // const [openAdd, setOpenAdd] = useState(false);
  // const [permissions, setPermissions] = useState(false);
  // const onCloseModal = () => {
  //   setOpenAdd(false);
  // };

  // useEffect(() => {
  //   CheckUser().then((user) => {
  //     if (Helper.isNullOrUndefined(user)) {
  //       sessionStorage.clear();
  //       localStorage.clear();
  //       HandleLogout("login");
  //     } else {
  //       new Api()
  //         .PhanQuyenVaiTroNguoiDung({
  //           token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //             ?.access_token,
  //         })
  //         .then((e) => {
  //           if (!Helper.isNullOrUndefined(e)) {
  //             setPermissions(
  //               JSON.stringify(e).includes(FUNC_PERMISSION.SYSTEM_ADMIN)
  //             );
  //             localStorage.setItem("UserInfo", JSON.stringify(e));
  //           }
  //         });
  //     }
  //   });
  // }, []);

  return (
    <nav
      id="main-header"
      className="main-header navbar navbar-expand navbar-white navbar-light"
      style={{ height: "46px" }}
    >
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-laptop-house site-bars" />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block site-name">
          <a href={HREF.TrangChu} className="nav-link ">
            {language?.NAVBAR?.SITE_SLOGAN}
          </a>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href={HREF.LichHop}>
            <i className="fas fa-calendar" />
            Lịch họp
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href={"./static/files/Tailieu_HDSD_HTT.pdf"}
            target="_blank"
          >
            <i className="fas fa-info-circle" />
            Hướng dẫn
          </a>
        </li>
        <li className="nav-item dropdown">
          <a
            href
            className="btn btn-signin dropdown-toggle"
            id="dropdownMenuButton1"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {/* TẠO PHÒNG HỌP */}
            <i className="fas fa-user" />{" "}
            {JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
              ?.username
              ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
                  ?.username
              : JSON.parse(
                  sessionStorage.getItem(SESSION_STORAGE)
                )?.profile?.sub.includes("@monre.gov.vn")
              ? JSON.parse(
                  sessionStorage.getItem(SESSION_STORAGE)
                )?.profile?.sub.replace("@monre.gov.vn", "")
              : JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
                  ?.sub}
          </a>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <a
              id="button-control-sidebar-dark"
              className="dropdown-item"
              href={HREF.ThongTinCaNhan}
              // data-widget="control-sidebar"
              // data-controlsidebar-slide="true"
              role="button"
            >
              Thông tin cá nhân
            </a>
            {permissions &&
              permissions?.includes(FUNC_PERMISSION.SYSTEM_ADMIN) === true && (
                <a
                  id="button-control-sidebar-dark"
                  className="dropdown-item"
                  href={href_fe_qtht}
                  // data-widget="control-sidebar"
                  // data-controlsidebar-slide="true"
                  role="button"
                >
                  Quản trị hệ thống
                </a>
              )}
            <a
              href
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => {
                HandleLogout("logout");
              }}
            >
              {/* Đăng xuất */}
              {language?.NAVBAR?.LOGOUT}
            </a>
          </div>
        </li>
        {/* <li className="nav-item dropdown">
          <a className="nav-link " href="#">
            <i className="fas fa-bell" />
            <span className="badge badge-danger navbar-badge">3</span>
            <span className="badge-notice">Thông báo</span>
          </a>
        </li> */}

        {/* {!Helper.isNullOrUndefined(permissions) &&
          permissions &&
          permissions?.includes(FUNC_PERMISSION.SYSTEM_ADMIN) === true && (
            <li className="nav-item dropdown">
              <a
                id="button-control-sidebar-dark"
                className="nav-link"
                href={href_fe_qtht}
                // data-widget="control-sidebar"
                // data-controlsidebar-slide="true"
                role="button"
              >
                <i className="fas fa-cogs" />
                Hệ thống
              </a>
            </li>
          )} */}
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>
        {/* <li className="nav-item">
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-controlsidebar-slide="true"
            href="#"
            role="button"
          >
            <i className="fas fa-th-large" />
          </a>
        </li> */}
      </ul>
      <Modal
        title="Thêm lịch họp"
        centered
        // open={openAdd}
        // onOk={() => setOpenAdd(false)}
        // onCancel={() => setOpenAdd(false)}
        footer={""}
        ok
        width={(window.innerWidth * 2) / 3}
        zIndex={1038}
        // style={{ top: "26px" }}
      >
        {/* <HandleTabs onCloseModal={onCloseModal} /> */}
      </Modal>
    </nav>
  );
}
