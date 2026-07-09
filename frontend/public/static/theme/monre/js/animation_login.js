$(document).ready(function () {
  var duration = 1000; // Thời gian hiệu ứng
  var $form_login = $("form#form-login");
  var $form_register = $("form#form-register");
  var $btn_login = $("button.login.align-center");
  var $btn_register = $("button.register.align-center");
  $form_login.css({
    // transform: "translate(50%, 50%)",
    position: "absolute",
  });
  $btn_register.click(() => {
    $form_login.animate(
      {
        display: "none",
        opacity: 0,
        height: "toggle",
      },
      duration,
      function () {
        // Khi hoàn thành hiệu ứng, sử dụng hàm fadeOut() để biến mất vòng tròn
        // circle.fadeOut();
        // $(this).remove();
        $form_register.animate(
          {
            display: "block",
            opacity: 1,
            height: "toggle",
          },
          duration,
          function () {
            // Khi hoàn thành hiệu ứng, sử dụng hàm fadeOut() để biến mất vòng tròn
            // circle.fadeOut();
            // $(this).remove();
          }
        );
      }
    );
  });
  $btn_login.click(() => {
    $form_register.animate(
      {
        display: "none",
        opacity: 0,
        height: "toggle",
      },
      duration,
      function () {
        // Khi hoàn thành hiệu ứng, sử dụng hàm fadeOut() để biến mất vòng tròn
        // circle.fadeOut();
        // $(this).remove();
        $form_login.animate(
          {
            display: "block",
            opacity: 1,
            height: "toggle",
          },
          duration,
          function () {
            // Khi hoàn thành hiệu ứng, sử dụng hàm fadeOut() để biến mất vòng tròn
            // circle.fadeOut();
            // $(this).remove();
          }
        );
      }
    );
  });
});
