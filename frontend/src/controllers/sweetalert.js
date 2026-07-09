//https://sweetalert.js.org/guides/
// import SwalAlertAllConfiguration from "sweetalert";
import { SwalAlertAllConfiguration } from "../components/Swal";

/**
 *
 * @param {*} title
 * @param {*} content
 * @param {*} type success, warning,
 */
export function SweetAlert(title, content, type) {
  SwalAlertAllConfiguration({
    title: title,
    text: content,
    icon: type,
    //dangerMode: true,
    button: "Đóng",
  });
}
export function SweetAlertWithRedirect(title, text, time, url, type) {
  SwalAlertAllConfiguration({
    title: title,
    text: text,
    icon: type,
    //dangerMode: true,
    button: "Đóng",
  });
  setTimeout(
    function () {
      window.location.href = url;
    },
    time > 1000 ? time : 1000
  );
}
export function SweetAlertPass(pass, user) {
  SwalAlertAllConfiguration({
    title: "Vui lòng nhập mật khẩu phòng họp",
    content: {
      element: "input",
      attributes: {
        placeholder: "Nhập mật khẩu",
        type: "password",
        id: "pass_meeting_schedule",
      },
    },
    button: {
      text: "Vào cuộc họp",
      closeModal: false,
    },
  }).then((password) => {
    if (password === pass) {
      SwalAlertAllConfiguration(
        "Đúng mật khẩu! Đang vào cuộc họp",
        ". . .",
        "success",
        {
          buttons: false,
          timer: 2000,
        }
      ).then(() => {
        SwalAlertAllConfiguration({
          title: "Vui lòng nhập họ tên để vào phòng họp",
          content: "input",
          button: {
            text: "Vào cuộc họp",
            closeModal: false,
          },
        }).then((name) => {
          SwalAlertAllConfiguration("Đang vào cuộc họp", ". . .", "success", {
            buttons: false,
            timer: 2000,
          });
          setTimeout(() => {
            let json = {
              Lang: "VI",
              UserInfo: {
                fullName: name,
                email: null,
                phoneNumber: null,
              },
            };
            localStorage.setItem("UserInfo", JSON.stringify(json));
            user = localStorage.getItem("UserInfo");
            window.location.reload();
          }, 1000);
        });
      });
    } else {
      SwalAlertAllConfiguration(
        "Sai mật khẩu! Vui lòng nhập lại",
        ". . .",
        "error",
        {
          buttons: false,
          timer: 2000,
        }
      ).then(() => {
        SweetAlertPass(pass, user);
      });
    }
  });
}
export function SweetAlertWithRedirectYesNo(
  title,
  text,
  icon,
  urlOld,
  urlDefault,
  pass,
  user
) {
  SwalAlertAllConfiguration({
    title: title,
    text: text,
    icon: icon,
    buttons: {
      urlNew: "Người ngoài",
      urlOld: "Công chức nhà nước!",
    },
  }).then((value) => {
    switch (value) {
      case "urlNew":
        SweetAlertPass(pass, user);
        break;
      case "urlOld":
        window.location.href = urlOld;
        break;
      default:
        window.location.href = urlDefault;
    }
  });
}
export function SweetAlertWithConfirmLeaveRoom(time, url) {
  SwalAlertAllConfiguration({
    title: "Bạn có chắc muốn kết thúc phiên họp?",
    text: "Khi bạn nhấn đồng ý phiên họp sẽ kết thúc!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      localStorage.removeItem("MEETING_TOKEN");
      localStorage.removeItem("SCHEDULE");
      localStorage.removeItem("MEETING");
      SwalAlertAllConfiguration("Bạn đã kết thúc phiên họp!", {
        icon: "success",
      });
      setTimeout(
        function () {
          window.location.href = url;
        },
        time > 2000 ? time : 2000
      );
    } else {
      SwalAlertAllConfiguration("Bạn đã hủy thao tác này!");
    }
  });
}

export function SweetAlertWithConfirmDelete(DeleteCallback, api, id) {
  alert(api);
  alert(id);
  SwalAlertAllConfiguration({
    title: "Bạn có chắc muốn xóa nội dung này?",
    text: "Khi nhấn xóa nội dung này sẽ chuyển vào mục đã xóa!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((DeleteCallback) => {
    if (DeleteCallback) {
      SwalAlertAllConfiguration("Thông báo! Xóa thành công", {
        icon: "success",
      });
    } else {
      SwalAlertAllConfiguration("Thông báo! Không xóa được nội dung này");
    }
  });
}
