import React from "react";
import { Theme } from "../../../theme";

export default function Preloader() {
  return (
    <div className="preloader flex-column justify-content-center align-items-center">
      <img
        className="animation__shake"
        src={"/static/" + Theme.theme().href + "/img/QuocHuy.png"}
        alt="CIIS - TRUNG TÂM HẠ TẦNG SỐ"
        height={60}
        width={60}
      />
    </div>
  );
}
