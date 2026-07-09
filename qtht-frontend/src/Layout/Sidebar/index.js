import React, { useEffect, useState } from 'react';
import { BackupOutlined, HistoryOutlined } from '@mui/icons-material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';
import Accordion from '@mui/material/Accordion';
import { default as AccordionSummary, default as MuiAccordionSummary } from '@mui/material/AccordionSummary';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import home from '../../assets/images/home.svg';
import { commonReducerSelector, userSelector } from '../../redux/selector';
import tableReducer from '../../redux/slice/TableSlice';
import '../../styles/sidebar.scss';
// Cấu hình menu
export const datasidebar = [
    {
        className: 'trangchu',
        path: 'trangchu',
        icon: <img src={home} alt="" />,
        name: 'Trang chủ',
    },
    // {
    //     className: 'bao-cao-thong-ke',
    //     path: 'bao-cao-thong-ke',
    //     icon: <AssessmentOutlined />,
    //     name: 'Báo cáo thống kê',
    // },
    {
        className: 'quan-ly-nhat-ky',
        path: 'quan-ly-nhat-ky',
        icon: <HistoryOutlined />,
        name: 'Quản lý nhật ký',
    },
    // {
    //     className: 'quan-ly-thong-tin-don-vi',
    //     path: 'quan-ly-thong-tin-don-vi',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý tổ chức',
    // },
    // {
    //     className: 'quan-ly-chuc-vu',
    //     path: 'quan-ly-chuc-vu',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý chức vụ',
    // },
    // {
    //     className: 'quan-ly-chuc-nang',
    //     path: 'quan-ly-chuc-nang',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý chức năng',
    // },
    // {
    //     className: 'quan-ly-vai-tro',
    //     path: 'quan-ly-vai-tro',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý vai trò',
    // },
    // {
    //     className: 'quan-ly-nguoi-dung',
    //     path: 'quan-ly-nguoi-dung',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý người dùng',
    // },
    // {
    //     className: 'quan-ly-phan-quyen',
    //     path: 'quan-ly-phan-quyen',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý phân quyền',
    // },
    // {
    //     className: 'quan-ly-cau-hinh-he-thong',
    //     path: 'quan-ly-cau-hinh-he-thong',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý cấu hình hệ thống',
    // },
    // {
    //     className: 'quan-ly-ung-dung',
    //     path: 'quan-ly-ung-dung',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý ứng dụng',
    // },
    // {
    //     className: 'quan-ly-phan-quyen-ung-dung',
    //     path: 'quan-ly-phan-quyen-ung-dung',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý phân quyền ứng dụng',
    // },
    // {
    //     className: 'quan-ly-giam-sat-truy-cap',
    //     path: 'quan-ly-giam-sat-truy-cap',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý giám sát truy cập',
    // },
    // {
    //     className: 'quan-ly-giam-sat-ip-quan-tri',
    //     path: 'quan-ly-giam-sat-ip-quan-tri',
    //     icon: <GroupOutlined />,
    //     name: 'Quản lý giám sát IP quản trị',
    // },
    {
        className: 'quan-ly-sao-luu',
        icon: <BackupOutlined />,
        name: 'Quản lý sao lưu',
        children: [
            {
                className: 'quan-ly-sao-luu-cau-hinh-he-thong',
                path: 'quan-ly-sao-luu-cau-hinh-he-thong',
                name: 'Quản lý sao lưu cấu hình hệ thống',
            },
            {
                className: 'quan-ly-du-lieu-sao-luu',
                path: 'quan-ly-du-lieu-sao-luu',
                name: 'Quản lý loại dữ liệu gán nhãn sao lưu',
            },
            {
                className: 'quan-ly-sao-luu-bang-du-lieu',
                path: 'quan-ly-sao-luu-bang-du-lieu',
                name: 'Quản lý sao lưu bảng dữ liệu',
            },
            {
                className: 'quan-ly-sao-luu-tep-tin',
                path: 'quan-ly-sao-luu-tep-tin',
                name: 'Quản lý sao lưu tệp tin',
            },
            {
                className: 'quan-ly-thiet-lap-co-che-sao-luu',
                path: 'quan-ly-thiet-lap-co-che-sao-luu',
                name: 'Quản lý thiết lập cơ chế sao lưu',
            },
        ],
    },
    //HTT
    {
        className: 'thiet-lap-cau-hinh',
        icon: <SettingsIcon />,
        name: 'Thiết lập cấu hình',
        children: [
            {
                className: 'thiet-lap-cau-hinh-ke-hoach',
                path: 'thiet-lap-cau-hinh-ke-hoach',
                name: 'Thiết lập cấu hình kế hoạch',
            },
            {
                className: 'thiet-lap-cau-hinh-chuong-trinh',
                path: 'thiet-lap-cau-hinh-chuong-trinh',
                name: 'Thiết lập cấu hình chương trình',
            },
            {
                className: 'thiet-lap-cau-hinh-tai-lieu-hop',
                path: 'thiet-lap-cau-hinh-tai-lieu-hop',
                name: 'Thiết lập cấu hình tài liệu họp',
            },
            {
                className: 'thiet-lap-cau-hinh-thanh-phan-tham-gia',
                path: 'thiet-lap-cau-hinh-thanh-phan-tham-gia',
                name: 'Thiết lập cấu hình thành phần tham gia',
            },
            {
                className: 'thiet-lap-cau-hinh-bieu-quyet',
                path: 'thiet-lap-cau-hinh-bieu-quyet',
                name: 'Thiết lập cấu hình biểu quyết',
            },
            {
                className: 'thiet-lap-cau-hinh-bao-cao-thong-ke',
                path: 'thiet-lap-cau-hinh-bao-cao-thong-ke',
                name: 'Thiết lập cấu hình báo cáo thống kê',
            },
            {
                className: 'thiet-lap-cau-hinh-su-kien',
                path: 'thiet-lap-cau-hinh-su-kien',
                name: 'Thiết lập cấu hình sự kiện',
            },
            {
                className: 'thiet-lap-cau-hinh-nguoi-dung',
                path: 'thiet-lap-cau-hinh-nguoi-dung',
                name: 'Thiết lập cấu hình người dùng',
            },
            {
                className: 'thiet-lap-cau-hinh-he-thong',
                path: 'thiet-lap-cau-hinh-he-thong',
                name: 'Thiết lập cấu hình hệ thống',
            },
            {
                className: 'quan-ly-thong-tin-cau-hinh-dich-vu-sms',
                path: 'thiet-lap-cau-hinh-dich-vu-sms',
                name: 'Quản lý thông tin cấu hình dịch vụ sms',
            },
            {
                className: 'thiet-lap-thong-bao-lich-hop',
                path: 'thiet-lap-cau-hinh-thong-bao-lich-hop',
                name: 'Thiết lập thông báo lịch họp',
            },
            {
                className: 'thiet-lap-thoi-gian-cho',
                path: 'thiet-lap-cau-hinh-thoi-gian-cho',
                name: 'Thiết lập thời gian chờ',
            },
            {
                className: 'thiet-lap-lich-hop',
                path: 'thiet-lap-cau-hinh-lich-hop',
                name: 'Thiết lập lịch họp',
            },
        ],
    },
    {
        className: 'quan-ly-danh-muc',
        icon: <FormatListBulletedIcon />,
        name: 'Quản lý danh mục',
        children: [
            {
                className: 'quan-ly-danh-muc-may-chu',
                path: 'quan-ly-danh-muc-may-chu',
                name: 'Quản lý danh mục máy chủ',
            },
            {
                className: 'quan-ly-thong-tin-don-vi',
                path: 'quan-ly-thong-tin-don-vi',
                name: 'Quản lý thông tin đơn vị',
            },
            {
                className: 'quan-ly-nguoi-dung',
                path: 'quan-ly-nguoi-dung',
                name: 'Quản lý thông tin người dùng',
            },
            {
                className: 'quan-ly-chuc-nang',
                path: 'quan-ly-chuc-nang',
                name: 'Quản lý chức năng',
            },
            {
                className: 'quan-ly-chuc-vu',
                path: 'quan-ly-chuc-vu',
                name: 'Quản lý chức vụ',
            },
            {
                className: 'quan-ly-vai-tro',
                path: 'quan-ly-vai-tro',
                name: 'Quản lý vai trò người dùng',
            },
            {
                className: 'quan-ly-phan-quyen',
                path: 'quan-ly-phan-quyen',
                name: 'Quản lý phân quyền người dùng',
            },
            {
                className: 'quan-ly-chan-truy-cap',
                path: 'quan-ly-chan-truy-cap',
                name: 'Quản lý chặn truy cập',
            },
            {
                className: 'quan-ly-giam-sat-ip-quan-tri',
                path: 'quan-ly-giam-sat-ip-quan-tri',
                name: 'Quản lý giám sát IP quản trị',
            },
        ],
    },
];
// Cấu hình Phân quyền
function ActiveClassAndRole({ setExpanded, commonReducer, setPhanQuyen, link }) {
    const activeClass = (value, classNameIcon) => {
        if (document.querySelector(`#active`)) {
            const a = document.querySelector(`#active`);
            a.setAttribute('id', '');
        }
        if (document.querySelector(`.${value}`)) {
            const box = document.querySelector(`.${value}`);
            box.setAttribute('id', 'active');
        }
        if (document.querySelector(`#activeColorIcon`)) {
            const icd = document.querySelector(`#activeColorIcon`);
            icd.setAttribute('id', '');
        }
        if (document.querySelector(`.${classNameIcon}`)) {
            const ic = document.querySelector(`.${classNameIcon}`);
            ic.setAttribute('id', 'activeColorIcon');
        }
    };
    datasidebar.forEach((value, index) => {
        if (value?.children?.length > 0) {
            // Trường hợp menu cấp 2
            value.children.forEach((childValue) => {
                if (link?.indexOf(`${childValue.path}`) !== -1) {
                    setExpanded(value.className);
                    activeClass(childValue.className);
                    return;
                }
            });
        } else {
            // Trường hợp menu cấp 1
            if (link?.indexOf(`${value?.path}`) !== -1) {
                activeClass(value.className);
                return;
            }
        }
    });
    // setPhanQuyen(true);
}
// Cấu hình Tooltip
function TitleTooltip(name, onClick, groupFunctions) {
    return datasidebar.map((value, index) => {
        // Kiểm tra tên menu có bằng tên tooltip không có thì mới tạo tooltip tương ứng với tên đó
        if (value?.name === name) {
            if (value?.children) {
                // Trường hợp menu cấp 2
                return (
                    <div key={index}>
                        {value.children.map((childValue, childIndex) => {
                            return (
                                <div
                                    key={childIndex}
                                    onClick={() => {
                                        onClick(value.className, childValue.path);
                                    }}
                                    className="title-tooltip"
                                >
                                    {childValue.name}
                                </div>
                            );
                        })}
                    </div>
                );
            } else {
                // Trường hợp menu cấp 1
                return (
                    <div
                        key={index}
                        onClick={() => {
                            onClick(value.className, value.path);
                        }}
                        className="title-tooltip"
                    >
                        {value.name}
                    </div>
                );
            }
        } else {
            return null;
        }
    });
}

