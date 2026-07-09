import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextFieldArea, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';
const RoutesDuLieuSaoLuu = [
    { path: '', element: <DuLieuSaoLuuList /> },
    { path: 'them-moi', element: <DuLieuSaoLuuForm /> },
    { path: 'cap-nhat/:id', element: <DuLieuSaoLuuForm /> },
    { path: 'chi-tiet/:id', element: <DuLieuSaoLuuChiTiet /> },
];

function DuLieuSaoLuuList(props) {
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
            .ListDuLieuSaoLuu(data)
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
        navigate(`cap-nhat/${data?.ten_bang}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ten_bang}`);
    }, []);
    // Fake delete
    const handleDelete = useCallback((data) => {
        if (!data?.ten_bang) return;
        // data.trangthai_xoa = 'Đã xóa';
        // new Api()
        //     .SubmitDuLieuSaoLuu(data)
        //     .then((res) => {
        //         if (res.code === 200) {
        //             ThongBao({ status: 'success', message: 'Xóa thành công!' });
        //             getApi(formikRef.current?.values);
        //         } else {
        //             ThongBao({ code: res.code, message: res?.message });
        //         }
        //     })
        //     .catch((err) => {
        //         console.log('Lỗi xóa ', err);
        //         ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
        //     });
        new Api()
            .DeleteDuLieuSaoLuu(data.ten_bang)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa ', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    // Restore
    const handleRestore = useCallback((data) => {
        if (!data?.ten_bang) return;
        data.trangthai_xoa = null;
        new Api()
            .SubmitDuLieuSaoLuu(data)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Phục hồi thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa ', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý dữ liệu gán nhãn sao lưu' }]} />
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
                        headerName: 'Tên bảng dữ liệu',
                        field: 'ten_bang',
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
                    // { headerName: 'Mô tả', field: 'mo_ta', flex: 1 },
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
function DuLieuSaoLuuForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [bangDuLieus, setBangDuLieus] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        bangdulieu: Yup.object()
            .required('Không được bỏ trống!')
            .test('unique', 'Tên bảng dữ liệu đã tồn tại', async (value, context) => {
                if (id || !rawData || !rawData.records) return true;
                const bangDuLieu = context.parent.bangdulieu?.ten_bang;
                const isUnique = !rawData.records.some((record) => record.ten_bang === bangDuLieu);
                return isUnique;
            }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListDuLieuSaoLuu(data)
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
    // const bangDuLieus = useMemo(() => [], []);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (id) {
            setLoading(true);
            new Api()
                .GetDuLieuSaoLuu(id)
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
        const getBangDuLieu = new Api().ListBangDuLieu({});
        Promise.all([getBangDuLieu])
            .then((res) => {
                if (res[0].code === 200) {
                    setBangDuLieus(res[0].data?.records);
                }
            })
            .catch((err) => {
                console.log('Lỗi khi lấy options cho select box!', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    const submitForm = (values, action) => {
        values.ten_bang = values?.bangdulieu?.ten_bang;
        // lấy tên ứng dụng
        new Api()
            .SubmitDuLieuSaoLuu(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-du-lieu-sao-luu');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý dữ liệu gán nhãn sao lưu', link: '/quan-ly-du-lieu-sao-luu' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý dữ liệu gán nhãn sao lưu', link: '/quan-ly-du-lieu-sao-luu' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, dirty, touched, handleSubmit, setFieldValue, submitCount, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={1}>
                                    <Grid item xs container spacing={1}>
                                        <Grid item xs>
                                            {/* <FastField name="ten_bang">{({ field, form, meta }) => <MyTextField required={true} disabled={Boolean(id)} label="Tên bảng" placeholder="Nhập tên bảng" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField> */}
                                            <MySelect
                                                // disabled={Boolean(id)}
                                                required={true}
                                                clearable={false}
                                                label="Tên bảng dữ liệu"
                                                placeholder="Chọn tên bảng dữ liệu"
                                                name="ten_bang"
                                                options={bangDuLieus}
                                                value={values?.bangdulieu || null}
                                                onChange={(e, value) => {
                                                    setFieldValue('bangdulieu', value || null);
                                                }}
                                                errors={(submitCount || touched?.bangdulieu) && errors?.bangdulieu}
                                                helperText={(submitCount || touched?.bangdulieu) && errors?.bangdulieu}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="mo_ta">{({ field, form, meta }) => <MyTextFieldArea label="Mô tả" placeholder="Nhập mô tả" {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-du-lieu-sao-luu')} />
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
function DuLieuSaoLuuChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetDuLieuSaoLuu(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý dữ liệu gán nhãn sao lưu', link: '/quan-ly-du-lieu-sao-luu' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý dữ liệu gán nhãn sao lưu', link: '/quan-ly-du-lieu-sao-luu' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết"
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'Tên bảng dữ liệu',
                                dataIndex: 'ten_bang',
                            },
                            {
                                rowName: 'Mô tả',
                                dataIndex: 'mo_ta',
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

export default RoutesDuLieuSaoLuu;
