/*
 *  @2019 Cs-core project
 *
 */

import message from "../components/Message";
import { MESSAGE } from "../constants/dictionaries";
import { ErrorHandlingLS } from "../lightState/ErrorHandling";
import { add as addLoading } from "../lightState/Loader";
import { getCCU } from "./ccuServices";

import { API_CORE_URI } from "../config";

const baseUri = API_CORE_URI;

export class HttpException extends Error {
  constructor({ message, status, statusText, url, ErrorCode, data } = {}) {
    super(message);
    this.pureMessage = message;
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.ErrorCode = ErrorCode;
    this.data = data;
  }
}

export default class APIService {
  constructor({ token, ccuConfig }) {
    this.baseUri = baseUri || "";
    this.credentials = token && token?.length > 0 ? token : null;
    this.ccuConfig = ccuConfig;
    this.headersBuilderDownload = (newToken) => {
      const token = newToken || this.credentials;
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          }
        : {
            "Content-Type": "application/json",
          };
      if (process.env.NODE_ENV !== "development") {
        delete headers["Ocp-Apim-Subscription-Key"];
      }
      return headers;
    };
    this.headersBuilderUpload = (newToken) => {
      const token = newToken || this.credentials;
      const headers = { Authorization: "Bearer " + token };
      if (process.env.NODE_ENV !== "development") {
        delete headers["Ocp-Apim-Subscription-Key"];
      }
      return headers;
    };
  }

  callAPIGetFile({
    method,
    path,
    data,
    isRefreshTokenApi = false,
    isRequestAfterRefreshToken = false,
    newToken = null,
    type,
  }) {
    const removeLoading = addLoading();
    let body = data;
    if (this.ccuConfig && this.ccuConfig.get) {
      let ccuData = getCCU(this.ccuConfig.get);
      body = { ...body, ...ccuData };
    }

    return fetch(this.baseUri + path, {
      method: method,
      mode: "cors",
      headers: this.headersBuilderDownload(newToken),
      body: data !== null ? JSON.stringify(body) : null,
    })
      .then((response) => {
        removeLoading();
        if (!response) {
          ErrorHandlingLS.setState({
            error: {
              message: "Server maintaine.",
              ErrorCode: 503,
              status: 503,
              statusText: `HttpException[${method}]`,
            },
          });
        }
        // if response is ok transform response.text to json object
        // else throw error
        if (response.ok) {
          if (response.status === 299) {
            return response.json().then((err) => {
              throw new Error(err && err.message);
            });
          }
          return response.blob();
        } else if (response.status === 401) {
          message.error(MESSAGE.cscore_tnn_ERROR);
          // TODO: handle logout
        } else if (response.status === 500) {
          // throw new Error(MESSAGE.cscore_tnn_ERROR)
          // response.json().then(err => {
          //     message.error(err.mess);
          // })
          message.error(MESSAGE.cscore_tnn_ERROR);

          // TODO: handle logout
        } else {
          message.error(MESSAGE.cscore_tnn_ERROR);
        }
      })
      .then((blob) => {
        if (!blob) {
          // throw new Error(MESSAGE.cscore_tnn_ERROR);
          // message.error(MESSAGE.cscore_tnn_ERROR)
        } else {
          /*TODO: Concurrent users*/
          const url = window.URL.createObjectURL(blob);
          return url;
        }
      });
  }

  postDataDown({ path, data, project, fileName }) {
    return this.callAPIDownloadFile({
      path,
      method: "POST",
      data,
      fileName,
      project,
    });
  }
  postDataUp({ path, data, project }) {
    return this.callAPIUploadFile({
      path,
      method: "POST",
      data,
      project,
    });
  }
  getDataDown({ path, data, project, fileName }) {
    return this.callAPIDownloadFile({
      path,
      method: "GET",
      data,
      fileName,
      project,
    });
  }
  getData({ path, data, project, fileName, type }) {
    return this.callAPIGetFile({
      path,
      method: "GET",
      data,
      fileName,
      project,
      type,
    });
  }
}