const AccordionSummarytest = styled((props) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
}));

const BootstrapTooltip = styled(({ className, ...props }) => <Tooltip {...props} placement="right" arrow classes={{ popper: className }} leaveDelay={200} />)(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#132639',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#132639',
        maxWidth: 500,
    },
}));

function MenuCap1(props) {
    return (
        <AccordionSummary
            className={props.className}
            expandIcon={props.expandIcon && props.openDraw && <KeyboardArrowRightIcon fontSize="small" />}
            onClick={props.onClick && props.onClick}
            sx={{
                ' .MuiAccordionSummary-content': {
                    justifyContent: props.openDraw ? 'flex-start' : 'center',
                    pl: props.openDraw ? 1 : 0,
                    width: '100%',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                },
            }}
        >
            {props.openDraw ? (
                <div className="my-sidebar__menu__icon">{props.icon && props.icon}</div>
            ) : (
                <BootstrapTooltip title={TitleTooltip(props.ten, props.onClickToolTip, props?.groupFunctions)}>
                    <div className="my-sidebar__menu__icon">{props.icon && props.icon}</div>
                </BootstrapTooltip>
            )}
            {props.openDraw && (
                <p className="my-sidebar__menu__title" style={{ opacity: props.openDraw }}>
                    {props.ten}
                </p>
            )}
        </AccordionSummary>
    );
}

