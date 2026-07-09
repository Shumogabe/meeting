import { Component, React } from "react";

class MainSidebar extends Component {
  render() {
    return (
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <div class="sidebar">
          <nav class="mt-2">
            <ul
              class="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li class="nav-item menu-open">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-newspaper"></i>
                  <p>
                    Quản lý bài viết
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/cms/article/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Soạn thảo bài viết</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/cms/article/draft" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Bài viết đang soạn thảo</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/cms/article" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Bài viết công bố</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-address-book"></i>
                  <p>
                    Quản lý liên hệ
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/contact/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Tạo mới liên hệ</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/contact" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Tất cả các liên hệ</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-address-card"></i>
                  <p>
                    Quản lý thông tin cá nhân
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/personalInfo/info" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Thông tin tài khoản</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/personalInfo/password" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Đổi mật khẩu</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-file-alt"></i>
                  <p>
                    Quản lý văn bản
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/law/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Soạn thảo văn bản</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/law/draft" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Văn bản đang soạn thảo</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/law" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Văn bản công bố</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-file"></i>
                  <p>
                    Quản lý tệp tin
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/file/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Tạo mới tệp tin</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/file" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Tất cả các tệp tin</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-gavel"></i>
                  <p>
                    Quản lý thủ tục hành chính
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/procedure/new" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Thủ tục hành chính mới</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/procedure/ministry" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>TTHC tại Bộ, cơ quan</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/procedure/local" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>TTHC tại địa phương</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/procedure/another" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>TTHC theo ngành</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-cog"></i>
                  <p>
                    Quản trị hệ thống
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/system/config" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Cấu hình</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/system/module" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Chức năng</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/system/language" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Ngôn ngữ</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/system/layout" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Bố cục trang</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/system/widget" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Bố cục hiển thị</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/system/server" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Máy chủ</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-link"></i>
                  <p>
                    Quản trị liên kết
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/link/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Tạo mới liên kết</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/link" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Danh sách các liên kết</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-project-diagram"></i>
                  <p>
                    Quản trị dự án
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/project/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Lập kế hoạch</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/project/invest" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>DS chuẩn bị đầu tư</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/project/executing" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>DS thực hiện thi công</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/project/financial" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Nhiệm vụ tài chính</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/project/administrative" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Nhiệm vụ hành chính</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-sitemap"></i>
                  <p>
                    Quản lý cơ cấu tổ chức
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/organization/function" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>CCTC theo chức năng</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/organization/authorities" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>CCTC phân quyền</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/organization/matric" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>CCTC ma trận</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-folder-open"></i>
                  <p>
                    Quản lý danh mục
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/catalog/channel" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Chuyên mục</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/catalog/articletype" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Loại tin</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-print"></i>
                  <p>
                    Quản trị tư liệu
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/document/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Thêm tư liệu mới</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/document" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>DS tư liệu</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <i class="nav-icon fas fa-calendar-alt"></i>
                  <p>
                    Quản lý lập lịch
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <a href="/admin/schedule/create" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Tạo lịch</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/schedule/approved" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Lịch đã phê duyệt</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="/admin/schedule/unapproved" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>Lịch chưa phê duyệt</p>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    );
  }
}

export { MainSidebar };
