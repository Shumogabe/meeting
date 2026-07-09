const Helper = {
  isNullOrUndefined: (param) => {
    return (
      param === null ||
      param === "null" ||
      param === undefined ||
      param === "undefined" ||
      param === "" ||
      /^\s*$/.test(param) ||
      param?.length <= 0 ||
      param === "00000000-0000-0000-0000-000000000000"
    );
  },

  getBrowserInfo: () => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown browser";

    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
      browserName = "Samsung Internet";
    } else if (
      userAgent.indexOf("Opera") > -1 ||
      userAgent.indexOf("OPR") > -1
    ) {
      browserName = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
      browserName = "Microsoft Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Microsoft Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Apple Safari";
    }
    return browserName;
  },
  addSttToTableDataSource: (dataSource, page, limit) => {
    if (!dataSource) return [];
    let newItems = [];
    if (dataSource) {
      if (window.location.pathname.includes("thiet-lap-cau-hinh-")) {
        newItems = dataSource.map((item, index) => ({
          ...item,
          refreshKey: page || page === 0 ? null : "refresh",
          stt: Number(page - 1) * (limit ? limit : 10) + Number(index) + 1,
        }));
      } else {
        newItems = dataSource.map((item, index) => ({
          ...item,
          refreshKey: page || page === 0 ? null : "refresh",
          stt: (page ? page : 0) * (limit ? limit : 10) + index + 1,
        }));
      }
    }
    return newItems;
  },
};

export default Helper;
