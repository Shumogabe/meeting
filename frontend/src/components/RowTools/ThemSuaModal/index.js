import React, { useState } from "react";
import { Modal } from "antd";
import { HREF } from "../../../constants/dictionaries";
export default function Index(props) {
  const { children, width, handleOk, isOpen } = props;
  const [isModalOpen, setIsModalOpen] = useState(isOpen ? isOpen : false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {props && props?.edit ? (
        <a onClick={showModal}>
          <i className="fas fa-edit orange" title="Sửa" />
        </a>
      ) : (
        <>
          {window.location.pathname === HREF.QUAN_LY_DANG_KY_NHU_CAU_SU_DUNG ||
          window.location.pathname === HREF.DU_DOAN_TANG_TRUONG ? (
            <>
              <a
                onClick={showModal}
                type="button"
                className="btn btn-info btn-sm"
              >
                Thêm mới
              </a>
            </>
          ) : (
            <>
              <button
                onClick={showModal}
                type="button"
                className="btn btn-success mb-3 float-right"
              >
                Thêm mới
              </button>
            </>
          )}
        </>
      )}
      <Modal
        title={
          props && props?.edit
            ? "Sửa"
            : window.location.pathname === HREF.QUAN_LY_DANG_KY_NHU_CAU_SU_DUNG
            ? "Đăng ký"
            : "Thêm"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={
          window.location.pathname === HREF.QUAN_LY_DANG_KY_NHU_CAU_SU_DUNG
            ? "Đăng ký"
            : "Lưu"
        }
        okType="primary"
        cancelText="Hủy"
        width={width}
      >
        {children}
      </Modal>
    </>
  );
}
