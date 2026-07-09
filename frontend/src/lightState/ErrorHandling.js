/*
 *  @2019 CS-Core project.
 *
 */

import LightState from "react-light-state";

export const ErrorHandlingLS = new LightState(
  {
    error: false,
    error409: false,
  },
  "error"
);

// Handle all errors which unhanlde from api
export const setupUnhandleError = function () {
  // prevent unhandledrejection default of react
  // For now, don't know how to prevent the default error alert
  // when unhandledrejection showing up in `Development` mode
  // but it work perfect on production.

  // add a custom event listener for `unhandledrejection`
  window.addEventListener("unhandledrejection", (event) => {
    if (event.status !== 400) {
      ErrorHandlingLS.setState({ error: event.reason });
    }
    // console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
  });
};
