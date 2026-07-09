import { configureStore } from '@reduxjs/toolkit';
import { reducer as oidcReducer } from 'redux-oidc';
import cachingReducer from '../redux/oidc/reducers/cachingReducer';
import functionReducer from '../redux/oidc/reducers/functionReducer';
import subscriptionReducer from '../redux/oidc/reducers/subscriptionReducer';
import commonReducer from './slice/CommonSlice';
import tableReducer from './slice/TableSlice.js';

const store = configureStore({
    reducer: {
        commonReducer: commonReducer.reducer,
        tableReducer: tableReducer.reducer,
        oidc: oidcReducer,
        subscription: subscriptionReducer,
        caching: cachingReducer,
        functions: functionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
