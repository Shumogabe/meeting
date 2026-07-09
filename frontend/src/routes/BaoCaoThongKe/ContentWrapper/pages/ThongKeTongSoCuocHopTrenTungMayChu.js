import React, { useEffect, useState } from "react";
import { Col, DatePicker, Input, Row } from "antd";
import dayjs from "dayjs";
import { PAGE_CURRENT, PAGE_SIZE } from "../../../../config";
import Helper from "../../../../helper/helper";
import Export from "../includes/Export";
import List from "../includes/List";
import Search from "../includes/Search";
const { RangePicker } = DatePicker;

export default function ThongKeTongSoCuocHopTrenTungMayChu({
  url,
  name,
  type,
  title,
  setIsModalOpen,
  setIsEdit,
  setIsType,
  create_ThongKe,
  delete_ThongKe,
  getlist_unapproved_ThongKe,
  bieudo_ThongKe,
  excel_ThongKe,
  setEdit,
  isAction,
  setIsAction,
  setTypeTab,
  permissions,
  user,
  setUser,
  isView,
  setIsView,
  view,
  setView,
}) {
  const [thongKeData, setThongKeData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(PAGE_CURRENT);
  const [size, setSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [print, setPrint] = useState(false);
  const [startTime, setStartTime] = useState(
    dayjs().subtract(1, "month").format("DD/MM/YYYY")
  );
  const [endTime, setEndTime] = useState(dayjs().format("DD/MM/YYYY"));

  const [data, setData] = useState([]);

  const getData = (url, search, pageSize, pageNumber) => {
    getlist_unapproved_ThongKe(url, search, pageSize, pageNumber).then((e) => {
      // return alert(JSON.stringify(e?.items));
      //console.log(e?.items.length);
      setData(e?.items);
      setTotal(e?.totalRecords);
    });
  };
  // const bieudo = () => {
  //   // bieudo_ThongKe().then((e) => {
  //   //   setThongKeData(e);
  //   // });
  //   new Api().ThongKeSoHoiNghiHoiThaoTheoNgay().then((e) => {
  //     setThongKeData(e);
  //   });
  // };

  // Print
  const handlePrint = () => {
    setPrint(true);
  };

  useEffect(() => {
    if (print === true) {
      try {
        window.print();
        setPrint(false);
      } catch (error) {
        //console.log(error);
      }
    }
  }, [print]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(user)) {
      getData(url, search, size, page);
      // bieudo();
    }
  }, [name, search, startTime, endTime, size, page, user]);

  useEffect(() => {
    if (isAction === true) {
      getData(url, search, size, page);
      // bieudo();
      setIsAction(false);
    }
  }, [isAction]);

  return (
    <>
      <h4>
        <b>{title}</b>
      </h4>
      {!print && <Search search={search} setSearch={setSearch} />}
      {/* <Chart
        data={thongKeData}
        name="dayDate"
        value="count"
        chartDefs={[]}
        title={title}
      /> */}
      {!print && (
        <Export
          url={url}
          setTypeTab={setTypeTab}
          type={name}
          handlePrint={handlePrint}
          setIsModalOpen={setIsModalOpen}
          setIsEdit={setIsEdit}
          setIsType={setIsType}
          excel_ThongKe={excel_ThongKe}
          create_ThongKe={create_ThongKe}
        />
      )}
      <List
        url={url}
        search={search}
        data={data}
        print={print}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        total={total}
        setTotal={setTotal}
        delete_ThongKe={delete_ThongKe}
        setEdit={setEdit}
        setIsModalOpen={setIsModalOpen}
        setIsEdit={setIsEdit}
        setIsType={setIsType}
        setTypeTab={setTypeTab}
        type={name}
        isView={isView}
        setIsView={setIsView}
        view={view}
        setView={setView}
      />
    </>
  );
}
