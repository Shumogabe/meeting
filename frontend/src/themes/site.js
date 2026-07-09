import { createGlobalStyle } from 'styled-components';

export const SiteTheme = createGlobalStyle`
  header {
    padding: 10px;
    height: 145px;
    background: url('../img/Header.png') center top no-repeat;
  }
  a{
    color: #ffffff;
  }
  a:hover {
    color: #666666;
  }
  header .banner {
      height: 115px;
  }
  footer {
    background: #2165ae;
    color: #ffffff;
    font-weight: normal;
    padding: 10px;
  }
  footer .contact-info, footer .contact-info h5, footer .contact-info a {
      font-size: 24px;
      color: #ffffff;
  }
  footer .copyright {
      font-size: medium;
      color: #999999;
  }
  footer .copyright a {
      font-size: medium;
      color: #999999;
  } 
  footer .address img{
    width:100%;
  }
  footer a {
    color: #ffffff;
  }
  footer a:hover {
      color: rgb(247 246 246 / 0.60);
  }
  .site-name{
    font-size:22px;
    font-weight:bold;
    padding:4px 0;
    margin:0;
  }

  .login-box, .register-box {
    width: 460px;
    margin: 0 auto;
  }
  .login-icon {
    font-size: 22px;
    color: #ffffff;
  }
  .area-heading{
    padding:20px;
  }
  .login-logo, .register-logo {
    height: 45px;
    font-size: 2.1rem;
    font-weight: 300;
    margin-bottom: 20px;
  }
  .login-logo img{
    height:65px;
  }
  .info {
    padding: 0 0 0 10px !important;
  }
  .user-info {
    position: absolute;
    right: 0;
    top: 0;
  }
  .admin-link {
    padding-right: 0 !important;
  }
  .breadcrumb {
    border-radius: 0;
    background: #f1eeee;
    font-size: 24px;
    padding: 5px;
    border-left: 10px solid #77b8fe;
  }
  .breadcrumb a{
    color:#333333;
  }
  .breadcrumb a:hover {
      color: #666666;
  }
  .other-article h3 {
    border-bottom:2px solid #dfdfdf;
  }
  .other-article a {
    color: #333333;
    font-size: 24px;
  }
  .other-article a:hover {
    color: #666666;
  }
  .section-content {
    margin-bottom: 20px;
  }
  .section-content a {
      color: #333333;
  }
  .section-content p {
      margin: 0;
      padding: 0;
      text-align: left;
      /*text-indent:35px;*/
  }
  .section-content h1, .section-content h2, .section-content h3, .section-content h4, .section-content h5, .section-content a, .section-content p, .section-content span, .section-content label, .section-content div {
      font-size: 24px !important;
  }
  .section-about {
  }
  .section-about a {
    color: #333333;
  }
  .section-about p {
      margin: 0;
      padding: 0;
      font-size: 24px;
      text-align: center;
      /*text-indent:35px;*/
  }
  .section-about .about-text {
      padding-right:20px;
  }
  .home-about-image {
    width: 100%;
  }
  .home-activ-image {
    width: 100%;
    height: 175px;
  }
  .section-sulution {
    background: #f3f2f2;
    padding: 0 20px 20px 20px;
  }
  .section-sulution a{
    color: #333333;
  }
  .block-activity {
    font-size: 24px;
    color: #333333;
    text-align: center;
    height: 380px;
    overflow-y: hidden;
  }
  .block-activity h5.heading {
      text-align: center;
      text-transform: uppercase;
      height: 65px;
      background: #2165ae;
      padding: 10px;
  }
  .block-activity h5.heading a {
    color: #ffffff;
  }
  .block-activity h5.heading a:hover {
      color: #efefef;
  }
  .block-activity p a{
      color: #333333;
  }
  .under-line-2 {
      border-bottom: 2px solid #d9d8d8;
  }
  .block-activity-more {
    background: #f3f2f2;
    padding: 5px 10px 5px 10px;
    font-size: 24px;
  }
  .block-activity-more:hover {
    background: rgb(202 201 201 / 0.60);
  }
  .block-activity-more a {
    color: #666666;
  }
  .block-activity-more a:hover {

  }
  .section-news-activity {
    font-size: 24px;
    color: #333333;
    text-align: center;
  }
  .section-news-activity p a {
    color: #333333;
  }
  .section-news-activity p img {
    height: 175px;
  }
  .section-news {
    font-size:24px;
    text-align:justify;
  }
  .section-news img {
    width: 100%;
  }
  .section-news .form-group {
    margin-bottom:20px;
  }
  .section-news .view-more {
      color: #333333;
      float:right;
  }
  .section-news .view-more:hover {
      color: #999999;
  }
  .news-title{
    font-weight:bold;
  }
  /*margin*/
  .margin-bottom-20 {
    margin-bottom: 20px;
  }
  /*Carousel*/
  .carousel-caption {
    right: 0;
    bottom: 0;
    left: 0;
    padding-top: 0;
    padding-bottom: 0;
    background-color: rgba(0,0,0,0.6);
  }
  /*./Carousel*/
  /*Tooltip*/
  .tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}
.carousel-item {
  
}
.carousel-item-border {
  border: 1px solid #dfdfdf;
  padding: 2px;
  height: 300px;
  overflow: hidden;
}
.carousel-item-border:hover {
  background:#eeecec;
}
.tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}
/*./Tooltip*/
/*Card*/
.card{
  border-radius:0;
}
.card-dark-blue:not(.card-outline) > .card-header {
  background-color: #2165ae;
  border-radius: 0;
  padding: 8px 10px 8px 10px;
}

.card-dark-blue:not(.card-outline) > .card-header,
.card-dark-blue:not(.card-outline) > .card-header a {
  color: #ffffff;
}

  .card-dark-blue:not(.card-outline) > .card-header a.active {
      color: #ffffff;
  }
.card-dark-blue:not(.card-outline) > .card-body a {
  color: #333333;
}
.card-dark-blue:not(.card-outline) > .card-body a:hover {
  color: #000000;
}
.card-dark-blue.card-outline {
  border-top: 3px solid #007bff;
}

.card-dark-blue.card-outline-tabs > .card-header a:hover {
  border-top: 3px solid #dee2e6;
}

.card-dark-blue.card-outline-tabs > .card-header a.active {
  border-top: 3px solid #007bff;
}

.card-dark-blue:not(.card-outline) .btn-tool {
  color: rgba(255, 255, 255, 0.8);
}
.card-dark-blue:not(.card-outline) .btn-tool:hover {
  color: #fff;
}
.card .nav.flex-column > li {
  border-bottom: 0;
}
  .card .nav.flex-column > li .nav-link {
      padding: 5px;
  }
/*./Card*/
/*Card tabs*/
.card-dark-blue-tabs{
  border: 1px solid #f3f2f2;
}
.card-dark-blue-tabs .nav-tabs .nav-link {
  border: 1px solid transparent;
  border-radius:0;
  color: #333333;
  text-transform: uppercase;
}
.card-dark-blue-tabs .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
  color: #ffffff;
  background-color: #1e6abb;
  border-color: #1e6abb;
  border-radius:0;
}
/*./Card tabs*/
/*Navbar*/
.navbar {
  padding: 5px;
  margin-bottom: 10px;
}
.dropdown-menu {
  background-color: #1e6abb;
  border: 1px solid #1e6abb;
  border-radius: 0;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 18%);
  padding:0;
  margin: 5px 0 0 0;
}
  .dropdown-menu .dropdown-item {
      color: #ffffff;
      border-bottom:1px solid #2e7fd5;
  }
  .dropdown-menu .dropdown-item:hover {
      color: #333333;
  }
/*./Navbar*/
/*Navbar dark blue*/
.navbar-dark-blue {
  background-color: #2165ae;
  border-color: #2165ae;
}

  .navbar-dark-blue .navbar-brand {
      color: #fff;
      font-size:x-large;
      padding:0 !important;
  }

      .navbar-dark-blue .navbar-brand:hover, .navbar-dark-blue .navbar-brand:focus {
          color: #fff;
      }

  .navbar-dark-blue .navbar-nav .nav-link {
      color: #ffffff !important;
      padding: 5px 20px 5px 20px;
      text-transform: uppercase;
      font-size: x-large;
  }

      .navbar-dark-blue .navbar-nav .nav-link:hover, .navbar-dark-blue .navbar-nav .nav-link:focus {
          color: white;
      }

      .navbar-dark-blue .navbar-nav .nav-link.disabled {
          color: rgba(255, 255, 255, 0.25);
      }

      .navbar-dark-blue .navbar-nav .show > .nav-link,
      .navbar-dark-blue .navbar-nav .active > .nav-link,
      .navbar-dark-blue .navbar-nav .nav-link.show,
      .navbar-dark-blue .navbar-nav .nav-link.active {
          color: #fff;
      }

  .navbar-dark-blue .navbar-toggler {
      color: rgba(255, 255, 255, 0.75);
      border-color: rgba(255, 255, 255, 0.1);
  }

  .navbar-dark-blue .navbar-toggler-icon {
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 0.75%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
  }

  .navbar-dark-blue .navbar-text {
      color: rgba(255, 255, 255, 0.75);
  }

      .navbar-dark-blue .navbar-text a {
          color: #fff;
      }

          .navbar-dark-blue .navbar-text a:hover, .navbar-dark-blue .navbar-text a:focus {
              color: #fff;
          }

  .navbar-dark-blue .form-control-navbar,
  .navbar-dark-blue .btn-navbar {
      background-color: rgba(255, 255, 255, 0.2);
      border: 0;
  }

      .navbar-dark-blue .form-control-navbar::-webkit-input-placeholder {
          color: rgba(255, 255, 255, 0.6);
      }

      .navbar-dark-blue .form-control-navbar::-moz-placeholder {
          color: rgba(255, 255, 255, 0.6);
      }

      .navbar-dark-blue .form-control-navbar:-ms-input-placeholder {
          color: rgba(255, 255, 255, 0.6);
      }

      .navbar-dark-blue .form-control-navbar::-ms-input-placeholder {
          color: rgba(255, 255, 255, 0.6);
      }

      .navbar-dark-blue .form-control-navbar::placeholder {
          color: rgba(255, 255, 255, 0.6);
      }

      .navbar-dark-blue .form-control-navbar + .input-group-append > .btn-navbar {
          color: rgba(255, 255, 255, 0.6);
      }

      .navbar-dark-blue .form-control-navbar:focus,
      .navbar-dark-blue .form-control-navbar:focus + .input-group-append .btn-navbar {
          background-color: rgba(255, 255, 255, 0.6);
          border: 0 !important;
          color: #343a40;
      }

.dark-mode .navbar-dark-blue .btn-navbar,
.dark-mode .navbar-dark-blue .form-control-navbar {
  background-color: #343a40;
  border: 1px solid #6c757d;
}

  .dark-mode .navbar-dark-blue .btn-navbar:hover {
      background-color: #454d55;
  }

  .dark-mode .navbar-dark-blue .btn-navbar:focus {
      background-color: #4b545c;
  }

  .dark-mode .navbar-dark-blue .form-control-navbar + .input-group-prepend > .btn-navbar,
  .dark-mode .navbar-dark-blue .form-control-navbar + .input-group-append > .btn-navbar {
      background-color: #3f474e;
      color: #fff;
      border: 1px solid #6c757d;
      border-left: none;
  }
/*Navbar dark blue*/
/*Table*/
.stt{
  width: 50px;
}
.option {
  width: 150px;
}
/*./Table*/
/*Text align*/
.align-center{
  text-align:center;
}
.align-left {
  text-align: left;
}
.align-right {
  text-align: right;
}
.vertical-align-middle {
  vertical-align: middle;
}
/*./Text align*/
/*Color*/
.red {
  color: #ff0000;
}
.orange{
  color:#ff6a00;
}
.yellow {
  color: #ffd800;
}
.green {
  color: #4cff00;
}
.blue {
  color: #0094ff;
}
.indigo {
  color: #4800ff;
}
.violet {
  color: #b200ff;
}
.pink {
  color: #ff00dc;
}
.light-blue{
  color: #77b8fe;
}
/*./Color*/
/*Width*/
.width-10 {
  width: 10px;
}
.width-20{
  width:20px;
}
.width-30 {
  width: 30px;
}
.width-40 {
  width: 40px;
}
.width-50 {
  width: 50px;
}
.width-100 {
  width: 100px;
}
.width-150 {
  width: 150px;
}
.width-200 {
  width: 200px;
}
.width-250 {
  width: 250px;
}
.width-300 {
  width: 300px;
}
.width-350 {
  width: 350px;
}
.width-400 {
  width: 400px;
}
.width-450 {
  width: 450px;
}
.width-500 {
  width: 500px;
}
.width-550 {
  width: 550px;
}
.width-600 {
  width: 600px;
}
.width-650 {
  width: 650px;
}
.width-700 {
  width: 700px;
}
.width-750 {
  width: 750px;
}
.width-800 {
  width: 800px;
}
.width-850 {
  width: 850px;
}
.width-900 {
  width: 950px;
}
.width-1000 {
  width: 1000px;
}
.width-1050 {
  width: 1050px;
}
/*./Width*/
/*Font*/
.font-5{
  font-size:5px;
}
.font-8 {
  font-size: 8px;
}
.font-13 {
  font-size: 13px;
}
.font-14 {
  font-size: 14px;
}
.font-18 {
  font-size: 18px;
}
.font-24 {
  font-size: 24px;
}
.font-36 {
  font-size: 36px;
}
.font-48 {
  font-size: 48px;
}
.font-72 {
  font-size: 72px;
}
.font-100 {
  font-size: 100px;
}
/*./Font*/
/*Background*/
.bg-light-grey{
  background: #e4f0fc;
}
/*./Background*/
/*Bing map area*/
.map-area {
  position: relative;
  width: 100%;
  height: 350px;
}
/*./Bing map area*/
#response-home-link {
  display: none;
}

@media screen and (max-width: 767px) {
  header{
      display:none;
  }
  .body-right{
      display:none;
  }
  #home-link {
      display: none;
  }
  #response-home-link img {
      height: 45px;
  }
  #response-home-link {
      display: block;
  }
  .navbar-right{
      display:none;
  }
  /*Navbar dark blue responsive*/
  .navbar-dark-blue {
      background-color: #ffffff;
      border-color: #ffffff;
  }

      .navbar-dark-blue .navbar-brand {
          color: #333333;
          font-size: 1rem;
          padding: 0 !important;
      }

          .navbar-dark-blue .navbar-brand:hover, .navbar-dark-blue .navbar-brand:focus {
              color: #333333;
          }

      .navbar-dark-blue .navbar-nav .nav-link {
          color: #ffffff !important;
          padding: 5px 10px 5px 10px;
          background-color: #2165ae;
      }

          .navbar-dark-blue .navbar-nav .nav-link:hover, .navbar-dark-blue .navbar-nav .nav-link:focus {
              color: white;
          }

          .navbar-dark-blue .navbar-nav .nav-link.disabled {
              color: rgba(255, 255, 255, 0.25);
          }

          .navbar-dark-blue .navbar-nav .show > .nav-link,
          .navbar-dark-blue .navbar-nav .active > .nav-link,
          .navbar-dark-blue .navbar-nav .nav-link.show,
          .navbar-dark-blue .navbar-nav .nav-link.active {
              color: #333333;
          }

      .navbar-dark-blue .navbar-toggler {
          color: #333333;
          border-color: #2165ae;
      }

      .navbar-dark-blue .navbar-toggler-icon {
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%280, 0, 0, 0.75%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
      }

      .navbar-dark-blue .navbar-text {
          color: rgba(255, 255, 255, 0.75);
      }

          .navbar-dark-blue .navbar-text a {
              color: #333333;
          }

              .navbar-dark-blue .navbar-text a:hover, .navbar-dark-blue .navbar-text a:focus {
                  color: #333333;
              }

      .navbar-dark-blue .form-control-navbar,
      .navbar-dark-blue .btn-navbar {
          background-color: rgba(255, 255, 255, 0.2);
          border: 0;
      }

          .navbar-dark-blue .form-control-navbar::-webkit-input-placeholder {
              color: rgba(255, 255, 255, 0.6);
          }

          .navbar-dark-blue .form-control-navbar::-moz-placeholder {
              color: rgba(255, 255, 255, 0.6);
          }

          .navbar-dark-blue .form-control-navbar:-ms-input-placeholder {
              color: rgba(255, 255, 255, 0.6);
          }

          .navbar-dark-blue .form-control-navbar::-ms-input-placeholder {
              color: rgba(255, 255, 255, 0.6);
          }

          .navbar-dark-blue .form-control-navbar::placeholder {
              color: rgba(255, 255, 255, 0.6);
          }

          .navbar-dark-blue .form-control-navbar + .input-group-append > .btn-navbar {
              color: rgba(255, 255, 255, 0.6);
          }

          .navbar-dark-blue .form-control-navbar:focus,
          .navbar-dark-blue .form-control-navbar:focus + .input-group-append .btn-navbar {
              background-color: rgba(255, 255, 255, 0.6);
              border: 0 !important;
              color: #343a40;
          }

  .dark-mode .navbar-dark-blue .btn-navbar,
  .dark-mode .navbar-dark-blue .form-control-navbar {
      background-color: #343a40;
      border: 1px solid #6c757d;
  }

      .dark-mode .navbar-dark-blue .btn-navbar:hover {
          background-color: #454d55;
      }

      .dark-mode .navbar-dark-blue .btn-navbar:focus {
          background-color: #4b545c;
      }

      .dark-mode .navbar-dark-blue .form-control-navbar + .input-group-prepend > .btn-navbar,
      .dark-mode .navbar-dark-blue .form-control-navbar + .input-group-append > .btn-navbar {
          background-color: #3f474e;
          color: #fff;
          border: 1px solid #6c757d;
          border-left: none;
      }
  .dropdown-menu {
      margin: 0;
  }
  /*Navbar dark blue*/
}
/*Carousel multiple*/


/*./Carousel multiple*/
`;