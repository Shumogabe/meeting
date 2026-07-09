import moment from 'moment';
import 'moment/locale/vi';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { OidcProvider, loadUser } from 'redux-oidc';
import MainLayout from './Layout/index';
import Helper from './helpers';
import { OidcCallBack, OidcSilentRenew, userManager } from './oidc';
import store from './redux/store';
import BaoCaoThongKe from './routes/BaoCaoThongKe';
import BaoCaoThongKeWraper from './routes/BaoCaoThongKe/BaoCaoThongKeWraper';
import { BaoCaoThongKeConfig } from './routes/BaoCaoThongKe/configMenu';
import RoutesQuanLyDanhMucMayChu from './routes/QuanLyDanhMuc/QuanLyDanhMucMayChu';
import QuanLyNhatKyWraper from './routes/QuanLyNhatKy/QuanLyNhatKyWraper';
import { QuanLyNhatKyConfig } from './routes/QuanLyNhatKy/configMenu';
import QuanLyNhatKy from './routes/QuanLyNhatKy/index';
import RoutesCauHinhHeThong from './routes/QuanTriHeThong/CauHinhHeThong';
import RoutesChucNang from './routes/QuanTriHeThong/ChucNang';
import RoutesChucVu from './routes/QuanTriHeThong/ChucVu';
import RoutesDuLieuSaoLuu from './routes/QuanTriHeThong/DuLieuSaoLuu';
import RoutesGiamSatIPQuanTri from './routes/QuanTriHeThong/GiamSatIPQuanTri';
import RoutesGiamSatTruyCap from './routes/QuanTriHeThong/GiamSatTruyCap';
import RoutesNguoiDung from './routes/QuanTriHeThong/NguoiDung';
import RoutesPhanQuyen from './routes/QuanTriHeThong/PhanQuyen';
import RoutesPhanQuyenUngDung from './routes/QuanTriHeThong/PhanQuyenUngDung';
import RoutesSaoLuuBangDuLieu from './routes/QuanTriHeThong/SaoLuBangDuLieu';
import RoutesSaoLuuCauHinhHeThong from './routes/QuanTriHeThong/SaoLuuCauHinhHeThong';
import RoutesSaoLuuTepTin from './routes/QuanTriHeThong/SaoLuuTepTin';
import RoutesThietLapCoCheSaoLuu from './routes/QuanTriHeThong/ThietLapCoCheSaoLuu';
import RoutesDanhMucToChuc from './routes/QuanTriHeThong/ToChuc';
import RoutesUngDung from './routes/QuanTriHeThong/UngDung';
import RoutesVaiTro from './routes/QuanTriHeThong/VaiTro';
import RoutesThietLapCauHinhBaoCaoThongKe from './routes/ThietLapCauHinh/BaoCaoThongKe';
import RoutesThietLapCauHinhBieuQuyet from './routes/ThietLapCauHinh/BieuQuyet';
import RoutesThietLapCauHinhChuongTrinh from './routes/ThietLapCauHinh/ChuongTrinh';
import RoutesThietLapCauHinhDichVuSms from './routes/ThietLapCauHinh/DichVuSms';
import RoutesThietLapCauHinhHeThong from './routes/ThietLapCauHinh/HeThong';
import RoutesThietLapCauHinhKeHoach from './routes/ThietLapCauHinh/KeHoach';
import RoutesThietLapCauHinhNguoiDung from './routes/ThietLapCauHinh/NguoiDung';
import RoutesThietLapCauHinhSuKien from './routes/ThietLapCauHinh/SuKien';
import RoutesThietLapCauHinhTaiLieuHop from './routes/ThietLapCauHinh/TaiLieuHop';
import RoutesThietLapCauHinhThanhPhanThamGia from './routes/ThietLapCauHinh/ThanhPhanThamGia';
import RoutesThietLapCauHinhThoiGianCho from './routes/ThietLapCauHinh/ThoiGianCho';
import RoutesThietLapCauHinhThongBaoLichHop from './routes/ThietLapCauHinh/ThongBaoLichHop';
import TrangChu from './routes/TrangChu';
import './styles/App.css';
import RoutesThietLapCauHinhLichHop from './routes/ThietLapCauHinh/LichHop';

