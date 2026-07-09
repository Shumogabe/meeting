let FirsWeekYear = 1;
let LastWeekYear = 52;
let WeekDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let WeekDay_VN = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
];
const HREF = {
  TrangChu: "/",
  LichHop: "/lich-hop",
  HopTrucTuyen: "/hop-truc-tuyen/phong-hop",
};
var WorkLayout = WorkLayout || {};
(function () {
  this.Set_Meta_Module_Header = function (name, url) {
    $("head").append('<meta name="module" content="' + name + '">');
    $("head").append('<meta name="module_url" content="' + url + '">');
    //document.querySelector('meta[name="module"]').setAttribute("content", name);
    //document.querySelector('meta[name="module_url"]').setAttribute("content", url);
  };
  this.Display_Header = function () {
    // // Get HTML head element
    // var content = "";
    // var tag = document.getElementById("main-header");
    // content += "<!-- Left navbar links -->";
    // content += '<ul class="navbar-nav">';
    // content += '<li class="nav-item">';
    // content +=
    //   '<a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-laptop-house site-bars"></i></a>';
    // content += "</li>";
    // content += '<li class="nav-item d-none d-sm-inline-block site-name">';
    // content +=
    //   '<a href="' +
    //   HREF.TrangChu +
    //   '" class="nav-link ">HỆ THỐNG HỌP TRỰC TUYẾN</a>';
    // content += "</li>";
    // content += "</ul>";
    // content += "<!-- Right navbar links -->";
    // content += '<ul class="navbar-nav ml-auto">';
    // //Tìm kiếm
    // /*
    //     content += '<!-- Navbar Search -->';
    //     content += '<li class="nav-item">';
    //     content += '<a class="nav-link" data-widget="navbar-search" href="#" role="button">';
    //     content += '<i class="fas fa-search"></i> Tìm kiếm';
    //     content += '</a>';
    //     content += '<div class="navbar-search-block">';
    //     //Start form
    //     content += '<div class="form-inline bg-whitesmoke">';
    //     content += '<div class="input-group input-group-sm">';
    //     content += '<input class="form-control form-control-navbar" type="search" placeholder="Nhập từ khóa tìm kiếm" aria-label="Search">';
    //     content += '<div class="input-group-append">';
    //     content += '<select class="form-control select-option">';
    //     content += '<option value="NhiemVuKHCN"> - Đề tài khoa học - </option>';
    //     content += '<option value="DuAn"> - Dự án - </option>';
    //     content += '</select>';
    //     content += '<input class="search-more-option form-control" type="checkbox"/> Nâng cao';
    //     content += '<button id="btn-search" class="btn btn-navbar" type="submit">';
    //     content += '<i class="fas fa-search"></i>';
    //     content += '</button>';
    //     content += '<button class="btn btn-navbar btn-search" type="button" data-widget="navbar-search">';
    //     content += '<i class="fas fa-times"></i>';
    //     content += '</button>';
    //     content += '</div>';
    //     content += '</div>';
    //     content += '</div>';
    //     //End form
    //     content += '</div>';
    //     content += '</li>';
    //     */
    // /////////
    // //content += '<li class="nav-item dropdown">';
    // //content += '<a class="nav-link" href="lich-cong-tac.html">';
    // //content += '<i class="fas fa-calendar-check"></i>';
    // //content += 'Tham gia';
    // //content += '</a>';
    // //content += '</li>';
    // //content += '</li>';
    // //
    // content += '<li class="nav-item dropdown">';
    // content +=
    //   '<a class="nav-link" ' +
    //   (window.location.pathname.includes(HREF.HopTrucTuyen) &&
    //     'target="_blank"') +
    //   ' href="' +
    //   HREF.LichHop +
    //   '">';
    // content += '<i class="fas fa-calendar"></i>';
    // content += "Lịch họp";
    // content += "</a>";
    // content += "</li>";
    // //
    // content += '<li class="nav-item dropdown">';
    // content += '<a class="nav-link" href="#">';
    // content += '<i class="fas fa-info-circle"></i>';
    // content += "Hướng đẫn";
    // content += "</a>";
    // content += "</li>";
    // content += '<li class="nav-item dropdown">';
    // content += '<a class="nav-link " href="#">';
    // content += '<i class="fas fa-bell"></i>';
    // content += '<span class="badge badge-danger navbar-badge">3</span>';
    // content += '<span class="badge-notice">Thông báo</span>';
    // content += "</a>";
    // content += "</li>";
    // content += '<li class="nav-item dropdown">';
    // content +=
    //   '<a id="button-control-sidebar-dark" class="nav-link" href="#" data-widget="control-sidebar" data-controlsidebar-slide="true" role="button">';
    // content += '<i class="fas fa-cogs"></i>';
    // content += "Hệ thống";
    // content += "</a>";
    // content += "</li>";
    // content += '<li class="nav-item">';
    // content +=
    //   '<a class="nav-link" data-widget="fullscreen" href="#" role="button">';
    // content += '<i class="fas fa-expand-arrows-alt"></i>';
    // content += "</a>";
    // content += "</li>";
    // /*
    //     content += '<li class="nav-item">';
    //     content += '<a class="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="#" role="button">';
    //     content += '<i class="fas fa-th-large"></i>';
    //     content += '</a>';
    //     content += '</li>';
    //     */
    // content += "</ul>";
    // tag.innerHTML = content;
  };

  this.Display_Main_Sidebar = function () {
    // var content = "";
    // var tag = document.getElementById("main-sidebar");
    // content += "<!-- Brand Logo -->";
    // content += '<a href="' + HREF.TrangChu + '" class="brand-link">';
    // if (window.location.pathname.includes(HREF.HopTrucTuyen)) {
    //   content +=
    //     '<img src="/static/img/QuocHuy.png" alt="TRUNG TÂM HẠ TẦNG SỐ" class="brand-image img-circle elevation-3" style="opacity: .8">';
    // } else {
    //   content +=
    //     '<img src="./static/img/QuocHuy.png" alt="TRUNG TÂM HẠ TẦNG SỐ" class="brand-image img-circle elevation-3" style="opacity: .8">';
    // }
    // content += '<span class="brand-text bold">TT CƠ SỞ HẠ TẦNG</span>';
    // content += "</a>";
    // content += "<!-- Sidebar -->";
    // content += '<div class="sidebar">';
    // content += "<!-- Sidebar user panel (optional) -->";
    // content += '<div class="user-panel mt-3 pb-3 mb-3">';
    // content += '<div class="image">';
    // if (window.location.pathname.includes(HREF.HopTrucTuyen)) {
    //   content += '<img src="/static/img/user-icon.png" />';
    // } else {
    //   content += '<img src="./static/img/user-icon.png" />';
    // }
    // content += "</div>";
    // content += '<div class="info">';
    // content +=
    //   '<p><a href="#" class="d-block full-name user-fullname-display">' +
    //   sessionStorage.getItem("fullname") +
    //   "</a></p>";
    // content += "</div>";
    // content += "</div>";
    // content += "<!-- Sidebar Menu -->";
    // content += '<nav class="mt-2">';
    // content +=
    //   '<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">';
    // content += '<li class="nav-item">';
    // content += '<a href="' + HREF.LichHop + '" class="nav-link">';
    // content += '<i class="far fa-calendar-alt"></i>';
    // if (window.location.pathname.includes(HREF.HopTrucTuyen)) {
    //   content += " ";
    // }
    // content += "<p>";
    // content += "Họp, hội thảo, hội nghị";
    // content += '<i class="fas fa-angle-left right"></i>';
    // content += "</p>";
    // content += "</a>";
    // content += "</li>";
    // content += '<li class="nav-item">';
    // content += '<a href="' + HREF.LichHop + '" class="nav-link">';
    // content += '<i class="far fa-calendar-alt"></i>';
    // if (window.location.pathname.includes(HREF.HopTrucTuyen)) {
    //   content += " ";
    // }
    // content += "<p>";
    // content += "Sự kiện";
    // content += '<i class="right fas fa-angle-left"></i>';
    // content += "</p>";
    // content += "</a>";
    // content += "</li>";
    // content += "</ul>";
    // content += "</nav>";
    // content += "<!-- /.sidebar-menu -->";
    // content += "</div>";
    // content += "<!-- /.sidebar -->";
    // tag.innerHTML = content;
  };
  this.Display_Content_Header = function () {
    var content = "";
    var tag = document.getElementById("content-header");
    content += '<div class="container-fluid">';
    content += '<div class="row mb-2">';
    content += '<div class="col-sm-6">';
    content += '<h1 class="m-0">' + document.title + "</h1>";
    content += "</div><!-- /.col -->";
    content += '<div class="col-sm-6">';
    content += '<ol class="breadcrumb float-sm-right">';
    content +=
      '<li class="breadcrumb-item"><a href="' +
      HREF.TrangChu +
      '"><i class="fas fa-home"></i></a></li>';
    content +=
      '<li class="breadcrumb-item"><a href="' +
      document.querySelector('meta[name="module_url"]').content +
      '">' +
      document.title +
      "</a></li>";
    content +=
      '<li class="breadcrumb-item active">' +
      document.querySelector('meta[name="module"]').content +
      "</li>";
    content += "</ol>";
    content += "</div><!-- /.col -->";
    content += "</div><!-- /.row -->";
    content += "</div><!-- /.container-fluid -->";
    tag.innerHTML = content;
  };
  this.Display_Control_Sidebar_Dark = function () {
    var content = "";
    var tag = document.getElementById("control-sidebar-dark");
    content += "<!-- Control sidebar content goes here -->";
    content += `<h3><i class="fas fa-cogs"></i> Quản trị hệ thống<button type="button" class="close text-danger" data-dismiss="control-sidebar" aria-label="Close" onclick="document.getElementById('control-sidebar-dark').style.display='none'">
    <span aria-hidden="true" style="font-size: 45px;line-height: 15px;">&times;</span>
  </button></h3>`;
    tag.innerHTML = content;
  };
  this.Display_Main_Footer = function () {
    var content = "";
    var tag = document.getElementById("main-footer");
    //content += '<div id="bottom-toolbar" class="bottom-toolbar">';
    //content += '<div class="row">';
    //content += '<div class="col-md-6">';
    //content += '</div>';
    //content += '<div class="col-md-6 bg-white">';
    //content += '<a class="btn"><i class="fas fa-plus-square blue"></i> Thêm mới</a>';
    //content += '<a class="btn"><i class="fas fa-edit orange"></i> Sửa</a>';
    //content += '<a class="btn"><i class="fas fa-share orange"></i> Phân quyền</a>';
    //content += '<a class="btn"><i class="fas fa-file-upload"></i> Sản phẩm</a>';
    //content += '<a class="btn"><i class="fas fa-share-alt-square blue"></i> Công bố</a>';
    //content += '<a class="btn"><i class="fas fa-times-circle red"></i> Hủy</a>';
    //content += '</div>';
    //content += '</div>';
    //content += '</div>';
    content +=
      "<strong>&copy; " +
      new Date().getFullYear() +
      ' - Phát triển bởi <a href="https://ciis.vn">CIIS</a>.</strong> Trung tâm Hạ tầng số <b>Phiên bản</b> 1.0';
    content += '<div class="float-right d-none d-sm-inline-block">';
    content += "";
    content += "</div>";
    tag.innerHTML = content;
  };
}).apply(WorkLayout);

