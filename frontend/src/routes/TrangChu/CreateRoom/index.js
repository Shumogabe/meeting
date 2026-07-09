import React, { useState } from "react";
import { CheckUser, HandleCreateRoom } from "../../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalDismissReasonTimer,
  SwalGetPopup,
  SwalGetTimerLeft,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import { Theme } from "../../../theme";
import "./css.css";
import Api from "../../../api";
import moment from "moment";
import { Button, Input, Space } from "antd";
import { isValidUUID } from "../../../helper/url";
let timerInterval;
export default function CreateRoom({
  language,
  permissions,
  user,
  setUser,
  setLoading,
}) {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const onLogin = () => {
    if (Helper.isNullOrUndefined(roomName))
      return SwalAlertAllConfiguration({
        icon: "warning",
        title: "Chưa nhập ID/URL phòng họp",
        timer: 3000,
      });
    else {
      setLoading(true);
      if (isValidUUID(roomName)) {
        new Api().get_schedule_byId({ id: roomName }).then((response) => {
          if (!Helper.isNullOrUndefined(response?.data?.id)) {
            if (
              moment(response?.data?.endTime).valueOf() < moment().valueOf() ||
              response?.data?.status === 3
            ) {
              setLoading(false);
              return SwalAlertAllConfiguration({
                title: "Thông báo!",
                text: "Phòng họp đã kết thúc!",
                icon: "warning",
                timer: 3000,
              });
            } else if (response?.data?.status === 1) {
              setLoading(false);
              return SwalAlertAllConfiguration({
                icon: "warning",
                title: "Phòng họp chưa được phê duyệt!",
                timer: 3000,
              });
            } else if (!response?.data?.start) {
              setLoading(false);
              return SwalAlertAllConfiguration({
                icon: "warning",
                title: "Phòng họp chưa được bắt đầu!",
                timer: 3000,
              });
            } else {
              sessionStorage.setItem("thamgiatructuyen", "true");
              SwalAlertAllConfiguration({
                toast: true,
                title: "Thông báo",
                html: `Vui lòng chờ sau <b id="time-waiting-to-join-room"></b> giây`,
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                didOpen: () => {
                  SwalIsLoading();
                  const timer = SwalGetPopup().querySelector(
                    "b#time-waiting-to-join-room"
                  );
                  timerInterval = setInterval(() => {
                    timer.textContent = `${SwalGetTimerLeft()}`;
                  }, 100);
                },
                willClose: () => {
                  clearInterval(timerInterval);
                },
              }).then((resultChild) => {
                /* Read more about handling dismissals below */
                // setTimeout(function () {
                //   //code goes here
                //   window.location.href =(
                //     HREF.HopTrucTuyen + "/" + result?.value
                //   );
                // }, 3000);
                if (resultChild.dismiss === SwalDismissReasonTimer()) {
                  // console.log("I was closed by the timer");
                  window.location.href = HREF.HopTrucTuyen + "/" + roomName;
                }
              });
              // return alert(3);
            }
          } else {
            setLoading(false);
            return SwalAlertAllConfiguration({
              title: "Phòng họp không tồn tại!",
              icon: "warning",
              timer: 3000,
            });
          }
        });
      } else if (roomName?.includes(HREF?.HopTrucTuyen)) {
        sessionStorage.setItem("thamgiatructuyen", "true");
        window.location.href = roomName;
      } else {
        new Api()
          .get_schedule_byRoomName({ room: roomName })
          .then((response) => {
            if (!Helper.isNullOrUndefined(response?.data?.id)) {
              if (
                moment(response?.data?.endTime).valueOf() <
                  moment().valueOf() ||
                response?.data?.status === 3
              ) {
                setLoading(false);
                return SwalAlertAllConfiguration({
                  title: "Thông báo!",
                  text: "Phòng họp đã kết thúc!",
                  icon: "warning",
                  timer: 3000,
                });
              } else if (response?.data?.status === 1) {
                setLoading(false);
                return SwalAlertAllConfiguration({
                  icon: "warning",
                  title: "Phòng họp chưa được phê duyệt!",
                  timer: 3000,
                });
              } else if (!response?.data?.start) {
                setLoading(false);
                return SwalAlertAllConfiguration({
                  icon: "warning",
                  title: "Phòng họp chưa được bắt đầu!",
                  timer: 3000,
                });
              } else {
                sessionStorage.setItem("thamgiatructuyen", "true");
                SwalAlertAllConfiguration({
                  toast: true,
                  title: "Thông báo",
                  html: `Vui lòng chờ sau <b id="time-waiting-to-join-room"></b> giây`,
                  icon: "success",
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                  didOpen: () => {
                    SwalIsLoading();
                    const timer = SwalGetPopup().querySelector(
                      "b#time-waiting-to-join-room"
                    );
                    timerInterval = setInterval(() => {
                      timer.textContent = `${SwalGetTimerLeft()}`;
                    }, 100);
                  },
                  willClose: () => {
                    clearInterval(timerInterval);
                  },
                }).then((resultChild) => {
                  /* Read more about handling dismissals below */
                  // setTimeout(function () {
                  //   //code goes here
                  //   window.location.href =(
                  //     HREF.HopTrucTuyen + "/" + result?.value
                  //   );
                  // }, 3000);
                  if (resultChild.dismiss === SwalDismissReasonTimer()) {
                    // console.log("I was closed by the timer");
                    window.location.href = HREF.HopTrucTuyen + "/" + roomName;
                  }
                });
                // return alert(3);
              }
            } else {
              setLoading(false);
              return SwalAlertAllConfiguration({
                title: "Phòng họp không tồn tại!",
                icon: "warning",
                timer: 3000,
              });
            }
          });
      }
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
                    {language?.CREATEROOM?.SECTIONHEADING}
                  </p>
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
                          placeholder="Nhập ID/URL phòng họp"
                          value={roomName}
                          onChange={(e) => {
                            setRoomName(e.target.value);
                          }}
                        />
                        <Button
                          size="large"
                          disabled={Helper.isNullOrUndefined(roomName)}
                          onClick={() => onLogin()}
                          style={{
                            color: Theme.theme().css.color.color,
                            background: Theme.theme().css.background.button,
                          }}
                        >
                          <i className="fas fa-video" /> {/* THAM GIA */}
                          {language?.JOINROOM?.BTNJOIN}
                        </Button>
                      </Space.Compact>
                      {/* <Input
                        size="large"
                        id="input-join-room-area"
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên phòng họp"
                        style={{ zIndex: 1 }}
                        value={roomName}
                        onChange={(e) => {
                          setRoomName(e.target.value);
                        }}
                      />
                      <span className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-orange btn-flat"
                          disabled={Helper.isNullOrUndefined(roomName)}
                          onClick={() => onLogin()}
                          style={{ borderRadius: "0 5px 5px 0" }}
                        >
                          <i className="fas fa-video" /> 
                          {language?.JOINROOM?.BTNJOIN}
                        </button>
                      </span> */}
                    </div>
                  </div>
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
