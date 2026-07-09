import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ColDetailTable, MyBreadCrumbs, MyButton, MyMultiSelect, MySearchBox, MySelect, MyTable, MyTextFieldArea, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid, Link } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesPhanQuyen = [
    { path: '', element: <PhanQuyenList /> },
    { path: 'them-moi', element: <PhanQuyenForm /> },
    { path: 'cap-nhat/:id', element: <PhanQuyenForm /> },
    { path: 'chi-tiet/:id', element: <PhanQuyenChiTiet /> },
];

function PhanQuyenList(props) {
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
            .ListPhanQuyen(data)
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
        navigate(`cap-nhat/${data?.ten_dangnhap_nguoidung}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ten_dangnhap_nguoidung}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ten_dangnhap_nguoidung) return;
        new Api()
            .DeletePhanQuyen(data.ten_dangnhap_nguoidung)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
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
    const handleRemove = useCallback((data) => {
        if (!data?.ten_dangnhap_nguoidung) return;
        new Api()
            .RemovePhanQuyen(data.ten_dangnhap_nguoidung)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
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
    const handleRestore = useCallback((data) => {
        if (!data?.ten_dangnhap_nguoidung) return;
        new Api()
            .RestorePhanQuyen(data.ten_dangnhap_nguoidung)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Khôi phục thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi khôi phục phân quyền', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền' }]} />
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
                        field: 'ten_dangnhap_nguoidung',
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
                    { headerName: 'Vai trò', field: 'ma_ds_vaitros', flex: 1 },
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
function PhanQuyenForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [nguoiDungs, setNguoiDungs] = useState([]);
    const [vaiTros, setVaiTros] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        nguoidung: Yup.object()
            .required('Không được bỏ trống!')
            .test('unique', 'Người dùng đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.ten_dangnhap_nguoidung === bangDuLieu);
                return isUnique;
            }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListPhanQuyen(data)
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
                .GetPhanQuyen(id)
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
        values.ten_dangnhap_nguoidung = values?.nguoidung?.ten_dangnhap || null;
        values.ma_ds_vaitros = values?.ds_vaitros?.map((vl) => vl.ma) || null;
        new Api()
            .SubmitPhanQuyen(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-phan-quyen');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền', link: '/quan-ly-phan-quyen' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền', link: '/quan-ly-phan-quyen' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
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
                                            <MySelect
                                                required={true}
                                                disabled={Boolean(id)}
                                                fullWidth
                                                name="ten_dangnhap"
                                                label="Người dùng"
                                                placeholder="Chọn người dùng"
                                                value={values?.nguoidung || null}
                                                options={nguoiDungs}
                                                onChange={(e, value) => {
                                                    setFieldValue('nguoidung', value || null);
                                                }}
                                                errors={(submitCount || touched?.nguoidung) && errors?.nguoidung}
                                                helperText={(submitCount || touched?.nguoidung) && errors?.nguoidung}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MyMultiSelect
                                                name="ten"
                                                label="Vai trò"
                                                placeholder="Chọn vai trò"
                                                value={values?.ds_vaitros || []}
                                                options={vaiTros}
                                                onChange={(e, value) => {
                                                    setFieldValue('ds_vaitros', value || []);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="mota">{({ field, form, meta }) => <MyTextFieldArea label="Mô tả" {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-phan-quyen')} />
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
function PhanQuyenChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetPhanQuyen(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền', link: '/quan-ly-phan-quyen' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền', link: '/quan-ly-phan-quyen' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết phân quyền"
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'Tên đăng nhập',
                                dataIndex: 'ten_dangnhap_nguoidung',
                                rowRender: (value, data) => {
                                    return (
                                        <Link component="button" underline="always" onClick={() => window.open(`/quan-ly-nguoi-dung/chi-tiet/${value}`, '_blank')}>
                                            {value || '-/-'}
                                        </Link>
                                    );
                                },
                            },
                            {
                                rowName: 'Tên đầy đủ',
                                dataIndex: 'nguoidung',
                                rowRender: (value, data) => <div>{value?.ten_day_du || '-/-'}</div>,
                            },

                            { rowName: 'Mô tả', dataIndex: 'mota' },
                        ]}
                    />
                    <ColDetailTable
                        data={data?.ds_vaitros || []}
                        colDefs={[
                            {
                                headerName: 'Tên vai trò',
                                dataIndex: 'ten',
                                rowRender: (value, data) => {
                                    return (
                                        <Link component="button" underline="always" onClick={() => window.open(`/quan-ly-vai-tro/chi-tiet/${data.ma}`, '_blank')}>
                                            {value || '-/-'}
                                        </Link>
                                    );
                                },
                            },
                            {
                                headerName: 'Mã vai trò',
                                dataIndex: 'ma',
                            },

                            { headerName: 'Mô tả', dataIndex: 'mota' },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesPhanQuyen;
