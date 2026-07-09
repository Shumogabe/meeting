import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Api from "../../api";
import { CheckUser } from "../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalDismissReasonTimer,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../components/Swal";
import {
  CLIENT_ID,
  KEY_LOGIN_HTT,
  SESSION_STORAGE,
  href_sso,
} from "../../config";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";
import userManager from "../../services/auth";
import { Theme } from "../../theme";
import "./css.css";
import { Button, ConfigProvider } from "antd";

let timerInterval;

export default function Index() {
  const [isLogin, setIsLogin] = useState(0);
  const [emailLogin, setEmailLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");

  useEffect(() => {
    var res = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    new Api()
      .get_option_byKey({
        key: KEY_LOGIN_HTT,
      })
      .then((response) => {
        if (
          !Helper.isNullOrUndefined(response?.data) &&
          !response?.data?.isDeleted
        ) {
          if (!response?.data?.status) {
            setTimeout(() => {
              return SwalAlertAllConfiguration({
                toast: true,
                title: "Thông báo",
                text: "Không thể thực hiện đăng nhập! Vui lòng liên hệ quản trị viên",
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
              }).then((resultChild) => {
                if (resultChild.dismiss === SwalDismissReasonTimer()) {
                  window.location.href = "/";
                }
              });
            }, 10000);
            new Api()
              .checkAllowSSO(
                href_sso + "oauth2/token/.well-known/openid-configuration"
              )
              .then((e) => {
                if (e === false) {
                  return SwalAlertAllConfiguration({
                    toast: true,
                    title: "Thông báo",
                    text: "Không thể thực hiện đăng nhập! Vui lòng liên hệ quản trị viên",
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
                  }).then((resultChild) => {
                    if (resultChild.dismiss === SwalDismissReasonTimer()) {
                      window.location.href = "/";
                    }
                  });
                } else {
                  return userManager.signinRedirect();
                }
              });
          } else {
            setIsLogin(1);
          }
          CheckUser().then((user) => {
            if (!Helper.isNullOrUndefined(user)) {
              window.location.href = HREF.TrangChu;
            }
          });
        } else return SwalShowValidationMessage(response.message);
      })
      .catch((e) => {
        return SwalShowValidationMessage(e.message);
      });
  }, []);

  const onLogin = () => {
    if (Helper.isNullOrUndefined(emailLogin))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập tài khoản!",
      });
    // if (
    //   !Helper.isNullOrUndefined(emailLogin) &&
    //   Helper.isNullOrUndefined(
    //     emailLogin.match(
    //       /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //     )
    //   )
    // )
    //   return SwalAlertAllConfiguration({
    //     icon: "warning",
    //     title: "Email không đúng định dạng!",
    //   });
    if (Helper.isNullOrUndefined(passLogin))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập mật khẩu!",
      });
    if (
      !Helper.isNullOrUndefined(emailLogin) &&
      !Helper.isNullOrUndefined(passLogin)
    ) {
      new Api()
        .DangNhap({
          data: {
            username: emailLogin,
            password: passLogin,
          },
        })
        .then((res) => {
          if (res?.state === true) {
            let store = {
              id_token: res?.token,
              session_state: "",
              access_token: res?.token,
              token_type: "Bear",
              scope: "openid profile",
              profile: {
                sub: emailLogin,
                other: res?.data,
                azp: CLIENT_ID,
                amr: ["BasicAuthenticator"],
                sid: "",
              },
              expires_at: new Date().valueOf() / 1000 + 3600,
            };
            sessionStorage.setItem(SESSION_STORAGE, JSON.stringify(store));
            window.location.href = HREF.TrangChu;
            //console.log(res);

            // userManager.storeUser().then((user) => this.user = username );
            // return Redirect('/');
            // this.userManager = new UserManager({
            //   silent_redirect_uri: '/',
            //   automaticSilentRenew: true,
            //   filterProtocolClaims: true,
            //   loadUserInfo: true,
            //   monitorSession: true,
            //   authority: null,
            //   client_id: null,
            //   redirect_uri: '/',
            //   silent_redirect_uri: '/',
            //   scope: "openid profile",
            //   userStore: new WebStorageStateStore({ store: window.localStorage })
            // });
          }
          //Message.success("Đã gửi yêu cầu đăng ký, vui lòng kiểm tra email")
        })
        .catch((err) => {
          SwalAlertAllConfiguration({
            icon: "error",
            title: err,
          });
        });
    }
  };
  return (
    <>
      {isLogin === 1 && (
        <div className="login-wrapper">
          <div className="container">
            <div id="wrapper">
              <form action id="form-login">
                <p>
                  <img
                    src={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
                    alt=""
                  />
                </p>
                {/* <h3>Đăng nhập</h3> */}
                <div className="form-group">
                  <input
                    type="text"
                    name="email"
                    required
                    value={emailLogin}
                    onChange={(e) => {
                      setEmailLogin(e.target.value);
                    }}
                  />
                  <label htmlFor>Tài khoản</label>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="password"
                    required
                    value={passLogin}
                    onChange={(e) => {
                      setPassLogin(e.target.value);
                    }}
                  />
                  <label htmlFor>Mật khẩu</label>
                </div>
                <p className="text-center">----- Hoặc xác thực qua -----</p>
                <div style={{ textAlign: "center" }}>
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          defaultActiveBorderColor:
                            Theme.theme().css.background.color,
                          defaultActiveColor:
                            Theme.theme().css.background.color,
                          defaultBorderColor:
                            Theme.theme().css.background.color,
                          defaultColor: Theme.theme().css.background.color,
                          // defaultHoverBg: Theme.theme().css.background.color,
                          // defaultHoverBorderColor:
                          //   Theme.theme().css.background.color,
                          // defaultHoverColor: Theme.theme().css.color.color,
                          colorPrimary: Theme.theme().css.background.color,
                          colorPrimaryHover: Theme.theme().css.background.color,
                          colorPrimaryActive:
                            Theme.theme().css.background.color,
                          colorPrimaryBorder:
                            Theme.theme().css.background.color,
                        },
                      },
                    }}
                  >
                    <Button
                      color="primary"
                      variant="link"
                      onClick={() => userManager.signinRedirect()}
                      style={{ marginRight: "20px", border: "none" }}
                    >
                      {/* <img src="./static/img/Logo-monre.png" /> */}
                      Hệ thống xác thực tập trung
                    </Button>
                  </ConfigProvider>
                  {/* <button
                    className="ico"
                    type="button"
                    onClick={() => {
                      userManager.signinRedirect();
                    }}
                  >
                    Hệ thống xác thực tập trung BTNMT
                  </button> */}
                </div>
                <br />
                <div style={{ textAlign: "center" }}>
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          defaultActiveBorderColor:
                            Theme.theme().css.background.color,
                          defaultActiveColor:
                            Theme.theme().css.background.color,
                          defaultBorderColor:
                            Theme.theme().css.background.color,
                          defaultColor: Theme.theme().css.background.color,
                          defaultHoverBg: Theme.theme().css.background.color,
                          defaultHoverBorderColor:
                            Theme.theme().css.background.color,
                          defaultHoverColor: Theme.theme().css.color.color,
                          colorPrimary: Theme.theme().css.background.color,
                          colorPrimaryHover: Theme.theme().css.background.color,
                          colorPrimaryActive:
                            Theme.theme().css.background.color,
                          colorPrimaryBorder:
                            Theme.theme().css.background.color,
                        },
                      },
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={() => onLogin()}
                      style={{ marginRight: "20px" }}
                    >
                      Đăng nhập
                    </Button>
                  </ConfigProvider>
                  <Button
                    onClick={() => {
                      window.location.href = "/";
                    }}
                  >
                    Quay lại
                  </Button>
                </div>
              </form>
              <form action id="form-register">
                <p>
                  <img
                    src={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
                    alt=""
                  />
                </p>
                {/* <h3>Đăng nhập</h3> */}
                <div className="form-group">
                  <input type="text" name="email" required />
                  <label htmlFor>Họ tên</label>
                </div>
                <div className="form-group">
                  <input type="text" name="email" required />
                  <label htmlFor>Số điện thoại</label>
                </div>
                <div className="form-group">
                  <input type="text" name="email" required />
                  <label htmlFor>Email</label>
                </div>
                <div className="form-group">
                  <input type="password" name="password" required />
                  <label htmlFor>Mật khẩu</label>
                </div>
                <div className="form-group">
                  <input type="password" name="password" required />
                  <label htmlFor>Nhập lại mật khẩu</label>
                </div>
                <br />
                <input
                  type="submit"
                  defaultValue="Đăng ký"
                  value="Đăng ký"
                  id="btn-login"
                />
                <button
                  type="button"
                  className="login align-center"
                  onClick={() => {
                    // window.location.href =("/");
                    // setIsLogin(0);
                  }}
                >
                  Đăng nhập
                </button>
              </form>
            </div>
          </div>
          <Helmet>
            <script src="./static/js/animation_login.js"></script>
          </Helmet>
        </div>
      )}
    </>
  );
}
