import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { LANGUAGE_EN } from "../../components/Language/en_us";
import { LANGUAGE_VI } from "../../components/Language/vi_vn";
import ContentWrapper from "./ContentWrapper";
import ControlSidebar from "./ControlSidebar";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Preloader from "./Preloader";
import Sidebar from "./Sidebar";
let user;
export default function Index({ permissions, user, setUser }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [title, setTitle] = useState("Quản lý họp trực tuyến");
  const [openAdd, setOpenAdd] = useState(false);
  const onCloseModal = () => {
    setOpenAdd(false);
  };
  useEffect(() => {
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
  });
  useEffect(() => {
    // CheckUser().then((user) => {
    //   if (Helper.isNullOrUndefined(user)) {
    //     sessionStorage.clear();
    //     localStorage.clear();
    //     HandleLogout("login");
    //   } else {
    //     user = user?.fullName ? user?.fullName : "";
    //   }
    // });
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
          setOpenAdd={setOpenAdd}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
        {/* /.navbar */}
        {/* Main Sidebar Container */}
        <Sidebar
          usr={user}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
        {/* Content Wrapper. Contains page content */}
        <ContentWrapper
          title={title}
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
          onCloseModal={onCloseModal}
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
        <script src="./static/js/script_lichhop.js"></script>
      </Helmet>
    </>
  );
}
