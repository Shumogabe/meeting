import React, { useEffect, useRef, useState } from "react";
import "./App.css";

//
// React router dom
//
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

// Routes
//
// Trang chủ
//
import TrangChu from "./routes/TrangChu";
//
// Lịch họp
//
import LichHop from "./routes/LichHop";
//
// Lập lịch
//
import LapLich from "./routes/LapLich";
//
// Phòng họp
//
import HopTrucTuyen from "./routes/HopTrucTuyen";
//
// Đăng nhập
//
import DangNhap from "./routes/DangNhap_DangKy";
//
// Thông tin cá nhân
//
import ThongTinCaNhan from "./routes/ThongTinCaNhan";
//
import KeHoachHop from "./routes/KeHoachHop";
import SuKien from "./routes/SuKien";
//
//
import CallBack from "./routes/callback";
import SilentRenew from "./routes/silentRenew";

//
import { Helmet } from "react-helmet";
import { OidcProvider } from "redux-oidc";
import Api from "./api";
import { CheckUser, HandleLogout } from "./components/Modal";
import { SESSION_STORAGE } from "./config";
import { HREF } from "./constants/dictionaries";
import Helper from "./helper/helper";
import { store } from "./redux/store";
import RoutesBaoCaoThongKe from "./routes/BaoCaoThongKe";
import RoutesCapPhatBoSungDichVu from "./routes/DichVu/CapPhatBoSungDichVu";
import RoutesCapPhatDichVu from "./routes/DichVu/CapPhatDichVu";
import RoutesHuyDichVu from "./routes/DichVu/HuyDichVu";
import RoutesPheDuyet from "./routes/PheDuyet";
import userManager from "./services/auth";
import { Theme } from "./theme";
import APK from "./routes/APK";
import XemTaiLieu from "./routes/XemTaiLieu";
import DieuKhoanSuDung from "./routes/DieuKhoanSuDung";
import ChinhSachBaoMat from "./routes/ChinhSachBaoMat";
import { checkSSO } from "./helper/authorize";
import Support from "./routes/Support";

