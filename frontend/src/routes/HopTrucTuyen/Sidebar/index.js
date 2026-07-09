import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Spin } from "antd";
import moment from "moment";
import { CheckUser, HandleLogout } from "../../../components/Modal";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";
import { Theme } from "../../../theme";
import "./css.css";

export default function MainSidebar({
  scheduleSidebar,
  setRoomMini,
  loading,
  displaySideBar,
  online,
  setOnline,
}) {
  const [user, setUser] = useState();
  const refs = useRef([]);
  useEffect(() => {
    CheckUser().then((usr) => {
      if (!Helper.isNullOrUndefined(usr)) {
        setUser(usr);
      }
    });
    if (window.innerWidth < 1023) {
      refs.current[1].classList.remove("d-none");
      refs.current[2].classList.remove("d-none");
      refs.current[3].classList.remove("d-none");
      refs.current[4].classList.remove("d-none");
      refs.current[5].classList.remove("d-none");
      refs.current[6].classList.remove("d-none");
      refs.current[7].classList.remove("d-none");
      refs.current[8].classList.remove("d-none");
      refs.current[9].classList.remove("d-none");
      refs.current[10].classList.remove("d-none");
      refs.current[11].style.width = "75px";
      refs.current[11].style.float = "unset";
      refs.current[12].classList.remove("d-none");
    }
  }, []);
  const onHandleToggle = (mouse) => {
    if (window.innerWidth > 1023) {
      switch (mouse) {
        case "enter":
          refs.current[1].classList.remove("d-none");
          refs.current[2].classList.remove("d-none");
          refs.current[3].classList.remove("d-none");
          refs.current[4].classList.remove("d-none");
          refs.current[5].classList.remove("d-none");
          refs.current[6].classList.remove("d-none");
          refs.current[7].classList.remove("d-none");
          refs.current[8].classList.remove("d-none");
          refs.current[9].classList.remove("d-none");
          refs.current[10].classList.remove("d-none");
          refs.current[11].style.width = "75px";
          refs.current[11].style.float = "unset";
          refs.current[12].classList.remove("d-none");
          break;
        case "leave":
          refs.current[1].classList.toggle("d-none");
          refs.current[2].classList.toggle("d-none");
          refs.current[3].classList.toggle("d-none");
          refs.current[4].classList.toggle("d-none");
          refs.current[5].classList.toggle("d-none");
          refs.current[6].classList.toggle("d-none");
          refs.current[7].classList.toggle("d-none");
          refs.current[8].classList.toggle("d-none");
          refs.current[9].classList.toggle("d-none");
          refs.current[10].classList.toggle("d-none");
          refs.current[11].style.width = "34px";
          refs.current[11].style.float = "left";
          refs.current[12].classList.toggle("d-none");
          break;
        default:
          break;
      }
    }
  };
  return (
    <Spin
      spinning={
        // !loading
        false
      }
    >
      <aside
        id="main-sidebar"
        className="main-sidebar sidebar-dark-primary elevation-4"
        onMouseEnter={() => onHandleToggle("enter")}
        onMouseLeave={() => onHandleToggle("leave")}
      >
        {/* Brand Logo */}
        <a
          href={HREF.TrangChu}
          className="brand-link"
          style={{ marginLeft: "-10px" }}
        >
          {window.location.pathname.includes(HREF.HopTrucTuyen) ? (
            <img
              src={"/static/" + Theme.theme().href + "/img/QuocHuy.png"}
              alt={Theme.theme().lang.vi.SITE_SLOGAN}
              className="brand-image img-circle elevation-3"
              style={{ opacity: ".8" }}
            />
          ) : (
            <img
              src={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
              alt={Theme.theme().lang.vi.SITE_SLOGAN}
              className="brand-image img-circle elevation-3"
              style={{ opacity: ".8" }}
            />
          )}
          <span className="brand-text bold">
            {Theme.theme().lang.vi.SITE_NAME}
          </span>
        </a>
        {/* Sidebar */}
        <div className="sidebar" style={{ padding: "0", marginLeft: "-5px" }}>
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3" style={{ marginLeft: "-5px" }}>
            <div className="image">
              {window.location.pathname.includes(HREF.HopTrucTuyen) ? (
                <img
                  src={"/static/" + Theme.theme().href + "/img/user-icon.png"}
                  style={{ width: "34px", float: "left" }}
                  ref={(element) => {
                    refs.current[11] = element;
                  }}
                />
              ) : (
                <img
                  src={"./static/" + Theme.theme().href + "/img/user-icon.png"}
                />
              )}
            </div>
            <div
              className="d-none"
              style={{ textAlign: "center" }}
              ref={(element) => {
                refs.current[12] = element;
              }}
            >
              <div className="info">
                <p>
                  <a
                    href
                    className="d-block full-name user-fullname-display"
                    style={{ fontSize: "15px" }}
                  >
                    {user?.ten_day_du}
                  </a>
                  <a
                    href
                    className="d-block full-name user-fullname-display"
                    style={{ fontSize: "15px" }}
                  >
                    {user?.thong_tin_don_vi?.ten}
                  </a>
                </p>
              </div>
              {/*
            {!Helper.isNullOrUndefined(
                sessionStorage.getItem(SESSION_STORAGE)
              ) && (
                <Button
                  onClick={() => {
                    HandleLogout("logout");
                  }}
                >
                  Đăng xuất
                </Button>
              )}
            */}
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <a href={HREF.LichHop} className="nav-link" target="_blank">
                  <i className="far fa-calendar-alt" />{" "}
                  <p>
                    Lịch họp
                    <i className="fas fa-angle-left right" />
                  </p>
                </a>
              </li>
              {/*
              <li className="nav-item">
                <a href className="nav-link" target="_blank">
                  <i className="far fa-calendar-alt" />{" "}
                  <p>
                    Sự kiện
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
              </li>
              */}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
          <Divider style={{ backgroundColor: "#fff" }} />
          <div
            className="nav flex-column nav-tabs h-100"
            id="vert-tabs-tab"
            role="tablist"
            aria-orientation="vertical"
            // ref={(element) => {
            //   refs.current[2] = element;
            // }}
            // onMouseEnter={() => onHandleToggle("enter")}
            // onMouseLeave={() => onHandleToggle("leave")}
            style={{
              display: "flex",
            }}
          >
            <div
              className={online === true ? "nav-link active" : "nav-link"}
              id="vert-tabs-phonghop-tab"
              data-id="phonghop"
              data-toggle="pill"
              href="#vert-tabs-phonghop"
              role="tab button"
              aria-controls="vert-tabs-phonghop"
              aria-selected="true"
              onClick={() => {
                //setRoomMini(false);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <div>
                <i className="fas fa-video" />{" "}
                <span
                  ref={(element) => {
                    refs.current[1] = element;
                  }}
                  className="d-none"
                >
                  Phòng họp trực tuyến
                </span>
              </div>
            </div>
            <div
              className={online === false ? "nav-link active" : "nav-link"}
              id="vert-tabs-thongtin-tab"
              data-id="thongtin"
              data-toggle="pill"
              href="#vert-tabs-thongtin"
              role="tab button"
              aria-controls="vert-tabs-thongtin"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <div>
                <i className="fas fa-info-circle" />{" "}
                <span
                  ref={(element) => {
                    refs.current[2] = element;
                  }}
                  className="d-none"
                >
                  Thông tin cuộc họp
                </span>
              </div>
              <div
                className="info-tab d-none hidden"
                ref={(element) => {
                  refs.current[3] = element;
                }}
              >
                {/*
                <p className="title">
                  {scheduleSidebar?.schedule?.title} -{" "}
                  {scheduleSidebar?.schedule?.roomName}
                </p>
                <p className="datetime">
                  {moment(scheduleSidebar?.schedule?.startTime).format(
                    "DD-MM-YYYY, hh:mm A"
                  )}
                </p>
                <p className="members">
                  {!Helper.isNullOrUndefined(scheduleSidebar?.participants) &&
                    scheduleSidebar?.participants.map((item, index) => {
                      if (index <= 3) {
                        return (
                          <img
                            alt=""
                            src={
                              item?.avatarURL
                                ? item?.avatarURL
                                : "/static/img/user-icon.png"
                            }
                            className="icon"
                            title={item?.displayName}
                          />
                        );
                      }
                    })}
                  {!Helper.isNullOrUndefined(scheduleSidebar?.participants) &&
                    scheduleSidebar?.participants.length > 3 && (
                      <span className="icon icon-x icon-4">
                        +{scheduleSidebar?.participants.length - 3}
                      </span>
                    )}
                </p>
                
                */}
              </div>
            </div>
            <div
              className="nav-link"
              id="vert-tabs-chuongtrinh-tab"
              data-id="chuongtrinh"
              data-toggle="pill"
              href="#vert-tabs-chuongtrinh"
              role="tab button"
              aria-controls="vert-tabs-chuongtrinh"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <i className="fas fa-list-ul"></i>{" "}
              <span
                ref={(element) => {
                  refs.current[4] = element;
                }}
                className="d-none"
              >
                Chương trình họp
              </span>
            </div>
            <div
              className="nav-link"
              id="vert-tabs-thanhphan-tab"
              data-id="thanhphan"
              data-toggle="pill"
              href="#vert-tabs-thanhphan"
              role="tab button"
              aria-controls="vert-tabs-thanhphan"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <i className="fas fa-users"></i>{" "}
              <span
                ref={(element) => {
                  refs.current[5] = element;
                }}
                className="d-none"
              >
                Thành phần tham gia
              </span>
            </div>
            <div
              className="nav-link"
              id="vert-tabs-tailieu-tab"
              data-id="tailieu"
              data-toggle="pill"
              href="#vert-tabs-tailieu"
              role="tab button"
              aria-controls="vert-tabs-tailieu"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <i className="fas fa-file-pdf" />{" "}
              <span
                ref={(element) => {
                  refs.current[6] = element;
                }}
                className="d-none"
              >
                Tài liệu cuộc họp
              </span>
            </div>
            <div
              className="nav-link"
              id="vert-tabs-traodoi-tab"
              data-id="traodoi"
              data-toggle="pill"
              href="#vert-tabs-traodoi"
              role="tab button"
              aria-controls="vert-tabs-traodoi"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              {/* <i className="fas fa-file-pdf" />{" "} */}
              <i className="fas fa-comments"></i>{" "}
              <span
                ref={(element) => {
                  refs.current[7] = element;
                }}
                className="d-none"
              >
                Trao đổi, chia sẻ tài liệu
              </span>
            </div>
            <div
              className={
                window.innerWidth > 1023
                  ? "nav-link form-group"
                  : "nav-link form-group d-none"
              }
              id="vert-tabs-trinhdien-tab"
              data-id="trinhdien"
              data-toggle="pill"
              href="#vert-tabs-trinhdien"
              role="tab button"
              aria-controls="vert-tabs-trinhdien"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <i className="fas fa-shapes" />{" "}
              <span
                ref={(element) => {
                  refs.current[8] = element;
                }}
                className="d-none"
              >
                Trình bày (Bảng vẽ)
              </span>
            </div>
            <div
              className="nav-link form-group"
              id="vert-tabs-bieuquyet-tab"
              data-id="bieuquyet"
              data-toggle="pill"
              href="#vert-tabs-bieuquyet"
              role="tab button"
              aria-controls="vert-tabs-bieuquyet"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <i className="fas fa-poll" />{" "}
              <span
                ref={(element) => {
                  refs.current[9] = element;
                }}
                className="d-none"
              >
                Biểu quyết
              </span>
            </div>
            <div
              className="nav-link form-group"
              id="vert-tabs-ketluan-tab"
              data-id="ketluan"
              data-toggle="pill"
              href="#vert-tabs-ketluan"
              role="tab button"
              aria-controls="vert-tabs-ketluan"
              aria-selected="false"
              onClick={() => {
                //setRoomMini(true);
                // document.getElementById('jitsiMeeting-0').style.height = '95vh';
              }}
            >
              <i className="fas fa-address-book" />{" "}
              <span
                ref={(element) => {
                  refs.current[10] = element;
                }}
                className="d-none"
              >
                Kết luận
              </span>
            </div>
          </div>
        </div>
        {/* /.sidebar */}
      </aside>
    </Spin>
  );
}
