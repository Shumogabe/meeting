const types = {
    ADD_LIST_FUNCTIONS: 'ADD_LIST_FUNCTIONS',
};

const GET_PROFILE_REQUEST = 'get_profile_request';

const addProfile = (user) => {
    return {
        type: GET_PROFILE_REQUEST,
        user,
    };
};

export default {
    types,
    addProfile,
};
