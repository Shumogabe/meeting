import React, { useState } from "react";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button, ConfigProvider } from "antd";
import { Theme } from "../../../../theme";
import { SwalAlertAllConfiguration } from "../../../../components/Swal";

export default function Export({
  url,
  type,
  tableRef,
  handlePrint,
  setIsModalOpen,
  setIsEdit,
  setIsType,
  excel_ThongKe,
  setTypeTab,
  create_ThongKe,
  handleCancel,
}) {
  const [loadingButton, setLoadingButton] = useState(false);

  // Export Csv
  const handleExportExcel = () => {
    excel_ThongKe();
    //   // const values = formikRef.current.values;
    //   // const { tu_khoa, page, filter_time_from, filter_time_to } = values;
    //   // const data = { tu_khoa, page, filter_time_from: filter_time_from || 0, filter_time_to: filter_time_to || 0 };
    //   // new Api().ExportExcelDangKyTaiKhoanCCVC({ data, fileName: bangFilter }).catch((err) => {
    //   //     ThongBao({ status: 'error', message: 'Có lỗi trong quá trình xuất file, vui lòng xem log!' });
    //   //     console.log(err);
    //   // });
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultActiveBorderColor: Theme.theme().css.background.color,
              defaultActiveColor: Theme.theme().css.background.color,
              defaultBorderColor: Theme.theme().css.background.color,
              defaultColor: Theme.theme().css.background.color,
              defaultHoverBg: Theme.theme().css.background.color,
              defaultHoverBorderColor: Theme.theme().css.background.color,
              defaultHoverColor: Theme.theme().css.color.color,
              colorPrimary: Theme.theme().css.background.color,
              colorPrimaryHover: Theme.theme().css.background.color,
              colorPrimaryActive: Theme.theme().css.background.color,
              colorPrimaryBorder: Theme.theme().css.background.color,
            },
          },
        }}
      >
        {/* <Button
          type="primary"
          size="large"
          loading={loadingButton}
          icon={<FileExcelOutlined />}
          width={"100px"}
          style={{
            marginRight: "10px",
          }}
          onClick={() => handleExportExcel()}
        >
          Xuất excel
        </Button> */}
        {/* <Button
          size="large"
          type="primary"
          loading={loadingButton}
          icon={<FilePdfOutlined />}
          width={"100px"}
          onClick={() => handlePrint()}
        >
          Xuất pdf
        </Button> */}
        <Button
          style={{ float: "right" }}
          onClick={() => {
            if (url === "QuanLyBaoCaoThongKeHoiNghiHoiThao1") {
              // alert(url);
              create_ThongKe(url, {}).then(() => {
                handleCancel();
                SwalAlertAllConfiguration({
                  title: "Thông báo",
                  text: "Thêm thành công",
                  timer: 2000,
                  icon: "success",
                });
              });
            } else {
              setIsModalOpen(true);
              setIsEdit(false);
              setIsType(type);
              setTypeTab(url);
            }
          }}
          className="btn btn-sm btn-default"
        >
          <i className="fas fa-plus info"></i> Thêm
        </Button>
      </ConfigProvider>
    </>
  );
}
