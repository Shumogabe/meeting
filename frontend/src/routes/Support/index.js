import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Helmet } from "react-helmet";
import { LANGUAGE_EN } from "../../components/Language/en_us";
import { LANGUAGE_VI } from "../../components/Language/vi_vn";
import CreateRoom from "./CreateRoom";
import Feature from "./Feature";
import Footer from "./Footer";
import JoinRoom from "./JoinRoom";
import Navbar from "./Navbar";
import News from "./News";
import Preloader from "./Preloader/Preloader";
import Support from "./Support";
import "./css.css";
export default function Index({ permissions, user, setUser }) {
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
  const [lang, setLang] = useState(localStorage.getItem("lang"));
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="portal">
        <Spin spinning={loading} tip="Vui lòng chờ trong giây lát...">
          <Preloader />
          <Navbar
            setLang={setLang}
            lang={lang}
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
          <CreateRoom
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                  ? LANGUAGE_EN
                  : LANGUAGE_VI
            }
            setLoading={setLoading}
            permissions={permissions}
            user={user}
            setUser={setUser}
          />
          {/* <JoinRoom
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                ? LANGUAGE_EN
                : LANGUAGE_VI
            }
            setLoading={setLoading}
          /> */}
          {/* <Feature
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                ? LANGUAGE_EN
                : LANGUAGE_VI
            }
          /> */}
          {/* <News
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                ? LANGUAGE_EN
                : LANGUAGE_VI
            }
          /> */}
          {/* <Partner
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                ? LANGUAGE_EN
                : LANGUAGE_VI
            }
          /> */}
          <Support
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                  ? LANGUAGE_EN
                  : LANGUAGE_VI
            }
            setLoading={setLoading}
            permissions={permissions}
            user={user}
            setUser={setUser}
          />
          <Footer
            language={
              lang === "vi"
                ? LANGUAGE_VI
                : lang === "en"
                  ? LANGUAGE_EN
                  : LANGUAGE_VI
            }
          />
        </Spin>
      </div>
      <Helmet>
        <script src="./static/js/year_footer.js"></script>
        {/* <script src="./static/js/slide.js"></script> */}
        {/* <script src="./static/js/animation_join_room_area.js"></script> */}
        {/* <script src="./static/js/animation_support_area.js"></script> */}
        <script src="./static/js/aos.js"></script>
      </Helmet>
    </>
  );
}
