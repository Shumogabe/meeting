import React from 'react';
import Logout from '@mui/icons-material/Logout';
import { AppBar, Avatar, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import image_playlist from '../../assets/images/Playlist.png';
import image_playlist_open from '../../assets/images/Playlist_open.png';
import logo from '../../assets/images/logotc1 2.png';
import { userManager } from '../../oidc';
import { commonReducerSelector } from '../../redux/selector';
import tableReducer from '../../redux/slice/TableSlice';

import { Constant } from '../../constants/constant';

export function MyAppBar(props) {
    const commonReducer = useSelector(commonReducerSelector);
    const profile = commonReducer.profile.data;
    const [anchorEl, setAnchorEl] = React.useState(null); //drop menu tài khoản
    const isMenuOpen = Boolean(anchorEl); //drop menu tài khoản
    const menuId = 'primary-search-account-menu'; //id drop menu tài khoản
    const [anchorElApplication, setAnchorElApplication] = React.useState(null);
    const isMenuOpenApplication = Boolean(anchorElApplication);
    const dispatch = useDispatch();
    let navigate = useNavigate(); //chuyển trang

    const handleDrawerOpen = () => {
        props.handleDrawerOpen();
        dispatch(tableReducer.actions.autofit());
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenuOpenApplication = (event) => {
        setAnchorElApplication(event.currentTarget);
    };

    const handleMenuCloseApplication = () => {
        setAnchorElApplication(null);
    };
    const handlenguoidung = () => {
        localStorage.setItem('CSCORE_LINK', `${window.location.pathname}`);
    };

    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }
    function stringAvatar(name) {
        const nameArr = name?.split(' ');
        const first = nameArr?.[0]?.[0] || 'U';
        const second = nameArr?.[1]?.[0] || 'D';
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${first}${second}`,
        };
    }

    // menu thông tin tài khoản
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            disableScrollLock={true}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    padding: '0.5rem',
                    '.css-6hp17o-MuiList-root-MuiMenu-list': {
                        padding: '0px 0px',
                    },
                    '.css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root': {
                        marginBottom: '8px',
                    },
                    '.css-kk1bwy-MuiButtonBase-root-MuiMenuItem-root:hover': {
                        backgroundColor: '#f0f2f5',
                        borderRadius: '0.375rem',
                        '.thongtintaikhoan__icon': {
                            color: '#344767',
                        },
                        '.thongtintaikhoan__text': {
                            color: '#344767',
                        },
                    },
                },
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {/* <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                    <Person className="thongtintaikhoan__icon" fontSize="small" />
                </ListItemIcon>
                <div onClick={() => handlenguoidung()}>
                    <Link to={'thongtinnguoidung'} className="thongtintaikhoan__text">
                        Thông tin người dùng
                    </Link>
                </div>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                <Settings className="thongtintaikhoan__icon" fontSize="small" />
                </ListItemIcon>
                <Link to={'doimatkhau'} className="thongtintaikhoan__text">Đổi mật khẩu</Link>
            </MenuItem> */}
            <MenuItem
                onClick={() => {
                    userManager.signoutRedirect();
                }}
            >
                <ListItemIcon>
                    <Logout className="thongtintaikhoan__icon" fontSize="small" />
                </ListItemIcon>
                <p className="thongtintaikhoan__text">Đăng xuất</p>
            </MenuItem>
        </Menu>
    );
    return (
        <div className="my-appbar">
            <AppBar
                style={{
                    // transition: 'all 0.3s ease-in-out',
                    boxShadow: 'none',
                    background: '#f6f8fc',
                    borderBottom: '1px solid #dfdfdf',
                }}
            >
                <div className="my-appbar__toolbar">
                    <div className="my-appbar__toolbar__left">
                        <IconButton style={{ padding: '5px 5px 5px 0px' }} color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start">
                            {props.openDraw ? <img src={image_playlist} /> : <img src={image_playlist_open} />}
                        </IconButton>
                        <div style={{ marginLeft: 5, display: 'flex', paddingRight: '15px', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('trangchu')}>
                            <div style={{ width: '54px', height: '54px' }}>
                                <img src={logo} style={{ width: '100%', height: 'auto' }} />
                            </div>
                            <div style={{ paddingLeft: '10px' }}>
                                <div className="title-tc">{Constant.TITLE_TO_CHUC}</div>
                                <div className="title-pm">{Constant.TITLE_PHAN_MEM}</div>
                            </div>
                        </div>
                        {/* <Paper
                            // component="form"
                            sx={{ p: '2px 4px', background: '#f0f0f0', height: '40px', boxShadow: 'none', display: 'flex', alignItems: 'center', width: 600, borderRadius: 4 }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Nhập từ khóa cần tìm"
                                inputProps={{
                                    onKeyDown: (e) => {
                                        if (e.key === 'Enter') {
                                            console.log(e.target.value);
                                        }
                                    },
                                }}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <img src={image_search} />
                            </IconButton>
                        </Paper> */}
                    </div>
                    <div className="my-appbar__toolbar__right">
                        {/* <div style={{ paddingRight: 30, display: 'flex' }}>
                            <div className="icon-noti">
                                <img src={image_notification} />
                            </div>
                            <div className="icon-noti">
                                <img src={image_question} />
                            </div>
                            <div className="icon-noti">
                                <img src={image_Headphones} />
                            </div>
                        </div> */}
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleProfileMenuOpen} className="myappbar__person">
                            <Tooltip title="Thông tin tài khoản">
                                <Typography
                                    style={{
                                        cursor: 'pointer',
                                        color: '#000000',
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        userSelect: 'none',
                                    }}
                                    className="name-account"
                                >
                                    {profile && profile.fullName}
                                </Typography>
                                {/* <Typography style={{ cursor: 'pointer', textAlign: 'end' }} className="name-account">
                                    {profile && profile.userName}
                                </Typography> */}
                            </Tooltip>
                            <div style={{ width: '45px', height: '45px', marginLeft: '5px', display: 'flex', alignItems: 'center' }}>
                                <Avatar {...stringAvatar(profile?.fullName || 'Not Found')} style={{ width: '30px', height: '30px', fontSize: '13px' }} />
                            </div>
                        </div>
                        {renderMenu}
                    </div>
                </div>
            </AppBar>
        </div>
    );
}
