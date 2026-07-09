import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { LANGUAGE_EN } from "../../components/Language/en_us";
import { LANGUAGE_VI } from "../../components/Language/vi_vn";
import { HREF } from "../../constants/dictionaries";
import { Theme } from "../../theme";
import ControlSidebar from "../LapLich/ControlSidebar";
import Footer from "../LapLich/Footer";
import Navbar from "../LapLich/Navbar";
import Preloader from "../LapLich/Preloader";
import MainSidebar from "../LapLich/Sidebar";
import ContentWrapper from "./ContentWrapper";
import { FUNC_PERMISSION } from "../../helper/authorize";
import Helper from "../../helper/helper";

let user;

const RoutesPheDuyet = [
  { path: "", element: ({ ...props }) => <PheDuyet {...props} /> },
  // { path: HREF.KeHoachHop.replace("/", ""), element: <PheDuyet /> },
  // { path: HREF.LichHop.replace("/", ""), element: <PheDuyet /> },
  // { path: HREF.DANG_KY_CAP_DICH_VU.replace("/", ""), element: <PheDuyet /> },
  // { path: HREF.DANG_KY_DOI_DICH_VU.replace("/", ""), element: <PheDuyet /> },
  // { path: HREF.DANG_KY_DOI_DICH_VU.replace("/", ""), element: <PheDuyet /> },
  { path: "chi-tiet", element: ({ ...props }) => <PheDuyet {...props} /> },
];

function PheDuyet({ permissions, user, setUser }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [title, setTitle] = useState("Phê duyệt");
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
          setTitle={setTitle}
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
      {window.location.pathname.includes(HREF.PheDuyet + "/") ? (
        <Helmet>
          <script src="/static/js/script_xetduyet.js"></script>
          <link
            rel="shortcut icon"
            href={"/static/" + Theme.theme().href + "/img/QuocHuy.png"}
          />
          <link
            rel="apple-touch-icon"
            href={"/static/" + Theme.theme().href + "/img/QuocHuy.png"}
          />
          <link
            rel="stylesheet"
            href={"/static/" + Theme.theme().href + "/css/style.css"}
          />
        </Helmet>
      ) : (
        <Helmet>
          <script src="./static/js/script_xetduyet.js"></script>
        </Helmet>
      )}
    </>
  );
}

export default RoutesPheDuyet;
