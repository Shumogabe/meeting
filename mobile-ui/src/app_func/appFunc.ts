import moment from "moment";

export const APP_FUNC_RoundNumber = (val: number, num?: number) => {
    if (typeof val != "number") {
        return 0;
    }

    num = num ?? 100;
    return Math.round((val + Number.EPSILON) * num) / num;
}

export function APP_FUNC_FormatDate(value?: any, template?: string, isNoUTC?: boolean) {
    if (isNoUTC) {
        return moment(value || undefined).utcOffset(0, false).format(template ?? 'HH:mm, DD/MM/YYYY');
    }
    return moment(value || undefined).format(template ?? 'HH:mm, DD/MM/YYYY');
}

export const APP_FUNC_FormatTel = (mobile?: string) => {
    return (mobile ?? '0123456789')
        .replace(/^0/, '+84')
        .replace(/[^0-9\+]/g, '') || null;
}

export const APP_FUNC_FormatMobileNumber = (mobile?: string) => {
    return (mobile ?? '0123456789')
        .replace(/^0/, '+84')
        .replace(/(.)(?=(\d{3})+$)/g, '$1 ') || null;
}

export const APP_FUNC_FormatRoomNumber = (strNum?: string) => {
    return (strNum ?? '123456789')
        .replace(/[^0-9]/, '')
        .replace(/(.)(?=(\d{3})+$)/g, '$1 ') || null;
}

export const APP_FUNC_CopyToClipboard = (data: any) => {
    if (!data) {
        return false;
    }

    try {
        // let input = window.document.createElement('textarea');
        // input.innerHTML = data;
        // window.document.body.appendChild(input);
        // input.select();
        // window.document.execCommand('copy');
        // window.document.body.removeChild(input);

        navigator.clipboard.writeText(data);

        return true;
    }
    catch (err) { console.error(err) }
    return false;
}