import moment from "moment";
import { StatusSchedule } from "./appLookup";

/*
    Case Status:
    0: Nháp
    1: Chờ duyệt (Đã gửi duyệt)
    2: Duyệt
    3: Hủy duyệt
    4: Công bố
    5: Hủy công bố

    ==(2,4): Xác nhận, Chỉnh sửa, Xóa
    !=(2,4): Hủy xác nhận, Tham gia
    end=true: Bắt đầu lại, Xóa
    delete=true: Khôi phục, Xóa hoàn toàn 
*/

export const ColorStatusSchedule = (status?: number) => {
    switch (status) {
        case StatusSchedule.BANNHAP: {
            return 'medium';
        }
        case StatusSchedule.CHODUYET: {
            return 'warning';
        }
        case StatusSchedule.DADUYET:
        case StatusSchedule.CONGBO: {
            return 'success';
        }
        case StatusSchedule.HUYDUYET:
        case StatusSchedule.HUYCONGBO: {
            return 'danger';
        }
        default: {
            return 'medium';
        }
    }
}

export const ColorStatusDocument = (status?: boolean) => {
    if (status) {
        return 'success';
    }
    else {
        return 'warning';
    }
}

export const ColorStatusVote = (status?: boolean) => {
    if (status) {
        return 'success';
    }
    else {
        return 'warning';
    }
}

//0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Hủy duyet
export const ColorStatusConslusion = (status?: number) => {
    switch (status) {
        case 0:
        case 1: {
            return 'warning';
        }
        case 2: {
            return 'success';
        }
        case 3: {
            return 'danger';
        }
        default: {
            return 'medium';
        }
    }
}