function MenuCap2(props) {
    return (
        <AccordionSummarytest sx className={props.className} expandIcon={props.expandIcon && <KeyboardArrowRightIcon fontSize="small" />} onClick={props.onClick && props.onClick}>
            <div style={{ opacity: props.openDraw }}>{props.icon && props.icon}</div>
            <p className="my-sidebar__menu__title__expand" style={{ opacity: props.openDraw, paddingLeft: props.expandIcon ? '2px' : '22px' }}>
                <ChevronRightIcon style={{ fontSize: 'medium' }} />
                {props.ten}
            </p>
        </AccordionSummarytest>
    );
}

export default function MySideBar(props) {
    const [expanded, setExpanded] = useState(false);
    const [expandedDetail, setExpandedDetail] = useState(false);
    const commonReducer = useSelector(commonReducerSelector);
    const user = useSelector(userSelector);
    let navigate = useNavigate(); //chuyển trang
    const dispatch = useDispatch();
    // Nếu đóng drawer thì sẽ không expand
    useEffect(() => {
        if (!props.openDraw) {
            setExpanded(false);
        }
    }, [props.openDraw]);
    // Tự động active khi refresh
    useEffect(() => {
        if (localStorage.getItem('CSCORE_LINK') === '/' || localStorage.getItem('CSCORE_LINK') === '/vanhanh' || localStorage.getItem('CSCORE_LINK') === '/') {
            if (props.defaultOpen) {
                const firstValue = commonReducer?.functions?.data?.[0];
                for (let key in datasidebar) {
                    if (datasidebar[key]?.moduleCode === firstValue?.moduleCode) {
                        setExpanded(datasidebar[key].className);
                        for (let childKey in datasidebar[key]) {
                            if (datasidebar[key][childKey]?.maChucNang === firstValue?.maChucNang) {
                                navigate(datasidebar[key][childKey]?.path);
                                if (document.querySelector(`#active`)) {
                                    const a = document.querySelector(`#active`);
                                    a.setAttribute('id', '');
                                }
                                if (document.querySelector(`.${datasidebar[key][childKey]?.className}`)) {
                                    const box = document.querySelector(`.${datasidebar[key][childKey]?.className}`);
                                    box.setAttribute('id', 'active');
                                }
                                props.setLink(`/${datasidebar[key][childKey]?.path}`);
                            }
                        }
                    }
                }
            } else {
                ActiveClassAndRole({
                    setExpanded: setExpanded,
                    setExpandedDetail: setExpandedDetail,
                    commonReducer: commonReducer,
                    setPhanQuyen: props.setPhanQuyen,
                    link: `/${datasidebar[0].path}`,
                    check: true,
                });
                props.setLink(`/${datasidebar[0].path}`);
            }
        } else {
            ActiveClassAndRole({
                setExpanded: setExpanded,
                setExpandedDetail: setExpandedDetail,
                commonReducer: commonReducer,
                setPhanQuyen: props.setPhanQuyen,
                link: localStorage.getItem('CSCORE_LINK'),
                check: true,
            });
            props.setLink(localStorage.getItem('CSCORE_LINK'));
        }
    }, [commonReducer.functions, props.defaultOpen]);

    const handleMenuCap1 = (panel, link) => (e, isExpanded) => {
        ActiveClassAndRole({
            setExpanded: setExpanded,
            setExpandedDetail: setExpandedDetail,
            commonReducer: commonReducer,
            setPhanQuyen: props.setPhanQuyen,
            link: `/${link}`,
        });
        props.setLink(`/${link}`);
        setExpanded(isExpanded ? panel : false);
        setExpandedDetail(false);
        if (document.querySelector(`#active`)) {
            const a = document.querySelector(`#active`);
            a.setAttribute('id', '');
        }
        if (document.querySelector(`#active1`)) {
            const a = document.querySelector(`#active1`);
            a.setAttribute('id', '');
        }
        const box = document.querySelector(`.${panel}`);
        box.setAttribute('id', 'active');
        dispatch(tableReducer.actions.offdetail());
        dispatch(tableReducer.actions.closefullsize());
        navigate(link);
    };

    const handleMenuExpandCap1 = (panel, link) => (e, isExpanded) => {
        if (props?.openDraw) {
            setExpanded(isExpanded ? panel : false);
            setExpandedDetail(false);
            if (expanded === panel) {
                ActiveClassAndRole({
                    setExpanded: () => {},
                    setExpandedDetail: setExpandedDetail,
                    commonReducer: commonReducer,
                    setPhanQuyen: props.setPhanQuyen,
                    link: link ? `/${link}` : undefined,
                });
            }
        }
    };

    const handleMenuDetailCap2 = (classname, link, parent) => () => {
        ActiveClassAndRole({
            setExpanded: setExpanded,
            setExpandedDetail: setExpandedDetail,
            commonReducer: commonReducer,
            setPhanQuyen: props.setPhanQuyen,
            link: `/${link}`,
        });
        props.setLink(`/${link}`);
        if (document.querySelector(`#active`)) {
            const a = document.querySelector(`#active`);
            a.setAttribute('id', '');
        }
        if (document.querySelector(`#active1`)) {
            const a = document.querySelector(`#active1`);
            a.setAttribute('id', '');
        }
        const box = document.querySelector(`.${classname}`);
        const box1 = document.querySelector(`.${parent}`);
        box1.setAttribute('id', 'active1');
        box.setAttribute('id', 'active');
        dispatch(tableReducer.actions.offdetail());
        dispatch(tableReducer.actions.closefullsize());
        navigate(link);
        setExpandedDetail(false);
    };

    const handleMenuCap1_ToolTip = (panel, link) => (e, isExpanded) => {
        ActiveClassAndRole({
            setExpanded: () => {},
            setExpandedDetail: setExpandedDetail,
            commonReducer: commonReducer,
            setPhanQuyen: props.setPhanQuyen,
            link: `/${link}`,
        });
        props.setLink(`/${link}`);
        setExpanded(false);
        setExpandedDetail(false);
        if (document.querySelector(`#active`)) {
            const a = document.querySelector(`#active`);
            a.setAttribute('id', '');
        }
        const box = document.querySelector(`.${panel}`);
        box.setAttribute('id', 'active');
        dispatch(tableReducer.actions.offdetail());
        dispatch(tableReducer.actions.closefullsize());
        navigate(link);
    };
    const handleMenuCap2_ToolTip = (panel, link) => {
        ActiveClassAndRole({
            setExpanded: () => {},
            setExpandedDetail: setExpandedDetail,
            commonReducer: commonReducer,
            setPhanQuyen: props.setPhanQuyen,
            link: `/${link}`,
        });
        props.setLink(`/${link}`);
        setExpanded(false);
        setExpandedDetail(false);
        if (document.querySelector(`#active`)) {
            const a = document.querySelector(`#active`);
            a.setAttribute('id', '');
        }
        const box = document.querySelector(`.${panel}`);
        box.setAttribute('id', 'active');
        dispatch(tableReducer.actions.offdetail());
        dispatch(tableReducer.actions.closefullsize());
        navigate(link);
    };
    // const groupFunctions = Helper.handleGroupFunctions(commonReducer?.functions?.data);
    const groupFunctions = [];
    return (
        <div className="my-sidebar">
            <div className="my-sidebar__menu">
                {datasidebar.map((value, index) => {
                    if (value?.children) {
                        // Menu cấp 2
                        return (
                            <Accordion key={index} expanded={expanded === value.className} onChange={handleMenuExpandCap1(value.className, value.path)}>
                                <MenuCap1 groupFunctions={groupFunctions} className={value.className} ten={value.name} expandIcon={true} icon={value.icon} openDraw={props?.openDraw} onClickToolTip={handleMenuCap2_ToolTip} />
                                {value.children?.map((childValue, childIndex) => {
                                    return <MenuCap2 key={childIndex} className={childValue.className} ten={childValue.name} onClick={handleMenuDetailCap2(childValue.className, childValue.path, value.className)} />;
                                })}
                            </Accordion>
                        );
                    } else {
                        // Menu cấp 1
                        return <MenuCap1 key={index} className={value.className} ten={value.name} onClick={handleMenuCap1(value.className, value.path)} onClickToolTip={handleMenuCap1_ToolTip} icon={value.icon} openDraw={props?.openDraw} />;
                    }
                })}
            </div>
            {props?.openDraw && (
                <div
                    style={{
                        // width: 300,
                        color: 'rgba(54, 54, 54, 0.81)',
                        fontWeight: 600,
                        fontSize: 12,
                        textShadow: 'rgb(0 0 0 / 28%) 1px 1px',
                        // fontStyle: 'italic',
                        borderTop: '0.01rem solid rgb(223, 223, 223)',
                        whiteSpace: 'pre-line',
                        paddingLeft: '4px',
                        marginBottom: '5px',
                    }}
                ></div>
            )}
        </div>
    );
}