function App() {
  const [auth, setAuth] = useState();
  const [user, setUser] = useState(null);
  const [quyen, setQuyen] = useState();
  const [permissions, setPermissions] = useState(false);
  const [ignoreMobileMode, setIgnoreMobileMode] = useState(
    () => sessionStorage.getItem("ignoreMobileMode") === "true",
  );
  const [isMobileRef, setIsMobile] = useState(false);

  const hash = window.location.hash;

  useEffect(() => {
    if (
      window.location.pathname.endsWith("/") &&
      window.location.pathname !== "/"
    ) {
      window.location.href = window.location.pathname.slice(0, -1);
    }
    document.title = Theme.theme().lang.vi.SITE_NAME;
    if (
      !window.location.pathname.startsWith(HREF.HopTrucTuyen) &&
      (hash === "" || hash === null || hash === undefined)
    ) {
      sessionStorage.removeItem("thamgiatructuyen");
      if (!Helper.isNullOrUndefined(localStorage.getItem(SESSION_STORAGE))) {
        checkSSO();
      } else {
        userManager.getUser().then((res) => {
          if (Helper.isNullOrUndefined(res)) {
            let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
            sessionStorage.clear();
            sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
            localStorage.clear();
          }
        });
      }
    }
    if (Helper.isNullOrUndefined(localStorage.getItem("lang"))) {
      localStorage.setItem("lang", "vi");
    }
    if (!window.location.pathname.startsWith(HREF.HopTrucTuyen)) {
      localStorage.removeItem("user");
      localStorage.removeItem("meeting_data");
    }
  }, []);

  useEffect(() => {
    if (!window.location.pathname.startsWith(HREF.HopTrucTuyen)) {
      CheckUser()
        .then((usr) => {
          // alert(JSON.stringify(usr));
          if (Helper.isNullOrUndefined(usr)) {
            let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
            sessionStorage.clear();
            sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
            localStorage.clear();
            if (
              !window.location.pathname.endsWith(HREF.TrangChu) &&
              !window.location.pathname.endsWith(HREF.Support) &&
              !window.location.pathname.endsWith(HREF.DangNhap) &&
              !window.location.pathname.endsWith(HREF.Callback) &&
              !window.location.pathname.endsWith(HREF.Silentrenew) &&
              !window.location.pathname.endsWith(HREF.Tai_APK) &&
              !window.location.pathname.endsWith(HREF.DieuKhoanSuDung) &&
              !window.location.pathname.endsWith(HREF.ChinhSachBaoMat) &&
              !window.location.pathname.endsWith(HREF.XemTaiLieu)
            ) {
              HandleLogout("login");
            }
          } else {
            setUser(usr);
            new Api()
              .PhanQuyenVaiTroNguoiDung({
                token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                  ?.access_token,
              })
              .then((e) => {
                if (!Helper.isNullOrUndefined(e)) {
                  setPermissions(JSON.stringify(e));
                  localStorage.setItem("UserInfo", JSON.stringify(e));
                }
              });
          }
        })
        .catch((e) => {
          alert(e);
        });
    }
  }, []);

  useEffect(() => {
    // var ress = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    if (
      !Helper.isNullOrUndefined(sessionStorage.getItem(SESSION_STORAGE)) &&
      !window.location.pathname.startsWith(HREF.HopTrucTuyen)
    ) {
      userManager.getUser().then((res) => {
        if (
          Number(res?.expires_at) * 1000 +
            1 -
            Number(Math.round(new Date().getTime())) <=
          0
        ) {
          userManager.removeUser().then(() => {
            window.location.href = "/";
          });
        }
        const timer = setTimeout(
          () => {
            userManager.removeUser().then(() => {
              window.location.href = "/";
            });
            // userManager.signoutRedirect({
            //   // post_logout_redirect_uri: APP_ADMIN_URI,
            // });
          },
          Number(res?.expires_at) * 1000 +
            1 -
            Number(Math.round(new Date().getTime())),
        );
        return () => clearTimeout(timer);
      });
    }
  }, []);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(localStorage.getItem(SESSION_STORAGE))) {
      sessionStorage.setItem(
        SESSION_STORAGE,
        localStorage.getItem(SESSION_STORAGE),
      );
    }
    if (!Helper.isNullOrUndefined(sessionStorage.getItem(SESSION_STORAGE))) {
      localStorage.setItem(
        SESSION_STORAGE,
        sessionStorage.getItem(SESSION_STORAGE),
      );
    }
    localStorage.setItem(
      "CSCORE_LINK",
      `${window.location.pathname}${window.location.search}`,
    );
    // new Api().CheckThongTinCanBo({
    //   token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
    //   data: {
    //     ten_dangnhap: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
    //   },
    // });
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleContinueOnDesktop = () => {
    sessionStorage.setItem("ignoreMobileMode", "true");
    setIgnoreMobileMode(true);
    console.log("Người dùng đã chọn dùng trình duyệt web (bỏ qua UI mobile)");
  };

  if (isMobileRef && !ignoreMobileMode)
    return (
      <>
        <div className="container my-5">
          <h2 className="text-center mb-4 text-primary font-weight-bold">
            Tải ứng dụng họp trực tuyến
          </h2>

          <div className="row justify-content-center">
            {/* App Store */}
            <div className="col-md-6 mb-4">
              <div className="card qr-card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center font-weight-bold mb-3">
                    <i className="fab fa-apple"></i> App Store
                  </h5>
                  <div className="text-center mb-3">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/vn/app/mmae-họp-trực-tuyến/id6757412263"
                      alt="QR App Store"
                      className="img-fluid rounded mx-auto d-block"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                  <div className="text-center">
                    <a
                      href="https://apps.apple.com/vn/app/mmae-họp-trực-tuyến/id6757412263"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-block font-weight-bold py-2"
                    >
                      <i className="fas fa-download mr-2"></i> Tải ngay
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Android */}
            <div className="col-md-6 mb-4">
              <div className="card qr-card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center font-weight-bold mb-3">
                    <i className="fab fa-android text-success"></i> Android
                  </h5>
                  <div className="text-center mb-3">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=org.monre.hoptructuyen"
                      alt="QR Play Google"
                      className="img-fluid rounded mx-auto d-block"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                  <div className="text-center">
                    <a
                      href="https://play.google.com/store/apps/details?id=org.monre.hoptructuyen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-block font-weight-bold py-2"
                    >
                      <i className="fas fa-download mr-2"></i> Tải ngay
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 text-dark">
            hoặc
            <button
              onClick={handleContinueOnDesktop}
              className="mt-1 btn btn-primary btn-block font-weight-bold py-2"
            >
              Tiếp tục dùng trình duyệt
            </button>
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <OidcProvider store={store} userManager={userManager}>
          {!auth && !auth?.access_token ? (
            <Routes>
              <Route path={HREF.Callback} element={<CallBack />} />
              <Route path={HREF.Silentrenew} element={<SilentRenew />} />
              <Route
                path={HREF.TrangChu}
                element={
                  <TrangChu
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.Support}
                element={
                  <Support
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.ThongTinCaNhan}
                element={
                  <ThongTinCaNhan
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.LichHop}
                element={
                  <LapLich
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.XemTaiLieu}
                element={
                  <XemTaiLieu
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.DieuKhoanSuDung}
                element={
                  <DieuKhoanSuDung
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.ChinhSachBaoMat}
                element={
                  <ChinhSachBaoMat
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.HopTrucTuyen + "/:id"}
                element={
                  <HopTrucTuyen
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.DangNhap}
                element={
                  <DangNhap
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.KeHoachHop}
                element={
                  <KeHoachHop
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route
                path={HREF.SuKien}
                element={
                  <SuKien
                    auth={auth}
                    permissions={permissions}
                    user={user}
                    setUser={setUser}
                  />
                }
              />
              <Route path={HREF.PheDuyet} element={<Outlet />}>
                {RoutesPheDuyet.map((route, index) => (
                  <Route
                    key={index}
                    index
                    path={route.path}
                    element={route.element({
                      permissions: permissions,
                      user: user,
                      setUser: setUser,
                    })}
                  />
                ))}
              </Route>
              <Route path={HREF.DANG_KY_CAP_DICH_VU} element={<Outlet />}>
                {RoutesCapPhatDichVu.map((route, index) => (
                  <Route
                    key={index}
                    index
                    path={route.path}
                    element={route.element({
                      permissions: permissions,
                      user: user,
                      setUser: setUser,
                    })}
                  />
                ))}
              </Route>
              <Route path={HREF.DANG_KY_HUY_DICH_VU} element={<Outlet />}>
                {RoutesHuyDichVu.map((route, index) => (
                  <Route
                    key={index}
                    index
                    path={route.path}
                    element={route.element({
                      permissions: permissions,
                      user: user,
                      setUser: setUser,
                    })}
                  />
                ))}
              </Route>
              <Route path={HREF.DANG_KY_DOI_DICH_VU} element={<Outlet />}>
                {RoutesCapPhatBoSungDichVu.map((route, index) => (
                  <Route
                    key={index}
                    index
                    path={route.path}
                    element={route.element({
                      permissions: permissions,
                      user: user,
                      setUser: setUser,
                    })}
                  />
                ))}
              </Route>
              <Route path={HREF.BaoCaoThongKe} element={<Outlet />}>
                {RoutesBaoCaoThongKe.map((route, index) => (
                  <Route
                    key={index}
                    index
                    path={route.path}
                    element={route.element({
                      permissions: permissions,
                      user: user,
                      setUser: setUser,
                    })}
                  />
                ))}
              </Route>
              <Route path={HREF.Tai_APK} element={<APK />} />
              <Route path="*" element={<Navigate to={HREF.TrangChu} />} />
            </Routes>
          ) : (
            <>
              {!Helper.isNullOrUndefined(permissions) && (
                <Routes>
                  {/* <Route path="/login" element={<DangNhap />} /> */}
                  {/* <Route
                    exact
                    path="/"
                    element={<Navigate to={HREF.TrangChu} />}
                  />
                  <Route path="/callback" element={<CallBack />} />
                  <Route path="/silentrenew" element={<SilentRenew />} /> */}

                  {/**
                   *
                   *
                   *
                   *
                   *
                   **/}
                  {/* <Route
                    path={HREF.LichHop}
                    element={<TrangChu auth={auth} quyen={quyen} />}
                  />
                  <Route
                    path={HREF.LichHop}
                    element={<TrangChu auth={auth} quyen={quyen} />}
                  /> */}

                  {/* <Route
                    path={HREF.QUAN_LY_DICH_VU_DA_HUY + "/xem"}
                    element={<XemDichVu auth={auth} quyen={quyen} />}
                  /> */}

                  {/**
                   *
                   *
                   * Quản lý đăng ký
                   *
                   *
                   **/}
                  {/* <Route
                    path={HREF.QUAN_LY_THONG_KE_CAP_PHAT_DICH_VU}
                    element={QuyenAdmin(
                      quyen,
                      <QuanLyThongKeCapPhatDichVu auth={auth} quyen={quyen} />
                    )}
                  /> */}
                  {/**
                   *
                   *
                   *
                   **/}
                  <Route path="*" element={<Navigate to={HREF.TrangChu} />} />
                </Routes>
              )}
            </>
          )}
        </OidcProvider>
        <Helmet>
          <link
            rel="shortcut icon"
            href={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
          />
          <link
            rel="apple-touch-icon"
            href={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
          />
          <link
            rel="stylesheet"
            href={"./static/" + Theme.theme().href + "/css/style.css"}
          />
        </Helmet>
      </>
    );
}

export default App;
