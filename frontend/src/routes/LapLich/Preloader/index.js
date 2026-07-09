import React from "react";
import { HREF } from "../../../constants/dictionaries";
import { Theme } from "../../../theme";

export default function Preloader() {
  return (
    <div className="preloader flex-column justify-content-center align-items-center">
      <img
        className="animation__shake"
        src={
          window.location.pathname.includes(HREF.PheDuyet + "/")
            ? "/static/" + Theme.theme().href + "/img/QuocHuy.png"
            : "./static/" + Theme.theme().href + "/img/QuocHuy.png"
        }
        alt="MAE - BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG"
        height={60}
        width={60}
      />
    </div>
  );
}
