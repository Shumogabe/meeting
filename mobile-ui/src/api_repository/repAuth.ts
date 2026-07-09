import { Drivers, Storage } from '@ionic/storage';
import { ApiConnectGet, ApiConnectPost } from '../api_connector/apiConnector';
import { IOptionRequest } from 'src/app_models/Repository';
import { IAuth } from 'src/app_models/Auth';
//import { environment } from '@env/environment';

const store = new Storage({
    name: '_authDB',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

export {
    RepAuth_Get,
    RepAuth_Set,
    RepAuth_Modify,
    RepAuth_AddUpdate,
    RepAuth_Clear,
    RepAuth_GetFirebase,
    RepAuth_SetFirebase
}

const RepAuth_Get = async (options?: IOptionRequest) => {
    await store.create();

    try {
        var dataContext = (await store.get('auth-device') || {}) as IAuth;
        if (typeof options?.callback == 'function') {
            options.callback(Object.assign({}, dataContext || {}));
        }
        return dataContext;
    }
    catch (err) {
        if (typeof options?.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }
    return {} as IAuth;
}

const RepAuth_Set = async (options: IOptionRequest) => {
    await store.create();

    options.params = options.params || {};

    try {
        var dataContext = Object.assign({}, options.params) as IAuth;

        await store.set('auth-device', dataContext);

        if (typeof options.callback == 'function') {
            options.callback(Object.assign({}, dataContext || {}));
        }
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }
}

const RepAuth_Modify = async (options: IOptionRequest) => {
    await store.create();

    options.params = options.params || {};

    try {
        var dataContext = (await store.get('auth-device') || {}) as IAuth;

        Object.assign(dataContext, options.params) as IAuth;

        await store.set('auth-device', dataContext);

        if (typeof options.callback == 'function') {
            options.callback(Object.assign({}, dataContext || {}));
        }
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }

}

const RepAuth_Clear = async (options?: IOptionRequest) => {
    if (options) {
        options.params = {};
    }
    return RepAuth_Set(options ?? {});
}

const RepAuth_AddUpdate = async (options: IOptionRequest, isnew?: boolean) => {

    if (isnew) {
        let arrPromise = [] as any;

        //check profilephoto
        if (options.params.profilephoto) {
            /*
            arrPromise.push(new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => {
                    options.params.url_profilephoto = img.src;

                    //
                    resolve(1);
                }
                img.onerror = () => {
                    options.params.url_profilephoto = "assets/image/user-avatar-default.png";

                    //
                    resolve(0);
                }
                img.src = environment.readfileuploadurl + options.params.profilephoto;
            }));
            */
        }

        //check banner
        if (options.params.banner) {
            /*
            arrPromise.push(new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => {
                    options.params.url_banner = img.src;

                    //
                    resolve(1);
                }
                img.onerror = () => {
                    options.params.url_banner = "assets/image/user-banner-default.png";

                    //
                    resolve(0);
                }
                img.src = environment.readfileuploadurl + options.params.banner;
            }));
            */
        }

        if (arrPromise.length > 0) {
            Promise.all(arrPromise)
                .then(() => {
                    RepAuth_Set(options);
                })
        }
        else {
            RepAuth_Set(options);
        }

    }
    else {
        RepAuth_Get({
            callback: (res: IAuth) => {
                if (res) {

                    let arrPromise = [] as any;

                    //check profilephoto
                    if (options.params.profilephoto) {
                        /*
                        arrPromise.push(new Promise((resolve, reject) => {
                            let img = new Image();
                            img.onload = () => {
                                options.params.url_profilephoto = img.src;

                                //
                                resolve(1);
                            }
                            img.onerror = () => {
                                options.params.url_profilephoto = "assets/image/user-avatar-default.png";

                                //
                                resolve(0);
                            }
                            img.src = environment.readfileuploadurl + options.params.profilephoto;
                        }));
                        */
                    }

                    //check banner
                    if (options.params.banner) {
                        /*
                        arrPromise.push(new Promise((resolve, reject) => {
                            let img = new Image();
                            img.onload = () => {
                                options.params.url_banner = img.src;

                                //
                                resolve(1);
                            }
                            img.onerror = () => {
                                options.params.url_banner = "assets/image/user-banner-default.png";

                                //
                                resolve(0);
                            }
                            img.src = environment.readfileuploadurl + options.params.banner;
                        }));
                        */
                    }

                    if (arrPromise.length > 0) {
                        Promise.all(arrPromise)
                            .then(() => {
                                RepAuth_Set({
                                    params: Object.assign({}, res, options.params),
                                    callback: options.callback
                                });
                            })
                    }
                    else {
                        RepAuth_Set({
                            params: Object.assign({}, res, options.params),
                            callback: options.callback
                        });
                    }
                }
                else {
                    if (typeof options.callback == 'function') {
                        options.callback();
                    }
                }
            }
        });
    }
}

const RepAuth_GetFirebase = async (options: any) => {
    await store.create();

    try {
        var dataContext = (await store.get('firebase-device') || {}) as any;
        if (typeof options.callback == 'function') {
            options.callback(Object.assign({}, dataContext || {}));
        }
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }

}

const RepAuth_SetFirebase = async (options: any) => {
    await store.create();

    options.params = options.params || {};

    try {
        var dataContext = Object.assign({}, options.params);

        await store.set('firebase-device', dataContext);

        if (typeof options.callback == 'function') {
            options.callback(Object.assign({}, dataContext || {}));
        }
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }

}

//

export const RepAuth_dang_nhap = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            authorization: false,
            url: 'Auth/dang_nhap',
            params: {
                "username": options.params.username,
                "password": options.params.password,
                "rememberme": options.params.rememberme,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepAuth_quyen_nguoi_dung = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'Auth/phan_quyen_vai_tro_nguoi_dung/quyen_nguoi_dung',
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}