import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HQCollapseForm, MyBreadCrumbs, MyButton, MySearchBox, MyTable, MyTextField, MyTextFieldArea, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Chip, Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesCauHinhHeThong = [
    { path: '', element: <CauHinhHeThongList /> },
    { path: 'them-moi', element: <CauHinhHeThongForm /> },
    { path: 'cap-nhat/:id', element: <CauHinhHeThongForm /> },
    { path: 'chi-tiet/:id', element: <CauHinhHeThongChiTiet /> },
];

function CauHinhHeThongList(props) {
    // SearchForm
    const [searchForm, setSearchForm] = useState({ tu_khoa: '', limit: 10, anchor: null });
    const formikRef = useRef(null);
    const validationSchema = Yup.object().shape({});
    // Table
    const [dataTable, setDataTable] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [rawData, setRawData] = useState({});
    const [Count, setCount] = useState();
    const [timeOutId, setTimeOutId] = useState();
    // Router Dom
    const navigate = useNavigate();
    // Func

    useEffect(() => {
        const values = formikRef.current.values;
        getApi(values);
    }, []);
    useEffect(() => {
        // Clear timeout
        return () => {
            clearTimeout(timeOutId);
        };
    }, [timeOutId]);

    const getRows = (limit, anchor, page) => {
        const values = formikRef.current.values;
        getApi({ ...values, limit, anchor, page });
    };
    const getApi = ({ tu_khoa, limit, anchor, page, ...rest }) => {
        setLoadingTable(true);
        const data = { tu_khoa, limit, anchor, page, ...rest };
        new Api()
            .ListCauHinhHeThong(data)
            .then((res) => {
                if (res.code === 200) {
                    setDataTable(Helper.addSttToTableDataSource(res.data.records, page, limit));
                    setRawData(res.data);
                    if (res.data?.count) {
                        setCount(res.data?.count);
                    }
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi get list cấu hình hệ thống', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((final) => {
                const timeOut = setTimeout(() => {
                    setLoadingTable(false);
                }, 300);
                setTimeOutId(timeOut);
            });
    };
    const handleKichHoat = useCallback((data) => {
        if (isEmpty(data)) {
            ThongBao({ status: 'error', message: 'Có lỗi xảy ra khi cập nhật trạng thái hoạt động!' });
            console.log('Data không tồn tại!', data);
            return;
        }
        // Đổi trạng thái hoạt động
        data.trangthai_hoatdong = data?.trangthai_hoatdong === 'Đang hoạt động' ? 'Ngừng hoạt động' : 'Đang hoạt động';
        new Api()
            .SubmitCauHinhHeThong(data)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: data?.trangthai_hoatdong === 'Đang hoạt động' ? 'Kích hoạt hoạt động thành công!' : 'Ngừng hoạt động thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi cập nhật trạng thái', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleEdit = useCallback((data) => {
        navigate(`cap-nhat/${data?.ten}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ten}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ten) return;
        new Api()
            .DeleteCauHinhHeThong(data.ten)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa cấu hình hệ thống', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý cấu hình hệ thống' }]} />
            <MySearchBox
                defaultExpand={false}
                name="tu_khoa"
                formikRef={formikRef}
                showState={false}
                initialValues={searchForm}
                validationSchema={validationSchema}
                // autoSubmit = time out delay vd 200, 300, 400,500...
                autoSubmit={false}
                onSubmit={(values) => {
                    getApi(values);
                }}
                customButton={[]}
            ></MySearchBox>
            <Grid container justifyContent="flex-end" py={1} pr="40px">
                <MyButton
                    variant="outlined"
                    txt="Thêm mới"
                    width={'100px'}
                    onClick={() => {
                        navigate('them-moi');
                    }}
                />
            </Grid>
            <MyTable
                data={dataTable}
                columns={[
                    { headerName: 'STT', field: 'stt', pinned: 'left', width: 80, type: 'center' },
                    {
                        headerName: 'Tên cấu hình',
                        field: 'ten',
                        flex: 1,
                        cellRenderer: ({ value, data, ...rest }) => (
                            <Link
                                component="button"
                                onClick={() => {
                                    handleDetail(data);
                                }}
                                underline="always"
                            >
                                {value}
                            </Link>
                        ),
                    },
                    {
                        headerName: 'Thông số',
                        field: 'thong_so',
                        flex: 1,
                        cellRenderer: (p) => {
                            const obj = p.value;
                            const str = `Email: ${obj?.email} <br/>SĐT: ${obj.so_dienthoai}`;
                            return <div dangerouslySetInnerHTML={{ __html: str }} />;
                        },
                    },
                    {
                        headerName: 'Thời gian tạo',
                        field: 'thoigian_tao',
                        cellRenderer: ({ value, data }) => {
                            return <div>{Helper.timeToVietNamDate(value)}</div>;
                        },
                        flex: 1,
                    },
                    {
                        headerName: 'Trạng thái kích hoạt',
                        field: 'trangthai_hoatdong',
                        width: 200,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <Chip label={value} color={value === 'Đang hoạt động' ? 'primary' : 'error'} variant="outlined" size="small" />;
                        },
                    },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_hoatdong',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} active={{ state: value === 'Đang hoạt động', name: 'hoạt động', callback: handleKichHoat }} handleEdit={handleEdit} handleDelete={handleDelete} handleDetail={handleDetail} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function CauHinhHeThongForm() {
    const { id } = useParams(null);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [nguoiDungs, setNguoiDungs] = useState([]);
    const [vaiTros, setVaiTros] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ten: Yup.string().required('Không được bỏ trống!'),
        thong_so: Yup.object().shape({
            so_dienthoai: Yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
            email: Yup.string().email('Email không hợp lệ'),
        }),
    });
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (id) {
            setLoading(true);
            new Api()
                .GetCauHinhHeThong(id)
                .then((res) => {
                    if (res.code === 200) {
                        setFormData(res.data);
                    } else {
                        ThongBao({ code: res.code, message: res?.message });
                    }
                })
                .catch((err) => {
                    console.log('Lỗi khi lấy theo id', err);
                    ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
                })
                .finally((fin) => {
                    const id = setTimeout(() => {
                        setLoading(false);
                    }, 300);
                    setTimeOutId(id);
                });
        } else {
            const initData = {};
            setFormData(initData);
        }
        getOptions();
    }, [id]);
    useEffect(() => {
        // Clear timeout
        return () => {
            clearTimeout(timeOutId);
        };
    }, [timeOutId]);
    const getOptions = () => {
        const getNguoiDung = new Api().ListNguoiDung({});
        const getVaiTro = new Api().ListVaiTro({});
        Promise.all([getNguoiDung, getVaiTro])
            .then((res) => {
                if (res[0].code === 200) {
                    const newarr = res[0].data?.records?.map((vl) => {
                        delete vl?.thong_tin_don_vi;
                        delete vl?.thong_tin_chuc_vu;
                        return vl;
                    });
                    setNguoiDungs(newarr);
                }
                if (res[1].code === 200) {
                    setVaiTros(res[1].data?.records);
                }
            })
            .catch((err) => {
                console.log('Lỗi khi lấy options cho select box!', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    const submitForm = (values, action) => {
        // lấy mã tổ chức và mã chức vụ
        values.trangthai_hoatdong = values?.trangthai_hoatdong || 'Đang hoạt động';
        values.thong_so_json = values?.thong_so ? JSON.stringify(values.thong_so) : null;
        new Api()
            .SubmitCauHinhHeThong(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-cau-hinh-he-thong');
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi khi submit form', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    // if (loading) {
    //     return (
    //         <>
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý cấu hình hệ thống', link: '/quan-ly-cau-hinh-he-thong' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý cấu hình hệ thống', link: '/quan-ly-cau-hinh-he-thong' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, dirty, handleSubmit, setFieldValue, submitCount, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={1}>
                                    <Grid item xs>
                                        <FastField name="ten">{({ field, form, meta }) => <MyTextField disabled={Boolean(id)} required={true} label="Tên cấu hình" placeholder="Nhập tên cấu hình" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs container>
                                        <HQCollapseForm title="Cấu hình thông số" defaultExpanded={true}>
                                            <Grid container p={1} spacing={1}>
                                                <Grid item xs>
                                                    <FastField name="thong_so.email">{({ field, form, meta }) => <MyTextField label="Email" placeholder="Nhập email" errors={meta.touched && meta.error} helperText={meta.touched && meta.error} {...field} />}</FastField>
                                                </Grid>
                                                <Grid item xs>
                                                    <FastField name="thong_so.so_dienthoai">{({ field, form, meta }) => <MyTextField label="Số điện thoại" placeholder="Nhập số điện thoại" errors={meta.touched && meta.error} helperText={meta.touched && meta.error} {...field} />}</FastField>
                                                </Grid>
                                            </Grid>
                                        </HQCollapseForm>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="mota">{({ field, form, meta }) => <MyTextFieldArea label="Mô tả" {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-cau-hinh-he-thong')} />
                                        <MyButton type="submit" txt={id ? 'Cập nhật' : 'Thêm mới'} width="100px" onClick={handleSubmit} />
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                        <DisplayFormikState props={values} errors={errors} />
                                    </Grid> */}
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            )}
        </>
    );
}
function CauHinhHeThongChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetCauHinhHeThong(id)
            .then((res) => {
                if (res.code === 200) {
                    setData(res.data);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi khi lấy theo id', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((fin) => {
                const id = setTimeout(() => {
                    setLoading(false);
                }, 300);
                setTimeOutId(id);
            });
    }, [id]);
    useEffect(() => {
        return () => {
            clearTimeout(timeOutId);
        };
    }, [timeOutId]);
    // if (loading) {
    //     return (
    //         <>
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý cấu hình hệ thống', link: '/quan-ly-cau-hinh-he-thong' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý cấu hình hệ thống', link: '/quan-ly-cau-hinh-he-thong' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết cấu hình hệ thống"
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'Tên cấu hình',
                                dataIndex: 'ten',
                            },
                            {
                                rowName: 'Thông số',
                                dataIndex: 'thong_so',
                                rowRender: (value, data) => {
                                    const str = `Email: ${value?.email} <br/> SĐT: ${value.so_dienthoai}`;
                                    return <div dangerouslySetInnerHTML={{ __html: str }} />;
                                },
                            },
                            {
                                rowName: 'Trạng thái kích hoạt',
                                dataIndex: 'trangthai_hoatdong',
                            },
                            {
                                rowName: 'Thời gian tạo',
                                dataIndex: 'thoigian_tao',
                                rowRender: (value, data) => {
                                    return <div>{Helper.timeToVietNamDate(value)}</div>;
                                },
                            },
                            { rowName: 'Mô tả', dataIndex: 'mota' },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesCauHinhHeThong;
