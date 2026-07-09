import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Api from "../../../api";
import { SESSION_STORAGE } from "../../../config";
import { MESSAGE } from "../../../constants/dictionaries";
import Message from "../../Message";
import Transfer from "../../Transfer";

export default function Index(props) {
  const { children, width, handleOk } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <button
            onClick={showModal}
            type="button"
            className="btn btn-success mb-3 float-right"
          >
            Thêm
          </button>
        </>
      )}
      <Modal
        title={props && props?.edit ? "Sửa" : "Thêm"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        okType="primary"
        cancelText="Hủy"
        width={width}
      >
        {children}
      </Modal>
    </>
  );
}

export const ThemMayChu = (props) => {
  const { auth, handleOk, row } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  //khai báo máy chủ có dịch vụ
  const [dataMayChuUngDungCoDichVu, setDataMayChuUngDungCoDichVu] = useState(
    []
  );
  const [loadingMayChuUngDungCoDichVu, setLoadingMayChuUngDungCoDichVu] =
    useState(true);
  const [
    tableParamsMayChuUngDungCoDichVu,
    setTableParamsMayChuUngDungCoDichVu,
  ] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
    },
  });
  const [strSearchMayChuUngDungCoDichVu, setStrSearchMayChuUngDungCoDichVu] =
    useState("");
  const handleTableChangeMayChuUngDungCoDichVu = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParamsMayChuUngDungCoDichVu({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (
      pagination.pageSize !==
      tableParamsMayChuUngDungCoDichVu.pagination?.pageSize
    ) {
      setDataMayChuUngDungCoDichVu([]);
    }
  };

  //khai báo máy chủ không có dịch vụ
  const [dataMayChuUngDungKhongDichVu, setDataMayChuUngDungKhongDichVu] =
    useState([]);
  const [loadingMayChuUngDungKhongDichVu, setLoadingMayChuUngDungKhongDichVu] =
    useState(true);
  const [
    tableParamsMayChuUngDungKhongDichVu,
    setTableParamsMayChuUngDungKhongDichVu,
  ] = useState({
    pagination: {
      current: 1,
      pageSize: 50,
    },
  });
  const [
    strSearchMayChuUngDungKhongDichVu,
    setStrSearchMayChuUngDungKhongDichVu,
  ] = useState("");
  const handleTableChangeMayChuUngDungKhongDichVu = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParamsMayChuUngDungKhongDichVu({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (
      pagination.pageSize !==
      tableParamsMayChuUngDungKhongDichVu.pagination?.pageSize
    ) {
      setDataMayChuUngDungKhongDichVu([]);
    }
  };

  const getMock = (id_dichvu) => {
    let GetDatasMayChuUngDungCoDichVu =
      new Api().GetList_GetMayChuUngDungDichVu({
        token: auth?.access_token,
        page: tableParamsMayChuUngDungCoDichVu.pagination.current,
        size: tableParamsMayChuUngDungCoDichVu.pagination.pageSize,
        strSearch: strSearchMayChuUngDungCoDichVu,
        id_dichvu: id_dichvu,
      });
    let GetDatasMayChuUngDungKhongDichVu =
      new Api().GetList_GetMayChuUngDungDichVu({
        token: auth?.access_token,
        page: tableParamsMayChuUngDungKhongDichVu.pagination.current,
        size: tableParamsMayChuUngDungKhongDichVu.pagination.pageSize,
        strSearch: strSearchMayChuUngDungKhongDichVu,
        id_dichvu: "00000000-0000-0000-0000-000000000000",
      });
    Promise.all([
      GetDatasMayChuUngDungCoDichVu,
      GetDatasMayChuUngDungKhongDichVu,
    ])
      .then((res) => {
        var tempTargetKeys = [];
        setDataMayChuUngDungCoDichVu(
          res &&
            res[0]?.data?.data.map((item, index) => ({
              ...item,
              stt: index + 1,
              key: item.id,
              id: item.id,
            }))
        );
        setLoadingMayChuUngDungCoDichVu(false);
        setTableParamsMayChuUngDungCoDichVu({
          ...tableParamsMayChuUngDungCoDichVu,
          pagination: {
            ...tableParamsMayChuUngDungCoDichVu.pagination,
            total: res && res[0]?.data?.pagination?.total,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });

        setDataMayChuUngDungKhongDichVu(
          res &&
            res[1]?.data?.data.map((item, index) => ({
              ...item,
              stt: index + 1,
              key: item.id,
              id: item.id,
            }))
        );
        setLoadingMayChuUngDungKhongDichVu(false);
        setTableParamsMayChuUngDungKhongDichVu({
          ...tableParamsMayChuUngDungKhongDichVu,
          pagination: {
            ...tableParamsMayChuUngDungKhongDichVu.pagination,
            total: res && res[1]?.data?.pagination?.total,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });

        res[0]?.data?.data.map((item, index) => {
          tempTargetKeys.push(item.id);
        });

        var tempMockData = [...res[0]?.data?.data, ...res[1]?.data?.data].map(
          (item, index) => ({
            ...item,
            stt: index + 1,
            key: item.id,
            id: item.id,
          })
        );

        setMockData(tempMockData);
        setTargetKeys(tempTargetKeys);
      })
      .catch((err) => Message.error(MESSAGE.ERROR));
  };

  const renderItem = (item) => {
    return {
      label: item.ten,
      // for displayed item
      value: item.id, // for title and filter matching
    };
  };

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);
    if (direction === "right") {
      // var listMayChu = [];
      // if (moveKeys && moveKeys.length > 0) {
      //   moveKeys.map((vl, idx) => {
      //     var objChange = dataMayChuUngDungKhongDichVu.filter(
      //       (x) => x.id === vl
      //     )[0];
      //     listMayChu.push(objChange);
      //   });
      // }
      new Api()
        .Post_GanMayChuDichVu({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          dichvu: row.id,
          maychuungdung: moveKeys,
        })
        .then((res) => {
          getMock(row.id);
        })
        .catch((err) => Message.error(err.message));
    } else if (direction === "left") {
      // var listMayChu = [];
      // if (moveKeys && moveKeys.length > 0) {
      //   moveKeys.map((vl, idx) => {
      //     var objChange = dataMayChuUngDungCoDichVu.filter(
      //       (x) => x.id === vl
      //     )[0];
      //     listMayChu.push(objChange);
      //   });
      // }
      new Api()
        .Post_GanMayChuDichVu({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          dichvu: "00000000-0000-0000-0000-000000000000",
          maychuungdung: moveKeys,
        })
        .then((res) => {
          getMock(row.id);
        })
        .catch((err) => Message.error(err.message));
    }
  };

  const handleSearch = (dir, value) => {
    if (dir === "left") {
      setStrSearchMayChuUngDungKhongDichVu(value.toString());
    }
    if (dir === "right") {
      setStrSearchMayChuUngDungCoDichVu(value.toString());
    }
  };

  const filterOption = (inputValue, option) =>
    // option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
    option.ten.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  useEffect(() => {
    getMock(row.id);
  }, [
    JSON.stringify(tableParamsMayChuUngDungCoDichVu),
    JSON.stringify(tableParamsMayChuUngDungKhongDichVu),
  ]);
  return (
    <>
      <a
        onClick={() => {
          showModal();
          getMock(row.id);
        }}
      >
        <i className="fas fa-check green" title="Cấp máy chủ" /> Cấp máy chủ
      </a>
      <Modal
        title={`Chọn máy chủ muốn cấp cho dịch vụ: ${row.tieuDe}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        okType="primary"
        cancelText="Hủy"
        width={1000}
        // okButtonProps={{ style: { display: "none" } }}
      >
        <Transfer
          showSearch={true}
          mockData={mockData}
          targetKeys={targetKeys}
          handleSearch={handleSearch}
          handleChange={handleChange}
          renderItem={renderItem}
          getMock={getMock}
          operations={["cấp máy", "thu hồi"]}
          renderFooter={{}}
          filterOption={filterOption}
          locale={{
            itemUnit: "Máy chủ",
            itemsUnit: "Máy chủ",
            notFoundContent: "Không có máy chủ",
          }}
          titles={["Máy chủ không thuộc dịch vụ", "Máy chủ thuộc dịch vụ"]}
          tableParamsLeft={tableParamsMayChuUngDungKhongDichVu}
          tableParamsRight={tableParamsMayChuUngDungCoDichVu}
          pageLeft={(page, pageSize) => {
            handleTableChangeMayChuUngDungKhongDichVu({
              current: page,
              pageSize: pageSize,
            });
          }}
          pageRight={(page, pageSize) => {
            handleTableChangeMayChuUngDungCoDichVu({
              current: page,
              pageSize: pageSize,
            });
          }}
        />
      </Modal>
    </>
  );
};

export const ModalSure = (props) => {
  const { auth, handleOk, row, label, title } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <a
        onClick={() => {
          showModal();
        }}
      >
        {label}
      </a>
      <Modal
        title={title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đồng ý"
        okType="primary"
        cancelText="Hủy"
        width={300}
        // okButtonProps={{ style: { display: "none" } }}
      ></Modal>
    </>
  );
};
