import axios from 'axios';
import { currentLang } from '@app/i18n/i18n.module';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { RepAuth_Get } from 'src/api_repository/repAuth';
//import download from 'downloadjs';

const get_authorization = async (options?: { AccessToken: string }) => {

    let AccessToken = options?.AccessToken ?? (await RepAuth_Get()).AccessToken;

    return AccessToken ? `Bearer ${AccessToken}` : undefined;
}

const removeNull = (obj: any) => {
    if (obj) return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined));
    return undefined;
}

const toFormData = (obj: any) => {
    obj = removeNull(obj);

    // Create an object of formData
    const formData = new FormData();

    Object.keys(obj).forEach(key => {
        formData.append(key, obj[key]);
    });

    return formData;
}

export async function ApiConnectGet(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    axios
        .get(environment.api_url + options.url, {
            headers: options.headers || removeNull({
                'Content-Type': 'application/json',
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            }),
            params: removeNull(options.params) as any,
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}

export async function ApiConnectPost(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    axios
        .post(environment.api_url + options.url, (removeNull(options.params) as any), {
            headers: options.headers || removeNull({
                'Content-Type': 'application/json',
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            })
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}

export async function ApiConnectPut(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    axios
        .put(environment.api_url + options.url, (removeNull(options.params) as any), {
            headers: options.headers || removeNull({
                'Content-Type': 'application/json',
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            })
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}

export async function ApiConnectPatch(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    axios
        .patch(environment.api_url + options.url, (removeNull(options.params) as any), {
            headers: options.headers || removeNull({
                'Content-Type': 'application/json',
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            })
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}

export async function ApiConnectDelete(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    axios
        .delete(environment.api_url + options.url, {
            headers: options.headers || removeNull({
                'Content-Type': 'application/json',
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            }),
            params: removeNull(options.params) as any
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}

export async function ApiConnectPostFile(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    fetch(environment.api_url + options.url, {
        method: 'POST',
        headers: removeNull({
            Authorization: options.authorization == false ? undefined : await get_authorization(options),
            lang: (await currentLang())
        }) as any,
        body: (toFormData(options.params) as any)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('File upload failed');
            }
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success({ data: res });
            }
        })
        .catch((err: any) => {
            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })

    /*
    axios
        .post(environment.api_url + options.url, (toFormData(options.params) as any), {
            headers: removeNull({
                'Content-Type': 'application/json',
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            }) as any,
            transformRequest: formData => formData
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
            options.loading(false);
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
            options.loading(false);
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
    */
}

export async function ApiConnectGetFile(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    axios
        .get(environment.api_url + options.url, {
            headers: options.headers || removeNull({
                Authorization: options.authorization == false ? undefined : await get_authorization(options),
                lang: (await currentLang())
            }),
            params: removeNull(options.params) as any,
            responseType: 'stream'
        })
        .then((res: any) => {
            if (typeof options.success == 'function') {
                options.success(res);
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}

export async function ApiConnectDownloadFile(options: any) {

    options.loading = options.loading ?? ((resStatus: boolean) => { });
    options.loading(true);

    let loading = options.loadingController ? await (options.loadingController as LoadingController).create() : undefined;
    loading?.present();

    fetch(environment.api_url + options.url + '?' + (new URLSearchParams(removeNull(options.params) as any)), {
        headers: options.headers || removeNull({
            Authorization: options.authorization == false ? undefined : await get_authorization(options),
            lang: (await currentLang())
        }),
    })
        .then(e => {
            return e.blob();
        })
        .then(blob => {
            //download(blob, options.params.fileName, options.params.fileType);

            if (typeof options.success == 'function') {
                options.success({
                    data: {
                        status: true,
                        data: {
                            blob: blob,
                            fileName: options.params.fileName,
                            fileType: options.params.fileType
                        }
                    }
                });
            }
        })
        .catch((err: any) => {
            console.error('axios', options, err);

            if (typeof options.error == 'function') {
                options.error({ response: { data: { data: -1, message: err?.message } } });
            }
        })
        .finally(() => {
            options.loading(false);
            loading?.dismiss();
        })
}