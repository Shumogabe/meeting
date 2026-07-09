import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CallbackComponent } from "redux-oidc";
import { APP_ADMIN_URI, SESSION_STORAGE } from "../../config";
import userManager from "../../services/auth";
import { HREF } from "../../constants/dictionaries";
import Api from "../../api";

export default function Callback(props) {
  const [auth, setAuth] = useState();
  const [newpermissions, setNewpermissions] = useState([]);
  const navigate = useNavigate();

  const successCallback = () => {
    // navigate(HREF.LichHop);
    return new Api()
      .log_ql_dangnhap({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        data: {
          ten_ung_dung: window.location.hostname,
          trangthai_dangnhap: "Thành công",
          da_xoa: false,
        },
      })
      .then(() => {
        window.location.href = HREF.LichHop;
      });
  };

  const errorCallback = (err) => {
    console.error("callback", err);
    // return new Api()
    //   .log_ql_dangnhap({
    //     token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
    //       ?.access_token,
    //     data: {
    //       ten_ung_dung: window.location.hostname,
    //       trangthai_dangnhap: "Thất bại",
    //       da_xoa: false,
    //     },
    //   })
    //   .then(() => {
    //     console.error("callback", err);
    //     // window.location.href =(HREF.LichHop);
    //   });
    // navigate(HREF.TrangChu);
    // window.location.href =(HREF.LichHop);
  };
  return (
    <CallbackComponent
      userManager={userManager}
      successCallback={successCallback}
      errorCallback={errorCallback}
    >
      <div>Redirecting...</div>
    </CallbackComponent>
  );
}
