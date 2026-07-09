import { createSlice } from '@reduxjs/toolkit';

const tableReducer = createSlice({
    name: 'table',
    initialState: {
        autofit: true,
        detail: false,
        fullsize: false,
        openDraw: true,
    },
    reducers: {
        autofit: (state, action) => {
            state.autofit = !state.autofit;
        },
        opendetail: (state, action) => {
            state.detail = true;
        },
        offdetail: (state, action) => {
            state.detail = false;
            state.fullsize = false;
        },
        openfullsize: (state, action) => {
            state.fullsize = true;
        },
        closefullsize: (state, action) => {
            state.fullsize = false;
        },
        handlefullsize: (state, action) => {
            state.fullsize = !state.fullsize;
            state.autofit = !state.autofit;
        },
        handleOpenDraw: (state, action) => {
            state.openDraw = !state.openDraw;
        },
    },
});

export default tableReducer;
