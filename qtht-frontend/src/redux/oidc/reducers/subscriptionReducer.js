import { SUBSCRIPTION_ACTIONS } from '../actions';
import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';

const initialState = {
    channels: [],
};

export default function oidcReducer(state = initialState, action) {
    switch (SUBSCRIPTION_ACTIONS.type) {
        case SESSION_TERMINATED:
        case USER_EXPIRED:
            return Object.assign({}, state, { channels: [] });
        case SUBSCRIPTION_ACTIONS.Types.LOAD_SUBSCRIPTIONS_SUCCESS:
            return Object.assign({}, state, { channels: action.payload });
        default:
            return state;
    }
}
