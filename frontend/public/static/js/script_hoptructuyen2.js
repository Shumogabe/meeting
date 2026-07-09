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
    dragElement(document.getElementById("vert-tabs-phonghop"));
  });
});
// Meeting.DisplayMeeting();
// Meeting.DisplaySmallMeeting();

// Make the DIV element draggable:

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = Number(e.clientX);
    pos4 = Number(e.clientY);
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - Number(e.clientX);
    pos2 = pos4 - Number(e.clientY);
    pos3 = Number(e.clientX);
    pos4 = Number(e.clientY);
    // set the element's new position:

    //console.log("e", e);
    //console.log("e.clientX", e.clientX);
    //console.log("e.clientY", e.clientY);
    //console.log("pos1", pos1);
    //console.log("pos2", pos2);
    //console.log("pos3", pos3);
   // console.log("pos4", pos4);
    //console.log("elmnt.offsetTop", elmnt.offsetTop);
    //console.log("elmnt.offsetLeft", elmnt.offsetLeft);
    //console.log("elmnt.style.top", elmnt.style.top);
    //console.log("elmnt.style.left", elmnt.style.left);
    elmnt.style.top = Number(elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = Number(elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
