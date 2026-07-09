// common api

import { createAsyncThunk } from '@reduxjs/toolkit';
import Api, { SESSION_STORAGE } from '../../api2';
import Helper from '../../helpers';

/**
 * @param {*} data
 */
//DVHC

//Profile
export const getProfile = createAsyncThunk('common/getProfile', async (user) => {
    var dulieu = null;

    await new Api()
        .Profile({ token: user?.access_token })
        .then((data) => {
            if (data.code === 200) {
                dulieu = { ...data.data.result };
            }
        })
        .catch((err) => {});
    return dulieu;
});
//Functions By Role
export const getFunctionsByRole = createAsyncThunk('common/getFunctionsByRole', async (user) => {
    var dulieu = null;
    await new Api()
        .getFunctionsByRole({ token: user?.access_token })
        .then((data) => {
            if (data.code === 200) {
                dulieu = data.data.result;
            }
        })
        .catch((err) => {});
    return dulieu;
});

export const CheckUser = () => {
    return new Promise((resolve, reject) => {
        var res = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
        var user = null;
        if (Helper.isNullOrUndefined(res)) {
            return resolve(user);
        }
        if (!Helper.isNullOrUndefined(res) && Number(res?.expires_at) - Number(Math.round(new Date().getTime() / 1000)) - 1000 < 0) {
            return resolve(user);
        } else {
            new Api()
                .CheckThongTinCanBo({
                    token: res?.access_token,
                })
                .then((resp) => {
                    if (!Helper.isNullOrUndefined(resp)) {
                        return resolve(resp);
                    }
                })
                .catch((error) => {
                    return reject(error);
                });
        }
    });
};
