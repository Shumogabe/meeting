import React, { useEffect, useState } from "react";
import { HREF } from "../../constants/dictionaries";
import "./css.css";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const XemTaiLieu = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  document.title = "Xem tài liệu";
  const filePath = window.location.search.split("&")[0].replace("?uri=", "");
  const fileType = window.location.search.split("&")[1].replace("type=", "");
  const fileName = window.location.search
    .split("&")[2]
    .replace("fileName=", "");
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClick = () => {
    alert("Bạn không thể xem tài liệu!");
    window.location.href = HREF.LichCongTac;
  };

  const fetchPDF = async () => {
    try {
      const response = await fetch(filePath);
      if (response.ok) {
        setHasError(false);
      }
      if (!response.ok) {
        setHasError(true);
        setErrorMsg("Bạn không thể xem tài liệu!");
      }
    } catch (error) {
      return handleClick();
    }
  };

  useEffect(() => {
    if (
      window.location.pathname.startsWith(HREF.XemTaiLieu) &&
      window.location.search.includes("?uri=") &&
      window.location.search.includes("&type=")
    ) {
      fetchPDF();
    } else {
      setHasError(true);
      window.location.href = HREF.TrangChu;
    }
  }, []);

  return (
    <>
      {hasError === true ? (
        <div className="error-message">
          <p>{errorMsg}</p>
        </div>
      ) : (
        <>
          <div style={{ width: window.innerWidth, height: window.innerHeight }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.js">
              <Viewer
                fileUrl={filePath}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </>
      )}
    </>
  );
};
export default XemTaiLieu;
