import { Drivers, Storage } from '@ionic/storage';

const store = new Storage({
    name: '_localDB',
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
});

export const RepLocalStorage_GetSetting = async (options?: any) => {
    await store.create();
    var storeCode = 'setting';

    options = options ?? {};
    options.params = options.params || {};

    try {
        var dataContext = (await store.get(storeCode) || {} as any);
        if (typeof options.callback == 'function') {
            options.callback(dataContext);
        }
        return dataContext;
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }
    return {} as any;
}

export const RepLocalStorage_SetSetting = async (options?: any) => {
    await store.create();
    var storeCode = 'setting';

    options = options ?? {};
    options.params = options.params || {};

    try {
        var dataContext = (await store.get(storeCode) || {});

        Object.assign(dataContext, options.params);

        await store.set(storeCode, dataContext);

        if (typeof options.callback == 'function') {
            options.callback(dataContext);
        }
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }
}

export const RepLocalStorage_ClearSetting = async (options?: any) => {
    await store.create();
    var storeCode = 'setting';

    options = options ?? {};
    options.params = options.params || {};

    try {
        await store.set(storeCode, {});

        if (typeof options.callback == 'function') {
            options.callback();
        }
    }
    catch (err) {
        if (typeof options.callback == 'function') {
            options.callback();
        }
        console.error(err);
    }
}