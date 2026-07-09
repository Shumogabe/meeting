import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import DichVu from "./DichVu";
import KeHoachHop from "./KeHoachHop";
import LichHop from "./LichHop";
const { RangePicker } = DatePicker;

export default function ContentWrapper({
  title,
  setTitle,
  permissions,
  user,
  setUser,
}) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  // const [role, setRole] = useState(null);
  const [typeTab, setTypeTab] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !Helper.isNullOrUndefined(permissions) &&
      permissions &&
      (permissions?.includes(FUNC_PERMISSION.APPROVE) === true ||
        permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true)
    ) {
      if (permissions?.includes(FUNC_PERMISSION.APPROVE)) {
        document.title = "Phê duyệt";
        setTitle("Phê duyệt");
      }
      if (permissions?.includes(FUNC_PERMISSION.SCHEDULE)) {
        document.title = "Cấp phát";
        setTitle("Cấp phát");
      }
      if (
        permissions?.includes(FUNC_PERMISSION.APPROVE) &&
        permissions?.includes(FUNC_PERMISSION.SCHEDULE)
      ) {
        document.title = "Phê duyệt & Cấp phát";
        setTitle("Phê duyệt & Cấp phát");
      }
      setTypeTab(
        searchParams && searchParams.get("doituong")
          ? searchParams.get("doituong")
          : permissions.includes(FUNC_PERMISSION.APPROVE)
          ? HREF.LichHop.replace("/", "")
          : HREF.CapPhatDichVu.replace("/", "")
      );
    }
  }, [permissions]);

  return (
    <div className="content-wrapper mt-3">
      {/* Content Header (Page header) */}
      <div id="content-header" className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">{title}</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href={HREF.TrangChu}>
                    <i className="fas fa-home" />
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href={HREF.PheDuyet}>{title}</a>
                </li>
                {/* <li className="breadcrumb-item active">Lịch họp</li> */}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <hr />
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info meeting-calendar">
            <div className="card-body">
              <ul
                className="nav nav-tabs mb-1"
                id="custom-content-below-tab"
                role="tablist"
              >
                {!Helper.isNullOrUndefined(permissions) &&
                  permissions &&
                  permissions?.includes(FUNC_PERMISSION.APPROVE) === true && (
                    <>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab === HREF.LichHop.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-meeting-tab"
                          data-toggle="pill"
                          href="#custom-content-below-meeting"
                          role="tab"
                          aria-controls="custom-content-below-meeting"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(HREF.LichHop.replace("/", ""));
                            navigate({
                              search:
                                "?doituong=" + HREF.LichHop.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          LỊCH HỌP
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab === HREF.KeHoachHop.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-pending-tab"
                          data-toggle="pill"
                          href="#custom-content-below-pending"
                          role="tab"
                          aria-controls="custom-content-below-pending"
                          aria-selected="true"
                          onClick={() => {
                            setTypeTab(HREF.KeHoachHop.replace("/", ""));
                            navigate({
                              search:
                                "?doituong=" + HREF.KeHoachHop.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          KẾ HOẠCH HỌP
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab ===
                            HREF.DANG_KY_CAP_DICH_VU.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-finished1-tab"
                          data-toggle="pill"
                          href="#custom-content-below-finished1"
                          role="tab"
                          aria-controls="custom-content-below-finished1"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(
                              HREF.DANG_KY_CAP_DICH_VU.replace("/", "")
                            );
                            navigate({
                              search:
                                "?doituong=" +
                                HREF.DANG_KY_CAP_DICH_VU.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          ĐĂNG KÝ CẤP PHÁT DỊCH VỤ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab ===
                            HREF.DANG_KY_DOI_DICH_VU.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-finished2-tab"
                          data-toggle="pill"
                          href="#custom-content-below-finished2"
                          role="tab"
                          aria-controls="custom-content-below-finished2"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(
                              HREF.DANG_KY_DOI_DICH_VU.replace("/", "")
                            );
                            navigate({
                              search:
                                "?doituong=" +
                                HREF.DANG_KY_DOI_DICH_VU.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          ĐĂNG KÝ CẤP PHÁT BỔ SUNG DỊCH VỤ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab ===
                            HREF.DANG_KY_HUY_DICH_VU.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-finished3-tab"
                          data-toggle="pill"
                          href="#custom-content-below-finished3"
                          role="tab"
                          aria-controls="custom-content-below-finished3"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(
                              HREF.DANG_KY_HUY_DICH_VU.replace("/", "")
                            );
                            navigate({
                              search:
                                "?doituong=" +
                                HREF.DANG_KY_HUY_DICH_VU.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          ĐĂNG KÝ HỦY DỊCH VỤ
                        </a>
                      </li>
                    </>
                  )}
                {!Helper.isNullOrUndefined(permissions) &&
                  permissions &&
                  permissions?.includes(FUNC_PERMISSION.SCHEDULE) === true && (
                    <>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab === HREF.CapPhatDichVu.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-finished1-tab"
                          data-toggle="pill"
                          href="#custom-content-below-finished1"
                          role="tab"
                          aria-controls="custom-content-below-finished1"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(HREF.CapPhatDichVu.replace("/", ""));
                            navigate({
                              search:
                                "?doituong=" +
                                HREF.CapPhatDichVu.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          CẤP PHÁT DỊCH VỤ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab ===
                            HREF.CapPhatBoSungDichVu.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-finished2-tab"
                          data-toggle="pill"
                          href="#custom-content-below-finished2"
                          role="tab"
                          aria-controls="custom-content-below-finished2"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(
                              HREF.CapPhatBoSungDichVu.replace("/", "")
                            );
                            navigate({
                              search:
                                "?doituong=" +
                                HREF.CapPhatBoSungDichVu.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          CẤP PHÁT BỔ SUNG DỊCH VỤ
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={
                            "nav-link" +
                            (typeTab === HREF.HuyDichVu.replace("/", "")
                              ? " active"
                              : "")
                          }
                          id="custom-content-below-finished3-tab"
                          data-toggle="pill"
                          href="#custom-content-below-finished3"
                          role="tab"
                          aria-controls="custom-content-below-finished3"
                          aria-selected="false"
                          onClick={() => {
                            setTypeTab(HREF.HuyDichVu.replace("/", ""));
                            navigate({
                              search:
                                "?doituong=" + HREF.HuyDichVu.replace("/", ""),
                            });
                          }}
                          style={{
                            fontSize: "large",
                          }}
                        >
                          HỦY DỊCH VỤ
                        </a>
                      </li>
                    </>
                  )}
              </ul>
              <div className="tab-content" id="custom-content-below-tabContent">
                {(() => {
                  switch (typeTab) {
                    case HREF.LichHop.replace("/", ""):
                      return (
                        <LichHop
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    //------------------------------------
                    case HREF.KeHoachHop.replace("/", ""):
                      return (
                        <KeHoachHop
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    //------------------------------------
                    case HREF.DANG_KY_CAP_DICH_VU.replace("/", ""):
                      return (
                        <DichVu
                          loaiDichVu={"DangKyCapPhatDichVu"}
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    case HREF.DANG_KY_DOI_DICH_VU.replace("/", ""):
                      return (
                        <DichVu
                          loaiDichVu={"DangKyCapPhatBoSungDichVu"}
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    case HREF.DANG_KY_HUY_DICH_VU.replace("/", ""):
                      return (
                        <DichVu
                          loaiDichVu={"DangKyHuyDichVu"}
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    //------------------------------------
                    case HREF.CapPhatDichVu.replace("/", ""):
                      return (
                        <DichVu
                          loaiDichVu={"CapPhatDichVu"}
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    case HREF.CapPhatBoSungDichVu.replace("/", ""):
                      return (
                        <DichVu
                          loaiDichVu={"CapPhatBoSungDichVu"}
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    case HREF.HuyDichVu.replace("/", ""):
                      return (
                        <DichVu
                          loaiDichVu={"HuyDichVu"}
                          permissions={permissions}
                          user={user}
                          setUser={setUser}
                        />
                      );
                    default:
                      break;
                  }
                })()}
              </div>
            </div>
            {/* /.card */}
          </div>
          {/* /.card */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
}
