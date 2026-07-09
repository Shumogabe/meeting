import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MyMultiSelect, MySearchBox, MySelect, MyTable, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid, Link } from '@mui/material';
import { Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesPhanQuyenUngDung = [
    { path: '', element: <PhanQuyenUngDungList /> },
    { path: 'them-moi', element: <PhanQuyenUngDungForm /> },
    { path: 'cap-nhat/:id', element: <PhanQuyenUngDungForm /> },
    { path: 'chi-tiet/:id', element: <PhanQuyenUngDungChiTiet /> },
];

function PhanQuyenUngDungList(props) {
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
            .ListPhanQuyenUngDung(data)
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
        navigate(`cap-nhat/${data?.ten_ung_dung}`);
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ten_ung_dung}`);
    }, []);
    const handleDelete = useCallback((data) => {
        if (!data?.ten_ung_dung) return;
        new Api()
            .DeletePhanQuyenUngDung(data.ten_ung_dung)
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
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền ứng dụng' }]} />
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
            {/* <Grid container justifyContent="flex-end" py={1} pr="40px">
                <MyButton
                    variant="outlined"
                    txt="Thêm mới"
                    width={'100px'}
                    onClick={() => {
                        navigate('them-moi');
                    }}
                />
            </Grid> */}
            <MyTable
                data={dataTable}
                columns={[
                    { headerName: 'STT', field: 'stt', pinned: 'left', width: 80, type: 'center' },
                    {
                        headerName: 'Tên ứng dụng',
                        field: 'ten_ung_dung',
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
                        headerName: 'Thời gian tạo',
                        field: 'thoigian_tao',
                        cellRenderer: ({ value, data }) => {
                            return <div>{Helper.timeToVietNamDate(value)}</div>;
                        },
                        flex: 1,
                    },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_hoatdong',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} handleEdit={handleEdit} handleDelete={handleDelete} handleDetail={handleDetail} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function PhanQuyenUngDungForm() {
    const { id } = useParams(null);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    const [nguoiDungs, setNguoiDungs] = useState([]);
    const [ungDungs, setUngDungs] = useState([]);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({ ungdung: Yup.object().required('Không được bỏ trống!') });
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (id) {
            setLoading(true);
            new Api()
                .GetPhanQuyenUngDung(id)
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
        const getUngDung = new Api().ListUngDung({});
        Promise.all([getNguoiDung, getUngDung])
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
                    setUngDungs(res[1].data?.records);
                }
            })
            .catch((err) => {
                console.log('Lỗi khi lấy options cho select box!', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    const submitForm = (values, action) => {
        // lấy tên ứng dụng
        values.ten_ung_dung = values?.ungdung?.ten || null;
        // Lấy ds mã người dùng(tên đăng nhập)
        values.ma_ds_nguoidungs = values?.ds_nguoidungs?.map((vl) => vl.ten_dangnhap) || null;
        new Api()
            .SubmitPhanQuyenUngDung(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-phan-quyen-ung-dung');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền ứng dụng', link: '/quan-ly-phan-quyen-ung-dung' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền ứng dụng', link: '/quan-ly-phan-quyen-ung-dung' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
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
                                                name="ten"
                                                label="Ứng dụng"
                                                placeholder="Chọn ứng dụng"
                                                value={values?.ungdung || null}
                                                options={ungDungs}
                                                onChange={(e, value) => {
                                                    setFieldValue('ungdung', value || null);
                                                }}
                                                errors={(submitCount || touched?.ungdung) && errors?.ungdung}
                                                helperText={(submitCount || touched?.ungdung) && errors?.ungdung}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <MyMultiSelect
                                                name="ten_dangnhap"
                                                label="Người dùng"
                                                placeholder="Chọn người dùng"
                                                value={values?.ds_nguoidungs || []}
                                                options={nguoiDungs}
                                                onChange={(e, value) => {
                                                    setFieldValue('ds_nguoidungs', value || []);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-phan-quyen-ung-dung')} />
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
function PhanQuyenUngDungChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetPhanQuyenUngDung(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền ứng dụng', link: '/quan-ly-phan-quyen-ung-dung' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý phân quyền ứng dụng', link: '/quan-ly-phan-quyen-ung-dung' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết phân quyền"
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'Tên ứng dụng',
                                dataIndex: 'ten_ung_dung',
                                rowRender: (value, data) => {
                                    return (
                                        <Link component="button" underline="always" onClick={() => window.open(`/quan-ly-nguoi-dung/chi-tiet/${value}`, '_blank')}>
                                            {value || '-/-'}
                                        </Link>
                                    );
                                },
                            },
                            {
                                rowName: 'Thời gian tạo',
                                dataIndex: 'thoigian_tao',
                                rowRender: (value, data) => {
                                    return <div>{Helper.timeToVietNamDate(value)}</div>;
                                },
                            },
                            {
                                rowName: 'Danh sách người dùng',
                                dataIndex: 'ds_nguoidungs',
                                rowRender: (value, data) => {
                                    const arrStr = value?.map((vl) => vl.ten_dangnhap) || [];
                                    const html = arrStr.join('<br/>');
                                    return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
                                },
                            },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesPhanQuyenUngDung;
