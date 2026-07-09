import React, { useState } from "react";
import { Modal } from "antd";
export default function Index(props) {
  const { children, width } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <a onClick={showModal}>
        <i className="fas fa-eye blue" title="Xem" />
      </a>
      <Modal
        title="Xem"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        okType="primary"
        cancelText="Thoát"
        okButtonProps={{ style: { display: "none" } }}
        width={width}
      >
        {children}
      </Modal>
    </>
  );
}
