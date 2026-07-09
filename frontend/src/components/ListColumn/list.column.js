import React from "react";
import moment from "moment";
import RowTools from "../RowTools";

//Các đơn vị
export const columnDangKyDichVu = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/xem?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "ten",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/xem?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      align: "center",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/xem?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "tools",
      key: "tools",
      align: "center",
      width: "90px",
      render: (value, row) => (
        <RowTools
          row={row}
          href={href}
          dangky={true}
          xem={true}
          sua={true}
          xoa={true}
          isDeleted={isDeleted}
          onDelete_onRecover={onDelete_onRecover}
          onDelete={onDelete}
        />
      ),
    },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnQuanLyDichVu = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  onUpdate,
  setOpenEdit,
  setOpenView,
  loaiDichVu,
  setDetail,
  tinhTrang,
} = {}) => {
  var column =
    tinhTrang === 1
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Người đăng ký",
            dataIndex: "nguoiDangKy",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Đơn vị",
            dataIndex: "donVi",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày đăng ký",
            dataIndex: "ngayDangKy",
            align: "center",
            width: "110px",
            render: (value, row) => {
              if (row?.createdAt === 0) {
                return null;
              }
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(value)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: "Thao tác",
            dataIndex: "tools",
            key: "tools",
            align: "center",
            width: "110px",
            render: (value, row) => (
              <RowTools
                row={row}
                href={href}
                dangky={row?.tinhTrang === 1 ? true : false}
                thuhoi={row?.tinhTrang === 2 ? true : false}
                xem={true}
                sua={
                  row?.tinhTrang === 4 || row?.tinhTrang === 5 ? false : true
                }
                xoa={false}
                huydangky={true}
                isDeleted={isDeleted}
                onDelete_onRecover={onDelete_onRecover}
                onDelete={onDelete}
                onUpdate={onUpdate}
                setOpenEdit={setOpenEdit}
                setOpenView={setOpenView}
                loaiDichVu={loaiDichVu}
                setDetail={setDetail}
              />
            ),
          },
        ]
      : [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Đơn vị",
            dataIndex: "donVi",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Người đăng ký",
            dataIndex: "nguoiDangKy",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày đăng ký",
            dataIndex: "ngayDangKy",
            align: "center",
            width: "110px",
            render: (value, row) => {
              if (row?.createdAt === 0) {
                return null;
              }
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(value)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title:
              tinhTrang === 2 ? "Người duyệt" : tinhTrang === 3 && "Người hủy",
            dataIndex: "nguoiDuyet",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title:
              tinhTrang === 2 ? "Ngày duyệt" : tinhTrang === 3 && "Ngày hủy",
            dataIndex: "ngayDuyet",
            align: "center",
            width: "110px",
            render: (value, row) => {
              if (row?.createdAt === 0) {
                return null;
              }
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(value)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
        ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnTiepNhanDangKy = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  onUpdate,
  setOpenEdit,
  loaiDichVu,
  setDetail,
  tinhTrang,
} = {}) => {
  var column =
    tinhTrang === "ĐÃ DUYỆT" || tinhTrang === "ĐÃ TỪ CHỐI"
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            key: "tenDichVu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Đơn vị",
            dataIndex: "donVi",
            key: "donVi",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Người đăng ký",
            dataIndex: "nguoiDangKy",
            key: "nguoiDangKy",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày đăng ký",
            dataIndex: "ngayDangKy",
            key: "ngayDangKy",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(value)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            key: "nguoiDuyet",
            title: "Người phê duyệt",
            dataIndex: "nguoiDuyet",
            key: "nguoiDuyet",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày phê duyệt",
            dataIndex: "ngayDuyet",
            key: "ngayDuyet",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(value)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          // {
          //   title: "Thao tác",
          //   dataIndex: "tools",
          //   key: "tools",
          //   align: "center",
          //   width: "110px",
          //   render: (value, row) => (
          //     <RowTools
          //       row={row}
          //       href={href}
          //       dangky={row?.tinhTrang === 1 ? true : false}
          //       xem={false}
          //       // sua={row?.tinhTrang === 4 || row?.tinhTrang === 5 ? false : true}
          //       sua={true}
          //       xoa={false}
          //       isDeleted={isDeleted}
          //       onDelete_onRecover={onDelete_onRecover}
          //       onDelete={onDelete}
          //       onUpdate={onUpdate}
          //       setOpenEdit={setOpenEdit}
          //       loaiDichVu={loaiDichVu}
          //       setDetail={setDetail}
          //     />
          //   ),
          // },
        ]
      : tinhTrang === "ĐÃ CẤP" || tinhTrang === "HỦY CẤP"
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            key: "tenDichVu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Người đăng ký",
            dataIndex: "nguoiDangKy",
            key: "nguoiDangKy",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Đơn vị",
            dataIndex: "donVi",
            key: "donVi",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Thời gian đăng ký",
            dataIndex: "ngayDangKy",
            key: "ngayDangKy",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(row?.ngayBatDau) * 1000).format("DD/MM/YYYY")}
                  {" - "}
                  {moment(Number(row?.ngayKetThuc) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            key: "taiKhoan",
            title: "Tài khoản",
            dataIndex: "taiKhoan",
            key: "taiKhoan",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            key: "mayChu",
            title: "Máy chủ",
            dataIndex: "mayChu",
            key: "mayChu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            key: "createdByName",
            title: "Người cấp",
            dataIndex: "createdByName",
            key: "createdByName",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title:
              tinhTrang === "ĐÃ CẤP"
                ? "Ngày cấp"
                : tinhTrang === "ĐÃ CẤP" && "Ngày hủy cấp",
            dataIndex: "createdDate",
            key: "createdDate",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(value).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          // {
          //   title: "Thao tác",
          //   dataIndex: "tools",
          //   key: "tools",
          //   align: "center",
          //   width: "110px",
          //   render: (value, row) => (
          //     <RowTools
          //       row={row}
          //       href={href}
          //       dangky={row?.tinhTrang === 1 ? true : false}
          //       xem={false}
          //       // sua={row?.tinhTrang === 4 || row?.tinhTrang === 5 ? false : true}
          //       sua={true}
          //       xoa={false}
          //       isDeleted={isDeleted}
          //       onDelete_onRecover={onDelete_onRecover}
          //       onDelete={onDelete}
          //       onUpdate={onUpdate}
          //       setOpenEdit={setOpenEdit}
          //       loaiDichVu={loaiDichVu}
          //       setDetail={setDetail}
          //     />
          //   ),
          // },
        ]
      : tinhTrang === "ĐÃ HỦY" || tinhTrang === "ĐÃ KHÔI PHỤC"
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            key: "tenDichVu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Người đăng ký",
            dataIndex: "nguoiDangKy",
            key: "nguoiDangKy",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Đơn vị",
            dataIndex: "donVi",
            key: "donVi",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Thời gian đăng ký",
            dataIndex: "ngayDangKy",
            key: "ngayDangKy",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(Number(row?.ngayBatDau) * 1000).format("DD/MM/YYYY")}
                  {" - "}
                  {moment(Number(row?.ngayKetThuc) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            key: "createdByName",
            title:
              tinhTrang === "ĐÃ HỦY"
                ? "Người hủy"
                : tinhTrang === "ĐÃ KHÔI PHỤC" && "Người khôi phục",
            dataIndex: "createdByName",
            key: "createdByName",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title:
              tinhTrang === "ĐÃ HỦY"
                ? "Ngày hủy"
                : tinhTrang === "ĐÃ KHÔI PHỤC" && "Ngày khôi phục",
            dataIndex: "createdDate",
            key: "createdDate",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {moment(value).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          // {
          //   title: "Thao tác",
          //   dataIndex: "tools",
          //   key: "tools",
          //   align: "center",
          //   width: "110px",
          //   render: (value, row) => (
          //     <RowTools
          //       row={row}
          //       href={href}
          //       dangky={row?.tinhTrang === 1 ? true : false}
          //       xem={false}
          //       // sua={row?.tinhTrang === 4 || row?.tinhTrang === 5 ? false : true}
          //       sua={true}
          //       xoa={false}
          //       isDeleted={isDeleted}
          //       onDelete_onRecover={onDelete_onRecover}
          //       onDelete={onDelete}
          //       onUpdate={onUpdate}
          //       setOpenEdit={setOpenEdit}
          //       loaiDichVu={loaiDichVu}
          //       setDetail={setDetail}
          //     />
          //   ),
          // },
        ]
      : [
          {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên dịch vụ",
            dataIndex: "tenDichVu",
            key: "tenDichVu",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Đơn vị",
            dataIndex: "donVi",
            key: "donVi",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Người đăng ký",
            dataIndex: "nguoiDangKy",
            key: "nguoiDangKy",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày đăng ký",
            dataIndex: "ngayDangKy",
            key: "ngayDangKy",
            align: "center",
            width: "130px",
            render: (value, row) => {
              return (
                <a onClick={(event) => setDetail(row)} target="_blank">
                  {/* {JSON.stringify(row)} */}
                  {moment(Number(value)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: "Thao tác",
            dataIndex: "tools",
            key: "tools",
            align: "center",
            width: "110px",
            render: (value, row) => (
              <RowTools
                row={row}
                href={href}
                dangky={row?.tinhTrang === 1 ? true : false}
                xem={false}
                // sua={row?.tinhTrang === 4 || row?.tinhTrang === 5 ? false : true}
                sua={true}
                xoa={false}
                isDeleted={isDeleted}
                onDelete_onRecover={onDelete_onRecover}
                onDelete={onDelete}
                onUpdate={onUpdate}
                setOpenEdit={setOpenEdit}
                loaiDichVu={loaiDichVu}
                setDetail={setDetail}
              />
            ),
          },
        ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnCapDangKy = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  onUpdate,
  auth,
} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "tieuDe",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "loaiDichVu",
      render: (value, row) => {
        return (
          <>
            <a
              onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
              target="_blank"
            >
              {(() => {
                switch (row?.loaiDichVu) {
                  case 1:
                    return "Cấp dịch vụ";
                  case 2:
                    return "Cấp đổi, bổ sung dịch vụ";
                  case 3:
                    return "Hủy sử dụng";
                  case 4:
                    return "Nhu cầu sử dụng";
                }
              })()}
            </a>
          </>
        );
      },
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      align: "center",
      width: "130px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {moment(Number(row?.createdAt) * 1000).format("DD/MM/YYYY")}
          </a>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "tools",
      key: "tools",
      align: "center",
      width: "190px",
      render: (value, row) => (
        <RowTools
          row={row}
          href={href}
          dangky={false}
          xem={true}
          sua={false}
          xoa={false}
          cap={
            row?.tinhTrang === 4
              ? 1
              : row?.tinhTrang === 7
              ? 2
              : row?.tinhTrang === 8
              ? 3
              : false
          }
          isDeleted={isDeleted}
          onDelete_onRecover={onDelete_onRecover}
          onDelete={onDelete}
          onUpdate={onUpdate}
          auth={auth}
        />
      ),
    },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnTraCuuMayChu = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieuDe",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "tinhTrang",
      render: (value, row) => (
        <div>
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {(() => {
              switch (row?.tinhTrang) {
                case 1:
                  return "Đang cập nhật";
                case 2:
                  return "Đã gửi đăng ký";
                case 3:
                  return "Yêu cầu bổ sung";
                case 4:
                  return "Đã duyệt";
                case 5:
                  return "Đã hủy";
                case 6:
                  return "Đã tiếp nhận";
                case 7:
                  return "Đã cấp";
                case 8:
                  return "Hủy cấp";
              }
            })()}
          </a>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
      width: "110px",
      render: (value, row) => (
        <a
          onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
          target="_blank"
        >
          {moment(Number(row?.createdAt) * 1000).format("DD/MM/YYYY")}
        </a>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "tools",
      key: "tools",
      align: "center",
      width: "110px",
      render: (value, row) => (
        <RowTools
          row={row}
          href={href}
          dangky={row?.tinhTrang === 1 ? true : false}
          xem={true}
          sua={row?.tinhTrang === 2 || row?.tinhTrang === 1 ? true : false}
          xoa={row?.tinhTrang === 2 || row?.tinhTrang === 1 ? true : false}
          isDeleted={isDeleted}
          onDelete_onRecover={onDelete_onRecover}
          onDelete={onDelete}
        />
      ),
    },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnQuanLyHuyDichVu = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieuDe",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Ngày hủy",
      dataIndex: "deletedAt",
      align: "center",
      width: "110px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {moment(Number(row?.deletedAt) * 1000).format("DD/MM/YYYY")}
          </a>
        );
      },
    },
    // {
    //   title: "Thao tác",
    //   dataIndex: "tools",
    //   key: "tools",
    //   align: "center",
    //   width: "110px",
    //   render: (value, row) => (
    //     <RowTools
    //       row={row}
    //       href={href}
    //       dangky={row?.tinhTrang === 0 ? true : false}
    //       xem={true}
    //       sua={row?.tinhTrang === 3 ? false : true}
    //       xoa={true}
    //       isDeleted={isDeleted}
    //       onDelete_onRecover={onDelete_onRecover}
    //       onDelete={onDelete}
    //     />
    //   ),
    // },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnLog = ({} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
    },
    {
      title: "Tài khoản",
      dataIndex: "taiKhoan",
    },
    {
      title: "Đối tượng",
      dataIndex: "chucNang",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      width: "190px",
      render: (value, row) => {
        return (
          <>
            {moment(Number(row?.createdAt) * 1000).format(
              "DD/MM/YYYY HH:mm:ss a"
            )}
          </>
        );
      },
    },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    ellipsis: true,
  }));
};
export const columnLogTiepNhanPheDuyet = ({} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
    },
    {
      title: () => {
        return (
          <>
            {window.location.pathname.includes("/phe-duyet")
              ? "Tài khoản phê duyệt"
              : window.location.pathname.includes("/tiep-nhan")
              ? "Tài khoản tiếp nhận"
              : "Tài khoản"}
          </>
        );
      },
      dataIndex: "taiKhoan",
      width: "180px",
    },
    {
      title: "Nội dung",
      dataIndex: "noiDung",
      render: (value, row) => {
        return (
          <>
            Thực hiện{" "}
            {window.location.pathname.includes("/phe-duyet")
              ? "phê duyệt"
              : window.location.pathname.includes("/tiep-nhan")
              ? "tiếp nhận"
              : "xử lý"}{" "}
            đăng ký "
            {
              JSON.parse(
                row?.noiDung
                  .substring(row?.noiDung.indexOf("{"), row?.noiDung.length)
                  .toString()
              ).TieuDe
            }
            "
          </>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            {window.location.pathname.includes("/phe-duyet")
              ? "Thời gian phê duyệt"
              : window.location.pathname.includes("/tiep-nhan")
              ? "Thời gian tiếp nhận"
              : "Thời gian"}
          </>
        );
      },
      dataIndex: "createdAt",
      width: "190px",
      render: (value, row) => {
        return (
          <>
            {moment(Number(row?.createdAt) * 1000).format(
              "DD/MM/YYYY HH:mm:ss a"
            )}
          </>
        );
      },
    },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    ellipsis: true,
  }));
};

