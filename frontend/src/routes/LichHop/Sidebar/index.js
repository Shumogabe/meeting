import React from "react";
import { Button, ConfigProvider, Menu } from "antd";
import { HandleLogout } from "../../../components/Modal";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import { Theme } from "../../../theme";
import "./css.css";

export default function MainSidebar({ usr, permissions, user }) {
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);

  // useLayoutEffect(() => {
  //   CheckUser().then((user) => {
  //     if (Helper.isNullOrUndefined(user)) {
  //       sessionStorage.clear();
  //       localStorage.clear();
  //       HandleLogout("login");
  //     } else {
  //       setUser(user);
  //     }
  //   });
  //   new Api()
  //     .PhanQuyenVaiTroNguoiDung({
  //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //         ?.access_token,
  //     })
  //     .then((e) => {
  //       setRole(!Helper.isNullOrUndefined(e) && JSON.stringify(e));
  //       localStorage.setItem("UserInfo", JSON.stringify(e));
  //     });
  //   // userManager.getUser().then((res) => {
  //   //   if (Helper.isNullOrUndefined(res)) {
  //   //     userManager.signinRedirect();
  //   //   } else {
  //   //     setUser(res);
  //   //     setRole(!Helper.isNullOrUndefined(res?.roles) && res?.roles.split(","));
  //   //   }
  //   // });
  // }, []);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              // darkSubMenuItemBg: Theme.theme().css.background.color,
              // darkItemBg: Theme.theme().css.background.color,
              // darkItemColor: Theme.theme().css.color.color,
              // darkPopupBg: Theme.theme().css.background.color,
              // darkItemHoverBg: Theme.theme().css.color.color,
              // darkItemHoverColor: Theme.theme().css.background.color,
              // darkItemSelectedBg: Theme.theme().css.color.color,
              // darkItemSelectedColor: Theme.theme().css.background.color,
              // itemActiveBg: Theme.theme().css.color.color,
              // itemBg: Theme.theme().css.background.color,
              // itemColor: Theme.theme().css.color.color,
              // // itemHoverBg: Theme.theme().css.color.color,
              // // itemHoverColor: Theme.theme().css.background.color,
              itemSelectedBg: Theme.theme().css.background.color,
              itemSelectedColor: Theme.theme().css.background.color,
              itemActiveBg: Theme.theme().css.background.color,
              // popupBg: Theme.theme().css.background.color,
              // subMenuItemBg: Theme.theme().css.background.color,
            },
          },
        }}
      >
        <aside
          id="main-sidebar"
          className="main-sidebar sidebar-dark-primary elevation-4"
        >
          {/* Brand Logo */}
          <a
            href={HREF.TrangChu}
            className="brand-link"
            style={{ background: "#0f515b" }}
          >
            {window.location.href.includes(HREF.HopTrucTuyen) ? (
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
          <div className="sidebar">
            {/* Sidebar user panel (optional) */}
            <div className="user-panel mt-3 pb-3 mb-3">
              <div className="image">
                {window.location.href.includes(HREF.HopTrucTuyen) ? (
                  <img
                    src={"/static/" + Theme.theme().href + "/img/user-icon.png"}
                  />
                ) : (
                  <img
                    src={
                      "./static/" + Theme.theme().href + "/img/user-icon.png"
                    }
                  />
                )}
              </div>
              <div className="info">
                <div>
                  <a href="#" className="full-name user-fullname-display">
                    {
                      JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.profile?.sub
                    }
                  </a>
                </div>
                <div>
                  <a href="#" className="">
                    {user?.thong_tin_don_vi?.ten}
                  </a>
                </div>
              </div>

              {/* <div style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    HandleLogout("logout");
                  }}
                >
                  Đăng xuất
                </Button>
              </div> */}
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                permissions="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <a
                    href={HREF.LichHop}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.LichHop && "active")
                    }
                  >
                    <i className="far fa-calendar-alt" />
                    <p>
                      Lịch họp
                      <i className="fas fa-angle-left right" />
                    </p>
                  </a>
                </li>
                {/*
                <li className="nav-item">
                  <a
                    href={HREF.TaiLieu}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.TaiLieu && "active")
                    }
                  >
                    <i className="far fa-file" />
                    <p>
                      Tài liệu
                      <i className="fas fa-angle-left right" />
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={HREF.BieuQuyet}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.BieuQuyet && "active")
                    }
                  >
                    <i className="far fa-edit" />
                    <p>
                      Biểu quyết
                      <i className="fas fa-angle-left right" />
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={HREF.KetLuan}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.KetLuan && "active")
                    }
                  >
                    <i className="far fa-file" />
                    <p>
                      Kết luận
                      <i className="fas fa-angle-left right" />
                    </p>
                  </a>
                </li>
                */}
              </ul>
            </nav>
            {/* <Menu
              onClick={(e) => {
                //console.log("click", e);
              }}
              style={
                {
                  // width: 256,
                }
              }
              mode="inline"
              defaultOpenKeys={() => {
                switch (window.location.pathname) {
                  case HREF.DichVu:
                    return [HREF.DichVu];
                  case HREF.DANG_KY_CAP_DICH_VU:
                    return [HREF.DichVu];
                  case HREF.DANG_KY_DOI_DICH_VU:
                    return [HREF.DichVu];
                  case HREF.DANG_KY_HUY_DICH_VU:
                    return [HREF.DichVu];
                  default:
                    break;
                }
              }}
              defaultSelectedKeys={() => {
                switch (window.location.pathname) {
                  case HREF.BaoCaoThongKe:
                    return [HREF.BaoCaoThongKe];
                  case HREF.KeHoachHop:
                    return [HREF.KeHoachHop];
                  case HREF.LichHop:
                    return [HREF.LichHop];
                  case HREF.SuKien:
                    return [HREF.SuKien];
                  case HREF.PheDuyet:
                    return [HREF.PheDuyet];
                  case HREF.DichVu:
                    return [HREF.DichVu];
                  case HREF.DANG_KY_CAP_DICH_VU:
                    return [HREF.DANG_KY_CAP_DICH_VU];
                  case HREF.DANG_KY_HUY_DICH_VU:
                    return [HREF.DANG_KY_HUY_DICH_VU];
                  case HREF.DANG_KY_DOI_DICH_VU:
                    return [HREF.DANG_KY_DOI_DICH_VU];
                  default:
                    break;
                }
              }}
              items={[
                !Helper.isNullOrUndefined(permissions) &&
                  permissions &&
                  permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true && {
                    key: HREF.BaoCaoThongKe,
                    label: (
                      <span
                        style={{
                          color:
                            window.location.href.includes(
                              window.location.origin + HREF.BaoCaoThongKe
                            ) && Theme.theme().css.color.color,
                        }}
                      >
                        Báo cáo, thống kê
                      </span>
                    ),
                    icon: (
                      <i
                        className="fas fa-chart-bar"
                        style={{
                          color:
                            window.location.href.includes(
                              window.location.origin + HREF.BaoCaoThongKe
                            ) && Theme.theme().css.color.color,
                        }}
                      ></i>
                    ),
                    onClick: () => {
                      window.location.href =(HREF.BaoCaoThongKe);
                    },
                  },
                {
                  key: HREF.KeHoachHop,
                  label: (
                    <span
                      style={{
                        color:
                          window.location.href.includes(
                            window.location.origin + HREF.KeHoachHop
                          ) && Theme.theme().css.color.color,
                      }}
                    >
                      Kế hoạch họp
                    </span>
                  ),
                  icon: (
                    <i
                      className="far fa-calendar"
                      style={{
                        color:
                          window.location.href.includes(
                            window.location.origin + HREF.KeHoachHop
                          ) && Theme.theme().css.color.color,
                      }}
                    />
                  ),
                  onClick: () => {
                    window.location.href =(HREF.KeHoachHop);
                  },
                },
                {
                  key: HREF.LichHop,
                  label: (
                    <span
                      style={{
                        color:
                          window.location.href.includes(
                            window.location.origin + HREF.LichHop
                          ) && Theme.theme().css.color.color,
                      }}
                    >
                      Họp, hội thảo, hội nghị
                    </span>
                  ),
                  icon: (
                    <i
                      className="far fa-calendar-alt"
                      style={{
                        color:
                          window.location.href.includes(
                            window.location.origin + HREF.LichHop
                          ) && Theme.theme().css.color.color,
                      }}
                    />
                  ),
                  onClick: () => {
                    window.location.href =(HREF.LichHop);
                  },
                },
                {
                  key: HREF.SuKien,
                  label: (
                    <span
                      style={{
                        color:
                          window.location.href.includes(
                            window.location.origin + HREF.SuKien
                          ) && Theme.theme().css.color.color,
                      }}
                    >
                      Sự kiện
                    </span>
                  ),
                  icon: (
                    <i
                      className="far fa-calendar-check"
                      style={{
                        color:
                          window.location.href.includes(
                            window.location.origin + HREF.SuKien
                          ) && Theme.theme().css.color.color,
                      }}
                    />
                  ),
                  onClick: () => {
                    window.location.href =(HREF.SuKien);
                  },
                },
                !Helper.isNullOrUndefined(permissions) &&
                  permissions &&
                  (permissions?.includes(FUNC_PERMISSION.APPROVE) === true ||
                    permissions?.includes(FUNC_PERMISSION.SCHEDULE) ===
                      true) && {
                    key: HREF.PheDuyet,
                    label: (
                      <span
                        style={{
                          color:
                            window.location.href.includes(
                              window.location.origin + HREF.PheDuyet
                            ) && Theme.theme().css.color.color,
                        }}
                      >
                        {permissions?.includes(FUNC_PERMISSION.APPROVE) &&
                          "Phê duyệt"}
                        {permissions?.includes(FUNC_PERMISSION.SCHEDULE) &&
                          "Cấp phát"}
                      </span>
                    ),
                    icon: (
                      <i
                        className="fas fa-check-double"
                        style={{
                          color:
                            window.location.href.includes(
                              window.location.origin + HREF.PheDuyet
                            ) && Theme.theme().css.color.color,
                        }}
                      ></i>
                    ),
                    onClick: () => {
                      window.location.href =(HREF.PheDuyet);
                    },
                  },
                {
                  key: HREF.DichVu,
                  label: <>Quản lý đăng ký dịch vụ</>,
                  icon: <i className="fas fa-concierge-bell"></i>,
                  children: [
                    {
                      key: HREF.DANG_KY_CAP_DICH_VU,
                      title: "Đăng ký cấp phát dịch vụ",
                      label: (
                        <span
                          style={{
                            color:
                              window.location.href.includes(
                                window.location.origin +
                                  HREF.DANG_KY_CAP_DICH_VU
                              ) && Theme.theme().css.color.color,
                          }}
                        >
                          Đăng ký cấp phát dịch vụ
                        </span>
                      ),
                      onClick: () => {
                        window.location.href =(HREF.DANG_KY_CAP_DICH_VU);
                      },
                    },
                    {
                      key: HREF.DANG_KY_HUY_DICH_VU,
                      label: (
                        <span
                          style={{
                            color:
                              window.location.href.includes(
                                window.location.origin +
                                  HREF.DANG_KY_HUY_DICH_VU
                              ) && Theme.theme().css.color.color,
                          }}
                        >
                          Đăng ký hủy dịch vụ
                        </span>
                      ),
                      onClick: () => {
                        window.location.href =(HREF.DANG_KY_HUY_DICH_VU);
                      },
                    },
                    {
                      key: HREF.DANG_KY_DOI_DICH_VU,
                      title: "Đăng ký cấp phát bổ sung dịch vụ",
                      label: (
                        <span
                          style={{
                            color:
                              window.location.href.includes(
                                window.location.origin +
                                  HREF.DANG_KY_DOI_DICH_VU
                              ) && Theme.theme().css.color.color,
                          }}
                        >
                          Đăng ký cấp phát bổ sung dịch vụ
                        </span>
                      ),
                      onClick: () => {
                        window.location.href =(HREF.DANG_KY_DOI_DICH_VU);
                      },
                    },
                  ],
                },
              ]}
            /> */}
            {/* <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                permissions="menu"
                data-accordion="false"
              >
                {permissions &&
                  (permissions?.includes(FUNC_PERMISSION.APPROVE) === true ||
                    permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true) && (
                    <li className="nav-item">
                      <a
                        href={HREF.BaoCaoThongKe}
                        className={
                          "nav-link " +
                          (window.location.pathname === HREF.BaoCaoThongKe &&
                            "active")
                        }
                      >
                        <i className="fas fa-chart-bar"></i>
                        <p>
                          Báo cáo, thống kê
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                    </li>
                  )}
                <li className="nav-item">
                  <a
                    href={HREF.KeHoachHop}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.KeHoachHop && "active")
                    }
                  >
                    <i className="far fa-calendar" />
                    <p>
                      Kế hoạch họp
                      <i className="fas fa-angle-left right" />
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={HREF.LichHop}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.LichHop && "active")
                    }
                  >
                    <i className="far fa-calendar-alt" />
                    <p>
                      Họp, hội thảo, hội nghị
                      <i className="fas fa-angle-left right" />
                    </p>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={HREF.SuKien}
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.SuKien && "active")
                    }
                  >
                    <i className="far fa-calendar-check" />
                    <p>
                      Sự kiện
                      <i className="right fas fa-angle-left" />
                    </p>
                  </a>
                </li>
                {permissions &&
                  (permissions?.includes(FUNC_PERMISSION.APPROVE) === true ||
                    permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true) && (
                    <li className="nav-item">
                      <a
                        href={HREF.PheDuyet}
                        className={
                          "nav-link " +
                          (window.location.pathname === HREF.PheDuyet &&
                            "active")
                        }
                      >
                        <i className="fas fa-check-double"></i>
                        <p>
                          Xét duyệt
                          <i className="right fas fa-angle-left" />
                        </p>
                      </a>
                    </li>
                  )}
                <li className="nav-item">
                  <a
                    href
                    className={
                      "nav-link " +
                      (window.location.pathname === HREF.DichVu && "active")
                    }
                  >
                    <i className="fas fa-concierge-bell"></i>
                    <p>
                      Dịch vụ
                      <i className="right fas fa-angle-left" />
                    </p>
                  </a>
                  <nav className="nav-child">
                    <ul className="submenu">
                      <li className="nav-item">
                        <a
                          href={HREF.CapPhatDichVu}
                          className={
                            "nav-link " +
                            (window.location.pathname === HREF.CapPhatDichVu &&
                              "active")
                          }
                        >
                          Cấp phát dịch vụ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href={HREF.HuyDichVu}
                          className={
                            "nav-link " +
                            (window.location.pathname === HREF.HuyDichVu &&
                              "active")
                          }
                        >
                          Hủy dịch vụ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href={HREF.CapPhatBoSungDichVu}
                          className={
                            "nav-link " +
                            (window.location.pathname ===
                              HREF.CapPhatBoSungDichVu && "active")
                          }
                        >
                          Cấp phát bổ sung dịch vụ
                        </a>
                      </li>
                    </ul>
                  </nav>
                </li>
              </ul>
            </nav> */}
            {/* /.sidebar-menu */}
          </div>
          {/* /.sidebar */}
        </aside>
      </ConfigProvider>
    </>
  );
}
