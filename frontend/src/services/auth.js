import { UserManager } from "oidc-client";
import {
  API_IDENTITY_URI,
  APP_ADMIN_REDIRECT_URL,
  APP_ADMIN_SILENT_REDIRECT_URL,
  APP_ADMIN_URI,
  CLIENT_ID,
  href_fe,
} from "../config";

const userManagerConfig = {
  client_id: CLIENT_ID,
  redirect_uri: APP_ADMIN_REDIRECT_URL,
  post_logout_redirect_uri: APP_ADMIN_URI, //APP_ADMIN_REDIRECT_URL,
  response_type: "id_token token",
  scope:
    "openid profile CSCoreApi CSCore_NghiepVu_Api CSCore_DMS_Api CSCore_Spatial_Api CSCore_Ocelot_ApiGateway",
  authority: API_IDENTITY_URI,
  silent_redirect_uri: APP_ADMIN_SILENT_REDIRECT_URL,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  monitorSession: true,
};

const userManager = new UserManager(userManagerConfig);

export default userManager;
