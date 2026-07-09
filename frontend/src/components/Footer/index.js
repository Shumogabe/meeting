import React from "react";

const mainFooterStyle = {
  color: "#869099",
  fontSize: "16px",
  height: "48px",
  lineHeight: "30px",
};
const tagAStyle = {
  color: "#333333",
};

export default function Footer() {
  return (
    // <div>
    //   © 2023 - Phát triển bởi Trung tâm Cơ sở hạ tầng và Bảo đảm an toàn thông
    //   tin CIIS. Phiên bản 1.0
    // </div>
    <footer id="main-footer" className="main-footer" style={mainFooterStyle}>
      <strong>
        © 2023 - Phát triển bởi Trung tâm Cơ sở hạ tầng và Bảo đảm an toàn thông
        tin{" "}
        <a href="https://ciis.vn" style={tagAStyle}>
          CIIS
        </a>
        . Phiên bản
      </strong>{" "}
      1.0
      <div className="float-right d-none d-sm-inline-block"></div>
    </footer>
  );
}
