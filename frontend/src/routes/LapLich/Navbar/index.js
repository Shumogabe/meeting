import React, { useEffect, useState } from "react";
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
  SwalAlertConfirm,
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
import "./css.css";

let timerInterval;

export default function Navbar({ language, setOpenAdd, permissions, user }) {
  const [roomName, setRoomName] = useState("");
  const [thoiGianChoKhiTaoNhanhPhongHop, setThoiGianChoKhiTaoNhanhPhongHop] =
    useState(0);
  // const onCloseModal = () => {
  //   setOpenAdd(false);
  // };

  useEffect(() => {
    // CheckUser().then((user) => {
    //   if (Helper.isNullOrUndefined(user)) {
    //     sessionStorage.clear();
    //     localStorage.clear();
    //     // HandleLogout("login");
    //   } else {
    //   }
    // });
    new Api()
      .LayRaThietLapCauHinh(
        "tl_ch_thoigiancho",
        "ThoiGianChoKhiTaoNhanhPhongHop",
      )
      .then((res) => {
        if (res.code === 200) {
          setThoiGianChoKhiTaoNhanhPhongHop(res?.data?.giatri);
        }
      });
  }, []);

  // useEffect(()=>{
  //   new Api().get_RoomName().then((res) => setRoomName(res));
  // },[])

  return (
    <nav
      id="main-header"
      className="main-header navbar navbar-expand navbar-white navbar-light"
      style={{ height: "57px" }}
    >
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i
              className="fas fa-home site-bars"
              style={{ lineHeight: "24px" }}
            />
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block site-name">
          <a
            href={HREF.TrangChu}
            className="nav-link fontsize-28"
            style={{ lineHeight: "28px" }}
          >
            {language?.NAVBAR?.SITE_SLOGAN}
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown" style={{ cursor: "pointer" }}>
          {permissions &&
            (permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true ||
              permissions?.includes(FUNC_PERMISSION.APPROVE) === true) &&
            window.location.pathname.endsWith(HREF.LichHop) && (
              <div className="dropdown">
                <a
                  href
                  className="nav-link dropdown-toggle"
                  id="dropdownMenuButton1"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  title="Lập lịch"
                >
                  <i className="fas fa-calendar-plus green" />
                  {window.innerWidth > 992 ? "Lập lịch" : ""}
                </a>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <a
                    href
                    className="dropdown-item"
                    onClick={() => {
                      CheckUser()
                        .then((user) => {
                          if (Helper.isNullOrUndefined(user)) {
                            let ignoreMobileMode =
                              sessionStorage.getItem("ignoreMobileMode");
                            sessionStorage.clear();
                            sessionStorage.setItem(
                              "ignoreMobileMode",
                              ignoreMobileMode,
                            );
                            localStorage.clear();
                            window.location.href = HREF.DangNhap;
                          } else {
                            if (
                              !Helper.isNullOrUndefined(
                                localStorage.getItem("UserInfo"),
                              ) &&
                              !localStorage
                                .getItem("UserInfo")
                                .includes(FUNC_PERMISSION.SCHEDULE)
                            ) {
                              return SwalAlertAllConfiguration({
                                toast: true,
                                title: "Thông báo",
                                text: "Tài khoản bạn không có quyền thao tác! Vui lòng liên hệ quản trị viên",
                                footer: `Vui lòng chờ sau <b></b> giây`,
                                icon: "warning",
                                timer: 3000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                  SwalIsLoading();
                                  const timer =
                                    SwalGetPopup().querySelector("b");
                                  timerInterval = setInterval(() => {
                                    timer.textContent = `${SwalGetTimerLeft()}`;
                                  }, 100);
                                },
                                willClose: () => {
                                  clearInterval(timerInterval);
                                },
                              });
                            }
                            SwalAlertConfirm({
                              title: "Tạo tự động tên phòng họp?",
                              showDenyButton: true,
                              showCancelButton: false,
                              confirmButtonText: "Đồng ý",
                              denyButtonText: "Không",
                              confirmYes: (result) => {
                                new Api().get_RoomName().then((e) => {
                                  return HandleCreateRoom(e?.data, user?.id)
                                    .then((room) => {
                                      if (
                                        Helper.isNullOrUndefined(room?.data)
                                      ) {
                                        SwalShowValidationMessage(
                                          room?.message,
                                        );
                                      } else {
                                        SwalAlertAllConfiguration({
                                          toast: true,
                                          title: "Thông báo",
                                          text: result?.value?.message
                                            ? result?.value?.message
                                            : "Thêm thành công!",
                                          footer: `Vui lòng chờ sau <b></b> giây`,
                                          icon: "success",
                                          timer: thoiGianChoKhiTaoNhanhPhongHop,
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            SwalIsLoading();
                                            const timer =
                                              SwalGetPopup().querySelector("b");
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
                                          if (
                                            resultChild.dismiss ===
                                            SwalDismissReasonTimer()
                                          ) {
                                            sessionStorage.setItem(
                                              "thamgiatructuyen",
                                              "true",
                                            );
                                            window.location.href =
                                              HREF.HopTrucTuyen +
                                              "/" +
                                              room?.data;
                                          }
                                        });
                                        return room?.data;
                                      }
                                    })
                                    .catch((err) => {
                                      SwalShowValidationMessage(err?.message);
                                    });
                                });
                              },
                              confirmDenied: () => {
                                SwalAlertAllConfiguration({
                                  title: "Thêm nhanh phòng họp",
                                  html: "Tên phòng họp",
                                  footer: `<b><i class="text-danger">
                                        Tên phòng họp phải là chữ liền, không dấu, không chứa ký tự đặc biệt hay khoảng trống
                                      </i></b>`,
                                  input: "text",
                                  // inputValue: ,
                                  inputAttributes: {
                                    autocapitalize: "off",
                                  },
                                  showCancelButton: true,
                                  confirmButtonText: "Thêm phòng họp",
                                  cancelButtonText: "Thoát",
                                  showLoaderOnConfirm: true,
                                  preConfirm: async (login) => {
                                    try {
                                      return HandleCreateRoom(login, user?.id)
                                        .then((room) => {
                                          if (
                                            Helper.isNullOrUndefined(room?.data)
                                          ) {
                                            SwalShowValidationMessage(
                                              room?.message,
                                            );
                                          } else {
                                            login = room?.data;
                                            return room?.data;
                                          }
                                        })
                                        .catch((err) => {
                                          SwalShowValidationMessage(
                                            err?.message,
                                          );
                                        });
                                    } catch (error) {
                                      SwalShowValidationMessage(
                                        `Request failed: ${error}`,
                                      );
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
                                        : "Thêm thành công!",
                                      footer: `Vui lòng chờ sau <b></b> giây`,
                                      icon: "success",
                                      timer: thoiGianChoKhiTaoNhanhPhongHop,
                                      timerProgressBar: true,
                                      showConfirmButton: false,
                                      didOpen: () => {
                                        SwalIsLoading();
                                        const timer =
                                          SwalGetPopup().querySelector("b");
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
                                      if (
                                        resultChild.dismiss ===
                                        SwalDismissReasonTimer()
                                      ) {
                                        sessionStorage.setItem(
                                          "thamgiatructuyen",
                                          "true",
                                        );
                                        window.location.href =
                                          HREF.HopTrucTuyen +
                                          "/" +
                                          result?.value;
                                      }
                                    });
                                  }
                                });
                              },
                            });
                          }
                        })
                        .catch((error) => {
                          SwalAlertAllConfiguration({
                            toast: true,
                            title: "Thông báo",
                            text: "Tài khoản bạn không có quyền thao tác! Vui lòng liên hệ quản trị viên",
                            footer: `Vui lòng chờ sau <b></b> giây`,
                            icon: "warning",
                            timer: 3000,
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
                          });
                          console.error(error);
                        });
                    }}
                  >
                    {/* Thêm nhanh lịch họp */}
                    {language?.NAVBAR?.QUICKLYCREATEMEETINGROOMS}
                  </a>
                  <a
                    href
                    className="dropdown-item"
                    data-toggle="modal"
                    data-target="#schedule-create"
                    onClick={() => {
                      CheckUser()
                        .then((user) => {
                          if (Helper.isNullOrUndefined(user)) {
                            let ignoreMobileMode =
                              sessionStorage.getItem("ignoreMobileMode");
                            sessionStorage.clear();
                            sessionStorage.setItem(
                              "ignoreMobileMode",
                              ignoreMobileMode,
                            );
                            localStorage.clear();
                            window.location.href = HREF.DangNhap;
                          } else {
                            if (
                              !Helper.isNullOrUndefined(
                                localStorage.getItem("UserInfo"),
                              ) &&
                              !localStorage
                                .getItem("UserInfo")
                                .includes(FUNC_PERMISSION.SCHEDULE)
                            ) {
                              return SwalAlertAllConfiguration({
                                toast: true,
                                title: "Thông báo",
                                text: "Tài khoản bạn không có quyền thao tác! Vui lòng liên hệ quản trị viên",
                                footer: `Vui lòng chờ sau <b></b> giây`,
                                icon: "warning",
                                timer: 3000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                  SwalIsLoading();
                                  const timer =
                                    SwalGetPopup().querySelector("b");
                                  timerInterval = setInterval(() => {
                                    timer.textContent = `${SwalGetTimerLeft()}`;
                                  }, 100);
                                },
                                willClose: () => {
                                  clearInterval(timerInterval);
                                },
                              });
                            }
                            setOpenAdd(true);
                          }
                        })
                        .catch((error) => {
                          if (error)
                            SwalAlertAllConfiguration({
                              toast: true,
                              title: "Thông báo",
                              text: "Tài khoản bạn không có quyền thao tác! Vui lòng liên hệ quản trị viên",
                              footer: `Vui lòng chờ sau <b></b> giây`,
                              icon: "warning",
                              timer: 3000,
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
                            });
                        });
                    }}
                  >
                    {/* Thêm lịch họp */}
                    {language?.NAVBAR?.ADDMEETINGSCHEDULE}
                  </a>
                </div>
              </div>
            )}
        </li>
        <li className="nav-item">
          <a className="nav-link" href={HREF.LichHop} title="Lịch họp">
            <i className="fas fa-calendar green" />
            {window.innerWidth > 992 ? "Lịch họp" : ""}
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href={"./static/files/Tailieu_HDSD_HTT.pdf"}
            target="_blank"
            title="Hướng dẫn"
          >
            <i className="fas fa-info-circle green" />
            {window.innerWidth > 992 ? "Hướng dẫn" : ""}
          </a>
        </li>
        <li className="nav-item dropdown">
          <a
            href
            className="btn btn-signin dropdown-toggle info"
            id="dropdownMenuButton1"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {/* TẠO PHÒNG HỌP */}
            <i className="fas fa-user" />{" "}
            {window.innerWidth > 992 && (
              <>
                {(user && user?.ten_day_du) ||
                  (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
                    ?.username
                    ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.profile?.username
                    : JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE),
                        )?.profile?.sub.includes("@monre.gov.vn")
                      ? JSON.parse(
                          sessionStorage.getItem(SESSION_STORAGE),
                        )?.profile?.sub.replace("@monre.gov.vn", "")
                      : JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                          ?.profile?.sub)}{" "}
              </>
            )}
          </a>
          <div
            className="dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
            style={{
              left: "unset",
              right: "0px",
            }}
          >
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
            {/* <a
              href={HREF.ThongTinCaNhan}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => {}}
            >
              {language?.NAVBAR?.INFO}
            </a> */}
            <a
              href
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // sessionStorage.clear();
                // localStorage.clear();
                // window.location.reload();
                // userManager.signoutRedirect({
                //   post_logout_redirect_uri: APP_ADMIN_URI,
                // });
                // userManager.signoutRedirect({
                //   post_logout_redirect_uri: APP_ADMIN_URI,
                // })
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
        <li
          className={window.innerWidth > 992 ? "nav-item" : "nav-item d-none"}
        >
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
