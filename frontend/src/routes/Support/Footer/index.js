import React from "react";
import { Theme } from "../../../theme";

export default function Footer({ language }) {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row">
            {/* <div className="col-md-7">
              <p className="contact-info-title">
                <img
                  className="site-logo"
                  src={"./static/" + Theme.theme().href + "/img/QuocHuy.png"}
                />
                <span className="site-name">
                  {language?.FOOTER?.SITE_NAME}
                </span>
                <br />
                <span className="site-slogan">
                  {language?.FOOTER?.SITE_SLOGAN}
                </span>
              </p>
            </div> */}
            <div className="col-md-7">
              © {new Date().getFullYear()} - {language?.FOOTER?.COPYRIGHT}
            </div>
            <div className="col-md-5">
              <div className="contac-info">
                <p>
                  <img
                    className="icon"
                    src={
                      "./static/" +
                      Theme.theme().href +
                      "/img/position-icon.png"
                    }
                  />{" "}
                  {/* Số 28, Phạm Văn Đồng, P.Dịch Vọng Hậu, Q.Cầu Giấy, TP.Hà Nội */}
                  {language?.FOOTER?.ADDRESS}
                </p>
                <p>
                  <img
                    className="icon"
                    src={
                      "./static/" + Theme.theme().href + "/img/phone-icon.png"
                    }
                  />{" "}
                  {language?.FOOTER?.PHONE}
                </p>
                <p>
                  <img
                    className="icon"
                    src={
                      "./static/" + Theme.theme().href + "/img/mail-icon.png"
                    }
                  />{" "}
                  {/* citis@monre.gov.vn */}
                  {/* {language?.FOOTER?.MAIL} */}
                  hatangso@mae.gov.vn
                </p>
              </div>
            </div>
          </div>
          <div className="row d-none">
            <div className="col-md-12 copyright align-center">
              © <span id="year" /> - {language?.FOOTER?.COPYRIGHT}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
