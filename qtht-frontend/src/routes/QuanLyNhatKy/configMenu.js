import { NotInterestedOutlined } from '@mui/icons-material';
import RoutesQLNhatKyDangNhap from './NhatKyDangNhap';
import RoutesQLNhatKyLoi from './NhatKyLoi';
import RoutesQLNhatKyTruyCapPhanMem from './NhatKyTruyCapHeThong';
import RoutesQLNhatKyDangKyDichVu from './QuanLyDangKyDichVu';
import RoutesQLNhatKyLapLich from './QuanLyLapLich';
import RoutesQLNhatKyNguoiDung from './QuanLyNguoiDung';
import RoutesQLNhatKySuKien from './QuanLySuKien';
import RoutesQLNhatKyThamGiaPhongHop from './QuanLyThamGiaPhongHop';

// End HowToRegOutlined
export const QuanLyNhatKyGroup = [
    { label: 'Chưa làm', icon: <NotInterestedOutlined />, id: 'todo' },
    { label: 'Không', icon: <NotInterestedOutlined />, id: 'empty' },
];
export const QuanLyNhatKyConfig = [
    {
        path: 'quan-ly-nhat-ky-truy-cap-phan-mem',
        name: `Nhật ký truy cập phần mềm`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyTruyCapPhanMem],
    },
    {
        path: 'quan-ly-nhat-ky-quan-ly-nguoi-dung',
        name: `Nhật ký quản lý người dùng`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyNguoiDung],
    },
    {
        path: 'quan-ly-nhat-ky-quan-ly-lap-lich',
        name: `Nhật ký quản lý lập lịch`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyLapLich],
    },
    {
        path: 'quan-ly-nhat-ky-quan-ly-su-kien',
        name: `Nhật ký quản lý sự kiện`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKySuKien],
    },
    {
        path: 'quan-ly-nhat-ky-tham-gia-phong-hop',
        name: `Nhật ký tham gia phòng họp`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyThamGiaPhongHop],
    },
    {
        path: 'quan-ly-nhat-ky-loi',
        name: `Nhật ký các lỗi phát sinh trong quá trình hoạt động`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyLoi],
    },
    {
        path: 'quan-ly-nhat-ky-quan-ly-dang-ky-dich-vu',
        name: `Nhật ký quản lý đăng ký dịch vụ`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyDangKyDichVu],
    },
    {
        path: 'quan-ly-nhat-ky-dang-nhap',
        name: `Nhật ký đăng nhập`,
        group: 'empty',
        childRoute: [...RoutesQLNhatKyDangNhap],
    },
    // {
    //     path: 'quan-ly-nhat-ky-dang-nhap-quan-tri',
    //     name: `Nhật ký đăng nhập quản trị`,
    //     group: 'todo',
    //     childRoute: [...RoutesQLNhatKyTruyCapPhanMem],
    // },
    // Đăng ký tài khoản
    // {
    //     path: 'nhat-ky-dang-ky-tai-khoan-ccvc',
    //     name: `Nhật ký đăng ký tài khoản cán bộ ccvc`,
    //     group: 'empty',
    // childRoute: [...RoutesNhatKyDKTKCCVC],
    // },
    // {
    //     path: 'nhat-ky-dang-ky-tai-khoan-to-chuc',
    //     name: `Nhật ký đăng ký tài khoản tổ chức`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDKTKToChuc],
    // },
    // Duyệt đăng ký
    // {
    //     path: 'nhat-ky-duyet-dang-ky-tai-khoan-ccvc',
    //     name: `Nhật ký duyệt đăng ký tài khoản cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDuyetDKTKCCVC],
    // },
    // {
    //     path: 'nhat-ky-duyet-dang-ky-tai-khoan-to-chuc',
    //     name: `Nhật ký duyệt đăng ký tài khoản tổ chức`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDuyetDKTKToChuc],
    // },
    // Nhật ký tài khoản
    // {
    //     path: 'nhat-ky-tai-khoan-ccvc',
    //     name: `Nhật ký tài khoản cán bộ ccvc`,
    //     group: 'todo',
    //     childRoute: [...RoutesQLNhatKyTruyCapPhanMem],
    // },
    // {
    //     path: 'nhat-ky-tai-khoan-to-chuc',
    //     name: `Nhật ký tài khoản tổ chức`,
    //     group: 'todo',
    //     childRoute: [...RoutesQLNhatKyTruyCapPhanMem],
    // },
    // ls đăng ký bổ sung
    // {
    //     path: 'nhat-ky-dang-ky-bo-sung-thong-tin-tai-khoan-ccvc',
    //     name: `Nhật ký đăng ký bổ sung thông tin tài khoản cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyBoSungTTTKCCVC],
    // },
    // {
    //     path: 'nhat-ky-dang-ky-bo-sung-thong-tin-tai-khoan-to-chuc',
    //     name: `Nhật ký đăng ký bổ sung thông tin tài khoản tổ chức`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyBoSungTTTKToChuc],
    // },
    // ls đăng ký hủy tài khoản
    // {
    //     path: 'nhat-ky-dang-ky-huy-tai-khoan-ccvc',
    //     name: `Nhật ký đăng ký hủy tài khoản cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDKHuyTKCCVC],
    // },
    // {
    //     path: 'nhat-ky-dang-ky-huy-tai-khoan-to-chuc',
    //     name: `Nhật ký đăng ký hủy tài khoản tổ chức`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDKHuyTKToChuc],
    // },
    // ls duyệt đăng ký bổ sung
    // {
    //     path: 'nhat-ky-duyet-dang-ky-bo-sung-thong-tin-tai-khoan-ccvc',
    //     name: `Nhật ký duyệt đăng ký bổ sung thông tin tài khoản cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDuyetBoSungTTTKCCVC],
    // },
    // {
    //     path: 'nhat-ky-duyet-dang-ky-bo-sung-thong-tin-tai-khoan-to-chuc',
    //     name: `Nhật ký duyệt đăng ký bổ sung thông tin tài khoản tổ chức`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDuyetBoSungTTTKToChuc],
    // },
    // ls duyệt đăng ký hủy tài khoản
    // {
    //     path: 'nhat-ky-duyet-dang-ky-huy-tai-khoan-ccvc',
    //     name: `Nhật ký duyệt đăng ký hủy tài khoản cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesNhatKyDuyetDKHuyTKCCVC],
    // },
    // {
    //     path: 'nhat-ky-duyet-dang-ky-huy-tai-khoan-to-chuc',
    //     name: `Nhật ký duyệt đăng ký hủy tài khoản tổ chức`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyTruyCapPhanMem],
    // },
    //
    // {
    //     path: 'quan-ly-nhat-ky-thay-doi-email',
    //     name: `Nhật ký thay đổi Email xác thực`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyThayDoiEmailXacThuc],
    // },
    // {
    //     path: 'quan-ly-nhat-ky-thay-doi-sdt',
    //     name: `Nhật ký thay đổi SĐT xác thực `,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyThayDoiSDT],
    // },
    // {
    //     path: 'quan-ly-nhat-ky-thay-doi-mat-khau',
    //     name: `Nhật ký thay đổi mật khẩu`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyThayDoiMK],
    // },
    // {
    //     path: 'quan-ly-nhat-ky-khoi-phuc-mat-khau',
    //     name: `Nhật ký khôi phục mật khẩu`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyThayDoiMK],
    // },
    // {
    //     path: 'quan-ly-nhat-ky-lien-ket-tai-khoan-ccvc-hscb',
    //     name: `Nhật ký liên kết tài khoản cán bộ ccvc với hồ sơ cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyLienKetTKCCVC],
    // },
    // {
    //     path: 'quan-ly-nhat-ky-lien-ket-tai-khoan-to-chuc-hscb',
    //     name: `Nhật ký liên kết tài khoản tổ chức với hồ sơ cán bộ ccvc`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyLienKetTKToChuc],
    // },
    // {
    //     path: 'quan-ly-nhat-ky-phuong-thuc-xac-thuc',
    //     name: `Nhật ký phương thức xác thực`,
    //     group: 'empty',
    //     childRoute: [...RoutesQLNhatKyPhuongThucXacThuc],
    // },
];