moment.locale('vi');
window.globalRouter = null;
function App() {
    useEffect(() => {
        const checkAccessToken = async () => {
            const user = await userManager.getUser();
            if (!Helper.isNullOrUndefined(user) && Number(user?.expires_at) - Number(Math.round(new Date().getTime() / 1000)) - 1000 < 0) {
                userManager.signinRedirect();
            }
            localStorage.setItem('CSCORE_LINK', `${window.location.pathname}${window.location.search}`);
            if (!user || !user?.access_token) {
                userManager.signinRedirect();
            } else {
                loadUser(store, userManager).then(() => {
                    userManager.events.addUserSignedOut(() => userManager.signoutRedirect());
                });
            }
        };
        const hash = window.location.hash;
        if (hash === '' || hash === null || hash === undefined) {
            checkAccessToken();
        }
    }, []);

    return (
        <Provider store={store}>
            <OidcProvider store={store} userManager={userManager}>
                <BrowserRouter basename="" innerRef={(node) => (window.globalRouter = node)}>
                    <Routes path="">
                        <Route path="/*" element={<MainLayout />}>
                            <Route index element={<TrangChu />} />
                            {/* <Route path="vanhanh" index element={<TrangChu />} /> */}
                            <Route path="trangchu" index element={<TrangChu />} />
                            {/* <Route path="logout" index element={<OidcLogout />} /> */}
                            <Route path="callback" index element={<OidcCallBack />} />
                            <Route path="silentrenew" index element={<OidcSilentRenew />} />
                            {/* Báo cáo thống kê danh sách */}
                            <Route path="bao-cao-thong-ke" index element={<BaoCaoThongKe />} />
                            <Route path="bao-cao-thong-ke/:id" index element={<BaoCaoThongKe />} />
                            {/* Bao cao thong ke child form */}
                            <Route path="bao-cao-thong-ke" element={<Outlet />}>
                                {BaoCaoThongKeConfig.map((item, index) => (
                                    <Route path={`${item.path}`} key={index} element={<BaoCaoThongKeWraper {...item} />}>
                                        {item.childRoute?.map((route, childIndex) => (
                                            <Route path={route.path} key={childIndex} index element={<route.main />} />
                                        ))}
                                    </Route>
                                ))}
                            </Route>
                            {/* Quản lý nhật ký */}
                            <Route path="quan-ly-nhat-ky" index element={<QuanLyNhatKy />} />
                            <Route path="quan-ly-nhat-ky/:id" index element={<QuanLyNhatKy />} />
                            {/* Bao cao thong ke child form */}
                            <Route path="quan-ly-nhat-ky" element={<Outlet />}>
                                {QuanLyNhatKyConfig.map((item, index) => (
                                    <Route path={`${item.path}`} key={index} element={<QuanLyNhatKyWraper {...item} />}>
                                        {item.childRoute?.map((route, childIndex) => (
                                            <Route path={route.path} key={childIndex} index element={route.element} />
                                        ))}
                                    </Route>
                                ))}
                            </Route>
                            {/* Quản lý danh mục tổ chức */}
                            <Route path="quan-ly-thong-tin-don-vi" element={<Outlet />}>
                                {RoutesDanhMucToChuc.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý chức vụ */}
                            <Route path="quan-ly-chuc-vu" element={<Outlet />}>
                                {RoutesChucVu.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý chức năng */}
                            <Route path="quan-ly-chuc-nang" element={<Outlet />}>
                                {RoutesChucNang.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý vai trò */}
                            <Route path="quan-ly-vai-tro" element={<Outlet />}>
                                {RoutesVaiTro.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý người dùng */}
                            <Route path="quan-ly-nguoi-dung" element={<Outlet />}>
                                {RoutesNguoiDung.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý phân quyền */}
                            <Route path="quan-ly-phan-quyen" element={<Outlet />}>
                                {RoutesPhanQuyen.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Cấu hình hệ thống */}
                            <Route path="quan-ly-cau-hinh-he-thong" element={<Outlet />}>
                                {RoutesCauHinhHeThong.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý ứng dụng */}
                            <Route path="quan-ly-ung-dung" element={<Outlet />}>
                                {RoutesUngDung.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý phân quyền ứng dụng */}
                            <Route path="quan-ly-phan-quyen-ung-dung" element={<Outlet />}>
                                {RoutesPhanQuyenUngDung.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý chặn truy cập người dùng */}
                            <Route path="quan-ly-chan-truy-cap" element={<Outlet />}>
                                {RoutesGiamSatTruyCap.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý giám sát ip quan tri */}
                            <Route path="quan-ly-giam-sat-ip-quan-tri" element={<Outlet />}>
                                {RoutesGiamSatIPQuanTri.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý danh mục loại dữ liệu gán nhãn sao lưu */}
                            <Route path="quan-ly-du-lieu-sao-luu" element={<Outlet />}>
                                {RoutesDuLieuSaoLuu.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý sao lưu cấu hình hệ thống */}
                            <Route path="quan-ly-sao-luu-cau-hinh-he-thong" element={<Outlet />}>
                                {RoutesSaoLuuCauHinhHeThong.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý sao lưu bảng dữ liệu */}
                            <Route path="quan-ly-sao-luu-bang-du-lieu" element={<Outlet />}>
                                {RoutesSaoLuuBangDuLieu.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý sao lưu tệp tin*/}
                            <Route path="quan-ly-sao-luu-tep-tin" element={<Outlet />}>
                                {RoutesSaoLuuTepTin.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý thiết lập cơ chế sao lưu */}
                            <Route path="quan-ly-thiet-lap-co-che-sao-luu" element={<Outlet />}>
                                {RoutesThietLapCoCheSaoLuu.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý danh mục máy chủ */}
                            <Route path="quan-ly-danh-muc-may-chu" element={<Outlet />}>
                                {RoutesQuanLyDanhMucMayChu.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            //TODO
                            {/* Thiết lập cấu hình kế hoạch */}
                            <Route path="thiet-lap-cau-hinh-ke-hoach" element={<Outlet />}>
                                {RoutesThietLapCauHinhKeHoach.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình chương trình */}
                            <Route path="thiet-lap-cau-hinh-chuong-trinh" element={<Outlet />}>
                                {RoutesThietLapCauHinhChuongTrinh.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình tài liệu họp */}
                            <Route path="thiet-lap-cau-hinh-tai-lieu-hop" element={<Outlet />}>
                                {RoutesThietLapCauHinhTaiLieuHop.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình thành phần tham gia */}
                            <Route path="thiet-lap-cau-hinh-thanh-phan-tham-gia" element={<Outlet />}>
                                {RoutesThietLapCauHinhThanhPhanThamGia.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình biểu quyết */}
                            <Route path="thiet-lap-cau-hinh-bieu-quyet" element={<Outlet />}>
                                {RoutesThietLapCauHinhBieuQuyet.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình báo cáo thống kê */}
                            <Route path="thiet-lap-cau-hinh-bao-cao-thong-ke" element={<Outlet />}>
                                {RoutesThietLapCauHinhBaoCaoThongKe.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình sự kiện */}
                            <Route path="thiet-lap-cau-hinh-su-kien" element={<Outlet />}>
                                {RoutesThietLapCauHinhSuKien.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình người dùng */}
                            <Route path="thiet-lap-cau-hinh-nguoi-dung" element={<Outlet />}>
                                {RoutesThietLapCauHinhNguoiDung.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập cấu hình hệ thống */}
                            <Route path="thiet-lap-cau-hinh-he-thong" element={<Outlet />}>
                                {RoutesThietLapCauHinhHeThong.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Quản lý thông tin cấu hình dịch vụ sms */}
                            <Route path="thiet-lap-cau-hinh-dich-vu-sms" element={<Outlet />}>
                                {RoutesThietLapCauHinhDichVuSms.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập thông báo lịch họp */}
                            <Route path="thiet-lap-cau-hinh-thong-bao-lich-hop" element={<Outlet />}>
                                {RoutesThietLapCauHinhThongBaoLichHop.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập thời gian chờ */}
                            <Route path="thiet-lap-cau-hinh-thoi-gian-cho" element={<Outlet />}>
                                {RoutesThietLapCauHinhThoiGianCho.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                            {/* Thiết lập lịch họp */}
                            <Route path="thiet-lap-cau-hinh-lich-hop" element={<Outlet />}>
                                {RoutesThietLapCauHinhLichHop.map((route, index) => (
                                    <Route key={index} index path={route.path} element={route.element} />
                                ))}
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </OidcProvider>
        </Provider>
    );
}

export default App;
