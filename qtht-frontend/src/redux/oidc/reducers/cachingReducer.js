import { CACHING_ACTIONS } from '../actions';

const initialData = {};

const cachingReducer = (state = initialData, action) => {
    switch (action.type) {
        case CACHING_ACTIONS.types.ADD_CACHE_DATA: {
            return { ...state, ...action.payload };
        }
        default:
            return state;
    }
};

export default cachingReducer;
