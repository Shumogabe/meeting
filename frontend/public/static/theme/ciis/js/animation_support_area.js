$(document).ready(function () {
  setInterval(() => {
    var size = 0; // Kích thước ban đầu của vòng tròn
    var duration = 2000; // Thời gian hiệu ứng
    for (var i = 1; i <= 5; i++) {
      var $circle = $('<div class="my-support-area"></div>'); // Tạo một div với class "circle"
      $circle.css({
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        // backgroundColor: '#7da3d3',
        border: "5px solid #7da3d3",
        opacity: 1,
        //
        position: "absolute",
        // top: '100%',
        // left: '100%',
        bottom: 0,
        right: 0,
        transform: "translate(50%, 50%)",
        // zIndex: -1,
      });

      $(".support-area").append($circle); // Thêm vòng tròn vào body

      $circle.animate(
        {
          width: "2000px",
          height: "2000px",
          opacity: 0,
        },
        duration,
        function () {
          // Khi hoàn thành hiệu ứng, sử dụng hàm fadeOut() để biến mất vòng tròn
          // circle.fadeOut();
          $(this).remove();
        }
      ); // Thực hiện hiệu ứng to dần và biến mất
      duration += 1000;
    }
  }, 5000);
});
