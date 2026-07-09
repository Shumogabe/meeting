/*
 *  @2019 Cs-core project
 *
 */

const STORE_NAME = "GEN_CACHING_";
const EXPIRE_TIME = 30000; // 30 seconds

class CachingStorage {
  constructor(storeName = "", expireTime = EXPIRE_TIME) {
    this.storeName = storeName;
    this.expireTime = expireTime;
  }

  getData(key) {
    const dataString = window.localStorage.getItem(this.storeName + key);
    if (dataString === null) {
      return null;
    }
    const dataObj = JSON.parse(dataString);
    if (dataObj.expire < Date.now()) {
      return null;
    }
    return dataObj.data;
  }

  setData(key, data) {
    window.localStorage.setItem(
      this.storeName + key,
      JSON.stringify({
        data,
        expire: Date.now() + this.expireTime,
      })
    );
  }
}

export async function cachingMiddleware({
  pathName,
  fetchApi,
  expireTime,
} = {}) {
  const store = new CachingStorage(STORE_NAME, expireTime);
  const data = store.getData(pathName);
  if (data) {
    return data;
  } else {
    const newData = await fetchApi();
    store.setData(pathName, newData);
    return newData;
  }
}
