import { IRole } from "src/app_models/Auth";

export const Role = {
    "APPROVE": "2",
    "ARTICLE": "1",
    "CATALOG": "20",
    "CONTACT": "9",
    "DOCUMENT": "21",
    "FILE": "14",
    "LAW": "13",
    "ORGANIZATION": "19",
    "PERSONALINFO": "12",
    "PROCEDURE": "15",
    "PROJECT": "18",
    "SCHEDULE": "22",
    "SITELINK": "17",
    "SYSTEMADMIN": "16",
    "_data": [
        {
            "ma": "22",
            "ten": "Quản lý lập lịch",
            "mota": "Schedule",
        },
        {
            "ma": "1",
            "ten": "Quản lý bài viết",
            "mota": "Article",
        },
        {
            "ma": "12",
            "ten": "Quản lý thông tin cá nhân",
            "mota": "PersonalInfo",
        },
        {
            "ma": "13",
            "ten": "Quản lý văn bản",
            "mota": "Law",
        },
        {
            "ma": "14",
            "ten": "Quản lý tệp tin",
            "mota": "File",
        },
        {
            "ma": "15",
            "ten": "Quản lý thủ tục hành chính",
            "mota": "Procedure",
        },
        {
            "ma": "16",
            "ten": "Quản trị hệ thống",
            "mota": "SystemAdmin",
        },
        {
            "ma": "17",
            "ten": "Quản lý liên kết",
            "mota": "SiteLink",
        },
        {
            "ma": "18",
            "ten": "Quản lý dự án",
            "mota": "Project",
        },
        {
            "ma": "19",
            "ten": "Quản lý cơ cấu tổ chức",
            "mota": "Organization",
        },
        {
            "ma": "20",
            "ten": "Quản lý danh mục",
            "mota": "Catalog",
        },
        {
            "ma": "21",
            "ten": "Quản lý tư liệu",
            "mota": "Document",
        },
        {
            "ma": "22",
            "ten": "Quản lý lập lịch",
            "mota": "Schedule",
        },
        {
            "ma": "9",
            "ten": "Quản lý liên hệ",
            "mota": "Contact",
        },
        {
            "ma": "2",
            "ten": "Quản lý phê duyệt",
            "mota": "Approve",
        }
    ],
    checkRole: (roles?: Array<IRole>, roleCode?: string) => {
        return roles?.find(f => f.ma == roleCode) ? true : false;
    }
}

export const MeetingType = {
    "GIAOBAN": 1,
    "HOINGHI": 2,
    "HOITHAO": 3,
    "SUKIEN": 4,
    "_data": [
        {
            "id": 1,
            "title": "Giao ban",
        },
        {
            "id": 2,
            "title": "Hội nghị",
        },
        {
            "id": 3,
            "title": "Hội thảo",
        },
        {
            "id": 4,
            "title": "Sự kiên",
        }
    ]
}

export const StatusSchedule = {
    "BANNHAP": 0,
    "CHODUYET": 1,
    "DADUYET": 2,
    "HUYDUYET": 3,
    "CONGBO": 4,
    "HUYCONGBO": 5,
    "_data": [
        // {
        //     "id": 0,
        //     "title": "Bản nháp",
        // },
        {
            "id": 1,
            "title": "Chờ duyệt",
        },
        {
            "id": 2,
            "title": "Đã duyệt",
        },
        {
            "id": 3,
            "title": "Hủy duyệt",
        },
        {
            "id": 4,
            "title": "Công bố",
        },
        {
            "id": 5,
            "title": "Hủy công bố",
        },
    ],
    getStatusName: (status?: number) => {
        return StatusSchedule._data.find(f => f.id == status)?.title ?? '';
    }
}

export const StatusConslusion = {
    "BANNHAP": 0,
    "CHODUYET": 1,
    "DADUYET": 2,
    "HUYDUYET": 3,
    "_data": [
        {
            "id": 0,
            "title": "Bản nháp",
        },
        {
            "id": 1,
            "title": "Chờ duyệt",
        },
        {
            "id": 2,
            "title": "Đã duyệt",
        },
        {
            "id": 3,
            "title": "Hủy duyệt",
        },
    ],
    getStatusName: (status?: number) => {
        return StatusConslusion._data.find(f => f.id == status)?.title ?? '';
    }
}