import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MyMultiSelect, MySearchBox, MyTable, MyTextField, MyTextFieldArea, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';
const RoutesSaoLuuBangDuLieu = [
    { path: '', element: <SaoLuuBangDuLieuList /> },
    { path: 'them-moi', element: <SaoLuuBangDuLieuForm /> },
    { path: 'cap-nhat/:id', element: <SaoLuuBangDuLieuForm /> },
    { path: 'chi-tiet/:id', element: <SaoLuuBangDuLieuChiTiet /> },
];

function SaoLuuBangDuLieuList(props) {
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
            .ListSaoLuuBangDuLieu(data)
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
        navigate(`cap-nhat/${data?.ma}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ma}`);
    }, []);
    // Fake delete
    const handleDelete = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .DeleteSaoLuuBangDuLieu(data.ma)
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
    const handleBackup = useCallback((data) => {
        console.log(data);
        if (!data?.ma) return;
        new Api()
            .ListThietLapCoCheSaoLuu(data)
            .then((res) => {
                if (res.code === 200) {
                    console.log(res.data.records);
                    const type = data.ten_bang
                        .map((table) => {
                            const match = res.data.records.find((item) => item.ten_bang === table && item.tenfile_saoluu === data.tenfile_saoluu);
                            return match && match.dinh_dang ? '.' + match.dinh_dang : '.json';
                        })
                        .filter(Boolean);
                    new Api()
                        .GetFile('saoluu_bangdulieu/' + data.ma + type)
                        .then((res) => {
                            // if (res.code === 200) {
                            //     const link = document.createElement('a');
                            //     link.href = res?.data;
                            //     link.setAttribute('target', '_blank');
                            //     link.setAttribute('download', data.ma + '.sql');
                            //     document.body.appendChild(link);
                            //     link.click();
                            //     link.remove();
                            //     window.URL.revokeObjectURL(res?.data);
                            // } else {
                            //     ThongBao({ code: res.code, message: res?.message });
                            // }
                        })
                        .catch((err) => {
                            console.log('Lỗi xóa ', err);
                            ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
                        });
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
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý sao lưu bảng dữ liệu' }]} />
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
                        headerName: 'Tên bảng dữ liệu',
                        field: 'ten_bang',
                        flex: 1,
                        // cellRenderer: ({ value, data, ...rest }) => (
                        //     <Link
                        //         component="button"
                        //         onClick={() => {
                        //             handleDetail(data);
                        //         }}
                        //         underline="always"
                        //     >
                        //         {value}
                        //     </Link>
                        // ),
                    },
                    { headerName: 'Tên file sao lưu', field: 'tenfile_saoluu', flex: 1 },
                    // { headerName: 'Mô tả', field: 'mo_ta', flex: 1 },
                    {
                        headerName: 'Thời gian sao lưu',
                        field: 'thoigian_saoluu',
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
                            return <MyThaoTac data={data} handleEdit={handleEdit} handleDelete={handleDelete} handleDetail={handleDetail} handleBackup={handleBackup} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function SaoLuuBangDuLieuForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [bangDuLieus, setBangDuLieus] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ds_ten_bang: Yup.array().min(1, 'Không được bỏ trống!').required('Không được bỏ trống!'),
        tenfile_saoluu: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Tên file sao lưu đã tồn tại', async (value, context) => {
                if (id || !rawData || !rawData.records) return true;
                const bangDuLieu = context.parent.ds_ten_bang?.map((record) => record.ten_bang);
                const isUnique = !rawData.records.some((record) => {
                    return record.tenfile_saoluu === value && record.ten_bang?.length === bangDuLieu?.length && record.ten_bang?.every((tenBang) => bangDuLieu?.includes(tenBang));
                });
                return isUnique;
            }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListSaoLuuBangDuLieu(data)
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
                .GetSaoLuuBangDuLieu(id)
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
        const getBangDuLieu = new Api().ListDuLieuSaoLuu({});
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
        values.ten_bang = values?.ds_ten_bang?.map((vl) => vl.ten_bang) || null;
        // lấy tên ứng dụng
        new Api()
            .SubmitSaoLuuBangDuLieu(values)
            .then((res) => {
                if (res.code === 200) {
                    new Api().BackupBangDuLieu(res?.data, res?.data?.tenfile_saoluu);
                    new Api().UploadBangDuLieu(res?.data);
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-sao-luu-bang-du-lieu');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý sao lưu bảng dữ liệu', link: '/quan-ly-sao-luu-bang-du-lieu' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý sao lưu bảng dữ liệu', link: '/quan-ly-sao-luu-bang-du-lieu' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
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
                                            <MyMultiSelect
                                                required={true}
                                                clearable={false}
                                                label="Tên bảng dữ liệu"
                                                placeholder="Chọn tên bảng dữ liệu"
                                                name="ten_bang"
                                                options={bangDuLieus}
                                                value={values?.ds_ten_bang || []}
                                                onChange={(e, value) => {
                                                    setFieldValue('ds_ten_bang', value || []);
                                                }}
                                                errors={(submitCount || touched?.ds_ten_bang) && errors?.ds_ten_bang}
                                                helperText={(submitCount || touched?.ds_ten_bang) && errors?.ds_ten_bang}
                                            />
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="tenfile_saoluu">{({ field, form, meta }) => <MyTextField required={true} label="Tên file sao lưu" placeholder="Nhập tên file sao lưu" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="mo_ta">{({ field, form, meta }) => <MyTextFieldArea label="Mô tả" placeholder="Nhập mô tả" {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-sao-luu-bang-du-lieu')} />
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
function SaoLuuBangDuLieuChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetSaoLuuBangDuLieu(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý sao lưu bảng dữ liệu', link: '/quan-ly-sao-luu-bang-du-lieu' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý sao lưu bảng dữ liệu', link: '/quan-ly-sao-luu-bang-du-lieu' }, { name: 'Chi tiết' }]} />
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
                                rowName: 'Tên file sao lưu',
                                dataIndex: 'tenfile_saoluu',
                            },
                            {
                                rowName: 'Mô tả',
                                dataIndex: 'mo_ta',
                            },
                            {
                                rowName: 'Thời gian sao lưu',
                                dataIndex: 'thoigian_saoluu',
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

export default RoutesSaoLuuBangDuLieu;
