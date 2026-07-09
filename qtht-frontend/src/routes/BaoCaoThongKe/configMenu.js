import { HowToRegOutlined, ListAltOutlined, ManageAccounts, PersonAddAlt, PersonOffOutlined, PersonRemoveAlt1Outlined } from '@mui/icons-material';
import BoSungThongTinCCVC from './BoSungThongTinTKCCVC';
import BoSungThongTinToChuc from './BoSungThongTinToChuc';
import DangKyHuyTaiKhoanCCVC from './DKHuyTaiKhoanCCVC';
import DangKyHuyToChuc from './DKHuyToChuc';
import DangKyTaiKhoanCCVC from './DKTaiKhoanCCVC';
import DangKyTaiKhoanToChuc from './DKTaiKhoanToChuc';
import DanhSachGuiThongBaoEmail from './DanhSachThongBaoEmail';
import DanhSachGuiThongBaoSMS from './DanhSachThongBaoSMS';
import DuyetHuyTaiKhoanCCVC from './DuyetDKHuyTaiKhoanCCVC';
import DuyeBoSungTaiKhoanCCVC from './DuyetDangKyBoSungTKCCVC';
import DuyetBoSungTaiKhoanToChuc from './DuyetDangKyBoSungTKToChuc';
import DuyetHuyTaiKhoanToChuc from './DuyetDangKyHuyTKToChuc';
import DuyetTaiKhoanCCVC from './DuyetTaiKhoanCCVC';
import DuyetTaiKhoanToChuc from './DuyetTaiKhoanToChuc';
import NguoiDungDaDangNhap from './NguoiDungDaDangNhap';
import QuanTriDangKyTaiKhoanToChuc from './QuanTriDKTaiKhoanToChuc';
import TaiKhoanCCVCDaXoa from './TaiKhoanCCVCDaXoa';
import TaiKhoanCCVCDangHoatDong from './TaiKhoanCCVCDangHoatDong';
import TaiKhoanToChucDaXoa from './TaiKhoanToChucDaXoa';
import ToChucDangHoatDong from './ToChucDangHoatDong/index';

