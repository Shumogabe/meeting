const types = {
    ADD_CACHE_DATA: 'ADD_CACHE_DATA',
};

const addCacheData = (name, data, expired = 10000) => ({
    type: types.ADD_CACHE_DATA,
    payload: {
        [name]: {
            data,
            expired,
        },
    },
});

export default {
    types,
    addCacheData,
};
