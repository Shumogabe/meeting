import React from "react";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";

export default function Index(props) {
  const {
    columns,
    dataSource,
    pagination,
    loading,
    onChange,
    expandable,
    hrefPageMain,
    title,
  } = props;
  let navigate = useNavigate();

  return (
    <>
      <Table
        locale={{
          emptyText: "Không có dữ liệu.",
        }}
        columns={columns}
        expandable={expandable}
        dataSource={dataSource}
        bordered
        pagination={pagination}
        loading={loading}
        onChange={onChange}
        size="large"
        // onRow={onRow}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // console.log(record);
              if (hrefPageMain) {
                if (hrefPageMain === "may-chu-vat-ly-thiet-bi-luu-tru") {
                  switch (record.tenThietBi) {
                    case "Máy chủ vật lý":
                      window.open(
                        HREF.MAY_CHU_VAT_LY + "/xem?id=" + record.iD_ThietBi
                      );
                      break;
                    case "Thiết bị lưu trữ":
                      window.open(
                        HREF.THIET_BI_LUU_TRU + "/xem?id=" + record.iD_ThietBi
                      );
                      break;
                    default:
                      break;
                  }
                  // navigate(hrefPageMain + "/xem?id=" + record.id);
                }
                if (hrefPageMain === "may-chu-ung-dung-he-thong-thong-tin") {
                  window.open(
                    HREF.MAY_CHU_UNG_DUNG + "/xem?id=" + record.mcud.id
                  );
                  // navigate(hrefPageMain + "/xem?id=" + record.id);
                }
                // navigate(hrefPageMain + "/xem?id=" + record.id);
                window.open(hrefPageMain + "/xem?id=" + record.id);
              }
            }, // click row
          };
        }}
      />
      {pagination && (
        <div
          style={{
            marginTop: -40,
            position: "relative",
            float: "left",
            width: "45%",
          }}
        >
          {!Helper.isNullOrUndefined(title) ? (
            <>
              Tổng số {title.toLowerCase()}: {pagination.total}
              <br />
            </>
          ) : (
            <></>
          )}
          {showTotal(pagination)}
        </div>
      )}
    </>
  );
}
const showTotal = ({ total, pageSize, current }) => {
  if (total === 0) {
    return "";
  }
  let strTotal = "Bản ghi từ ";
  const x1 = (current - 1) * pageSize + 1;
  let x2 = current * pageSize;
  const y = total;
  if (x2 > y) {
    x2 = y;
  }
  if (y) {
    strTotal = strTotal + `${x1} tới ${x2} của ${y}`;
  } else {
    return false;
  }
  return strTotal;
};
