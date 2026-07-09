import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { LANGUAGE_EN } from "../../components/Language/en_us";
import { LANGUAGE_VI } from "../../components/Language/vi_vn";
import { CheckUser, HandleLogout } from "../../components/Modal";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";
import ControlSidebar from "../LapLich/ControlSidebar";
import Footer from "../LapLich/Footer";
import Navbar from "../LapLich/Navbar";
import Preloader from "../LapLich/Preloader";
import MainSidebar from "../LapLich/Sidebar";
import ContentWrapper from "./ContentWrapper";
import Api from "../../api";

let user;

const RoutesBaoCaoThongKe = [
  { path: "", element: ({ ...props }) => <BaoCaoThongKe {...props} /> },
  {
    path: HREF.QuanLyBaoCaoThongKeHoiNghiHoiThao.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyBaoCaoDinhKy.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyBaoCaoThongKeDiemDiemCau.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyBaoCaoTongHop.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeTongSoCuocHopDangDienRa.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeTongSoCuocHopTrenTungMayChu.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeSoCuocHopTheoLichSuTrenTongTheHeThong.replace(
      "/",
      ""
    ),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeSoCuocHopTheoLichSuTrenTungMayChu.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeTongSoNguoiThamGiaCuocHopDangDienRa.replace(
      "/",
      ""
    ),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeTongSoSoNguoiThamGiaCuocHopTheoLichSu.replace(
      "/",
      ""
    ),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeSoNguoiThamGiaTrongMotCuocHop.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTai.replace(
      "/",
      ""
    ),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeTaiLieuHopCacCuocHop.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeGhiHinhCuocHop.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeBieuQuyetCuocHop.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  {
    path: HREF.QuanLyThongKeKetLuanCuocHop.replace("/", ""),
    element: ({ ...props }) => <BaoCaoThongKe {...props} />,
  },
  { path: "cap-nhat", element: ({ ...props }) => <BaoCaoThongKe {...props} /> },
  { path: "chi-tiet", element: ({ ...props }) => <BaoCaoThongKe {...props} /> },
];

function BaoCaoThongKe({ permissions, user, setUser }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [title, setTitle] = useState("Báo cáo, thống kê");
  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.classList.add(
        "hold-transition",
        "sidebar-mini",
        "layout-fixed",
        "sidebar-collapse"
      );

      return () => {
        document.body.classList.remove(
          "hold-transition",
          "sidebar-mini",
          "layout-fixed",
          "sidebar-collapse"
        );
      };
    } else {
      document.body.classList.add(
        "hold-transition",
        "sidebar-mini",
        "layout-fixed"
      );

      return () => {
        document.body.classList.remove(
          "hold-transition",
          "sidebar-mini",
          "layout-fixed"
        );
      };
    }
  });
  useEffect(() => {
    // CheckUser().then((user) => {
    //   if (Helper.isNullOrUndefined(user)) {
    //   } else {
    //     user = user?.fullName ? user?.fullName : "";

    //   }
    // });
    new Api()
      .LayRaThietLapCauHinh(
        "tl_ch_baocaothongke",
        "ChoPhepCacDonViThongKeLichHop"
      )
      .then((res) => {
        if (res.code === 200) {
          if (res?.data?.giatri === "0") {
            window.location.href = HREF.LichHop;
          }
        }
      });
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <>
      <div className="wrapper">
        {/* Preloader */}
        <Preloader />
        {/* Navbar */}
        <Navbar
          language={
            lang === "vi"
              ? LANGUAGE_VI
              : lang === "en"
              ? LANGUAGE_EN
              : LANGUAGE_VI
          }
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
        {/* /.navbar */}
        {/* Main Sidebar Container */}
        <MainSidebar
          usr={user}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
        {/* Content Wrapper. Contains page content */}
        <ContentWrapper
          title={title}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
        {/* /.content-wrapper */}
        <Footer
          language={
            lang === "vi"
              ? LANGUAGE_VI
              : lang === "en"
              ? LANGUAGE_EN
              : LANGUAGE_VI
          }
        />
        {/* Control Sidebar */}
        <ControlSidebar />
        {/* /.control-sidebar */}
      </div>
      <Helmet>
        <script src="./static/js/script_baocaothongke.js"></script>
      </Helmet>
    </>
  );
}

export default RoutesBaoCaoThongKe;
