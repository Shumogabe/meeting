import React from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";

export default function Index(props) {
  const { row, isDeleted, onDelete_onRecover, onDelete } = props;
  const { confirm } = Modal;
  const showDeleteConfirm = (xoa_khoiphuc) => {
    confirm({
      title: `Bạn chắc chắn muốn ${
        isDeleted && row.isDeleted && xoa_khoiphuc === 0 ? "khôi phục" : "xóa"
      } ${
        isDeleted && row.isDeleted && xoa_khoiphuc === 1
          ? "vĩnh viễn không?"
          : "không?"
      }`,
      icon: <ExclamationCircleFilled />,
      content: `Xác nhận ${
        isDeleted && row.isDeleted && xoa_khoiphuc === 0 ? "khôi phục" : "xóa"
      }?`,
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        if (isDeleted && row.isDeleted && xoa_khoiphuc === 0) {
          onDelete_onRecover(row.id, row);
        } else if (!isDeleted && !row.isDeleted && xoa_khoiphuc === 1) {
          onDelete_onRecover(row.id, row);
        } else if (isDeleted && row.isDeleted && xoa_khoiphuc === 1) {
          onDelete(row.id, row);
        }
      },
      onCancel() {
        //console.log(row);
      },
    });
  };
  switch (isDeleted) {
    case false:
      return (
        <>
          <a onClick={() => showDeleteConfirm(1)}>
            <i className="fas fa-trash-alt red" title="Xóa" />
          </a>
        </>
      );
    case true:
      return (
        <>
          <a onClick={() => showDeleteConfirm(0)}>
            <i className="fas fa-redo blue" title="Khôi phục" />
          </a>{" "}
          <a onClick={() => showDeleteConfirm(1)}>
            <i className="fas fa-trash-alt red" title="Xóa" />
          </a>
        </>
      );
    default:
      return <></>;
  }
}

export const ModalDelete = (onDelete) => {
  const { confirm } = Modal;
  const showDeleteConfirm = () => {
    confirm({
      title: `Bạn chắc chắn muốn xóa máy chủ này không?`,
      icon: <ExclamationCircleFilled />,
      content: `Xác nhận xóa?`,
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        onDelete();
      },
      onCancel() {
        //console.log();
      },
    });
  };
  return showDeleteConfirm();
};
