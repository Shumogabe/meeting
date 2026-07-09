import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextField, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api, { SESSION_STORAGE } from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesNguoiDung = [
    { path: '', element: <NguoiDungList /> },
    { path: 'them-moi', element: <NguoiDungForm /> },
    { path: 'cap-nhat/:id', element: <NguoiDungForm /> },
    { path: 'chi-tiet/:id', element: <NguoiDungChiTiet /> },
];

function NguoiDungList(props) {
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
            .ListNguoiDung(data)
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
                console.log('Lỗi get list người dùng', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((final) => {
                const timeOut = setTimeout(() => {
                    setLoadingTable(false);
                }, 300);
                setTimeOutId(timeOut);
            });
    };
    const handleEdit = useCallback((data) => {
        navigate(`cap-nhat/${data?.ten_dangnhap}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ten_dangnhap}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ten_dangnhap) return;
        new Api()
            .DeleteNguoiDung(data.ten_dangnhap)
            .then((res) => {
                if (res.code === 200) {
                    new Api().SubmitQLNhatKyNguoiDung({
                        tai_khoan: data.ten_dangnhap,
                        noi_dung: (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.username || JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.sub) + ' thực hiện xóa ' + data.ten_dangnhap,
                        loai_hoatdong: 'Xóa',
                        chuc_nang: 'Quản lý người dùng',
                    });
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa người dùng', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRemove = useCallback((data) => {
        if (!data?.ten_dangnhap) return;
        new Api()
            .RemoveNguoiDung(data.ten_dangnhap)
            .then((res) => {
                if (res.code === 200) {
                    new Api().SubmitQLNhatKyNguoiDung({
                        tai_khoan: data.ten_dangnhap,
                        noi_dung: (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.username || JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.sub) + ' thực hiện xóa ' + data.ten_dangnhap,
                        loai_hoatdong: 'Xóa',
                        chuc_nang: 'Quản lý người dùng',
                    });
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa người dùng', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRestore = useCallback((data) => {
        if (!data?.ten_dangnhap) return;
        new Api()
            .RestoreNguoiDung(data.ten_dangnhap)
            .then((res) => {
                if (res.code === 200) {
                    new Api().SubmitQLNhatKyNguoiDung({
                        tai_khoan: data.ten_dangnhap,
                        noi_dung: (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.username || JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.sub) + ' thực hiện khôi phục ' + data.ten_dangnhap,
                        loai_hoatdong: 'Khôi phục',
                        chuc_nang: 'Quản lý người dùng',
                    });
                    ThongBao({ status: 'success', message: 'Khôi phục thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi khôi phục người dùng', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý người dùng' }]} />
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
            >
                {({ handleSubmit, setFieldValue, handleChange, values, errors, ...propsForm }) => (
                    <Grid container gap={1} alignItems="flex-end" direction="row">
                        <Grid item xs={3}>
                            <MySelect
                                fullWidth
                                clearAble={true}
                                name="trangthai_xoa"
                                label="Trạng thái xóa"
                                placeholder="Chọn trạng thái"
                                value={values?.trangthai_xoa || null}
                                onChange={(e, value) => {
                                    setFieldValue('trangthai_xoa', value || null);
                                }}
                                options={['Đã xóa', 'Chưa xóa']}
                            />
                        </Grid>
                    </Grid>
                )}
            </MySearchBox>
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
                        headerName: 'Tên đăng nhập',
                        field: 'ten_dangnhap',
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
                    { headerName: 'Tên đầy đủ', field: 'ten_day_du', flex: 1 },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_hoatdong',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} handleEdit={handleEdit} handleDelete={formikRef.current?.values?.trangthai_xoa !== 'Đã xóa' ? handleRemove : handleDelete} handleDetail={handleDetail} handleRestore={formikRef.current?.values?.trangthai_xoa === 'Đã xóa' && handleRestore} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function NguoiDungForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [chucVus, setChucVus] = useState([]);
    const [toChucs, setToChucs] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ten_dangnhap: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Tên đăng nhập đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                // const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.ten_dangnhap === value);
                return isUnique;
            }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListNguoiDung(data)
            .then((res) => {
                if (res.code === 200) {
                    setRawData(res.data);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi get list', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((final) => {
                const timeOut = setTimeout(() => {}, 300);
                setTimeOutId(timeOut);
            });
    };
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (id) {
            setLoading(true);
            new Api()
                .GetNguoiDung(id)
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
        const getChucNang = new Api().ListChucVu({});
        const getToChuc = new Api().ListToChuc({});
        Promise.all([getChucNang, getToChuc])
            .then((res) => {
                if (res[0].code === 200) {
                    setChucVus(res[0].data?.records);
                }
                if (res[1].code === 200) {
                    setToChucs(res[1].data?.records);
                }
            })
            .catch((err) => {
                console.log('Lỗi khi lấy options cho select box!', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    const submitForm = (values, action) => {
        // lấy mã tổ chức và mã chức vụ
        values.ma_tochuc = values?.thong_tin_don_vi?.ma || null;
        values.ma_chucvu = values?.thong_tin_chuc_vu?.ma || null;
        new Api()
            .SubmitNguoiDung(values)
            .then((res) => {
                if (res.code === 200) {
                    new Api().SubmitQLNhatKyNguoiDung({
                        tai_khoan: values.ten_dangnhap,
                        noi_dung: (JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.username || JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.profile?.sub) + ' thực hiện ' + (id ? 'cập nhật ' : 'thêm mới ') + values.ten_dangnhap,
                        loai_hoatdong: id ? 'Cập nhật' : 'Thêm mới',
                        chuc_nang: 'Quản lý người dùng',
                    });
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-nguoi-dung');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý người dùng', link: '/quan-ly-nguoi-dung' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý người dùng', link: '/quan-ly-nguoi-dung' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, dirty, handleSubmit, setFieldValue, submitCount, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={1}>
                                    <Grid item xs container spacing={1}>
                                        <Grid item xs={6}>
                                            <FastField name="ten_dangnhap">{({ field, form, meta }) => <MyTextField required={true} disabled={Boolean(id)} label="Tên đăng nhập" placeholder="Nhập tên đăng nhập" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FastField name="ten_day_du">{({ field, form, meta }) => <MyTextField label="Tên người dùng" placeholder="Nhập tên người dùng" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FastField name="so_dien_thoai">{({ field, form, meta }) => <MyTextField label="Số điện thoại" placeholder="Nhập số điện thoại" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FastField name="email">{({ field, form, meta }) => <MyTextField label="Email" placeholder="Nhập email" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MySelect
                                                name="ten"
                                                label="Tổ chức"
                                                placeholder="Chọn tổ chức"
                                                value={values?.thong_tin_don_vi || null}
                                                options={toChucs}
                                                onChange={(e, value) => {
                                                    setFieldValue('thong_tin_don_vi', value || null);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MySelect
                                                name="ten"
                                                label="Chức vụ"
                                                placeholder="Chọn chức vụ"
                                                value={values?.thong_tin_chuc_vu || null}
                                                options={chucVus}
                                                onChange={(e, value) => {
                                                    setFieldValue('thong_tin_chuc_vu', value || null);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-nguoi-dung')} />
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
function NguoiDungChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetNguoiDung(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý người dùng', link: '/quan-ly-nguoi-dung' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý người dùng', link: '/quan-ly-nguoi-dung' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container>
                    <RowDetailTable
                        title="Chi tiết người dùng"
                        data={data}
                        rowDefs={[
                            { rowName: 'Tên người dùng', dataIndex: 'ten_dangnhap' },
                            { rowName: 'Mã người dùng', dataIndex: 'ten_day_du' },
                            { rowName: 'Số điện thoại', dataIndex: 'so_dien_thoai' },
                            { rowName: 'Email', dataIndex: 'email' },
                            {
                                rowName: 'Tổ chức',
                                dataIndex: 'thong_tin_don_vi',
                                rowRender: (value, data) => {
                                    return (
                                        <Link component="button" underline="always" onClick={() => window.open(`/quan-ly-thong-tin-don-vi/chi-tiet/${data?.thong_tin_don_vi?.ma}`, '_blank')}>
                                            {value?.ten || '-/-'}
                                        </Link>
                                    );
                                },
                            },
                            {
                                rowName: 'Chức vụ',
                                dataIndex: 'thong_tin_chuc_vu',
                                rowRender: (value, data) => {
                                    return (
                                        <Link component="button" underline="always" onClick={() => window.open(`/quan-ly-chuc-vu/chi-tiet/${data?.thong_tin_chuc_vu?.ma}`, '_blank')}>
                                            {value?.ten || '-/-'}
                                        </Link>
                                    );
                                },
                            },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesNguoiDung;
