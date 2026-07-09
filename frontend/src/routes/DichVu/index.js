import React, { useEffect, useState } from "react";
import { LANGUAGE_EN } from "../../components/Language/en_us";
import { LANGUAGE_VI } from "../../components/Language/vi_vn";
import ControlSidebar from "../LapLich/ControlSidebar";
import Footer from "../LapLich/Footer";
import Navbar from "../LapLich/Navbar";
import Preloader from "../LapLich/Preloader";
import MainSidebar from "../LapLich/Sidebar";
import ContentWrapper from "./ContentWrapper";
let user;
export default function DichVu({
  script,
  breadcrumb,
  loaiDichVu,
  permissions,
  user,
  setUser,
}) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [title, setTitle] = useState(breadcrumb);
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
          breadcrumb={breadcrumb}
          loaiDichVu={loaiDichVu}
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
      {script}
    </>
  );
}
