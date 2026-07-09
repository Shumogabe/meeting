import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";
import ThemSua from "../../routes/QuanLyFile/ThemSua";
import userManager from "../../services/auth";

export default function CardHeaderList({
  title,
  hrefPageMain,
  auth,
  GetDatas,
  quyen,
}) {
  var isCardTools = true;

  if (
    window.location.pathname === HREF.LOG ||
    window.location.pathname === HREF.TIEP_NHAN_DANG_KY ||
    window.location.pathname === HREF.PHE_DUYET_DANG_KY ||
    window.location.pathname === HREF.CAP_DANG_KY ||
    window.location.pathname === HREF.TRA_CUU_DICH_VU ||
    window.location.pathname === HREF.QUAN_LY_DICH_VU_DA_HUY
  ) {
    isCardTools = false;
  }

  useEffect(() => {
    // setQuyen([3]);
    userManager.getUser().then((res) => {
      if (
        Number(res?.expires_at) -
          Number(Math.round(new Date().getTime() / 1000)) -
          1000 <
        0
      ) {
        // userManager.signoutRedirect({
        //   post_logout_redirect_uri: APP_ADMIN_URI,
        // });
        window.location.href = "/";
      }
    });
  }, [window.location.pathname]);

  // useEffect(() => {
  //   userManager.getUser().then((res) => {
  //     GetQuyen(res);
  //   });
  // }, []);

  return (
    <div className="card-header border-0">
      <h3 className="card-title" style={{ textTransform: "uppercase" }}>
        <i className="far fa-calendar-alt" /> {title}{" "}
        {window.location.search === "?deleted" ? "ĐÃ XÓA" : ""}
      </h3>
      {/* tools card */}
      {!Helper.isNullOrUndefined(quyen) && (
        <div className="card-tools">
          {/* button with a dropdown */}
          {isCardTools && quyen.includes(3) && (
            <>
              {window.location.search === "?deleted" ? (
                <>
                  <a
                    type="button"
                    className="btn btn-info btn-sm"
                    href={hrefPageMain}
                  >
                    Quay lại
                  </a>
                </>
              ) : (
                <>
                  {window.location.pathname ===
                    HREF.QUAN_LY_THONG_KE_CAP_PHAT_DICH_VU ||
                  window.location.pathname ===
                    HREF.QUAN_LY_BAO_CAO_HIEN_TRANG_SU_DUNG ||
                  window.location.pathname ===
                    HREF.QUAN_LY_THONG_KE_NHU_CAU_HA_TANG ? (
                    <></>
                  ) : (
                    <>
                      {window.location.pathname ===
                        HREF.QUAN_LY_DANG_KY_NHU_CAU_SU_DUNG ||
                      window.location.pathname === HREF.DU_DOAN_TANG_TRUONG ? (
                        <>
                          <ThemSua
                            GetDatas={GetDatas}
                            auth={auth}
                            titles={title}
                            href={hrefPageMain}
                            row={{}}
                            isEdit={false}
                          />
                        </>
                      ) : (
                        <>
                          <Link
                            type="button"
                            className="btn btn-info btn-sm"
                            to={hrefPageMain + "/them"}
                          >
                            Thêm mới
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          {(window.location.pathname === HREF.DANG_KY_CAP_DICH_VU ||
            window.location.pathname === HREF.DANG_KY_DOI_DICH_VU ||
            window.location.pathname === HREF.DANG_KY_HUY_DICH_VU) &&
          (quyen.includes(1) || quyen.includes(2) || quyen.includes(0)) ? (
            <>
              {window.location.search === "?deleted" ? (
                <>
                  <a
                    type="button"
                    className="btn btn-info btn-sm"
                    href={hrefPageMain}
                  >
                    Quay lại
                  </a>
                </>
              ) : (
                <>
                  {" "}
                  <Link
                    type="button"
                    className="btn btn-info btn-sm"
                    to={hrefPageMain + "/them"}
                  >
                    Đăng ký
                  </Link>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-info btn-sm dropdown-toggle"
                      data-toggle="dropdown"
                      data-offset={-98}
                    >
                      <i className="fas fa-bars" />
                    </button>
                    <div className="dropdown-menu" role="menu">
                      <a href="?deleted" className="dropdown-item">
                        <i className="fas fa-trash red" /> Danh sách đã xóa
                      </a>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <></>
          )}

          {isCardTools && quyen.includes(3) && (
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-info btn-sm dropdown-toggle"
                data-toggle="dropdown"
                data-offset={-98}
              >
                <i className="fas fa-bars" />
              </button>
              <div className="dropdown-menu" role="menu">
                <a href="?deleted" className="dropdown-item">
                  <i className="fas fa-trash red" /> Danh sách đã xóa
                </a>
              </div>
            </div>
          )}
          <button
            type="button"
            className="btn btn-info btn-sm"
            data-card-widget="collapse"
          >
            <i className="fas fa-minus" />
          </button>
        </div>
      )}
      {/* /. tools */}
    </div>
  );
}
