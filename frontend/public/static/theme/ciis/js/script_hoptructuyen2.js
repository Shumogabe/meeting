$(".sidebar-control-meeting-open").attr({
  style: "display:none",
});
$(document).ready(function () {
  // $("#meeting-sidebar-doc-list").slimscroll({
  //   size: "5px",
  // });
  function display() {
    $(".sidebar-control-meeting-close").attr({
      style: "display:block",
    });
  }
  window.setTimeout(display, 5000); // 5 seconds

  $(".sidebar-control-meeting-close").click(function () {
    Meeting.HideSidebar();
  });
  $(".sidebar-control-meeting-open").click(function () {
    Meeting.DisplaySidebar();
  });
  //Hide small meeting
  $(".small-meeting").attr({
    style: "display:none",
  });
  $("#vert-tabs-tab").on("click", function (e) {
    var target = $(e.target).attr("data-id");
    if (target != null && target != "phonghop") {
      //alert(target);
      $(".small-meeting").attr({
        style: "display:block",
      });
    } else {
      $(".small-meeting").attr({
        style: "display:none",
      });
    }
  });
});
// Meeting.DisplayMeeting();
// Meeting.DisplaySmallMeeting();
