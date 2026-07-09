import React from "react";
import { Theme } from "../../../theme";

export default function Partner({ language }) {
  return (
    <>
      <div
        className="section partner-area"
        data-aos="zoom-in"
        data-aos-duration="1500"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12 section-heading">
                  {/* Đối tác */}
                  {language?.PARTNER?.SECTIONHEADING}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <section className="carousel-slider d-flex">
                <div>
                  <img
                    src={
                      "./static/" +
                      Theme.theme().href +
                      "/img/partner-lacviet-icon.png"
                    }
                  />
                </div>
                <div>
                  <img
                    src={
                      "./static/" +
                      Theme.theme().href +
                      "/img/partner-vnpt-icon.png"
                    }
                  />
                </div>
                <div>
                  <img
                    src={
                      "./static/" +
                      Theme.theme().href +
                      "/img/partner-ektech-icon.png"
                    }
                  />
                </div>
                {/* <div>
              <img src />
            </div> */}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
