import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { commonReducerSelector, tableSelector, userSelector } from '../redux/selector';
import tableReducer from '../redux/slice/TableSlice';
import { getFunctionsByRole, getProfile } from '../services/apis/danhmuc-service';
import '../styles/appbar.scss';
import '../styles/main-layout.scss';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api, { SESSION_STORAGE, setCurrentUser } from '../api2';
import { ThongBao } from '../components';
import Helper from '../helpers';
import { userManager } from '../oidc';
import { MyAppBar } from './Appbar';
import AuthenLayout from './Auth';
import { Drawer, DrawerHeader } from './Drawer';
import MySideBar from './Sidebar';

export default function MainLayout(props) {
    const [openDraw, setOpenDraw] = useState(true); //thu gon page
    const [phanquyen, setPhanQuyen] = useState(true); //có quyền : true : không có quyền false
    const [phanquyenChucNang, setPhanQuyenChucNang] = useState(true); //có quyền : true : không có quyền false
    const [defaultOpen, setDefaultOpen] = useState(false); // Khi không có trang chủ mặc định chọn hoặc mở 1 tính năng khác

    const [check_trangchu, setCheck_trangchu] = useState(false);
    const [link, setLink] = useState('/');
    // Fake loading
    const [loading, setLoading] = useState(false); //thu gon page
    const [timeOutId, setTimeOutId] = useState(false);
    //redux
    const commonReducer = useSelector(commonReducerSelector);
    const user = useSelector(userSelector);
    const tableselector = useSelector(tableSelector);
    const dispatch = useDispatch();
    //
    const navigate = useNavigate();
    // Tự động mở drawer
    useEffect(() => {
        setLoading(true);
        if (localStorage.getItem('CSCORE_OPEN_DRAWER')) {
            setOpenDraw(JSON.parse(localStorage.getItem('CSCORE_OPEN_DRAWER')));
        }
        const idTimeOut = setTimeout(() => {
            setLoading(false);
        }, 100);
        setTimeOutId(idTimeOut);
    }, []);
    useEffect(() => {
        return () => {
            clearTimeout(timeOutId);
        };
    }, [timeOutId]);
    useEffect(() => {
        if (user?.access_token) {
            setCurrentUser(user); // first of all authenticated api
            dispatch(getProfile(user));
            dispatch(getFunctionsByRole(user));
            setPhanQuyen(true);
        } else {
            setPhanQuyen(false);
        }
    }, [user]);

    useEffect(() => {
        if (link === '/vanhanh' || link === '/trangchu') {
            setCheck_trangchu(true);
        } else {
            setCheck_trangchu(false);
        }
    }, [link]);
    useEffect(() => {
        if (commonReducer.functions.data?.length > 0 && commonReducer.functions.data?.[0]?.moduleCode !== 'vanhanh_trangchu') {
            setDefaultOpen(true);
        }
    }, [commonReducer]);

    const handleDrawerOpen = () => {
        localStorage.setItem('CSCORE_OPEN_DRAWER', !openDraw);
        setOpenDraw(!openDraw);
        dispatch(tableReducer.actions.handleOpenDraw());
    };
    useEffect(() => {
        setLoading(true);
        userManager.getUser().then((res) => {
            if (res && res?.access_token) {
                new Api()
                    .PhanQuyenVaiTroNguoiDung({
                        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
                    })
                    .then((e) => {
                        if (!Helper.isNullOrUndefined(e) && JSON.stringify(e).includes('SystemAdmin') === false) {
                            setLoading(true);
                            return Swal.fire({
                                title: 'Thông báo',
                                text: 'Bạn không có quyền thao tác ở trang này. Vui lòng đăng xuất!',
                                icon: 'warning',
                                showCancelButton: false,
                                confirmButtonText: 'Đăng xuất',
                                cancelButtonText: 'Thoát',
                                showLoaderOnConfirm: true,
                                dangerMode: true,
                                toast: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    return userManager.signoutRedirect();
                                } else {
                                    // new Api().log_ql_nhat_ky_loi({
                                    //   token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                                    //     ?.access_token,
                                    //   data: {
                                    //     thoigian_loi: new Date().getTime(),
                                    //     noi_dung: "Có lỗi xảy ra (401)",
                                    //   },
                                    // });
                                    // message.error('Bạn cần đăng nhập để thực hiện chức năng này');
                                    return ThongBao({ status: 'error', message: 'Bạn cần đăng nhập để thực hiện chức năng này!' });
                                    return false;
                                }
                            });
                        } else {
                            setLoading(false);
                        }
                    });
            }
        });
    }, [user]);
    return (
        <div>
            {loading || !phanquyen ? (
                <div className="flat">
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                </div>
            ) : (
                <div className="main-layout">
                    <Box sx={{ display: 'flex', height: '100%' }}>
                        <MyAppBar handleDrawerOpen={handleDrawerOpen} openDraw={openDraw} />
                        <Drawer variant="permanent" open={openDraw}>
                            <DrawerHeader />
                            <MySideBar openDraw={openDraw} setPhanQuyen={setPhanQuyenChucNang} setLink={setLink} defaultOpen={defaultOpen} />
                        </Drawer>
                        <div className="main-layout__body">
                            <DrawerHeader />
                            <div className="main-layout__body__content">
                                <div className="main-layout__body__content__detail">
                                    <div
                                        style={{
                                            width: '100%',
                                            background: '#F6F8FC',
                                        }}
                                    >
                                        <AuthenLayout auth={phanquyenChucNang}>
                                            <div
                                                className={check_trangchu ? 'class-trangchu' : 'class-chil'}
                                                style={{
                                                    width: tableselector.detail && openDraw ? 'calc(100vw - 360px)' : tableselector.detail && openDraw === false && 'calc(100vw - 80px)',
                                                }}
                                            >
                                                <Outlet />
                                            </div>
                                        </AuthenLayout>
                                        <ToastContainer position="bottom-right" autoClose={500} hideProgressBar={true} closeOnClick theme="colored" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Box>
                </div>
            )}
        </div>
    );
}
