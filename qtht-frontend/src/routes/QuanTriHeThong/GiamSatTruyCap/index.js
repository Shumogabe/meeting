import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HQCollapseForm, MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextField, MyThaoTac, MyTimePicker, PopConfirm, RowDetailTable, ThongBao } from '../../../components';

// Form
import { AddCircleOutline } from '@mui/icons-material';
import { Grid, Link } from '@mui/material';
import { FastField, FieldArray, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';
const RoutesGiamSatTruyCap = [
    { path: '', element: <GiamSatTruyCapList /> },
    { path: 'them-moi', element: <GiamSatTruyCapForm /> },
    { path: 'cap-nhat/:id', element: <GiamSatTruyCapForm /> },
    { path: 'chi-tiet/:id', element: <GiamSatTruyCapChiTiet /> },
];

function GiamSatTruyCapList(props) {
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
            .ListGiamSatTruyCap(data)
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
        data.trangthai_xoa = 'Đã xóa';
        new Api()
            .SubmitGiamSatTruyCap(data)
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
    // Restore
    const handleRestore = useCallback((data) => {
        if (!data?.ma) return;
        data.trangthai_xoa = null;
        new Api()
            .SubmitGiamSatTruyCap(data)
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
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý chặn truy cập' }]} />
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
                        headerName: 'Tên',
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
                    { headerName: 'Phân loại', field: 'loai', flex: 1 },
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
function GiamSatTruyCapForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    // Data 4 edit
    const [formData, setFormData] = useState(null);
    // State manager
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        ten: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Tên chặn đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                if (id || !rawData || !rawData.records) return true;
                const bangDuLieu = context.parent.ten;
                const isUnique = !rawData.records.some((record) => record.ten === bangDuLieu);
                return isUnique;
            }),
        noidung_giamsat: Yup.object().shape({
            ds_thoigian_batthuongs: Yup.array().of(
                Yup.object().shape({
                    thoigian_batthuong_from: Yup.number().nullable(),
                    thoigian_batthuong_to: Yup.mixed()
                        .test('isLarger', 'Thời gian kết thúc lớn hơn bắt đầu', (value, testContext) => {
                            if (testContext.parent.thoigian_batthuong_from > value) return false;
                            return true;
                        })
                        .nullable(),
                }),
            ),
        }),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListGiamSatTruyCap(data)
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
                .GetGiamSatTruyCap(id)
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
            const initData = {
                noidung_giamsat: {
                    ds_thoigian_batthuongs: [{ thoigian_batthuong_from: null, thoigian_batthuong_to: null }],
                },
            };
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
        Promise.all([])
            .then((res) => {})
            .catch((err) => {
                console.log('Lỗi khi lấy options cho select box!', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    };
    const submitForm = (values, action) => {
        // lấy tên ứng dụng
        values.noidung_giamsat_json = values?.noidung_giamsat ? JSON.stringify(values?.noidung_giamsat) : '';
        new Api()
            .SubmitGiamSatTruyCap(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-chan-truy-cap');
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý chặn truy cập', link: '/quan-ly-chan-truy-cap' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý chặn truy cập', link: '/quan-ly-chan-truy-cap' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
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
                                            <FastField name="ten">{({ field, form, meta }) => <MyTextField required={true} disabled={Boolean(id)} label="Tên chặn" placeholder="Nhập tên chặn" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="loai">{({ field, form, meta }) => <MyTextField label="Loại chặn" placeholder="Nhập loại chặn" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="noidung_giamsat.soluot_dangnhapqua">{({ field, form, meta }) => <MyTextField type="number" label="Số lượt đăng nhập quá hạn" placeholder="Nhập số lượt" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                    </Grid>
                                    <Grid item xs>
                                        <HQCollapseForm title="Thời gian truy cập bất thường">
                                            <Grid container spacing={1} p={1}>
                                                <FieldArray
                                                    name="noidung_giamsat.ds_thoigian_batthuongs"
                                                    render={(arrayHelpers) => {
                                                        return (
                                                            <>
                                                                {values?.noidung_giamsat.ds_thoigian_batthuongs?.map((value, index) => (
                                                                    <Grid key={index} item container width={'100%'} sx={{ position: 'relative' }}>
                                                                        <div
                                                                            onClick={() => {
                                                                                setFieldValue('deleteThoiGian', index);
                                                                            }}
                                                                            style={{ position: 'absolute', top: '-5px', right: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'red', paddingTop: '5px' }}
                                                                        >
                                                                            Xóa
                                                                        </div>
                                                                        <PopConfirm
                                                                            open={values?.deleteThoiGian || values?.deleteThoiGian === 0}
                                                                            title="Xóa thời gian truy cập"
                                                                            content="Bạn có chắc chắn muốn xóa thời gian truy cập bất thường?"
                                                                            handleClose={() => {
                                                                                setFieldValue('deleteThoiGian', false);
                                                                            }}
                                                                            handleConfirm={() => {
                                                                                setFieldValue('deleteThoiGian', false);
                                                                                if (values?.deleteThoiGian || values?.deleteThoiGian === 0) {
                                                                                    arrayHelpers.remove(values?.deleteThoiGian);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Grid item container xs={12} spacing={1}>
                                                                            <Grid item xs>
                                                                                <MyTimePicker
                                                                                    inputAble
                                                                                    views={['hours', 'minutes', 'seconds']}
                                                                                    label="Thời gian bất thường từ"
                                                                                    value={value?.thoigian_batthuong_from || null}
                                                                                    onChange={(value) => {
                                                                                        setFieldValue(`noidung_giamsat.ds_thoigian_batthuongs[${index}.thoigian_batthuong_from]`, value || null);
                                                                                    }}
                                                                                    errors={errors?.noidung_giamsat?.ds_thoigian_batthuongs?.[index]?.thoigian_batthuong_from}
                                                                                    helperText={errors?.noidung_giamsat?.ds_thoigian_batthuongs?.[index]?.thoigian_batthuong_from}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs>
                                                                                <MyTimePicker
                                                                                    inputAble
                                                                                    views={['hours', 'minutes', 'seconds']}
                                                                                    label="Thời gian bất thường tới"
                                                                                    value={value?.thoigian_batthuong_to || null}
                                                                                    onChange={(value) => {
                                                                                        setFieldValue(`noidung_giamsat.ds_thoigian_batthuongs[${index}.thoigian_batthuong_to]`, value || null);
                                                                                    }}
                                                                                    errors={errors?.noidung_giamsat?.ds_thoigian_batthuongs?.[index]?.thoigian_batthuong_to}
                                                                                    helperText={errors?.noidung_giamsat?.ds_thoigian_batthuongs?.[index]?.thoigian_batthuong_to}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                        {values?.noidung_giamsat.ds_thoigian_batthuongs?.length > 0 && <div style={{ width: '100%', height: '1px', marginTop: '8px', marginBottom: '8px', backgroundColor: 'green' }}></div>}
                                                                    </Grid>
                                                                ))}
                                                                <Grid item xs={12}>
                                                                    <div
                                                                        onClick={() => {
                                                                            arrayHelpers.push({ thoigian_batthuong_from: null, thoigian_batthuong_to: null });
                                                                        }}
                                                                        style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', color: 'green', fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}
                                                                    >
                                                                        <AddCircleOutline style={{ paddingRight: '5px' }} />
                                                                        Thêm thời gian truy cập bất thường
                                                                    </div>
                                                                </Grid>
                                                            </>
                                                        );
                                                    }}
                                                />
                                            </Grid>
                                        </HQCollapseForm>
                                    </Grid>
                                    <Grid item xs>
                                        <HQCollapseForm title="IP truy cập bất thường">
                                            <Grid container p={1}>
                                                <FieldArray
                                                    name="noidung_giamsat.ds_ip_nuocngoai"
                                                    render={(arrayHelpers) => {
                                                        return (
                                                            <>
                                                                {values?.noidung_giamsat.ds_ip_nuocngoai?.map((value, index) => (
                                                                    <Grid key={index} item container width={'100%'} sx={{ position: 'relative' }}>
                                                                        <div
                                                                            onClick={() => {
                                                                                setFieldValue('deleteIp', index);
                                                                            }}
                                                                            style={{ position: 'absolute', top: '-5px', right: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'red', paddingTop: '5px' }}
                                                                        >
                                                                            Xóa
                                                                        </div>
                                                                        <PopConfirm
                                                                            open={values?.deleteIp || values?.deleteIp === 0}
                                                                            title="Xóa IP bất thường"
                                                                            content="Bạn có chắc chắn muốn xóa IP này?"
                                                                            handleClose={() => {
                                                                                setFieldValue('deleteIp', false);
                                                                            }}
                                                                            handleConfirm={() => {
                                                                                setFieldValue('deleteIp', false);
                                                                                if (values?.deleteIp || values?.deleteIp === 0) {
                                                                                    arrayHelpers.remove(values?.deleteIp);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Grid container>
                                                                            <FastField name={`noidung_giamsat.ds_ip_nuocngoai[${index}]`}>{({ field, form, meta }) => <MyTextField label="IP bất thường" placeholder="Nhập IP bất thường" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                                                        </Grid>
                                                                        {values?.noidung_giamsat.ds_ip_nuocngoai?.length > 0 && <div style={{ width: '100%', height: '1px', marginTop: '8px', marginBottom: '8px', backgroundColor: 'green' }}></div>}
                                                                    </Grid>
                                                                ))}
                                                                <Grid item xs={12}>
                                                                    <div
                                                                        onClick={() => {
                                                                            arrayHelpers.push(null);
                                                                        }}
                                                                        style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', color: 'green', fontWeight: 600, cursor: 'pointer', width: 'fit-content' }}
                                                                    >
                                                                        <AddCircleOutline style={{ paddingRight: '5px' }} />
                                                                        Thêm IP truy cập bất thường
                                                                    </div>
                                                                </Grid>
                                                            </>
                                                        );
                                                    }}
                                                />
                                            </Grid>
                                        </HQCollapseForm>
                                    </Grid>
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-chan-truy-cap')} />
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
function GiamSatTruyCapChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetGiamSatTruyCap(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý chặn truy cập', link: '/quan-ly-chan-truy-cap' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý chặn truy cập', link: '/quan-ly-chan-truy-cap' }, { name: 'Chi tiết' }]} />
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết phân quyền"
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'Tên chặn',
                                dataIndex: 'ten',
                            },
                            {
                                rowName: 'Phân loại',
                                dataIndex: 'loai',
                                // rowRender: (value, data) => <div>{value?.ten_day_du || '-/-'}</div>,
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
                    <RowDetailTable
                        title="Nội dung chặn"
                        data={data?.noidung_giamsat}
                        rowDefs={[
                            {
                                rowName: 'Số lượt đăng nhập quá',
                                dataIndex: 'soluot_dangnhapqua',
                            },
                            {
                                rowName: 'Danh sách IP bất thường',
                                dataIndex: 'ds_ip_nuocngoai',
                                rowRender: (value, data) => <div dangerouslySetInnerHTML={{ __html: value?.length > 0 && value.join('<br/>') }} />,
                            },
                            {
                                rowName: 'Thời truy cập bất thường',
                                dataIndex: 'ds_thoigian_batthuongs',
                                rowRender: (value, data) => {
                                    const listStr =
                                        value?.length > 0 &&
                                        value.map((vl) => {
                                            return Helper.timestempToDateTime(vl?.thoigian_batthuong_from, 'HH:mm:ss') + ' - ' + Helper.timestempToDateTime(vl?.thoigian_batthuong_to, 'HH:mm:ss');
                                        });
                                    return <div dangerouslySetInnerHTML={{ __html: listStr?.length > 0 && listStr.join('<br/>') }} />;
                                },
                            },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesGiamSatTruyCap;
