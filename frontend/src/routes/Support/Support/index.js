import React, { useState } from "react";
import moment from "moment";
import Api from "../../../api";
import {
  SwalAlertAllConfiguration,
  SwalDismissReasonTimer,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { HREF } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";
import { Theme } from "../../../theme";
import "./css.css";
import { Button, Input, Space } from "antd";
let timerInterval;

export default function Support({
  language,
  permissions,
  user,
  setUser,
  setLoading,
}) {
  const [roomName, setRoomName] = useState("");
  const onSubmit = () => {
    if (Helper.isNullOrUndefined(roomName))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập câu hỏi",
        timer: 3000,
      });
    else {
      setLoading(true);
      new Api()
        .create_meeting_Support({ data: { NoiDung: roomName } })
        .then((response) => {
          if (!Helper.isNullOrUndefined(response?.data)) {
            setLoading(false);
            return SwalAlertAllConfiguration({
              title: "Thông báo!",
              text: "Gửi thành công!",
              icon: "success",
              // timer: 3000,
            });
          } else {
            setLoading(false);
            return SwalAlertAllConfiguration({
              title: "Gửi không thành công!",
              icon: "warning",
              timer: 3000,
            });
          }
        });
    }
  };
  return (
    <>
      <div
        className="section create-room-area"
        style={{
          position: "fixed",
          top: "0",
          bottom: "0",
          width: "100%",
        }}
      >
        <div
          className="container"
          style={{
            position: "fixed",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="row">
            <div
              className="col-md-5"
              style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div className="row">
                <div className="col-md-12">
                  <p className="section-heading" style={{ fontSize: "20px" }}>
                    {/* Họp trực tuyến */}
                    {language?.SUPPORT?.TITLE}
                  </p>
                  <i>{language?.SUPPORT?.SUB}</i>
                </div>
                <div className="col-md-12">
                  <div
                    className="col-md-12"
                    style={{ padding: "0", maxWidth: "100%" }}
                  >
                    <div className="input-group input-group-sm">
                      <Space.Compact
                        style={{
                          width: "100%",
                        }}
                      >
                        <Input
                          size="large"
                          placeholder="Viết câu hỏi của bạn tại đây"
                          value={roomName}
                          onChange={(e) => {
                            setRoomName(e.target.value);
                          }}
                        />
                        <Button
                          size="large"
                          disabled={Helper.isNullOrUndefined(roomName)}
                          onClick={() => onSubmit()}
                          style={{
                            color: Theme.theme().css.color.color,
                            background: Theme.theme().css.background.button,
                          }}
                        >
                          <i className="fas fa-paper-plane"></i>{" "}
                          {/* THAM GIA */}
                          {language?.SUPPORT?.BTNSUBMIT}
                        </Button>
                      </Space.Compact>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <p className="section-heading" style={{ fontSize: "20px" }}>
                    {/* Họp trực tuyến */}
                    {language?.SUPPORT?.SLOGAN}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-md-7"
              style={{ paddingTop: window.innerWidth <= 992 && "20px" }}
            >
              <img
                // src={"./static/" + Theme.theme().href + "/img/btnmt1.jpg"}
                src={"./static/" + Theme.theme().href + "/img/btnmt1.jpg"}
                className="meeting-intro"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