//Deleted
export const columnQuanLyDichVuDeleted = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  onUpdate,
} = {}) => {
  var column = [
    {
      title: "STT",
      dataIndex: "stt",
      rowScope: "row",
      align: "center",
      width: "60px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieuDe",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {value}
          </a>
        );
      },
    },
    {
      title: "Ngày xóa",
      dataIndex: "deletedAt",
      align: "center",
      width: "110px",
      render: (value, row) => {
        return (
          <a
            onClick={(event) => window.open(href + "/chi-tiet?id=" + row.id)}
            target="_blank"
          >
            {moment(Number(row?.createdAt) * 1000).format("DD/MM/YYYY")}
          </a>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "tools",
      key: "tools",
      align: "center",
      width: "110px",
      render: (value, row) => (
        <RowTools
          row={row}
          href={href}
          dangky={row?.tinhTrang === 1 ? true : false}
          xem={true}
          sua={row?.tinhTrang === 4 || row?.tinhTrang === 5 ? false : true}
          xoa={true}
          isDeleted={isDeleted}
          onDelete_onRecover={onDelete_onRecover}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ),
    },
  ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnDangKyCapPhatDichVuDeleted = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  quyen,
} = {}) => {
  var column =
    quyen && quyen.includes(3)
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên",
            dataIndex: "tenBaoCao",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày xóa",
            dataIndex: "deletedAt",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {moment(Number(row.deletedAt) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: "Thao tác",
            dataIndex: "tools",
            key: "tools",
            align: "center",
            width: "90px",
            render: (value, row) => (
              <RowTools
                row={row}
                href={href}
                xem={true}
                sua={true}
                xoa={true}
                isDeleted={isDeleted}
                onDelete_onRecover={onDelete_onRecover}
                onDelete={onDelete}
              />
            ),
          },
        ]
      : [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên",
            dataIndex: "ten",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày xóa",
            dataIndex: "deletedAt",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {moment(Number(row.deletedAt) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
        ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnHienTrangSuDungDeleted = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  quyen,
} = {}) => {
  var column =
    quyen && quyen.includes(3)
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên",
            dataIndex: "tenBaoCao",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày xóa",
            dataIndex: "deletedAt",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {moment(Number(row.deletedAt) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: "Thao tác",
            dataIndex: "tools",
            key: "tools",
            align: "center",
            width: "90px",
            render: (value, row) => (
              <RowTools
                row={row}
                href={href}
                xem={true}
                sua={true}
                xoa={true}
                isDeleted={isDeleted}
                onDelete_onRecover={onDelete_onRecover}
                onDelete={onDelete}
              />
            ),
          },
        ]
      : [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên",
            dataIndex: "ten",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày xóa",
            dataIndex: "deletedAt",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {moment(Number(row.deletedAt) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
        ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
export const columnNhuCauHaTangDeleted = ({
  href,
  isDeleted,
  onDelete_onRecover,
  onDelete,
  quyen,
} = {}) => {
  var column =
    quyen && quyen.includes(3)
      ? [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên",
            dataIndex: "tenBaoCao",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày xóa",
            dataIndex: "deletedAt",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) =>
                    window.open(href + "/chi-tiet?id=" + row.id)
                  }
                  target="_blank"
                >
                  {moment(Number(row.deletedAt) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: "Thao tác",
            dataIndex: "tools",
            key: "tools",
            align: "center",
            width: "90px",
            render: (value, row) => (
              <RowTools
                row={row}
                href={href}
                xem={true}
                sua={true}
                xoa={true}
                isDeleted={isDeleted}
                onDelete_onRecover={onDelete_onRecover}
                onDelete={onDelete}
              />
            ),
          },
        ]
      : [
          {
            title: "STT",
            dataIndex: "stt",
            rowScope: "row",
            align: "center",
            width: "60px",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) => window.open(href + "/xem?id=" + row.id)}
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Tên",
            dataIndex: "ten",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) => window.open(href + "/xem?id=" + row.id)}
                  target="_blank"
                >
                  {value}
                </a>
              );
            },
          },
          {
            title: "Ngày xóa",
            dataIndex: "deletedAt",
            render: (value, row) => {
              return (
                <a
                  onClick={(event) => window.open(href + "/xem?id=" + row.id)}
                  target="_blank"
                >
                  {moment(Number(row.deletedAt) * 1000).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
        ];
  return column.map((col) => ({
    ...col,
    textWrap: "word-break",
    // ellipsis: true,
  }));
};
