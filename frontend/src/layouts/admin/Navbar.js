import { React, Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../services/authentication";
import { SESSION_STORAGE } from "../../config";
import { CheckUser, HandleLogout } from "../../components/Modal";
import Helper from "../../helper/helper";
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem("UserInfo")),
    };
    this.path = window.location.pathname;
  }

  componentDidMount() {
    CheckUser().then((user) => {
      if (Helper.isNullOrUndefined(user)) {
        HandleLogout("login");
      } else {
        // this.setState({
        //   user: user,
        // });
      }
    });
  }

  render(props) {
    return this.state.user ? (
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <ul class="navbar-nav">
          <li class="nav-item site-name">
            <a href="/" class="nav-link">
              QUẢN TRỊ HỆ THỐNG
            </a>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link" data-toggle="dropdown">
              DANH MỤC
            </a>
            <div class="dropdown-menu dropdown-menu-lg">
              <a href="/admin/catalog/channel" class="dropdown-item">
                Chuyên mục
              </a>
              <div class="dropdown-divider"></div>
              <a href="/admin/catalog/articletype" class="dropdown-item">
                Loại tin
              </a>
              {/* <div class="dropdown-divider"></div>
                  <a href="#" class="dropdown-item">
                    Link
                  </a> */}
              {/* <div class="dropdown-divider"></div>
                  <a href="#" class="dropdown-item dropdown-footer">
                    See All Messages
                  </a> */}
            </div>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link" data-toggle="dropdown">
              CƠ CẤU TỔ CHỨC
            </a>
            <div class="dropdown-menu dropdown-menu-lg">
              <a
                href="/admin/organizationalstructure/organ"
                class="dropdown-item"
              >
                Cơ quan
              </a>
              <div class="dropdown-divider"></div>
              <a
                href="/admin/organizationalstructure/user"
                class="dropdown-item"
              >
                Người dùng
              </a>
              <div class="dropdown-divider"></div>
              <a
                href="/admin/organizationalstructure/position"
                class="dropdown-item"
              >
                Chức vụ
              </a>
              <div class="dropdown-divider"></div>
              <a
                href="/admin/organizationalstructure/role"
                class="dropdown-item"
              >
                Vai trò
              </a>
              <div class="dropdown-divider"></div>
              <a
                href="/admin/organizationalstructure/authorize"
                class="dropdown-item"
              >
                Phân quyền
              </a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a href="#" class="nav-link" data-toggle="dropdown">
              HỆ THỐNG
            </a>
            <div class="dropdown-menu dropdown-menu-lg">
              <a href="/admin/system/config" class="dropdown-item">
                Cấu hình
              </a>
              <div class="dropdown-divider"></div>
              <a href="/admin/system/module" class="dropdown-item">
                Chức năng
              </a>
              <div class="dropdown-divider"></div>
              <a href="/admin/system/language" class="dropdown-item">
                Ngôn ngữ
              </a>
              <div class="dropdown-divider"></div>
              <a href="/admin/system/layout" class="dropdown-item">
                Bố cục trang
              </a>
              <div class="dropdown-divider"></div>
              <a href="/admin/system/widget" class="dropdown-item">
                Bố cục hiển thị
              </a>
              <div class="dropdown-divider"></div>
              <a href="/admin/system/server" class="dropdown-item">
                Máy chủ
              </a>
            </div>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-comments"></i>
              <span class="badge badge-danger navbar-badge">3</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <a href="#" class="dropdown-item">
                <div class="media">
                  <img
                    src="dist/img/user1-128x128.jpg"
                    alt="User Avatar"
                    class="img-size-50 mr-3 img-circle"
                  />
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      Brad Diesel
                      <span class="float-right text-sm text-danger">
                        <i class="fas fa-star"></i>
                      </span>
                    </h3>
                    <p class="text-sm">Call me whenever you can...</p>
                    <p class="text-sm text-muted">
                      <i class="far fa-clock mr-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <div class="media">
                  <img
                    src="dist/img/user8-128x128.jpg"
                    alt="User Avatar"
                    class="img-size-50 img-circle mr-3"
                  />
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      John Pierce
                      <span class="float-right text-sm text-muted">
                        <i class="fas fa-star"></i>
                      </span>
                    </h3>
                    <p class="text-sm">I got your message bro</p>
                    <p class="text-sm text-muted">
                      <i class="far fa-clock mr-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <div class="media">
                  <img
                    src="dist/img/user3-128x128.jpg"
                    alt="User Avatar"
                    class="img-size-50 img-circle mr-3"
                  />
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      Nora Silvester
                      <span class="float-right text-sm text-warning">
                        <i class="fas fa-star"></i>
                      </span>
                    </h3>
                    <p class="text-sm">The subject goes here</p>
                    <p class="text-sm text-muted">
                      <i class="far fa-clock mr-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item dropdown-footer">
                See All Messages
              </a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-bell"></i>
              <span class="badge badge-warning navbar-badge">15</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span class="dropdown-item dropdown-header">
                15 Notifications
              </span>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-envelope mr-2"></i> 4 new messages
                <span class="float-right text-muted text-sm">3 mins</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-users mr-2"></i> 8 friend requests
                <span class="float-right text-muted text-sm">12 hours</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-file mr-2"></i> 3 new reports
                <span class="float-right text-muted text-sm">2 days</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
              <i class="fas fa-expand-arrows-alt"></i>
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link"
              data-widget="pushmenu"
              data-slide="true"
              href="#"
              role="button"
            >
              <i class="fas fa-th-large"></i>
            </a>
          </li>
          {/* <li class="nav-item">
              <a class="nav-link" href="#" role="button">
                Xin chào: <i class="fas fa-user"></i> {this.state.user.UserInfo.User && this.state.user.UserInfo.User.userName}
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" role="button" onClick={() => Auth.signout()}>
                <i class="fas fa-sign-in-alt"></i>
              </a>
            </li> */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Xin chào: <i className="fas fa-user"></i>{" "}
              {this.state.user?.UserInfo?.User?.userName}
            </a>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <a className="dropdown-item" href="#">
                Đơn vị:{" "}
                {this.state.user &&
                  this.state.user?.UserInfo &&
                  this.state.user?.UserInfo?.Organ &&
                  this.state.user?.UserInfo?.Organ?.title}
              </a>
              <a className="dropdown-item" href="#">
                Chức vụ:{" "}
                {this.state.user &&
                  this.state.user?.UserInfo &&
                  this.state.user?.UserInfo?.Position &&
                  this.state.user?.UserInfo?.Position?.title}
              </a>
              <a className="dropdown-item" onClick={() => Auth.signout()}>
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/" title="Xem ngoài site">
              <i class="fas fa-eye blue"></i>
            </a>
          </li>
        </ul>
      </nav>
    ) : (
      (window.location.href = "/")
    );
  }
}

export { Navbar };
