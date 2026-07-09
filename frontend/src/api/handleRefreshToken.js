/*
 *  @2019 Cs-core project
 *
 */

import { notifyObservable, subscribeObservable } from "../services/Observable";
import Auth from "../services/auth";
import Api from "./index";

export default async function (request) {
  if (window.isFetchingNewToken) {
    /**
     * //  subcrice new token and do the request again..
     * subcrice(isRefreshTokenSuccessed => {
     *   isRefreshTokenSuccessed && request()
     * });
     */

    return subscribeObservable().then((newToken) => {
      if (newToken) {
        return request(newToken);
      }
    });
  } else {
    // tell to other api the fetching token already progressing

    window.isFetchingNewToken = true;
    return new Api().refreshToken().then((res) => {
      if (res.status === 401) {
        notifyObservable(false);
        // refresh token expired also.
        throw new Error("Refresh token expried.");
      } else {
        // Save the new token
        // push an event to tell all subcrice do continute the request.
        new Auth().handleRefreshTokenSuccessed(res);
        notifyObservable(res.data.AuthToken);
        window.isFetchingNewToken = false;
        return request(res.data.AuthToken);
      }
    });
  }
}