// End HowToRegOutlined
export const DanhMucGroup = [
    { label: 'Đăng ký mới', icon: <PersonAddAlt />, id: 'new' },
    { label: 'Phê duyệt', icon: <HowToRegOutlined />, id: 'approve' },
    { label: 'Đăng ký bổ sung', icon: <ManageAccounts />, id: 'update' },
    { label: 'Hủy đăng ký', icon: <PersonRemoveAlt1Outlined />, id: 'remove' },
    { label: 'Đã xóa', icon: <PersonOffOutlined />, id: 'delete' },
    { label: 'Khác', icon: <ListAltOutlined />, id: 'other' },
];
export const BaoCaoThongKeConfig = [
    {
        path: 'dang-ky-tai-khoan-can-bo-cong-chuc-vien-chuc',
        name: `Đăng ký tài khoản cán bộ công chức viên chức`,
        group: 'new',
        childRoute: [
            {
                path: '',
                main: () => <DangKyTaiKhoanCCVC />,
            },
        ],
    },
    {
        path: 'dang-ky-tai-khoan-to-chuc',
        name: `Đăng ký tài khoản tổ chức`,
        group: 'new',
        childRoute: [
            {
                path: '',
                main: () => <DangKyTaiKhoanToChuc />,
            },
        ],
    },
    {
        path: 'phe-duyet-dang-ky-tai-khoan-can-bo-cong-chuc-vien-chuc',
        name: `Phê duyệt đăng ký tài khoản cán bộ công chức viên chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <DuyetTaiKhoanCCVC />,
            },
        ],
    },
    {
        path: 'phe-duyet-dang-ky-tai-khoan-to-chuc',
        name: `Phê duyệt đăng ký tài khoản tổ chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <DuyetTaiKhoanToChuc />,
            },
        ],
    },
    {
        path: 'quan-tri-dang-ky-tai-khoan-to-chuc',
        name: `Quản trị đăng ký tài khoản tổ chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <QuanTriDangKyTaiKhoanToChuc />,
            },
        ],
    },
    {
        path: 'bo-sung-thong-tin-tai-khoan-can-bo-cong-chuc-vien-chuc',
        name: `Bổ sung thông tin tài khoản cán bộ công chức viên chức`,
        group: 'update',
        childRoute: [
            {
                path: '',
                main: () => <BoSungThongTinCCVC />,
            },
        ],
    },
    {
        path: 'bo-sung-thong-tin-tai-khoan-to-chuc',
        name: `Bổ sung thông tin tài khoản tổ chức`,
        group: 'update',
        childRoute: [
            {
                path: '',
                main: () => <BoSungThongTinToChuc />,
            },
        ],
    },
    {
        path: 'huy-tai-khoan-can-bo-cong-chuc-vien-chuc',
        name: `Hủy tài khoản cán bộ công chức viên chức`,
        group: 'remove',
        childRoute: [
            {
                path: '',
                main: () => <DangKyHuyTaiKhoanCCVC />,
            },
        ],
    },
    {
        path: 'huy-tai-khoan-to-chuc',
        name: `Hủy tài khoản tổ chức`,
        group: 'remove',
        childRoute: [
            {
                path: '',
                main: () => <DangKyHuyToChuc />,
            },
        ],
    },
    {
        path: 'tai-khoan-can-bo-cong-chuc-vien-chuc-dang-hoat-dong',
        name: `Tài khoản cán bộ công chức viên chức đang hoạt động`,
        group: 'other',
        childRoute: [
            {
                path: '',
                main: () => <TaiKhoanCCVCDangHoatDong />,
            },
        ],
    },
    {
        path: 'tai-khoan-to-chuc-dang-hoat-dong',
        name: `Tài khoản tổ chức đang hoạt động`,
        group: 'other',
        childRoute: [
            {
                path: '',
                main: () => <ToChucDangHoatDong />,
            },
        ],
    },
    {
        path: 'phe-duyet-dang-ky-bo-sung-tai-khoan-can-bo-cong-chuc-vien-chuc',
        name: `Phê duyệt đăng ký bổ sung thông tin tài khoản cán bộ công chức viên chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <DuyeBoSungTaiKhoanCCVC />,
            },
        ],
    },
    {
        path: 'phe-duyet-dang-ky-bo-sung-tai-khoan-to-chuc',
        name: `Phê duyệt đăng ký bổ sung thông tin tài khoản tổ chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <DuyetBoSungTaiKhoanToChuc />,
            },
        ],
    },
    {
        path: 'phe-duyet-dang-ky-huy-tai-khoan-can-bo-cong-chuc-vien-chuc',
        name: `Phê duyệt đăng ký hủy tài khoản cán bộ công chức viên chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <DuyetHuyTaiKhoanCCVC />,
            },
        ],
    },
    {
        path: 'phe-duyet-dang-ky-huy-tai-khoan-to-chuc',
        name: `Phê duyệt đăng ký hủy tài khoản tổ chức`,
        group: 'approve',
        childRoute: [
            {
                path: '',
                main: () => <DuyetHuyTaiKhoanToChuc />,
            },
        ],
    },
    {
        path: 'tai-khoan-cong-chuc-vien-chuc-da-xoa',
        name: `Tài khoản cán bộ công chức viên chức đã xóa`,
        group: 'delete',
        childRoute: [
            {
                path: '',
                main: () => <TaiKhoanCCVCDaXoa />,
            },
        ],
    },
    {
        path: 'tai-khoan-to-chuc-da-xoa',
        name: `Tài khoản tổ chức đã xóa`,
        group: 'delete',
        childRoute: [
            {
                path: '',
                main: () => <TaiKhoanToChucDaXoa />,
            },
        ],
    },
    {
        path: 'nguoi-dung-da-dang-nhap',
        name: `Người dùng đã đăng nhập`,
        group: 'other',
        childRoute: [
            {
                path: '',
                main: () => <NguoiDungDaDangNhap />,
            },
        ],
    },
    {
        path: 'danh-sach-gui-thong-bao-email',
        name: `Thông báo email`,
        group: 'other',
        childRoute: [
            {
                path: '',
                main: () => <DanhSachGuiThongBaoEmail />,
            },
        ],
    },
    {
        path: 'tong-so-luong-sms-theo-thang-quy-nam',
        name: `SMS theo tháng, quý, năm`,
        group: 'other',
        childRoute: [
            {
                path: '',
                main: () => <DanhSachGuiThongBaoSMS />,
            },
        ],
    },
    //
];
