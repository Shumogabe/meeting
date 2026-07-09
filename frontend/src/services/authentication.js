import { HandleLogout } from "../components/Modal";
import { SweetAlertWithRedirect } from "../controllers/sweetalert";
class Authentication {
  signout() {
    localStorage.clear();
    HandleLogout("login");
    SweetAlertWithRedirect(
      "Thông báo! Bạn đã đăng xuất",
      ". . .",
      0,
      "/",
      "warning"
    );
    //window.location.href =('/');
    //alert('Đăng xuất');
  }
}
export default new Authentication();
