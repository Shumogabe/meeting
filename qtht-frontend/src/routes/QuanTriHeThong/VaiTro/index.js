import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ColDetailTable, MyBreadCrumbs, MyButton, MyMultiSelect, MySearchBox, MySelect, MyTable, MyTextField, MyTextFieldArea, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { RemoveCircleOutline } from '@mui/icons-material';
import { Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty, isEqual } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesVaiTro = [
    { path: '', element: <VaiTroList /> },
    { path: 'them-moi', element: <VaiTroForm /> },
    { path: 'cap-nhat/:id', element: <VaiTroForm /> },
    { path: 'chi-tiet/:id', element: <VaiTroChiTiet /> },
];

function VaiTroList(props) {
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
            .ListVaiTro(data)
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
                console.log('Lỗi get list vai trò', err);
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
        navigate(`cap-nhat/${data?.ma}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ma}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .DeleteVaiTro(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa vai trò', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRemove = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .RemoveVaiTro(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa vai trò', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleRestore = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .RestoreVaiTro(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Khôi phục thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi khôi phục vai trò', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý vai trò' }]} />
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
                        headerName: 'Tên vai trò',
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
                    { headerName: 'Mã vai trò', field: 'ma', flex: 1 },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_hoatdong',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} handleEdit={handleEdit} handleDelete={formikRef.current?.values?.trangthai_xoa !== 'Đã xóa' && handleRemove} handleDetail={handleDetail} handleRestore={formikRef.current?.values?.trangthai_xoa === 'Đã xóa' && handleRestore} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function VaiTroForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    const [formData, setFormData] = useState(null);
    const [chucNangs, setChucNangs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ten: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Tên vai trò đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                // const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.ten === value);
                return isUnique;
            }),
        ma: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Mã vai trò đã tồn tại', async (value, context) => {
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
            .ListVaiTro(data)
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
                .GetVaiTro(id)
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
        const getChucNang = new Api().ListChucNang({});
        Promise.all([getChucNang])
            .then((res) => {
                if (res[0].code === 200) {
                    setChucNangs(res[0].data?.records);
                }
            })
            .catch((err) => {
                console.log('Lỗi khi lấy options cho select box!', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    const submitForm = (values, action) => {
        // Lấy ra mã ds_thong_tin_chuc_nangs
        values.ma_ds_thong_tin_chuc_nangs = values?.ds_thong_tin_chuc_nangs?.map((vl) => vl.ma) || [];
        new Api()
            .SubmitVaiTro(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-vai-tro');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý vai trò', link: '/quan-ly-vai-tro' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý vai trò', link: '/quan-ly-vai-tro' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, dirty, handleSubmit, setFieldValue, submitCount, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={2}>
                                    <Grid item xs container spacing={1}>
                                        <Grid item xs>
                                            <FastField name="ma">{({ field, form, meta }) => <MyTextField required={true} disabled={Boolean(id)} label="Mã vai trò" placeholder="Nhập mã vai trò" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="ten">{({ field, form, meta }) => <MyTextField required={true} label="Tên vai trò" placeholder="Nhập tên vai trò" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="mota">{({ field, form, meta }) => <MyTextFieldArea label="Mô tả" {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs>
                                        <MyMultiSelect
                                            clearable={false}
                                            label="Chức năng"
                                            placeholder="Chọn chức năng"
                                            name="ten"
                                            options={chucNangs}
                                            value={values?.ds_thong_tin_chuc_nangs || []}
                                            onChange={(e, value) => {
                                                setFieldValue('ds_thong_tin_chuc_nangs', value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <ColDetailTable
                                            colDefs={[
                                                { headerName: 'Tên chức năng', dataIndex: 'ten' },
                                                { headerName: 'Mã chức năng', dataIndex: 'ma' },
                                                {
                                                    headerName: 'Thao tác',
                                                    dataIndex: 'ma',
                                                    width: '100px',
                                                    align: 'center',
                                                    rowRender: (value, data) => (
                                                        <div
                                                            onClick={() => {
                                                                const newArr = values?.ds_thong_tin_chuc_nangs?.filter((vl) => !isEqual(data, vl)) || [];
                                                                setFieldValue('ds_thong_tin_chuc_nangs', newArr);
                                                            }}
                                                        >
                                                            <RemoveCircleOutline color="error" />
                                                        </div>
                                                    ),
                                                },
                                            ]}
                                            data={values?.ds_thong_tin_chuc_nangs || []}
                                        />
                                    </Grid>

                                    {/* <Grid item xs>
                                        <CopyDnD dataKey="ma" labelKey="ten" sources={chucNangs} data={values?.ds_thong_tin_chuc_nangs || []} setData={(data) => setFieldValue('ds_thong_tin_chuc_nangs', data)} />
                                    </Grid> */}

                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-vai-tro')} />
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
function VaiTroChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetVaiTro(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý vai trò', link: '/quan-ly-vai-tro' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý vai trò', link: '/quan-ly-vai-tro' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết vai trò"
                        data={data}
                        rowDefs={[
                            { rowName: 'Tên', dataIndex: 'ten' },
                            { rowName: 'Mã', dataIndex: 'ma' },
                            { rowName: 'Mô tả', dataIndex: 'mota' },
                        ]}
                    />
                    <ColDetailTable
                        title="Danh sách chức năng"
                        colDefs={[
                            {
                                headerName: 'Tên chức năng',
                                dataIndex: 'ten',
                                rowRender: (value, data) => {
                                    return (
                                        <Link component="button" underline="always" onClick={() => window.open(`/quan-ly-chuc-nang/chi-tiet/${data.ma}`, '_blank')}>
                                            {value}
                                        </Link>
                                    );
                                },
                            },
                            { headerName: 'Mã chức năng', dataIndex: 'ma' },
                        ]}
                        data={data?.ds_thong_tin_chuc_nangs || []}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesVaiTro;
