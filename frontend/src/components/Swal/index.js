import Swal from "sweetalert2";

// export const SwalAlert = {
//     normal: (title, icon, footer, timer) => Swal.fire({
//         title: { title }, //"<strong>HTML <u>example</u></strong>",
//         icon: { icon }, //"info",
//         footer: { footer }, //'<a href="">Why do I have this issue?</a>',
//         timer: { timer }, //1500,
//       })
//  }

export const SwalAlertAllConfiguration = (config) => Swal.fire(config);

export const SwalIsLoading = () => Swal.isLoading();

export const SwalGetPopup = () => Swal.getPopup();

export const SwalGetTimerLeft = () => Swal.getTimerLeft();

export const SwalShowValidationMessage = (e) => Swal.showValidationMessage(e);

export const SwalDismissReasonTimer = () => Swal.DismissReason.timer;

export const SwalAlertTimeRedirect = ({
  title,
  icon,
  text,
  footer,
  timer,
  redirect,
  showConfirmButton,
} = {}) => {
  let timerInterval;
  Swal.fire({
    title: title, //"<strong>HTML <u>example</u></strong>",
    text: text,
    icon: icon, //"info",
    footer: footer, //'<a href="">Why do I have this issue?</a>',
    timer: timer, //1500,
    showConfirmButton: showConfirmButton,
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      // redirect();
      window.location.href = redirect;
    }
  });
};

export const SwalAlertDesign = ({
  title,
  icon,
  html,
  showCloseButton,
  showCancelButton,
  focusConfirm,
  confirmButtonText,
  confirmButtonAriaLabel,
  cancelButtonText,
  cancelButtonAriaLabel,
  footer,
  timer,
} = {}) =>
  Swal.fire({
    title: title, //"<strong>HTML <u>example</u></strong>",
    icon: icon, //"info",
    html: html,
    //"You can use <b>bold text</b>, " +
    //'<a href="//sweetalert2.github.io">links</a> ' +
    //"and other HTML tags",
    showCloseButton: showCloseButton, //true,
    showCancelButton: showCancelButton, //true,
    focusConfirm: focusConfirm, //false,
    confirmButtonText: confirmButtonText, //'<i class="fa fa-thumbs-up"></i> Great!',
    confirmButtonAriaLabel: confirmButtonAriaLabel, //"Thumbs up, great!",
    cancelButtonText: cancelButtonText, //'<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: cancelButtonAriaLabel, //"Thumbs down",
    footer: footer, //'<a href="">Why do I have this issue?</a>',
    timer: timer, //1500,
  });

export const SwalAlertConfirm = ({
  title,
  icon,
  html,
  showCloseButton,
  showDenyButton,
  showCancelButton,
  focusConfirm,
  confirmButtonText,
  confirmButtonAriaLabel,
  cancelButtonText,
  cancelButtonAriaLabel,
  denyButtonText,
  footer,
  timer,
  confirmYes,
  confirmDenied,
  confirmNo,
} = {}) =>
  Swal.fire({
    title: title, //"<strong>HTML <u>example</u></strong>",
    icon: icon, //"info",
    html: html,
    //"You can use <b>bold text</b>, " +
    //'<a href="//sweetalert2.github.io">links</a> ' +
    //"and other HTML tags",
    showCloseButton: showCloseButton, //true,
    showCancelButton: showCancelButton, //true,
    showDenyButton: showDenyButton, //true
    focusConfirm: focusConfirm, //false,
    confirmButtonText: confirmButtonText, //'<i class="fa fa-thumbs-up"></i> Great!',
    confirmButtonAriaLabel: confirmButtonAriaLabel, //"Thumbs up, great!",
    cancelButtonText: cancelButtonText, //'<i class="fa fa-thumbs-down"></i>',
    cancelButtonAriaLabel: cancelButtonAriaLabel, //"Thumbs down",
    denyButtonText: denyButtonText,
    footer: footer, //'<a href="">Why do I have this issue?</a>',
    timer: timer, //1500,
  }).then((result) => {
    if (result.isConfirmed) {
      confirmYes();
    } else if (result.isDenied) {
      confirmDenied();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      confirmNo();
    }
  });