var Calendar = Calendar || {};
(function () {
  /**
   * Định dạng thời gian
   * */
  this.DateFormat = function (date, char) {
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + char + mm + char + yyyy;
  };
  this.GetAllDateInWeek = function (date) {
    var week = new Array();
    // Starting Monday not Sunday
    date.setDate(date.getDate() - date.getDay() + 1);
    for (var i = 0; i < 7; i++) {
      week.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    //console.log(week);
    return week;
  };
  /**
   * Lấy ngày thứ hai theo tuần, năm
   * */
  this.GetMonthDayOfISOWeek = function (w, y) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
  };
  /**
   * Lấy năm hiện tại
   * */
  this.GetCurrentYear = function () {
    return new Date().getFullYear();
  };
  /**
   * Lấy ngày trong tuần theo ngày
   * */
  this.GetWeekDay = function (date) {
    //const d = new Date();
    let day = WeekDay[date.getDay()];
    let getdate = this.DateFormat(date, "/");
    return { date: getdate, text: day };
  };
  /**
   * Lấy số tuần hiện tại
   * */
  this.Get_Current_Week_Number = function () {
    var weekNumber = 0;
    var week = Common.GetURLParameters("week");
    if (week > 0) weekNumber = week;
    else {
      currentDate = new Date();
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

      weekNumber = Math.ceil(days / 7);
      // Display the calculated result
      //console.log("Week number of " + currentDate + " is :   " + weekNumber);
    }
    return weekNumber;
  };
  /**
   * Lấy ngày đầu tuần (T2) theo ngày bất kỳ trong tuần
   * */
  this.Get_Monday = function (date) {
    var d = this.GetAllDateInWeek(date)[0];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Thứ hai",
      day: d1,
    };
  };
  /**
   * Lấy ngày thứ 3 trong tuần
   * */
  this.Get_Tuesday = function (date) {
    var d = this.GetAllDateInWeek(date)[1];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Thứ ba",
      day: d1,
    };
  };
  /**
   * Lấy ngày thứ 4 trong tuần
   * */
  this.Get_Wednesday = function (date) {
    var d = this.GetAllDateInWeek(date)[2];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Thứ tư",
      day: d1,
    };
  };
  /**
   * Lấy ngày thứ 5 trong tuần
   * */
  this.Get_Thirsday = function (date) {
    var d = this.GetAllDateInWeek(date)[3];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Thứ năm",
      day: d1,
    };
  };
  /**
   * Lấy ngày thứ 6 trong tuần
   * */
  this.Get_Friday = function (date) {
    var d = this.GetAllDateInWeek(date)[4];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Thứ sáu",
      day: d1,
    };
  };
  /**
   * Lấy ngày thứ 7trong tuần
   * */
  this.Get_Saturday = function (date) {
    var d = this.GetAllDateInWeek(date)[5];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Thứ bảy",
      day: d1,
    };
  };
  /**
   * Lấy ngày cuối tuần (CN) theo ngày bất kỳ trong tuần
   * */
  this.Get_Sunday = function (date) {
    var d = this.GetAllDateInWeek(date)[6];
    var d1 = this.DateFormat(d, "/");
    return {
      text: "Chủ nhật",
      day: d1,
    };
    //var first = date.getDate() - date.getDay() + 1; // First day is the day of the month - the day of the week
    //var last = first + 6; // last day is the first day + 6

    ////var firstday = new Date(date.setDate(first)).toUTCString();
    //var lastday = new Date(date.setDate(last));
    ////alert(first);
    //return lastday;
  };
  /**
   * Lấy tuần trước theo tuần hiện hành
   * */
  this.Get_Previous_Week_Number = function () {
    let week = this.Get_Current_Week_Number();
    return week > FirsWeekYear ? --week : FirsWeekYear;
  };
  /**
   * Lấy tuần sau theo tuần hiện hành
   * */
  this.Get_Next_Week_Number = function () {
    let week = this.Get_Current_Week_Number();
    return week < LastWeekYear ? ++week : LastWeekYear;
  };
  /**
   * Hiển thị tuần hiện tại lên giao diện
   * */
  this.Set_Current_Week = function () {
    var tag = document.getElementById("current_week_number");
    tag.innerHTML = this.Get_Current_Week_Number();
  };

  this.Set_Monday = function () {
    var tag = document.getElementById("start_week");
    let today = Calendar.GetMonthDayOfISOWeek(
      Calendar.Get_Current_Week_Number(),
      Calendar.GetCurrentYear()
    );
    let day = this.Get_Monday(today);
    tag.innerHTML = day.day;
  };

  this.Set_Sunday = function () {
    var tag = document.getElementById("end_week");
    let today = Calendar.GetMonthDayOfISOWeek(
      Calendar.Get_Current_Week_Number(),
      Calendar.GetCurrentYear()
    );
    let day = this.Get_Sunday(today);
    tag.innerHTML = day.day;
  };

  this.Set_Previous_Week_Number = function () {
    window.location.href = "?week=" + this.Get_Previous_Week_Number();
  };

  this.Set_Next_Week_Number = function () {
    window.location.href = "?week=" + this.Get_Next_Week_Number();
  };
  this.Set_Current_Week_Number = function () {
    window.location.href = "/cucdcvn";
  };
  /**
   * Lấy thông tin và hiển thị lịch theo ngày
   *
   * */
  this.Display_Schedule = function (date, index) {
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    let d = dd + "/" + mm + "/" + yyyy;
    let rowspan = 3; //Tính theo số lượng bản ghi lịch lấy ra trong ngày
    content += "<tbody>";
    content += "<tr>";
    content +=
      '<td rowspan="' + rowspan + '" class="calendar-heading date-title">';
    content += WeekDay_VN[index];
    content += "<br/>";
    content += d;
    content += "</td>";
    content +=
      '<td class="align-center calendar-leader"><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Cục trưởng<br> Trần Bình Trọng</a></td>';
    content +=
      '<td class="align-center calendar-time"><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">14:00</a></td>';
    content +=
      '<td><font style="font-weight:bold;color:black;"><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Họp BCH Công đoàn Cục</font><br><font style="font-style:italic;color:black;">BCH CĐ Cục, Chủ tịch CĐCSTV Trung tâm KĐSPCNTT</font><br><font></font></a></td>';
    content +=
      '<td><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Phòng họp tầng 2, trực tuyến với TPHCM</a></td>';
    content += "</tr>";
    content += "<tr>";
    content +=
      '<td class="align-center red"><a class="red" href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Lãnh đạo Cục</a></td>';
    content +=
      '<td class="align-center red"><a class="red" href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">14:30</a></td>';
    content +=
      '<td class="red"><a class="red" href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong"><b>Họp về vị trí việc làm công chức.</b><br><em>LĐ các Phòng QLNN;Văn phòng chuẩn bị.</em></a></td>';
    content +=
      '<td class="align-center red"><a class="red" href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Trực tuyến tại Phòng họp tầng 4</a></td>';
    content += "</tr>";
    content += "<tr>";
    content +=
      '<td class="align-center"><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Lãnh đạo Cụ</a>c</td>';
    content +=
      '<td class="align-center"><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">16:00</a></td>';
    content +=
      '<td><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong"><font style="font-weight:bold;color:black;">Họp chuẩn bị báo cáo tình hình triển khai các dự án đầu tư.</font><br><font style="font-style:italic;color:black;">Phòng KHTC; Ban quản lý Dự án CĐS, Dự án CSDL TNMT; Phòng KHTC chuẩn bị.</font><br><font></font></a></td>';
    content +=
      '<td width="20%" style="color:black"><a href="' +
      HREF.HopTrucTuyen +
      '?room=tbtrong">Phòng họp tầng 4</a></td>';
    content += "</tr>";
    content += "</tbody>";
  };
  /**
   * Hiển thị bảng quản lý lập lịch
   * */
  this.Display_Calendar = function (date, index) {
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    let d = dd + "/" + mm + "/" + yyyy;
    let rowspan = 3; //Tính theo số lượng bản ghi lịch lấy ra trong ngày
    content += "<tbody>";
    content += "<tr>";
    content +=
      '<td rowspan="' + rowspan + '" class="calendar-heading date-title">';
    content += WeekDay_VN[index];
    content += "<br/>";
    content += d;
    content += "</td>";
    content +=
      '<td class="align-center calendar-leader"><a href="lap-lich.html">Cục trưởng<br> Trần Bình Trọng</a></td>';
    content +=
      '<td class="align-center calendar-time"><a href="lap-lich.html">14:00</a></td>';
    content +=
      '<td class="calendar-content"><font style="font-weight:bold;color:black;"><a href="lap-lich.html">Họp BCH Công đoàn Cục</font><br><font style="font-style:italic;color:black;">BCH CĐ Cục, Chủ tịch CĐCSTV Trung tâm KĐSPCNTT</font><br><font></font></a></td>';
    content +=
      '<td><a href="lap-lich.html">Phòng họp tầng 2, trực tuyến với TPHCM</a></td>';
    content += '<td><input type="checkbox"></td>';
    content += "</tr>";
    content += "<tr>";
    content +=
      '<td class="align-center red"><a class="red" href="lap-lich.html">Lãnh đạo Cục</a></td>';
    content +=
      '<td class="align-center red"><a class="red" href="lap-lich.html">14:30</a></td>';
    content +=
      '<td class="calendar-content red"><a class="red" href="lap-lich.html"><b>Họp về vị trí việc làm công chức.</b><br><em>LĐ các Phòng QLNN;Văn phòng chuẩn bị.</em></a></td>';
    content +=
      '<td class="red"><a class="red" href="lap-lich.html">Trực tuyến tại Phòng họp tầng 4</a></td>';
    content += '<td><input type="checkbox"></td>';
    content += "</tr>";
    content += "<tr>";
    content +=
      '<td class="align-center"><a href="lap-lich.html">Lãnh đạo Cụ</a>c</td>';
    content +=
      '<td class="align-center"><a href="lap-lich.html">16:00</a></td>';
    content +=
      '<td class="calendar-content"><a href="lap-lich.html"><font style="font-weight:bold;color:black;">Họp chuẩn bị báo cáo tình hình triển khai các dự án đầu tư.</font><br><font style="font-style:italic;color:black;">Phòng KHTC; Ban quản lý Dự án CĐS, Dự án CSDL TNMT; Phòng KHTC chuẩn bị.</font><br><font></font></a></td>';
    content += '<td><a href="lap-lich.html">Phòng họp tầng 4</a></td>';
    content += '<td class="td-chon align-center"><input type="checkbox"></td>';
    content += "</tr>";
    content += "</tbody>";
  };
}).apply(Calendar);

