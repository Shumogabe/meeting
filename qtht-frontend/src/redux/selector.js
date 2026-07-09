import { createSelector } from '@reduxjs/toolkit';

export const userSelector = (state) => state.oidc.user;
export const commonReducerSelector = (state) => state.commonReducer;
export const tableSelector = (state) => state.tableReducer;

export const commonReducerMainSelector = createSelector(commonReducerSelector, (commonReducer) => {
    return commonReducer;
});
