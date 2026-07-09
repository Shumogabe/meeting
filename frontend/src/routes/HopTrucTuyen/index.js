import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { LANGUAGE_EN } from "../../components/Language/en_us";
import { LANGUAGE_VI } from "../../components/Language/vi_vn";
import { CheckUser, HandleLogout } from "../../components/Modal";
import { SESSION_STORAGE } from "../../config";
import Helper from "../../helper/helper";
import { Theme } from "../../theme";
import ContentWrapper from "./ContentWrapper";
import ControlSidebar from "./ControlSidebar";
import Footer from "./Footer";
import Preloader from "./Preloader";
import Sidebar from "./Sidebar";
import userManager from "../../services/auth";
import Navbar from "../LapLich/Navbar";

export default function Index({ permissions, user, setUser }) {
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(false);
  const [roomMini, setRoomMini] = useState(false);
  const [scheduleSidebar, setScheduleSideBar] = useState({
    schedule: null,
    participants: [], //api.getParticipantsInfo();
    numberOfParticipants: 0, //api.getNumberOfParticipants();
  });
  const [displayJoinName, setDisplayJoinName] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  //
  const [online, setOnline] = useState(false);
  //
  const onCloseModal = () => {
    setOpenAdd(false);
  };
  useEffect(() => {
    document.body.classList.add(
      "hold-transition",
      "sidebar-mini",
      "layout-fixed",
      "sidebar-collapse",
    );

    return () => {
      document.body.classList.remove(
        "hold-transition",
        "sidebar-mini",
        "layout-fixed",
        "sidebar-collapse",
      );
    };
  });
  useEffect(() => {
    document.title = "Phòng họp trực tuyến";
    if (document.getElementById("main-header")) {
      document.getElementById("main-header").style.display =
        window.innerWidth < 1023 ? "" : "none";
    }
    if (document.getElementById("main-footer")) {
      document.getElementById("main-footer").style.display = "none";
    }
    if (document.getElementById("control-sidebar-dark")) {
      document.getElementById("control-sidebar-dark").style.display = "none";
    }
    CheckUser().then((user) => {
      if (!Helper.isNullOrUndefined(user) && displayJoinName === false) {
        // document.getElementById("main-header").style.display = "none";
        if (document.getElementById("main-sidebar")) {
          document.getElementById("main-sidebar").style.display = "";
        }
        if (document.getElementById("main-footer")) {
          document.getElementById("main-footer").style.display = "";
        }
        if (document.getElementById("control-sidebar-dark")) {
          document.getElementById("control-sidebar-dark").style.display = "";
        }
        sessionStorage.setItem("fullname", user?.fullName);
        sessionStorage.setItem("position", user?.position?.title);
      } else if (
        Helper.isNullOrUndefined(user) &&
        !Helper.isNullOrUndefined(localStorage.getItem("user")) &&
        displayJoinName === false
      ) {
        // document.getElementById("main-header").style.display = "none";
        if (document.getElementById("main-sidebar")) {
          document.getElementById("main-sidebar").style.display = "";
        }
        if (document.getElementById("main-footer")) {
          document.getElementById("main-footer").style.display = "";
        }
        if (document.getElementById("control-sidebar-dark")) {
          document.getElementById("control-sidebar-dark").style.display = "";
        }
      }
    });
    if (window.innerWidth < 600) {
      // document.getElementById("main-header").style.display = "none";
      if (document.getElementById("main-sidebar")) {
        document.getElementById("main-sidebar").style.display = "none";
      }
      if (document.getElementById("main-footer")) {
        document.getElementById("main-footer").style.display = "";
      }
    }
  }, [displayJoinName]);

  useEffect(() => {
    // return alert(sessionStorage.getItem(SESSION_STORAGE));
    // return alert(123);
    if (
      !Helper.isNullOrUndefined(sessionStorage.getItem("thamgiatructuyen")) &&
      sessionStorage.getItem("thamgiatructuyen") === "true"
    ) {
      setOnline(true);
    }
    if (!Helper.isNullOrUndefined(sessionStorage.getItem(SESSION_STORAGE))) {
      // CheckUser().then((user) => {
      //   if (Helper.isNullOrUndefined(user)) {
      //     sessionStorage.clear();
      //     localStorage.clear();
      //     HandleLogout("login");
      //   } else {
      //   }
      // });
      var res = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
      if (
        !Helper.isNullOrUndefined(res) &&
        Number(res?.expires_at) -
          Number(Math.round(new Date().getTime() / 1000)) -
          1000 <
          0
      ) {
        let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
        sessionStorage.clear();
        sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
        // localStorage.clear();
        HandleLogout("login");
      }
    }
  }, []);

  return (
    <>
      <div className="wrapper" style={{ overflow: "hidden", width: "100%" }}>
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
          openAdd={openAdd}
          onCloseModal={onCloseModal}
          setOpenAdd={setOpenAdd}
          permissions={permissions}
          user={user}
          setUser={setUser}
        />
        {/* /.navbar */}
        {/* Main Sidebar Container */}
        <Sidebar
          scheduleSidebar={scheduleSidebar}
          setRoomMini={setRoomMini}
          loading={loading}
          permissions={permissions}
          user={user}
          setUser={setUser}
          online={online}
          setOnline={setOnline}
        />
        {/* Content Wrapper. Contains page content */}
        <ContentWrapper
          scheduleSidebar={scheduleSidebar}
          setScheduleSideBar={setScheduleSideBar}
          roomMini={roomMini}
          setLoading={setLoading}
          displayJoinName={displayJoinName}
          setDisplayJoinName={setDisplayJoinName}
          permissions={permissions}
          user={user}
          setUser={setUser}
          online={online}
          setOnline={setOnline}
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
        <script src="/static/js/script_hoptructuyen1.js"></script>
        <script src="/static/js/script_hoptructuyen2.js"></script>
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
    </>
  );
}
