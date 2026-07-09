const Types = {
  LOAD_SUBSCRIPTIONS_START: "redux-oidc-sample/LOAD_SUBSCRIPTIONS_START",
  LOAD_SUBSCRIPTIONS_SUCCESS: "redux-oidc-sample/LOAD_SUBSCRIPTIONS_SUCCESS"
};

export function loadSubscriptionsStart() {
  return {
    type: Types.LOAD_SUBSCRIPTIONS_START
  };
}

export function loadSubscriptionsSuccess(channels) {
  return {
    type: Types.LOAD_SUBSCRIPTIONS_SUCCESS,
    payload: channels
  };
}

export default {
  Types,
  loadSubscriptionsStart,
  loadSubscriptionsSuccess
};
