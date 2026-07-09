import { SESSION_STORAGE } from "../config";
import { HREF } from "../constants/dictionaries";
import userManager from "../services/auth";
import Helper from "./helper";

export const FUNC_PERMISSION = {
  ARTICLE: "Article",
  PERSONAL_INFO: "PersonalInfo",
  LAW: "Law",
  FILE: "File",
  PROCEDURE: "Procedure",
  SYSTEM_ADMIN: "SystemAdmin",
  SITE_LINK: "SiteLink",
  PROJECT: "Project",
  ORGANIZATION: "Organization",
  APPROVE: "Approve",
  CONTACT: "Contact",
  CATALOG: "Catalog",
  DOCUMENT: "Document",
  SCHEDULE: "Schedule",
  CAPHAT_DICHVU: "CapPhatDichVu",
};

export function getSystemRole(functionname, authorize) {
  var role = [];
  if (authorize != null && functionname != null) {
    authorize.forEach((element, item) => {
      if (element.Module === functionname) {
        role = {
          Create: element.Role.Create,
          Read: element.Role.Read,
          Edit: element.Role.Edit,
          Delete: element.Role.Delete,
          Approve: element.Role.Approve,
          Publish: element.Role.Publish,
          Authorize: element.Role.Authorize,
        };
      }
    });
  }
  return role;
}

export function getPermission(functionname, authorize) {
  var role = [];
  if (authorize != null && functionname != null) {
    authorize.forEach((element, item) => {
      if (element.module === functionname) {
        return (role = {
          Create: role.Create ? role.Create : element.create,
          Read: role.Read ? role.Read : element.read,
          Edit: role.Edit ? role.Edit : element.edit,
          Delete: role.Delete ? role.Delete : element.delete,
          Approve: role.Approve ? role.Approve : element.approve,
          Publish: role.Publish ? role.Publish : element.publish,
          Authorize: role.Authorize ? role.Authorize : element.authorize,
        });
      }
    });
  }
  return role;
}

export function getPermission_demo(functionname, authorize) {
  //authorize: list các quyền | functionname: list các func ở trên FUNC_PERMISSION
  var role = [];
  if (authorize != null && functionname != null) {
    authorize.forEach((element, item) => {
      if (element.ten === "Đại diện đơn vị") {
        role.push(1);
      }
      if (element.ten === "Xem tất cả") {
        role.push(2);
      }
      if (element.ten === "Cán bộ hạ tầng") {
        role.push(3);
      }
    });
  }
  return role;
}

export function checkSSO() {
  if (
    !Helper.isNullOrUndefined(sessionStorage.getItem(SESSION_STORAGE)) &&
    Number(JSON.parse(localStorage.getItem(SESSION_STORAGE))?.expires_at) *
      1000 +
      1 -
      Number(Math.round(new Date().getTime())) <=
      0
  ) {
    let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
    sessionStorage.clear();
    sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
    localStorage.clear();
    window.location.href = HREF.DangNhap;
    userManager.removeUser().then(() => {
      window.location.href = "/";
    });
  }
  const timer = setTimeout(
    () => {
      let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
      sessionStorage.clear();
      sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
      localStorage.clear();
      window.location.href = HREF.DangNhap;
      userManager.removeUser().then(() => {
        window.location.href = "/";
      });
      // userManager.signoutRedirect({
      //   // post_logout_redirect_uri: APP_ADMIN_URI,
      // });
    },
    Number(JSON.parse(localStorage.getItem(SESSION_STORAGE))?.expires_at) *
      1000 +
      1 -
      Number(Math.round(new Date().getTime())),
  );
  return () => clearTimeout(timer);
}
