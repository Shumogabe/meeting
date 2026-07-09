import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextField, MyTextFieldArea, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Chip, Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesToChuc = [
    { path: '', element: <ToChucList /> },
    { path: 'them-moi', element: <ToChucForm /> },
    { path: 'cap-nhat/:id', element: <ToChucForm /> },
    { path: 'chi-tiet/:id', element: <ToChucChiTiet /> },
];

function ToChucList(props) {
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
            .ListToChuc(data)
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
                console.log('Lỗi get list danh mục đơn vị', err);
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
            .SubmitToChuc(data)
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
        navigate(`cap-nhat/${data?.ma}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ma}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .DeleteToChuc(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa danh mục đơn vị', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRemove = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .RemoveToChuc(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa danh mục đơn vị', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRestore = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .RestoreToChuc(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Khôi phục thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi khôi phục danh mục đơn vị', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục đơn vị' }]} />
            <MySearchBox
                defaultExpand={true}
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
                                name="trangthai_hoatdong"
                                label="Trạng thái hoạt động"
                                placeholder="Chọn trạng thái"
                                value={values?.trangthai_hoatdong || null}
                                onChange={(e, value) => {
                                    setFieldValue('trangthai_hoatdong', value || null);
                                }}
                                options={['Đang hoạt động', 'Ngừng hoạt động']}
                            />
                        </Grid>
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
                        headerName: 'Tên đơn vị',
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
                    { headerName: 'Mã hành chính', field: 'ma_hanhchinh', flex: 1 },
                    // { headerName: 'Điện thoại', field: 'dienthoai', flex: 1 },
                    // { headerName: 'Email', field: 'mail', flex: 1 },
                    // { headerName: 'Fax', field: 'fax', flex: 1 },
                    // { headerName: 'Website', field: 'website', flex: 1 },
                    { headerName: 'Địa chỉ', field: 'diachi', flex: 1 },
                    {
                        headerName: 'Trạng thái hoạt động',
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
                            return <MyThaoTac data={data} active={{ state: value === 'Đang hoạt động', name: 'hoạt động', callback: handleKichHoat }} handleEdit={handleEdit} handleDelete={formikRef.current?.values?.trangthai_xoa !== 'Đã xóa' && handleRemove} handleDetail={handleDetail} handleRestore={formikRef.current?.values?.trangthai_xoa === 'Đã xóa' && handleRestore} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function ToChucForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ten: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Tên đơn vị đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                // const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.ten === value);
                return isUnique;
            }),
        ma_hanhchinh: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Mã hành chính đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                // const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.ma === value);
                return isUnique;
            }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListToChuc(data)
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
                .GetToChuc(id)
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
    }, [id]);
    useEffect(() => {
        // Clear timeout
        return () => {
            clearTimeout(timeOutId);
        };
    }, [timeOutId]);
    const submitForm = (values, action) => {
        // Nếu khởi tạo thì trạng thái hoạt = true
        values.trangthai_hoatdong = values?.trangthai_hoatdong || 'Đang hoạt động';
        new Api()
            .SubmitToChuc(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-thong-tin-don-vi');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục đơn vị', link: '/quan-ly-thong-tin-don-vi' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục đơn vị', link: '/quan-ly-thong-tin-don-vi' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, dirty, handleSubmit, setFieldValue, submitCount, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={2}>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FastField name="ten">{({ field, form, meta }) => <MyTextField required={true} label="Tên đơn vị" placeholder="Nhập tên đơn vị" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="ma_hanhchinh">{({ field, form, meta }) => <MyTextField required={true} label="Mã hành chính" placeholder="Nhập mã hành chính" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FastField name="diachi">{({ field, form, meta }) => <MyTextField label="Địa chỉ" {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="dienthoai">{({ field, form, meta }) => <MyTextField label="Điện thoại" {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FastField name="mail">{({ field, form, meta }) => <MyTextField label="Thư điện tử (email)" {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="fax">{({ field, form, meta }) => <MyTextField label="Fax" {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs={6}>
                                            <FastField name="website">{({ field, form, meta }) => <MyTextField label="Website" {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="mota">{({ field, form, meta }) => <MyTextFieldArea label="Mô tả" {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-thong-tin-don-vi')} />
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
function ToChucChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetToChuc(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục đơn vị', link: '/quan-ly-thong-tin-don-vi' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục đơn vị', link: '/quan-ly-thong-tin-don-vi' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container>
                    <RowDetailTable
                        title="Chi tiết đơn vị"
                        data={data}
                        rowDefs={[
                            { rowName: 'Tên', dataIndex: 'ten' },
                            { rowName: 'Mã hành chính', dataIndex: 'ma_hanhchinh' },
                            { rowName: 'Địa chỉ', dataIndex: 'diachi' },
                            { rowName: 'Điện thoại', dataIndex: 'dienthoai' },
                            { rowName: 'Thư điện tử (mail)', dataIndex: 'mail' },
                            { rowName: 'Fax', dataIndex: 'fax' },
                            { rowName: 'Trạng thái hoạt động', dataIndex: 'trangthai_hoatdong' },
                            { rowName: 'Mô tả', dataIndex: 'mota' },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesToChuc;
