import React, { useState } from "react";
import { Modal, Pagination, Table } from "antd";
import Highlighter from "react-highlight-words";
import ModalBaoCaoThongKe from "./modal";
import moment from "moment";

export default function List({
  url,
  search,
  data,
  print,
  page,
  setPage,
  size,
  setSize,
  total,
  setTotal,
  delete_ThongKe,
  setEdit,
  setIsModalOpen,
  setIsEdit,
  setIsType,
  setTypeTab,
  type,
  typeRoute,
  isView,
  setIsView,
  view,
  setView,
}) {
  // const [isView, setIsView] = useState(false);
  // const [view, setView] = useState(null);
  // const handleOk = () => {
  //   setIsView(false);
  // };
  // const handleCancel = () => {
  //   setIsView(false);
  // };
  return (
    <>
      <Table
        locale={{
          emptyText: "Không có dữ liệu.",
        }}
        // expandable={{
        //   expandedRowRender: (record) => (
        //     <p
        //       style={{ margin: 0 }}
        //       dangerouslySetInnerHTML={{
        //         __html: record?.content,
        //       }}
        //     ></p>
        //   ),
        // }}
        columns={[
          // {
          //   title: "STT",
          //   dataIndex: "id",
          //   key: "id",
          //   render: (text, record) =>
          //     search ? (
          //       <Highlighter
          //         highlightStyle={{
          //           backgroundColor: "#ffc069",
          //           padding: 0,
          //         }}
          //         searchWords={[search]}
          //         autoEscape
          //         textToHighlight={text ? text.toString() : ""}
          //       />
          //     ) : (
          //       text
          //     ),
          // },
          {
            title: "Tên báo cáo",
            dataIndex: "title",
            key: "title",
            render: (text, record) =>
              search ? (
                <Highlighter
                  highlightStyle={{
                    backgroundColor: "#ffc069",
                    padding: 0,
                  }}
                  searchWords={[search]}
                  autoEscape
                  textToHighlight={text ? text.toString() : ""}
                />
              ) : (
                text
              ),
          },
          // {
          //   title: "Nội dung",
          //   dataIndex: "content",
          //   key: "content",
          //   render: (text, record) =>
          //     search ? (
          //       <Highlighter
          //         highlightStyle={{
          //           backgroundColor: "#ffc069",
          //           padding: 0,
          //         }}
          //         searchWords={[search]}
          //         autoEscape
          //         // textToHighlight={text ? text.toString() : ""}
          //         textToHighlight={
          //           text ? text.replace(/<[^>]+>/g, "").toString() : ""
          //         }
          //       />
          //     ) : (
          //       <p
          //         style={{ margin: 0 }}
          //         dangerouslySetInnerHTML={{
          //           __html: text,
          //         }}
          //       ></p>
          //     ),
          // },
          {
            title: "Ngày báo cáo",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (text, record) =>
              search ? (
                <Highlighter
                  highlightStyle={{
                    backgroundColor: "#ffc069",
                    padding: 0,
                  }}
                  searchWords={[search]}
                  autoEscape
                  textToHighlight={
                    moment(text).format("DD-MM-YYYY HH:mm")
                      ? moment(text)
                          .format("DD-MM-YYYY HH:mm")
                          .split("T")[0]
                          .toString()
                      : ""
                  }
                />
              ) : (
                moment(text).format("DD-MM-YYYY HH:mm")
              ),
          },
          {
            title: "Chọn",
            key: "chon",
            width: "20%",
            render: (text, record) => (
              <>
                <a
                  href
                  role="button"
                  className="ml-1 mr-1"
                  // className="dropdown-item"
                  onClick={() => {
                    setView(record);
                    setIsView(true);
                    setIsType(type);
                  }}
                >
                  <i className="fas fa-eye blue"></i> Xem
                </a>
                <a
                  href
                  role="button"
                  className="ml-1 mr-1"
                  // className="dropdown-item"
                  onClick={() => {
                    setEdit(record);
                    setIsModalOpen(true);
                    setIsEdit(true);
                    setIsType(type);
                    setTypeTab(url);
                  }}
                >
                  <i className="fas fa-edit orange"></i> Sửa
                </a>
                <a
                  role="button"
                  className="ml-1 mr-1"
                  // className="dropdown-item"
                  href
                  onClick={() => delete_ThongKe(url, record)}
                >
                  <i className="fas fa-trash-alt red"></i> Xóa
                </a>
              </>
            ),
          },
        ]}
        dataSource={
          data &&
          (search
            ? data
                ?.filter(
                  (item) =>
                    item?.title
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase()) &&
                    item?.isDeleted === false
                )
                ?.sort(
                  (a, b) => new Date(b?.createdDate) - new Date(a?.createdDate)
                )
            : data
                ?.filter((item) => item?.isDeleted === false)
                ?.sort(
                  (a, b) => new Date(b?.createdDate) - new Date(a?.createdDate)
                ))
        }
        pagination={false}
      />
      <Pagination
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} trên ${total} đối tượng`
        }
        current={page}
        onChange={(page, size) => {
          setPage(page);
          setSize(size);
        }}
        total={total}
      />
      {/* <Modal
        title={"Xem"}
        open={isView}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
        width={window.innerWidth / 2}
      >
        <ModalBaoCaoThongKe
          onHandleCancel={handleCancel}
          // onHandleOk={isEdit ? update_ThongKe : create_ThongKe}
          // isEdit={isEdit}
          isView={isView}
          // isType={isType}
          // setIsType={setIsType}
          edit={view}
          setEdit={setEdit}
          type={typeRoute}
        />
      </Modal> */}
    </>
  );
}
