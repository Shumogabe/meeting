import { FUNCTION_ACTIONS } from '../actions';

const initialData = [];

const functionReducer = (state = initialData, action) => {
    switch (action.type) {
        case FUNCTION_ACTIONS.types.ADD_LIST_FUNCTIONS: {
            return [...state, ...action.payload];
        }
        default:
            return state;
    }
};

export default functionReducer;
