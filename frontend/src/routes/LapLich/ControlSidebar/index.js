import React from "react";

export default function ControlSidebar({ role, permissions }) {
  // const [permissions, setPermissions] = useState(false);
  // useEffect(() => {
  //   CheckUser().then((user) => {
  //     if (Helper.isNullOrUndefined(user)) {
  //       HandleLogout("login");
  //     } else {
  //       new Api()
  //         .PhanQuyenVaiTroNguoiDung({
  //           token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
  //             ?.access_token,
  //         })
  //         .then((e) => {
  //           if (!Helper.isNullOrUndefined(e)) {
  //             setPermissions(
  //               JSON.stringify(e).includes(FUNC_PERMISSION.SYSTEM_ADMIN)
  //             );
  //             localStorage.setItem("UserInfo", JSON.stringify(e));
  //           }
  //         });
  //     }
  //   });
  // }, []);
  return (
    <aside
      id="control-sidebar-dark"
      className="control-sidebar control-sidebar-info"
    >
      {/* Control sidebar content goes here */}
      <h3>
        <i className="fas fa-cogs" /> Quản trị hệ thống
        <button
          type="button"
          className="close text-danger"
          data-dismiss="control-sidebar"
          aria-label="Close"
          onClick={() =>
            (document.getElementById("control-sidebar-dark").style.display =
              "none")
          }
        >
          <span
            aria-hidden="true"
            style={{ fontSize: "45px", lineHeight: "15px" }}
          >
            &times;
          </span>
        </button>
      </h3>
      {/* {permissions === true && (
        <Menu
          onClick={(e) => {
            //console.log("click ", e);
          }}
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
          // mode="inline"
          mode="vertical"
          items={[
            // {
            //   key: "123",
            //   label: "123",
            //   onClick: () => {
            //     alert(123);
            //   },
            // },
            {
              key: "Quản lý cấu hình",
              label: "Quản lý cấu hình",
              icon: <MenuUnfoldOutlined />,
              children: [
                {
                  key: "Thiết lập cấu hình kế hoạch",
                  label: "Thiết lập cấu hình kế hoạch",
                },
                {
                  key: "Thiết lập cấu hình chương trình",
                  label: "Thiết lập cấu hình chương trình",
                },
                {
                  key: "Thiết lập cấu hình tài liệu họp",
                  label: "Thiết lập cấu hình tài liệu họp",
                },
                {
                  key: "Thiết lập cấu hình thành phần tham gia",
                  label: "Thiết lập cấu hình thành phần tham gia",
                },
                {
                  key: "Thiết lập cấu hình biểu quyết",
                  label: "Thiết lập cấu hình biểu quyết",
                },
                {
                  key: "Thiết lập cấu hình báo cáo thống kê",
                  label: "Thiết lập cấu hình báo cáo thống kê",
                },
                {
                  key: "Thiết lập cấu hình sự kiện",
                  label: "Thiết lập cấu hình sự kiện",
                },
                {
                  key: "Thiết lập cấu hình người dùng",
                  label: "Thiết lập cấu hình người dùng",
                },
                {
                  key: "Thiết lập cấu hình hệ thống",
                  label: "Thiết lập cấu hình hệ thống",
                },
                {
                  key: "Quản lý thông tin cấu hình dịch vụ sms",
                  label: "Quản lý thông tin cấu hình dịch vụ sms",
                },
                {
                  key: "Thiết lập thông báo lịch họp",
                  label: "Thiết lập thông báo lịch họp",
                },
                {
                  key: "Thiết lập thời gian chờ",
                  label: "Thiết lập thời gian chờ",
                },
              ],
            },
            {
              key: "Quản lý log",
              label: "Quản lý log",
              icon: <MenuUnfoldOutlined />,
              children: [
                {
                  key: "Quản lý nhật ký truy cập phần mềm",
                  label: "Quản lý nhật ký truy cập phần mềm",
                },
                {
                  key: "Quản lý nhật ký quản lý người dùng",
                  label: "Quản lý nhật ký quản lý người dùng",
                },
                {
                  key: "Quản lý nhật ký quản lý lập lịch",
                  label: "Quản lý nhật ký quản lý lập lịch",
                },
                {
                  key: "Quản lý nhật ký quản lý sự kiện",
                  label: "Quản lý nhật ký quản lý sự kiện",
                },
                {
                  key: "Quản lý nhật ký tham gia phòng họp",
                  label: "Quản lý nhật ký tham gia phòng họp",
                },
                {
                  key: "Quản lý nhật ký các lỗi phát sinh trong quá trình hoạt động",
                  label:
                    "Quản lý nhật ký các lỗi phát sinh trong quá trình hoạt động",
                },
                {
                  key: "Quản lý nhật ký quản lý đăng ký dịch vụ",
                  label: "Quản lý nhật ký quản lý đăng ký dịch vụ",
                },
                {
                  key: "Quản lý nhật ký đăng nhập",
                  label: "Quản lý nhật ký đăng nhập",
                },
              ],
            },
            {
              key: "Quản trị hệ thống",
              label: "Quản trị hệ thống",
              icon: <MenuUnfoldOutlined />,
              children: [
                {
                  key: "Quản lý danh mục máy chủ",
                  label: "Quản lý danh mục máy chủ",
                },
                {
                  key: "Quản lý thông tin đơn vị",
                  label: "Quản lý thông tin đơn vị",
                },
                {
                  key: "Quản lý thông tin người dùng",
                  label: "Quản lý thông tin người dùng",
                },
                {
                  key: "Quản lý chức vụ",
                  label: "Quản lý chức vụ",
                },
                {
                  key: "Quản lý vai trò người dùng",
                  label: "Quản lý vai trò người dùng",
                },
                {
                  key: "Quản lý phân quyền người dùng",
                  label: "Quản lý phân quyền người dùng",
                },
                {
                  key: "Quản lý chặn truy cập",
                  label: "Quản lý chặn truy cập",
                },
                {
                  key: "Quản lý, giám sát IP máy chủ người quản trị",
                  label: "Quản lý, giám sát IP máy chủ người quản trị",
                },
                {
                  key: "Quản lý sao lưu cấu hình hệ thống",
                  label: "Quản lý sao lưu cấu hình hệ thống",
                },
                {
                  key: "Quản lý danh mục loại dữ liệu gán nhãn sao lưu",
                  label: "Quản lý danh mục loại dữ liệu gán nhãn sao lưu",
                },
                {
                  key: "Quản lý sao lưu bảng dữ liệu",
                  label: "Quản lý sao lưu bảng dữ liệu",
                },
                {
                  key: "Quản lý sao lưu tệp tin",
                  label: "Quản lý sao lưu tệp tin",
                },
                {
                  key: "Quản lý thiết lập cơ chế sao lưu",
                  label: "Quản lý thiết lập cơ chế sao lưu",
                },
              ],
            },
          ]}
        />
      )} */}
    </aside>
  );
}