/**
 * Search
 * */
$("#btn-search").click(function () {
  alert("Handler for .click() called.");
});

var Search = Search || {};
(function () {
  /**
   * Định dạng thời gian
   * */
  this.BtnSearch = function () {
    $("#btn-search").click(function () {
      alert("Handler for .click() called.");
    });
  };
}).apply(Search);
/**
 * End search
 * */

var Meeting = Meeting || {};
(function () {
  // this.DisplayMeeting = function () {
  //   var meeting = document.getElementById("Meeting");
  //   var width = meeting.offsetWidth;
  //   var height =
  //     (window.innerHeight ||
  //       document.documentElement.clientHeight ||
  //       document.body.clientHeight) - 120;
  //   const domain = "meeting-11.citis.vn";
  //   const options = {
  //     roomName: "Test",
  //     jwt: "***",
  //     width: width - 5,
  //     height: height,
  //     parentNode: meeting,
  //     userInfo: {
  //       email: "email@jitsiexamplemail.com",
  //       displayName: "John Doe",
  //     },
  //     configOverwrite: { startWithAudioMuted: true },
  //     interfaceConfigOverwrite: { DISABLE_DOMINANT_SPEAKER_INDICATOR: true },
  //   };
  //   const api = new JitsiMeetExternalAPI(domain, options);
  //   api.resizeLargeVideo(width, height);
  //   //api.executeCommand('subject', 'Test họp');//Gán tên phòng họp
  //   //api.executeCommand('displayName', 'Hello me');//Gán tên người tham gia
  // };
  // this.DisplaySmallMeeting = function () {
  //   var meeting = document.getElementById("small-meeting");
  //   var width = meeting.offsetWidth;
  //   var height = 190;
  //   const domain = "meeting-11.citis.vn";
  //   const options = {
  //     roomName: "Test",
  //     jwt: "***",
  //     width: width,
  //     height: height,
  //     parentNode: meeting,
  //     userInfo: {
  //       email: "email@jitsiexamplemail.com",
  //       displayName: "John Doe",
  //     },
  //     configOverwrite: { startWithAudioMuted: true },
  //     interfaceConfigOverwrite: { DISABLE_DOMINANT_SPEAKER_INDICATOR: true },
  //   };
  //   const api = new JitsiMeetExternalAPI(domain, options);
  //   api.resizeLargeVideo(width, height);
  //   //api.executeCommand('subject', 'Test họp');//Gán tên phòng họp
  //   //api.executeCommand('displayName', 'Hello me');//Gán tên người tham gia
  // };
  this.HideSidebar = function () {
    $("#meeting-sidebar").attr({
      style: "display:none",
    });
    $(".sidebar-control-meeting-open").attr({
      style: "display:block",
    });
    $("#meeting-content").removeClass("col-9 col-sm-10").addClass("col-12");
    $("iframe").attr({
      style: "width: 1820px;height: " + (window.innerHeight - 110) + "px",
    });
  };
  this.DisplaySidebar = function () {
    $(".sidebar-control-meeting-open").attr({
      style: "display:none",
    });
    $("#meeting-sidebar").attr({
      style: "display:block",
    });
    $("#meeting-content").removeClass("col-12").addClass("col-9 col-sm-10");
    $("iframe").attr({
      style: "width: 1525px;height: " + (window.innerHeight - 110) + "px",
    });
  };
}).apply(Meeting);
