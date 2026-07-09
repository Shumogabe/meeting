import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextField, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesGiamSatIPQuanTri = [
    { path: '', element: <GiamSatIPQuanTriList /> },
    { path: 'them-moi', element: <GiamSatIPQuanTriForm /> },
    { path: 'cap-nhat/:id', element: <GiamSatIPQuanTriForm /> },
    { path: 'chi-tiet/:id', element: <GiamSatIPQuanTriChiTiet /> },
];

function GiamSatIPQuanTriList(props) {
    // SearchForm
    const [searchForm, setSearchForm] = useState({ tu_khoa: '', limit: 10, trangthai_xoa: null, anchor: null });
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
            .ListGiamSatIPQuanTri(data)
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
                console.log('Lỗi get list', err);
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
        navigate(`cap-nhat/${data?.ip}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ip}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ip) return;
        console.log(data);
        data.trangthai_xoa = 'Đã xóa';
        new Api()
            .SubmitGiamSatIPQuanTri(data)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                    console.log(data);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa phân quyền', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRestore = useCallback((data) => {
        if (!data?.ip) return;
        data.trangthai_xoa = null;
        new Api()
            .SubmitGiamSatIPQuanTri(data)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Phục hồi thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa phân quyền', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý giám sát IP quản trị' }]} />
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
                    <Grid container>
                        <Grid item xs={2}>
                            <MySelect clearAble={true} label="Trạng thái" placeholder="Chọn" value={values?.trangthai_xoa || null} options={['Đã xóa']} onChange={(e, value) => setFieldValue('trangthai_xoa', value || null)} />
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
                        headerName: 'IP',
                        field: 'ip',
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
                    { headerName: 'Tên máy', field: 'ten', flex: 1 },
                    { headerName: 'Thiết bị', field: 'thiet_bi', flex: 1 },
                    { headerName: 'Địa chỉ MAC', field: 'mac', flex: 1 },
                    {
                        headerName: 'Thời gian tạo',
                        field: 'thoigian_tao',
                        cellRenderer: ({ value, data }) => {
                            return <div>{Helper.timeToVietNamDate(value)}</div>;
                        },
                        flex: 1,
                    },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_xoa',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} handleEdit={value !== 'Đã xóa' && handleEdit} handleDelete={value !== 'Đã xóa' && handleDelete} handleRestore={value === 'Đã xóa' && handleRestore} handleDetail={handleDetail} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function GiamSatIPQuanTriForm() {
    const { id } = useParams(null);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [rawData, setRawData] = useState([]);
    const [nguoiDungs, setNguoiDungs] = useState([]);
    const [ungDungs, setUngDungs] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ip: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Địa chỉ IP đã tồn tại', async (value, context) => {
                // console.log(context);
                if (id || !rawData || !rawData.records) return true;
                const bangDuLieu = context.parent.ip;
                const isUnique = !rawData.records.some((record) => record.ip === bangDuLieu);
                return isUnique;
            }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListGiamSatIPQuanTri(data)
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
                .GetGiamSatIPQuanTri(id)
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
        // const getNguoiDung = new Api().ListNguoiDung({});
        // const getUngDung = new Api().ListUngDung({});
        // Promise.all([getNguoiDung, getUngDung])
        //     .then((res) => {
        //         if (res[0].code === 200) {
        //             const newarr = res[0].data?.records?.map((vl) => {
        //                 delete vl?.thong_tin_don_vi;
        //                 delete vl?.thong_tin_chuc_vu;
        //                 return vl;
        //             });
        //             setNguoiDungs(newarr);
        //         }
        //         if (res[1].code === 200) {
        //             setUngDungs(res[1].data?.records);
        //         }
        //     })
        //     .catch((err) => {
        //         console.log('Lỗi khi lấy options cho select box!', err);
        //         ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
        //     });
    };
    const submitForm = (values, action) => {
        // lấy tên ứng dụng
        values.ten_ung_dung = values?.ungdung?.ten || null;
        // Lấy ds mã người dùng(tên đăng nhập)
        values.ma_ds_nguoidungs = values?.ds_nguoidungs?.map((vl) => vl.ten_dangnhap) || null;
        new Api()
            .SubmitGiamSatIPQuanTri(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-giam-sat-ip-quan-tri');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý giám sát IP quản trị', link: '/quan-ly-giam-sat-ip-quan-tri' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý giám sát IP quản trị', link: '/quan-ly-giam-sat-ip-quan-tri' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, dirty, touched, handleSubmit, setFieldValue, submitCount, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={1}>
                                    <Grid item xs container spacing={1}>
                                        <Grid item xs={6}>
                                            <FastField name="ip">{({ field, form, meta }) => <MyTextField required={true} disabled={Boolean(id)} label="Địa chỉ IP" placeholder="Nhập địa chỉ IP" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FastField name="ten">{({ field, form, meta }) => <MyTextField label="Tên máy" placeholder="Nhập tên máy" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FastField name="thiet_bi">{({ field, form, meta }) => <MyTextField label="Thiết bị đăng nhập" placeholder="Nhập thiết bị đăng nhập" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FastField name="mac">{({ field, form, meta }) => <MyTextField label="Địa chỉ MAC" placeholder="Nhập địa chỉ MAC" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-giam-sat-ip-quan-tri')} />
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
function GiamSatIPQuanTriChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetGiamSatIPQuanTri(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý giám sát IP quản trị', link: '/quan-ly-giam-sat-ip-quan-tri' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý giám sát IP quản trị', link: '/quan-ly-giam-sat-ip-quan-tri' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'IP',
                                dataIndex: 'ip',
                            },
                            {
                                rowName: 'Tên máy',
                                dataIndex: 'ten',
                            },
                            {
                                rowName: 'Thiết bị',
                                dataIndex: 'thiet_bi',
                            },
                            {
                                rowName: 'Địa chỉ MAC',
                                dataIndex: 'mac',
                            },
                            {
                                rowName: 'Thời gian tạo',
                                dataIndex: 'thoigian_tao',
                                rowRender: (value, data) => {
                                    return <div>{Helper.timeToVietNamDate(value)}</div>;
                                },
                            },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesGiamSatIPQuanTri;
