import React from 'react';
import { isEmpty, trim } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import querystring from 'query-string';
import { userManager as Auth } from './oidc';

export const objectSearchParams = (params) => {
    const result = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    return result;
};

const Helper = {
    // FIXME: form comment
    iterationCopy: (src) => {
        const target = {};
        for (const prop in src) {
            if (src.hasOwnProperty(prop)) {
                target[prop] = src[prop];
            }
        }
        return target;
    },

    setMaxYear(year) {
        const date = new Date();
        date.setFullYear(date.getFullYear() + year);
        return date;
    },

    formatDate(value, format = 'DD/MM/YYYY') {
        if (!value) {
            return null;
        }
        return moment(value).format(format);
    },
    timeToVietNamDate(value) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // Để hiển thị 24 giờ
        };
        const date = new Date(value.toString().length === 13 ? value : value * 1000).toLocaleDateString('vi-VN', options).replace('l', 'L');
        return date;
    },
    timestempToDateTime(value, format = 'DD/MM/YYYY') {
        if (!value) {
            return null;
        }
        return moment(new Date(value.toString().length === 13 ? value : value * 1000)).format(format);
    },
    timestempToDate_Time(value, format = 'DD/MM/YYYY HH:mm') {
        if (!value) {
            return null;
        }
        return moment(new Date(value.toString().length === 13 ? value : value * 1000)).format(format);
    },
    timestempToQuarter(value, prefix = 'Quý') {
        if (!value) {
            return null;
        }
        const date = new Date(value.toString().length === 13 ? value : value * 1000);
        //Lấy ra năm
        const year = date.getFullYear();
        // Lấy tháng từ 0 đến 11
        const month = date.getMonth();

        // Xác định quý từ tháng
        const quarter = Math.floor(month / 3) + 1;

        return prefix + ' ' + quarter + ' - ' + year;
    },
    timestampToMonth(value, prefix = 'Tháng') {
        if (!value) {
            return null;
        }
        const date = new Date(value.toString().length === 13 ? value : value * 1000);
        //Lấy ra năm
        const year = date.getFullYear();
        // Lấy tháng từ 0 đến 11
        const month = date.getMonth() + 1;

        return prefix + ' ' + month + '/' + year;
    },
    timestampToYear(value, prefix = 'Năm') {
        if (!value) {
            return null;
        }
        const date = new Date(value.toString().length === 13 ? value : value * 1000);
        //Lấy ra năm
        const year = date.getFullYear();

        return prefix + ' ' + year;
    },
    formatTableDate(value, format) {
        if (!value) {
            return null;
        }
        return moment(value).format(format || 'DD/MM/YYYY');
    },

    formatUTCDate(value, format) {
        if (!value) {
            return null;
        }
        return moment(value).set({ hour: '0', minute: '0', second: '0', millisecond: '0' }).toISOString();
    },

    formatDateBold(value, format) {
        return <span style={{ fontWeight: 600, color: '#e8be22' }}>{moment(value).format(format || 'DD MMM YYYY')}</span>;
    },

    renderDateFromTo(from, to) {
        if (!from) {
            return <span>To {this.formatDateBold(to)}</span>;
        }

        return (
            <span>
                From {this.formatDateBold(from)} to {this.formatDateBold(to)}
            </span>
        );
    },

    formatTime(value, format) {
        if (!value) {
            return null;
        }
        return moment(value).format(format || 'DD MMM YYYY hh:mm A');
    },

    formatDateTimeSecond(value, format) {
        if (!value) {
            return null;
        }
        return moment(value).format(format || 'DD-MM-YYYY HH:mm:ss');
    },

    getLocateTime(value) {
        if (!value) {
            return null;
        }
        return moment.utc(value).local();
    },

    compareDate: (date1, date2) => {
        const moment1 = moment(date1, 'YYYY-MM-DD');
        const moment2 = moment(date2, 'YYYY-MM-DD');
        return moment1.isAfter(moment2);
    },

    subtractDate: (date, number, unit = 'd') => {
        return moment(date).subtract(number, unit);
    },

    copyToClipboard: (r) => {
        const inp = document.createElement('input');
        document.body.appendChild(inp);
        inp.value = r;
        inp.select();
        document.execCommand('copy', false);
        inp.remove();
    },

    getFileNameFromInfoSheet: (fileName) => {
        try {
            const a = fileName.split('/');
            return a[a.length - 1];
        } catch (err) {
            return null;
        }
    },

    isSuperAdmin: () => {
        const userInfo = new Auth().getUserInfo();
        if (userInfo) {
            return userInfo['Role'].split('-').includes('SuperAdmin');
        }
    },

    isSystemAdmin: () => {
        const userInfo = new Auth().getUserInfo();
        return userInfo && userInfo['Role'].split('-').includes('SystemAdmin');
    },

    getBase64FromFile: async (fileContent, cb) => {
        if (!fileContent) {
            return null;
        }
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            let file;
            fileReader.onload = function (fileLoadedEvent) {
                // let file = fileLoadedEvent.target.result;
                file = fileLoadedEvent.target.result;
                // Print data in console
                // cb(file);
                resolve(file);
            };
            fileReader.readAsDataURL(fileContent);
        });
    },

    getBase64FileFromInput: (input, cb) => {
        if (input.files.length > 0) {
            Helper.getBase64FromFile(input.files[0], cb);
        } else {
            return null;
        }
    },

    formatMoney: (amount, decimalCount = 2, decimal = '.', thousands = ',') => {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
            const negativeSign = amount < 0 ? '-' : '';
            const i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
            const j = i.length > 3 ? i.length % 3 : 0;
            return (
                negativeSign +
                (j ? i.substr(0, j) + thousands : '') +
                i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
                (decimalCount
                    ? decimal +
                      Math.abs(amount - i)
                          .toFixed(decimalCount)
                          .slice(2)
                    : '')
            );
        } catch (e) {}
    },

    formatPhoneNumber: (phoneNo) => {
        if (!phoneNo) {
            return null;
        }
        if (phoneNo.includes('+')) {
            return `(${phoneNo})`;
        } else {
            return `(+${phoneNo})`;
        }
    },

    formatMoneyNumeral: function (value) {
        if (value === undefined || value === null || value === '') {
            return '';
        }
        return numeral(value).format('$0,0.00');
    },

    formatMoneyNumeralTrueData: function (value) {
        if (value === undefined || value === null || value === '') {
            return '';
        }
        return numeral(value).format('$0,0.00');
    },

    formatPercentage: function (value) {
        return numeral(Number(value / 100)).format('0.00%');
    },

    openInNewTab: function (url) {
        const win = window.open(url, '_blank');
        win.focus();
    },

    renderAddressCombine: function ({ Block = '', Street = '', Floor = '', Unit = '', Building = '', NameOfTown = 'Singapore', Postal = '' } = {}) {
        return trim(`${Block ? Block : ''} ${Street ? Street : ''} ${Floor || Unit ? '#' : ''}${Floor ? Floor : ''}${Floor && Unit ? '-' : ''}${Unit ? Unit : ''} ${Building ? Building : ''} ${NameOfTown ? NameOfTown : ''} ${Postal ? Postal : ''}`.replace(/\s+/g, ' '));
    },

    stringtifyURL: function ({ path = '', params = {} }) {
        return path + '?' + querystring.stringify(params);
    },

    offuscateString: function (str, isEmail = false) {
        if (!str || typeof str !== 'string') {
            return null;
        }
        return isEmail ? `${str.slice(0, 4)} ****` : `**** ${str.slice(-4)}`;
    },

    trySplit(value) {
        if (!value) {
            return [];
        }
        if (typeof value !== 'string') {
            return [];
        }
        return value.split(',').map((o) => o.trim());
    },

    parseNumeral: (number) => {
        return numeral(number).value();
    },

    stringIsNullOrEmpty: (str) => {
        if (!str) {
            return true;
        }
        if (!str.trim()) {
            return true;
        }
        return false;
    },
    // Curry function
    sortString: (field) => (a, b) => {
        return a[field] !== b[field] ? (a[field] < b[field] ? -1 : 1) : 0;
    },
    sortArrayNumber: (array, field) => {
        array.sort(function (a, b) {
            return a[field] - b[field];
        });
        return array;
    },
    sortArrayString: (array) => {
        array.sort(function (a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
        return array;
    },

    // generate placeholder
    genSelectPL: (text) => {
        return `--- ${text} ---`;
    },

    // update object in array
    replaceItem: (newObj, array, field = 'id') => {
        return array.reduce((accumulator, currentObj) => {
            if (currentObj[field] === newObj[field]) {
                return [...accumulator, newObj];
            } else {
                return [...accumulator, currentObj];
            }
        }, []);
    },
    replaceItemNamThu: (newObj, array, field = 'namThu') => {
        return array.reduce((accumulator, currentObj) => {
            if (currentObj[field] === newObj[field]) {
                return [...accumulator, newObj];
            } else {
                return [...accumulator, currentObj];
            }
        }, []);
    },

    removeItemNamThu: (targetObj, array) => {
        return array.reduce((accumulator, currentObj) => {
            if (currentObj.namThu === targetObj.namThu) {
                return accumulator;
            } else {
                return [...accumulator, currentObj];
            }
        }, []);
    },

    removeItem: (targetObj, array, field) => {
        return array.reduce((accumulator, currentObj) => {
            if (currentObj[field] === targetObj[field]) {
                return accumulator;
            } else {
                return [...accumulator, currentObj];
            }
        }, []);
    },

    updateArray: (item, dataSource, isEdit) => {
        var newData = [];
        if (isEdit) {
            if (item.id === 0) {
                dataSource.map((x, idx) => {
                    if (x.stt === item.stt) {
                        dataSource.splice(idx, 1);
                    }
                });
                newData = dataSource;
            } else {
                newData = dataSource.map((x, idx) => ({
                    ...x,
                    daXoa: x.id === item.id ? 1 : x.daXoa,
                }));
            }
        } else {
            dataSource.map((x, idx) => {
                if (x.stt === item.stt) {
                    dataSource.splice(idx, 1);
                }
            });
            newData = dataSource;
        }
        return newData;
    },

    addSttToDataSource: (dataSource) => {
        if (!dataSource) return [];
        let newItems = [];
        if (dataSource) {
            newItems = dataSource.map((item, index) => ({
                ...item,
                stt: index + 1,
            }));
        }
        return newItems;
    },
    addSttToTableDataSource: (dataSource, page, limit) => {
        if (!dataSource) return [];
        let newItems = [];
        if (dataSource) {
            if (window.location.pathname.includes('thiet-lap-cau-hinh-')) {
                newItems = dataSource.map((item, index) => ({
                    ...item,
                    refreshKey: page || page === 0 ? null : 'refresh',
                    stt: Number(page - 1) * (limit ? limit : 10) + Number(index) + 1,
                }));
            } else {
                newItems = dataSource.map((item, index) => ({
                    ...item,
                    refreshKey: page || page === 0 ? null : 'refresh',
                    stt: (page ? page : 0) * (limit ? limit : 10) + index + 1,
                }));
            }
        }
        return newItems;
    },

    addSttToDatasourceForReport: (datasource) => {
        return datasource.map((item, index) => ({ stt: index === 0 ? '' : index, ...item }));
    },

    leaveLastToFirst: (datasource) => {
        var dataSource2 = datasource;
        if (dataSource2 && dataSource2.length > 0) {
            var dataSource3 = [dataSource2[dataSource2.length - 1]];
            dataSource2 = dataSource2.slice(0, dataSource2.length - 1);
            dataSource2 = dataSource3.concat(dataSource2);
        }
        return dataSource2;
    },

    checkInt: (value) => {
        return (!isNaN(value) && /^-?(0|[1-9][0-9]*)?$/.test(value)) || value === '' || value === '-';
    },
    checkFloat: (value) => {
        return (!isNaN(value) && /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(value)) || value === '' || value === '-';
    },

    getFieldValueFromID: (id, array, field = 'ten') => {
        if (id && !isEmpty(array)) {
            const item = array.find((item) => item.id === id);
            return item[field];
        }
        return null;
    },
    /*
     * TODO ============================ Nghiệp vụ =============================================*/
    getToaDoX: (toaDo) => {
        if (!toaDo) {
            return null;
        }
        return toaDo.split(',')[0];
    },
    getToaDoY: (toaDo) => {
        if (!toaDo) {
            return null;
        }
        return toaDo.split(',')[1];
    },

    mergeToaDo: (x, y) => {
        if (x && y) {
            return `${x},${y}`;
        }
        return null;
    },

    validateToaDo: (toaDo) => {
        if (!toaDo || toaDo === '') return undefined;
        var pair = toaDo.split(',');
        if (!pair || pair.length !== 2) return 'Tọa độ có định dạng x,y';
        if (pair[0] === '') return 'x không được để trống';
        if (pair[1] === '') return 'y không được để trống';
        if (!Helper.checkFloat(pair[0])) return 'x phải là số nguyên';
        if (!Helper.checkFloat(pair[1])) return 'y phải là số nguyên';
    },
    validateToaDoVung: (toaDo) => {
        if (toaDo && toaDo !== '' && toaDo?.length > 0) {
            if (toaDo.split(';').length === 2) return false;
        }
        return true;
    },
    getYears: () => {
        var c_year = new Date().getFullYear();
        var years = [];
        for (var i = c_year; i >= 1930; i--) {
            years.push({ year: i, id: i });
        }
        return years;
    },

    // Tạo list mã chức năng theo nhóm chức năng
    handleGroupFunctions: (listFunc) => {
        if (!isEmpty(listFunc)) {
            return listFunc?.reduce(function (obj, item) {
                obj[item.moduleCode] = obj[item.moduleCode] || [];
                obj[item.moduleCode].push(item.maChucNang);
                return obj;
            }, {});
        }
        return [];
    },

    handleGetEditableFunction: (listFunctions, pageCode) => {
        if (!isEmpty(listFunctions)) {
            return listFunctions.find((item) => item.maChucNang === pageCode);
        }
    },

    isNullOrUndefined: (param) => {
        return param === null || param === undefined || param === '' || param.length <= 0;
    },

    isNullOrEmptyItems: (param) => {
        return param === null || param === undefined || param.length <= 0;
    },

    getParam: (searchParams) => {
        const searchParamsString = decodeURIComponent(searchParams.toString());
        const searchParamObject = objectSearchParams(searchParamsString);
        if (searchParamObject.StrSearch !== undefined) {
            var x = searchParamObject.StrSearch.split('+');
            var a = x.map((e) => e + ' ');
            var ten = '';
            a.map((e) => {
                ten += e;
            });
            searchParamObject.StrSearch = ten.trim();
        }
        if (searchParamObject.StrSearch == ' ') {
            searchParamObject.StrSearch = '';
        }
        return searchParamObject;
    },
    filterAndKeepFirstDuplicate: (arr, name) => {
        const seenMaMuc = new Set();

        return arr?.filter((obj) => {
            if (typeof obj === 'string') {
                return true;
            }
            const maMuc = obj[name];
            if (!seenMaMuc.has(maMuc)) {
                seenMaMuc.add(maMuc);
                return true;
            }

            return false;
        });
    },
    generateColorFromString: (str) => {
        let hash = 0;

        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hexColor = Math.abs(hash).toString(16).substring(0, 6);

        // Đảm bảo mã màu có đúng 6 ký tự
        const paddedHexColor = '000000'.substring(0, 6 - hexColor.length) + hexColor;

        return `#${paddedHexColor}`;
    },
};

export default Helper;
