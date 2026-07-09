import React from "react";

export default function Footer({ language }) {
  return (
    <footer
      id="main-footer"
      className="main-footer"
      style={{
        height: "0px",
        lineHeight: "0px",
        width: "100%",
        fontSize: "10px",
      }}
    >
      <strong>&copy; {new Date().getFullYear()}</strong> -{" "}
      {language?.FOOTER?.COPYRIGHT}
    </footer>
  );
}
