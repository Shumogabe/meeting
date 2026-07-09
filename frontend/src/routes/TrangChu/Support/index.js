import React from "react";
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
let timerInterval;

export default function Support({ language }) {
  return (
    <>
      {/* <div className="section support-area">
        <div className="container">
          <p className="title">Hãy bắt đầu cuộc họp của bản</p>
          <p className="slogan">
            Liên hệ với chúng tôi nếu bạn có thắc mắc cần giải đáp
          </p>
          <p>
            <a href="#" className="btn btn-orange">
              <i className="fas fa-video" /> THAM GIA
            </a>{" "}
            <a href="#" className="btn btn-contact">
              LIÊN HỆ
            </a>{" "}
          </p>
        </div>
      </div> */}
      <div className="section support-area">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="title">
                {/* Hãy bắt đầu cuộc họp của bản */}
                {language?.SUPPORT?.TITLE}
              </p>
              <p className="slogan">
                {/* Liên hệ với chúng tôi nếu bạn có thắc mắc cần giải đáp */}
                {language?.SUPPORT?.SLOGAN}
              </p>
              <p>
                <a
                  href
                  className="btn btn-orange"
                  onClick={() => {
                    SwalAlertAllConfiguration({
                      title: "Tham gia phòng họp",
                      html: "Nhập tên phòng họp",
                      footer: `<b><i class="text-danger">
                    Tên phòng họp không được chứ các kí tự khoảng trắng, dấu câu và kí tự đặc biệt
                  </i></b>`,
                      input: "text",
                      inputAttributes: {
                        autocapitalize: "off",
                      },
                      showCancelButton: true,
                      confirmButtonText: "Tham gia",
                      cancelButtonText: "Thoát",
                      showLoaderOnConfirm: true,
                      preConfirm: async (login) => {
                        try {
                          if (Helper.isNullOrUndefined(login))
                            return SwalShowValidationMessage(
                              "Tên phòng họp không được để trống"
                            );
                          else {
                            return new Api()
                              .get_schedule_byRoomName({ room: login })
                              .then((response) => {
                                if (
                                  response &&
                                  !Helper.isNullOrUndefined(response?.data?.id)
                                ) {
                                  if (response?.data?.status === 1) {
                                    SwalShowValidationMessage(
                                      "Phòng họp chưa được phê duyệt!"
                                    );
                                  } else if (
                                    moment(response?.data?.endTime).valueOf() <
                                      moment().valueOf() ||
                                    response?.data?.status === 3
                                  ) {
                                    SwalShowValidationMessage(
                                      "Phòng họp đã kết thúc!"
                                    );
                                  } else if (!response?.data?.start) {
                                    SwalShowValidationMessage(
                                      "Phòng họp chưa được bắt đầu!"
                                    );
                                  } else {
                                    return login;
                                  }
                                } else {
                                  SwalShowValidationMessage(
                                    "Phòng họp không tồn tại!"
                                  );
                                }
                              });
                          }
                        } catch (error) {
                          SwalShowValidationMessage(`Request failed: ${error}`);
                        }
                      },
                      allowOutsideClick: () => !SwalIsLoading(),
                    }).then((result) => {
                      if (result.isConfirmed) {
                        SwalAlertAllConfiguration({
                          toast: true,
                          title: "Thông báo",
                          text: result?.value?.message
                            ? result?.value?.message
                            : "Tạo thành công!",
                          footer: `Vui lòng chờ sau <b></b> giây`,
                          icon: "success",
                          timer: 2000,
                          timerProgressBar: true,
                          showConfirmButton: false,
                          didOpen: () => {
                            SwalIsLoading();
                            const timer = SwalGetPopup().querySelector("b");
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
                          if (
                            resultChild.dismiss === SwalDismissReasonTimer()
                          ) {
                            // console.log("I was closed by the timer");
                            window.location.href =
                              HREF.HopTrucTuyen + "/" + result?.value;
                          }
                        });
                      }
                    });
                  }}
                >
                  <i className="fas fa-video" /> {/* THAM GIA */}
                  {language?.SUPPORT?.BTNJOIN}
                </a>{" "}
                <a
                  href={Theme.theme().link_contact}
                  className="btn btn-contact"
                >
                  {/* LIÊN HỆ */}
                  {language?.SUPPORT?.BTNCONTACT}
                </a>{" "}
              </p>
            </div>
            <div className="col-md-6 img-support">
              <img
                src={"../static/" + Theme.theme().href + "/img/support1x.png"}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
