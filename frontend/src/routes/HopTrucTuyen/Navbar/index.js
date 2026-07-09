import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import moment from "moment";
import Api from "../../../api";
import {
  CheckUser,
  HandleCreateRoom,
  HandleTabs,
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
import { SESSION_STORAGE, href_be_qtht, href_fe_qtht } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";

let timerInterval;

export default function Navbar({
  openAdd,
  onCloseModal,
  language,
  setOpenAdd,
  permissions,
}) {
  // useEffect(() => {
  //   CheckUser().then((user) => {
  //     if (Helper.isNullOrUndefined(user)) {
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
        <li
          className="nav-item dropdown"
          style={{
            background: "#1e6abb",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <a
            className="nav-link bg-green border-radius-5"
            href
            style={{ color: "#fff" }}
            onClick={() => {
              SwalAlertAllConfiguration({
                title: "Tham gia phòng họp",
                html: "Nhập tên phòng họp",
                footer: `<b><i class="text-danger">
              Tên phòng họp không được chứa các kí tự khoảng trắng, dấu câu và kí tự đặc biệt
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
                        "Tên lịch họp không được để trống",
                      );
                    else {
                      return new Api()
                        .get_schedule_byRoomName({ room: login })
                        .then((response) => {
                          if (!Helper.isNullOrUndefined(response?.data?.id)) {
                            if (response?.data?.status === 1) {
                              SwalShowValidationMessage(
                                "Lịch họp chưa được phê duyệt!",
                              );
                            } else if (
                              moment(response?.data?.endTime).valueOf() <
                                moment().valueOf() ||
                              response?.data?.status === 3
                            ) {
                              SwalShowValidationMessage(
                                "Lịch họp đã kết thúc!",
                              );
                            } else if (!response?.data?.start) {
                              SwalShowValidationMessage(
                                "Lịch họp chưa được bắt đầu!",
                              );
                            } else {
                              return login;
                            }
                          } else {
                            SwalShowValidationMessage(
                              "Lịch họp không tồn tại!",
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
                      : "Thêm thành công!",
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
                    /* Read more about handling dismissals below */
                    // setTimeout(function () {
                    //   //code goes here
                    //   window.location.href =(
                    //     HREF.HopTrucTuyen + "/" + result?.value
                    //   );
                    // }, 3000);
                    if (resultChild.dismiss === SwalDismissReasonTimer()) {
                      // console.log("I was closed by the timer");
                      window.location.href =
                        HREF.HopTrucTuyen + "/" + result?.value;
                    }
                  });
                }
              });
            }}
          >
            <i className="fas fa-video" />
            Tham gia
          </a>
        </li>
        <li className="nav-item dropdown" style={{ cursor: "pointer" }}>
          {/* <a className="nav-link" href>
            <i className="fas fa-calendar-plus" />
            Tạo phòng họp
          </a> */}
          <div className="dropdown">
            <a
              href
              className="nav-link dropdown-toggle"
              id="dropdownMenuButton1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-calendar-plus" />
              Lập lịch
            </a>
            <div
              className="dropdown-menu"
              aria-labelledby="dropdownMenuButton1"
            >
              <a
                href
                className="dropdown-item"
                onClick={() => {
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
                        const timer = SwalGetPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          timer.textContent = `${SwalGetTimerLeft()}`;
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      },
                    });
                  }
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
                        SwalAlertAllConfiguration({
                          title: "Thêm nhanh lịch họp",
                          //html: "Nhập tên phòng họp",
                          footer: `<b><i class="text-danger">
                          Tên lịch họp viết liền, không dấu, không nhập ký tự đặc biệt và khoảng trống
                        </i></b>`,
                          input: "text",
                          inputAttributes: {
                            autocapitalize: "off",
                          },
                          showCancelButton: true,
                          confirmButtonText: "Tạo phòng họp",
                          cancelButtonText: "Thoát",
                          showLoaderOnConfirm: true,
                          preConfirm: async (login) => {
                            try {
                              return HandleCreateRoom(login, user?.id)
                                .then((room) => {
                                  if (Helper.isNullOrUndefined(room?.data)) {
                                    SwalShowValidationMessage(room?.message);
                                  } else return room?.data?.roomName;
                                })
                                .catch((err) => {
                                  SwalShowValidationMessage(err?.message);
                                });
                            } catch (error) {
                              SwalShowValidationMessage(`
                              Request failed: ${error}
                            `);
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
                              timer: 1500,
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
                              /* Read more about handling dismissals below */
                              // setTimeout(function () {
                              //   //code goes here
                              //   window.location.href =(
                              //     HREF.HopTrucTuyen + "/" + result?.value
                              //   );
                              // }, 3000);
                              if (
                                resultChild.dismiss === SwalDismissReasonTimer()
                              ) {
                                // console.log("I was closed by the timer");
                                window.location.href =
                                  HREF.HopTrucTuyen + "/" + result?.value;
                              }
                            });
                          }
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
                Thêm nhanh lịch họp
              </a>
              <a
                href
                className="dropdown-item"
                data-toggle="modal"
                data-target="#schedule-create"
                onClick={() => {
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
                        const timer = SwalGetPopup().querySelector("b");
                        timerInterval = setInterval(() => {
                          timer.textContent = `${SwalGetTimerLeft()}`;
                        }, 100);
                      },
                      willClose: () => {
                        clearInterval(timerInterval);
                      },
                    });
                  }
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
                        setOpenAdd(true);
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
                    });
                }}
              >
                Thêm lịch họp
              </a>
            </div>
          </div>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link" href={HREF.LichHop} target="_blank">
            <i className="fas fa-calendar green" />
            Lịch họp
          </a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link" href>
            <i className="fas fa-info-circle green" />
            Hướng đẫn
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
            {JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
              ?.username
              ? JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile
                  ?.username
              : JSON.parse(
                    sessionStorage.getItem(SESSION_STORAGE),
                  )?.profile?.sub.includes("@monre.gov.vn")
                ? JSON.parse(
                    sessionStorage.getItem(SESSION_STORAGE),
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
                  role="button"
                >
                  <i class="fas fa-cogs info"></i> Quản trị hệ thống
                </a>
              )}
            <a
              href={HREF.ThongTinCaNhan}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => {}}
            >
              <i class="fas fa-user info"></i> {language?.NAVBAR?.INFO}
            </a>
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
              <i class="fas fa-sign-out-alt info"></i>{" "}
              {language?.NAVBAR?.LOGOUT}
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-widget="fullscreen" href role="button">
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>
      </ul>
      <Modal
        title="Thêm lịch họp"
        centered
        open={openAdd}
        onOk={() => setOpenAdd(false)}
        onCancel={() => setOpenAdd(false)}
        footer={""}
        ok
        width={window.innerWidth / 2}
        zIndex={1038}
        style={{ top: "26px" }}
      >
        <HandleTabs onCloseModal={onCloseModal} />
      </Modal>
    </nav>
  );
}
