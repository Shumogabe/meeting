const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const url = window.location.hostname;
//" + url.split(".")[1] + "

// export const href_fe = "http://" + url + ":9001/";
// export const href_fe = "https://cmeeting.ciis.vn/";
// export const href_fe = "https://meeting.mae.gov.vn/";
// export const href_fe = "https://meeting1.mae.gov.vn/";
export const href_fe = isDev
  ? "http://" + url + ":9001/"
  : "https://" + url.split(".")[0] + ".mae.gov.vn/";

// export const href_be = "http://" + url + ":9002/";
// export const href_be = "https://cmeeting-api.ciis.vn/";
// export const href_be = "https://meeting-api.mae.gov.vn/";
// export const href_be = "https://meeting1-api.mae.gov.vn/";
export const href_be = isDev
  ? "http://" + url + ":9002/"
  : "https://" + url.split(".")[0] + "-api.mae.gov.vn/";

// export const href_be_qtht = "http://" + url + ":9004/";
// export const href_be_qtht = "https://meeting-qthtapi.mae.gov.vn/";
// export const href_be_qtht = "https://meeting1-qthtapi.mae.gov.vn/";
export const href_be_qtht = isDev
  ? "http://" + url + ":9004/"
  : "https://" + url.split(".")[0] + "-qthtapi.mae.gov.vn/";

// export const href_fe_qtht = "http://" + url + ":9003/";
// export const href_fe_qtht = "https://meeting-qtht.mae.gov.vn/";
// export const href_fe_qtht = "https://meeting1-qtht.mae.gov.vn/";
export const href_fe_qtht = isDev
  ? "http://" + url + ":9003/"
  : "https://" + url.split(".")[0] + "-qtht.mae.gov.vn/";

// export const href_sso = "https://xttk.monre.gov.vn:9443/";
export const href_sso = "https://xacthuc.mae.gov.vn/";

// export const CLIENT_ID = "bHKxaF8Gio5JEqQ5sGcxGYAyt84a"; //https://xttk.monre.gov.vn:9443/
export const CLIENT_ID = "zrAi9HWLePnyM9AdScsJ3AxxcJsa"; //https://xacthuc.mae.gov.vn/

export const API_IDENTITY_URI = href_sso + "oauth2/token";

export const API_IDENTITY_URI_LOGOUT = href_sso + "oidc/logout";

export const API_CORE_URI = href_be;

export const API_TNN_URI = "http://localhost:8082/api/tnn/";

export const API_DMS_URI = "http://localhost:8082/api/dms";

export const API_SPATIAL_URI = "http://localhost:8082/api/spatial";

export const APP_ADMIN_URI = href_fe;

export const APP_ADMIN_REDIRECT_URL = href_fe + "callback";

export const APP_ADMIN_SILENT_REDIRECT_URL = href_fe + "silentRenew";

export const APP_DASHBOARD_URI = "http://localhost:5001/api/";

export const APP_DASHBOARD_REDIRECT_URL = "http://localhost:5001/callback";

export const APP_DASHBOARD_SILENT_REDIRECT_URL =
  "http://localhost:5001/silentRenew";

export const APP_TNN_URI = "http://localhost:5300/";

export const APP_TNN_REDIRECT_URL = "http://localhost:5300/callback";

export const APP_TNN_SILENT_REDIRECT_URL = "http://localhost:5300/silentRenew";

export const DATETIME = {
  NULL: "01/01/1970 00:00:00 AM",
  FORMAT: {
    DDMMYYYY: "DD-MM-YYYY",
    MMDDYYYY: "MM-DD-YYYY",
    DDMMYYYY_HHMMSS: "DD-MM-YYYY hh:mm A",
    MMDDYYYY_HHMMSS: "MM-DD-YYYY hh:mm:ss A",
    HHMMSS: "hh:mm A",
  },
};
export const APP_TYPE = "monre"; //ciis //monre //dinte
export const APP_NAME = "cmeeting";
export const PAGE_CURRENT = 1;
export const PAGE_SIZE = 10;

export const SESSION_STORAGE =
  `oidc.user:` + href_sso + `oauth2/token:${CLIENT_ID}`;
export const KEY_LOGIN_HTT = "LoginHTT";
export const Authorization_xttk = "YWRtaW46SGFUYW5nIUAjNDU2Nzg5";
export const CONFIG = {
  DEFAULT_FORMAT_DATE: DATETIME.FORMAT.DDMMYYYY,
  DEFAULT_FORMAT_DATETIME: DATETIME.FORMAT.DDMMYYYY_HHMMSS,
  DEFAULT_LAYOUT_ID: 4, //Layout trang chủ
  SUPPER_ADMIN: "testquanlyduan",
  DEFAULT_PATICTION_DIR: "C", //Phân vùng lưu trữ tệp tin trên máy chủ
  ROOT_DIR: "APP_STORAGE_FILES", //Thư mục gốc lưu trữ tệp tin cho các ứng dụng
  APPLICATION_DIR: "APP_0DNF84S48H562JKYUFE7584YD045B7892CCF", //Thư mục lưu trữ tệp tin của từng ứng dụng
};
export const PERMISSION = {
  CREATE: "Create",
  READ: "Read",
  EDIT: "Edit",
  DELETE: "Delete",
  APPROVE: "Approve",
  PUBLISH: "Publish",
  AUTHORIZE: "Authorize",
};
export const PREFIX = "/";
export const MOD = {
  ADMIN: "admin",
  USER: "user",
  MEETING: "meeting",
};
export const API_URL = href_be.slice(0, -1);
