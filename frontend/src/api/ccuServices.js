const ccuKeyPrefix = "gen_ccu_";
export function setCCU(key, data) {
  window[ccuKeyPrefix + key] = data;
}
export function getCCU(key) {
  return window[ccuKeyPrefix + key];
}
