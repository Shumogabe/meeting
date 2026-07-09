import React from "react";
import DichVu from ".";
import { Helmet } from "react-helmet";

const RoutesHuyDichVu = [
  { path: "", element: ({ ...props }) => <HuyDichVu {...props} /> },
  { path: "cap-nhat", element: ({ ...props }) => <HuyDichVu {...props} /> },
  { path: "chi-tiet", element: ({ ...props }) => <HuyDichVu {...props} /> },
];

function HuyDichVu({ permissions, user, setUser }) {
  return (
    <DichVu
      script={
        <Helmet>
          <script src="./static/js/script_huydichvu.js"></script>
        </Helmet>
      }
      breadcrumb={"Hủy dịch vụ"}
      loaiDichVu={"DangKyHuyDichVu"}
      permissions={permissions}
      user={user}
      setUser={setUser}
    />
  );
}

export default RoutesHuyDichVu;
