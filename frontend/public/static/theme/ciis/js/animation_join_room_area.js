var background = {};

background.initializr = function () {
  var $this = this;

  //option
  $this.id = "background_css3";
  $this.style = {
    bubbles_color: "#fff",
    stroke_width: 0,
    stroke_color: "black",
  };
  $this.bubbles_number = 30;
  $this.speed = [1500, 8000]; //milliseconds
  $this.max_bubbles_height = $this.height;
  $this.shape = false; // 1 : circle | 2 : triangle | 3 : rect | false :random

  if ($("#" + $this.id).lenght > 0) {
    $("#" + $this.id).remove();
  }
  $this.object = $(
    "<div style='z-inde: -1; margin: -" +
      (Number($("#root>div>div>div>div.section.join-room-area").height()) +
        Number(
          $("#root>div>div>div>div.section.join-room-area")
            .css("padding-bottom")
            .replace("px", "")
        )) +
      "px 0 0 0; padding: 0; overflow: hidden; position: absolute; " +
      // "bottom: " +
      // Number(
      //   window.innerHeight -
      //     ($(".section.join-room-area").offset().top +
      //       $(".section.join-room-area").outerHeight())
      // ) +
      // "px' " +
      " id='" +
      $this.id +
      "'> </div>'"
  ).appendTo(".section.join-room-area");

  $this.ww = $(".section.join-room-area").width();
  $this.wh = $(".section.join-room-area").height() + 100;
  $this.width = $this.object.width($this.ww);
  $this.height = $this.object.height($this.wh);

  $("body").prepend(
    "<style>.shape_background {transform-origin:center; width:80px; height:80px; position: absolute}</style>"
  );

  for (i = 0; i < $this.bubbles_number; i++) {
    $this.generate_bubbles();
  }
};

background.generate_bubbles = function () {
  var $this = this;
  var base = $("<div class='shape_background'></div>");
  var shape_type = $this.shape ? $this.shape : Math.floor($this.rn(1, 9));
  switch (shape_type) {
    case 1:
      $('<i class="fas fa-microphone fa-5x" style="color:#fff"></i>').appendTo(
        base
      );
      var bolla = base;
      break;
    case 2:
      $('<i class="fas fa-video fa-5x" style="color:#fff"></i>').appendTo(base);
      var bolla = base;
      break;
    case 3:
      $('<i class="fas fa-chromecast fa-5x" style="color:#fff"></i>').appendTo(
        base
      );
      var bolla = base;
      break;
    case 4:
      $('<i class="fas fa-volume-up fa-5x" style="color:#fff"></i>').appendTo(
        base
      );
      var bolla = base;
      break;
    case 5:
      $('<i class="fas fa-comment-alt fa-5x" style="color:#fff"></i>').appendTo(
        base
      );
      var bolla = base;
      break;
    case 6:
      $('<i class="fas fa-unlock-alt fa-5x" style="color:#fff"></i>').appendTo(
        base
      );
      var bolla = base;
      break;
    case 7:
      $(
        '<i class="fas fa-tachometer-alt fa-5x" style="color:#fff"></i>'
      ).appendTo(base);
      var bolla = base;
      break;
    case 8:
      $(
        '<i class="fas fa-record-vinyl fa-5x" style="color:#fff"></i>'
      ).appendTo(base);
      var bolla = base;
      break;
    case 9:
      $('<i class="fas fa-phone-slash fa-5x" style="color:#fff"></i>').appendTo(
        base
      );
      var bolla = base;
      break;

    default:
      break;
  }
  // if (shape_type == 1) {
  //     //hình tròn
  //     // var bolla = base.css({ borderRadius: "50%" })

  // } else if (shape_type == 2) {
  //     //hình tam giác
  //     // var bolla = base.css({ width: 0, height: 0, "border-style": "solid", "border-width": "0 40px 69.3px 40px", "border-color": "transparent transparent " + $this.style.bubbles_color + " transparent", background: "transparent" });

  // } else {
  //     //hình vuông
  //     // var bolla = base;

  // }

  var rn_size = $this.rn(0.8, 1.2);
  bolla.css({
    transform: "scale(" + rn_size + ") rotate(" + $this.rn(-360, 360) + "deg)",
    top: $this.wh + 100,
    left: $this.rn(-60, $this.ww + 60),
  });
  bolla.appendTo($this.object);
  bolla.transit(
    {
      top: $this.rn($this.wh / 2, $this.wh / 2 - 60),
      transform:
        "scale(" + rn_size + ") rotate(" + $this.rn(-360, 360) + "deg)",
      opacity: 0,
    },
    $this.rn($this.speed[0], $this.speed[1]),
    function () {
      $(this).remove();
      $this.generate_bubbles();
    }
  );
};

background.rn = function (from, to, arr) {
  if (arr) {
    return Math.random() * (to - from + 1) + from;
  } else {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }
};
background.initializr();

/**
 *
 * Tying carousel
 *
 */

var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.placeholder = this.txt;

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  new TxtRotate(
    document.getElementById("input-join-room-area"),
    [
      "CIIS",
      "PhongHop",
      "HopTrucTuyen",
      "cmeeting",
      "TenPhongHop",
      "MaPhongHop",
    ],
    2000
  );
};
