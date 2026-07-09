import React from "react";
import { Link } from "react-router-dom";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";
import {
  SwalAlertAllConfiguration,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../Swal";
import { ModalSure, ThemMayChu } from "./DichVuModal";
import ThemSuaModal from "./ThemSuaModal";
import XemModal from "./XemModal";
import DeleteModal from "./XoaKhoiPhucModal";

const isEdit = true;

export default function RowTools({
  row,
  dangky,
  thuhoi,
  xem,
  sua,
  suaModal,
  xoa,
  huydangky,
  href,
  children,
  childrenXem,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  isModal,
  onUpdate,
  cap,
  auth,
  setOpenEdit,
  setOpenView,
  loaiDichVu,
  setDetail,
}) {
  return (
    <>
      {!isDeleted && (
        <>
          {/**
           *
           *
           * cap
           *
           */}
          {cap === 1 &&
            !Helper.isNullOrUndefined(href) &&
            window.location.pathname ===
              "/quan-ly-dang-ky/xet-duyet-dang-ky/cap-dang-ky" && (
              <ThemMayChu
                row={row}
                auth={auth}
                handleOk={() => onUpdate(row, cap)}
              />
            )}{" "}
          {cap === 2 &&
            !Helper.isNullOrUndefined(href) &&
            window.location.pathname ===
              "/quan-ly-dang-ky/xet-duyet-dang-ky/cap-dang-ky" && (
              <ModalSure
                auth={auth}
                handleOk={() => onUpdate(row, cap)}
                row={row}
                label={
                  <>
                    <i className="fas fa-times red" title="Hủy cấp" /> Hủy cấp
                  </>
                }
                title={"Bạn có chắc chắn muốn hủy cấp"}
              />
            )}{" "}
          {cap === 3 &&
            !Helper.isNullOrUndefined(href) &&
            window.location.pathname ===
              "/quan-ly-dang-ky/xet-duyet-dang-ky/cap-dang-ky" && (
              <ModalSure
                auth={auth}
                handleOk={() => onUpdate(row, cap)}
                row={row}
                label={
                  <>
                    <i className="fas fa-redo blue" title="Khôi phục" /> Khôi
                    phục
                  </>
                }
                title={"Bạn có chắc chắn muốn khôi phục"}
              />
            )}{" "}
          {/**
           *
           *
           * dang ky
           *
           */}
          {dangky && href && (
            <a onClick={() => onUpdate(row)}>
              <i className="fas fa-share blue" title="Đăng ký" />
            </a>
          )}{" "}
          {/**
           *
           *
           * huy dang ky
           *
           */}
          {thuhoi && href && (
            <a onClick={() => onUpdate(row)}>
              <i className="fas fa-reply blue" title="Hủy đăng ký" />
            </a>
          )}{" "}
          {/**
           *
           *
           * xem
           *
           *
           *  */}
          {xem && href && (
            <Link
              to={
                window.location.pathname.includes(HREF.DANG_KY_CAP_DICH_VU) ||
                window.location.pathname.includes(HREF.DANG_KY_DOI_DICH_VU) ||
                window.location.pathname.includes(HREF.DANG_KY_HUY_DICH_VU)
                  ? href +
                    "?chi-tiet?id=" +
                    row.id +
                    "&loaiDichVu=" +
                    loaiDichVu
                  : href +
                    "?chi-tiet?id=" +
                    row.id +
                    "&loaiDichVu=" +
                    loaiDichVu
              }
              onClick={() => {
                setOpenView(true);
                setDetail(row);
              }}
            >
              <i className="fas fa-eye blue" title="Xem" />{" "}
              {window.location.pathname.includes("/xet-duyet-dang-ky/")
                ? "Xem"
                : ""}
            </Link>
          )}{" "}
          {xem && Helper.isNullOrUndefined(href) && (
            <XemModal children={childrenXem} width={1000} />
          )}{" "}
          {/**
           *
           *
           * clone
           *
           *
           *  */}
          {(window.location.href.includes(HREF.MAY_CHU_UNG_DUNG) ||
            window.location.href.includes(HREF.HE_THONG_THONG_TIN) ||
            window.location.href.includes(HREF.HE_THONG) ||
            window.location.href.includes(HREF.TRUNG_TAM_DU_LIEU) ||
            window.location.href.includes(HREF.MAY_CHU_VAT_LY) ||
            window.location.href.includes(HREF.THIET_BI_LUU_TRU) ||
            window.location.href.includes(HREF.KHUNG_MAY_CHU_PHIEN) ||
            window.location.href.includes(HREF.THIET_BI_WIFI) ||
            window.location.href.includes(HREF.KENH_TRUYEN) ||
            window.location.href.includes(HREF.THIET_BI_MANG) ||
            window.location.href.includes(HREF.THIET_BI_AN_TOAN_THONG_TIN) ||
            window.location.href.includes(HREF.DAI_IP) ||
            window.location.href.includes(HREF.TU_RACK) ||
            window.location.href.includes(HREF.THIET_BI_CO_DIEN) ||
            window.location.href.includes(HREF.THIET_BI_KHAC) ||
            window.location.href.includes(HREF.PHAN_MEM)) &&
            href && (
              <Link className="" to={href + "/clone?id=" + row.id}>
                <i className="fas fa-clone" title="Nhân đôi bản ghi" />
              </Link>
            )}{" "}
          {/**
           *
           *
           * sua
           *
           *
           *  */}
          {sua && Helper.isNullOrUndefined(href) && (
            <ThemSuaModal edit={true} children={children} width={1000} />
          )}{" "}
          {sua && href && (
            <Link
              className=""
              to={
                window.location.pathname.includes(HREF.PheDuyet) &&
                window.location.search
                  ? href +
                    window.location.search +
                    "&id=" +
                    row.id +
                    "&loaiDichVu=" +
                    loaiDichVu
                  : href +
                    "?cap-nhat?id=" +
                    row.id +
                    "&loaiDichVu=" +
                    loaiDichVu
              }
              onClick={() => {
                setOpenEdit(true);
                setDetail(row);
              }}
            >
              <i
                className="fas fa-edit orange"
                title={
                  window.location.pathname.includes(HREF.PheDuyet)
                    ? "Xem xét"
                    : "Sửa"
                }
              />{" "}
              {window.location.pathname.includes(HREF.PheDuyet)
                ? "Xem xét"
                : ""}
            </Link>
          )}
        </>
      )}
      {/**
       *
       * xoa - khoi phuc - xoa vinh vien
       *
       *  */}
      {xoa && (
        <DeleteModal
          row={row}
          isDeleted={isDeleted}
          onDelete_onRecover={onDelete_onRecover}
          onDelete={onDelete}
        />
      )}
      {huydangky && (
        <a
          href
          onClick={() => {
            SwalAlertAllConfiguration({
              title: "Bạn có chắc muốn hủy đăng ký?",
              text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy đăng ký!",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Thoát",
              showLoaderOnConfirm: true,
              dangerMode: true,
              preConfirm: async (login) => {
                try {
                  onDelete_onRecover(row?.id);
                } catch (error) {
                  SwalShowValidationMessage(`
                      Request failed: ${error}
                    `);
                }
              },
              allowOutsideClick: () => !SwalIsLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
          }}
        >
          {" "}
          <i
            className="fas fa-times-circle"
            style={{ color: "#ff0000" }}
            title="Hủy"
          ></i>
        </a>
      )}
      {isModal && <></>}
    </>
  );
}
