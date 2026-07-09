import React from "react";
import { Helmet } from "react-helmet";
import DichVu from ".";

const RoutesCapPhatDichVu = [
  { path: "", element: ({ ...props }) => <CapPhatDichVu {...props} /> },
  { path: "cap-nhat", element: ({ ...props }) => <CapPhatDichVu {...props} /> },
  { path: "chi-tiet", element: ({ ...props }) => <CapPhatDichVu {...props} /> },
];

function CapPhatDichVu({ permissions, user, setUser }) {
  return (
    <DichVu
      script={
        <Helmet>
          <script src="./static/js/script_capphatdichvu.js"></script>
        </Helmet>
      }
      breadcrumb={"Đăng ký cấp phát dịch vụ"}
      loaiDichVu={"DangKyCapPhatDichVu"}
      permissions={permissions}
      user={user}
      setUser={setUser}
    />
  );
}

export default RoutesCapPhatDichVu;
