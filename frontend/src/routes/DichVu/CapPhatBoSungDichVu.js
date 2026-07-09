import React from "react";
import DichVu from ".";
import { Helmet } from "react-helmet";

const RoutesCapPhatBoSungDichVu = [
  { path: "", element: ({ ...props }) => <CapPhatBoSungDichVu {...props} /> },
  {
    path: "cap-nhat",
    element: ({ ...props }) => <CapPhatBoSungDichVu {...props} />,
  },
  {
    path: "chi-tiet",
    element: ({ ...props }) => <CapPhatBoSungDichVu {...props} />,
  },
];

function CapPhatBoSungDichVu({ permissions, user, setUser }) {
  return (
    <DichVu
      script={
        <Helmet>
          <script src="./static/js/script_capphatbosungdichvu.js"></script>
        </Helmet>
      }
      breadcrumb={"Cấp phát bổ sung dịch vụ"}
      loaiDichVu={"DangKyCapPhatBoSungDichVu"}
      permissions={permissions}
      user={user}
      setUser={setUser}
    />
  );
}

export default RoutesCapPhatBoSungDichVu;
