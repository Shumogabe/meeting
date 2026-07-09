import { createSlice } from '@reduxjs/toolkit';
import { getFunctionsByRole, getProfile } from '../../services/apis/danhmuc-service';

const commonReducer = createSlice({
    name: 'common',
    initialState: {
        functions: {
            data: [],
            loading: 'idle',
        },
        profile: {
            data: {},
            loading: 'idle',
        },
        tinhs: {
            data: [],
            loading: 'idle',
        },
        kinhtuyentruc: {
            data_dp: [],
            data_tw: [],
            loading: 'idle',
        },
        danhmucs: {
            data: [],
            loading: 'idle',
        },
    },
    extraReducers: (builder) => {
        builder
            // Profile
            .addCase(getProfile.pending, (state, action) => {
                state.profile = { data: [], loading: 'pending' };
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.profile = { data: action.payload, loading: 'success' };
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.profile = { data: action.error, loading: 'error' };
            })
            //Functions
            .addCase(getFunctionsByRole.pending, (state, action) => {
                state.functions = { data: [], loading: 'pending' };
            })
            .addCase(getFunctionsByRole.fulfilled, (state, action) => {
                state.functions = { data: action.payload, loading: 'success' };
            })
            .addCase(getFunctionsByRole.rejected, (state, action) => {
                state.functions = { data: action.error, loading: 'error' };
            });
    },
});

export default commonReducer;
