import { AUTH_ACTIONS } from '../actions';
import _ from 'lodash';

const defaultState = null;

const authReducer = (state = defaultState, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.types.STORAGE_AUTH: {
            return action.payload;
        }
        default:
            return state;
    }
};

export default authReducer;
