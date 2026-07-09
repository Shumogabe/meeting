const types = {
  STORAGE_AUTH: "STORAGE_AUTH"
};

const storageAuth = data => {
  return {
    type: types.STORAGE_AUTH,
    payload: data
  };
};

export default {
  types,
  storageAuth
};
