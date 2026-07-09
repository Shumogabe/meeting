import React from "react";

export default function Footer({ language }) {
  return (
    <footer id="main-footer" className="main-footer">
      <strong>&copy; {new Date().getFullYear()}</strong> -{" "}
      {language?.FOOTER?.COPYRIGHT}
    </footer>
  );
}
