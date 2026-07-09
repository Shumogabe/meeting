import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextField, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Grid } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const name = 'Thiết lập lịch họp';

const url = '/thiet-lap-cau-hinh-lich-hop';

const RoutesThietLapCauHinhLichHop = [
    { path: '', element: <ThietLapCauHinhLichHopList /> },
    { path: 'them-moi', element: <ThietLapCauHinhLichHopForm /> },
    { path: 'cap-nhat/:id', element: <ThietLapCauHinhLichHopForm /> },
    { path: 'chi-tiet/:id', element: <ThietLapCauHinhLichHopChiTiet /> },
];

function ThietLapCauHinhLichHopList(props) {
    // SearchForm
    // const [searchForm, setSearchForm] = useState({ tu_khoa: '', limit: 10, pageNumber: null);
    const [searchForm, setSearchForm] = useState({ pageNumber: 1, pageSize: 10, dateTo: '01/01/0001', dateFrom: '01/01/0001', strSearch: '' });

    const formikRef = useRef(null);
    const validationSchema = Yup.object().shape({});
    // Table
    const [dataTable, setDataTable] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [rawData, setRawData] = useState({});
    const [Count, setCount] = useState();
    const [timeOutId, setTimeOutId] = useState();
    const [isDeleted, setIsDeleted] = useState(0);
    // Router Dom
    const navigate = useNavigate();
    // Func

    useEffect(() => {
        const values = formikRef.current.values;
        switch (isDeleted) {
            case 0:
                getApi(values);
                break;
            case 1:
                getApiDeleted(values);
                break;
            default:
                getApi(values);
                break;
        }
    }, [isDeleted]);

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

    const getRows = (pageSize, pageNumber, page) => {
        const values = formikRef.current.values;
        switch (isDeleted) {
            case 0:
                getApi({ ...values, pageSize, pageNumber, page });
                break;
            case 1:
                getApiDeleted({ ...values, pageSize, pageNumber, page });
                break;
            default:
                getApi({ ...values, pageSize, pageNumber, page });
                break;
        }
    };

    const getApi = ({ strSearch, pageSize, pageNumber, page, ...rest }) => {
        setLoadingTable(true);
        const data = { strSearch, pageSize, pageNumber, page, ...rest };
        new Api()
            .ListThietLapCauHinhLichHop(data)
            .then((res) => {
                if (res.code === 200) {
                    setDataTable(Helper.addSttToTableDataSource(res?.data?.data, res?.data?.pageNumber, res?.data?.pageSize));
                    setRawData(res?.data);
                    if (res?.data?.totalRecords) {
                        setCount(res?.data?.totalRecords);
                    }
                } else {
                    ThongBao({ code: res?.code });
                }
            })
            .catch((err) => {
                console.log(`Lỗi lấy danh sách ${name}`, err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((final) => {
                const timeOut = setTimeout(() => {
                    setLoadingTable(false);
                }, 300);
                setTimeOutId(timeOut);
            });
    };

    const getApiDeleted = ({ strSearch, pageSize, pageNumber, page, ...rest }) => {
        setLoadingTable(true);
        const data = { strSearch, pageSize, pageNumber, page, ...rest };
        new Api()
            .ListDeleteThietLapCauHinhLichHop(data)
            .then((res) => {
                if (res.code === 200) {
                    setDataTable(Helper.addSttToTableDataSource(res?.data?.data, res?.data?.pageNumber, res?.data?.pageSize));
                    setRawData(res?.data);
                    if (res?.data?.totalRecords) {
                        setCount(res?.data?.totalRecords);
                    }
                } else {
                    ThongBao({ code: res?.code });
                }
            })
            .catch((err) => {
                console.log(`Lỗi lấy danh sách ${name} đã xóa`, err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((final) => {
                const timeOut = setTimeout(() => {
                    setLoadingTable(false);
                }, 300);
                setTimeOutId(timeOut);
            });
    };

    const handleAdd = useCallback(() => {
        new Api()
            .AddThietLapCauHinhLichHop()
            .then((res) => {
                setIsDeleted(0);
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Thêm thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res?.code });
                }
            })
            .catch((err) => {
                console.log(`Lỗi thêm ${name}`, err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);

    const handleEdit = useCallback((data) => {
        navigate(`cap-nhat/${data?.id}`);
    }, []);

    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.id}`);
    }, []);

    const handleDelete = useCallback((data) => {
        if (!data?.id) return;
        new Api()
            .DeleteThietLapCauHinhLichHop(data?.id)
            .then((res) => {
                setIsDeleted(0);
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res?.code });
                }
            })
            .catch((err) => {
                console.log(`Lỗi xóa ${name}`, err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);

    const handleRestore = useCallback((data) => {
        if (!data?.id) return;
        new Api()
            .RestoreThietLapCauHinhLichHop(data?.id)
            .then((res) => {
                setIsDeleted(1);
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Khôi phục thành công!' });
                    getApiDeleted(formikRef.current?.values);
                } else {
                    ThongBao({ code: res?.code });
                }
            })
            .catch((err) => {
                console.log(`Lỗi khôi phục ${name}`, err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);

    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: name }]} />
            <MySearchBox
                defaultExpand={false}
                name="strSearch"
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
                {({ setFieldValue, values }) => (
                    <Grid container gap={1} alignItems="flex-end" direction="row">
                        <Grid item xs={3}>
                            <MySelect
                                fullWidth
                                clearAble={true}
                                name="deletedStatus"
                                label="Danh sách"
                                placeholder="Chọn danh sách"
                                value={values?.deletedStatus || null}
                                onChange={(e, value) => {
                                    setFieldValue('deletedStatus', value || null);
                                    switch (value) {
                                        case 'Đã xoá':
                                            setIsDeleted(1);
                                            break;
                                        case 'Chưa xoá':
                                            setIsDeleted(0);
                                            break;
                                        default:
                                            setIsDeleted(0);
                                            break;
                                    }
                                }}
                                options={['Đã xoá', 'Chưa xoá']}
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
                        handleAdd();
                    }}
                />
            </Grid>
            <MyTable
                data={dataTable}
                columns={[
                    { headerName: 'STT', field: 'stt', pinned: 'left', width: 80, type: 'center' },
                    {
                        headerName: 'Tên hiển thị',
                        field: 'tenhienthi',
                        flex: 1,
                    },
                    { headerName: 'Tên cấu hình', field: 'tencauhinh', flex: 1 },
                    { headerName: 'Giá trị', field: 'giatri', flex: 1 },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_hoatdong',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} handleDetail={handleDetail} handleEdit={handleEdit} handleDelete={isDeleted === 0 && handleDelete} handleRestore={isDeleted === 1 && handleRestore} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}
function ThietLapCauHinhLichHopForm() {
    const { id } = useParams(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const validationSchema = Yup.object().shape({
        tenhienthi: Yup.string().required('Không được bỏ trống!'),
        tenhienthi: Yup.string().required('Không được bỏ trống!'),
        giatri: Yup.string().required('Không được bỏ trống!'),
    });
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if (id) {
            setLoading(true);
            new Api()
                .DetailThietLapCauHinhLichHop(id)
                .then((res) => {
                    if (res.code === 200) {
                        setFormData(res?.data);
                    } else {
                        ThongBao({ code: res?.code });
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
        new Api()
            .EditThietLapCauHinhLichHop(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate(url);
                } else {
                    ThongBao({ code: res?.code });
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: name, link: url }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }
    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: name, link: url }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
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
                                            <FastField name="tenhienthi">{({ field, form, meta }) => <MyTextField disabled={Boolean(id)} required={true} label="Tên hiển thị" placeholder="Nhập tên hiển thị" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="tencauhinh">{({ field, form, meta }) => <MyTextField disabled={Boolean(id)} required={true} label="Tên cấu hình" placeholder="Nhập tên cấu hình" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs>
                                        <FastField name="giatri">{({ field, form, meta }) => <MyTextField required={true} label="Giá trị" placeholder="Nhập giá trị" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                    </Grid>

                                    {/* <Grid item xs>
                                        <CopyDnD dataKey="ma" labelKey="ten" sources={chucNangs} data={values?.ds_chucnang_quantris || []} setData={(data) => setFieldValue('ds_chucnang_quantris', data)} />
                                    </Grid> */}

                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate(url)} />
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
function ThietLapCauHinhLichHopChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);
    const { id } = useParams(null);

    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .DetailThietLapCauHinhLichHop(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: name, link: url }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }

    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: name, link: url }, { name: 'Chi tiết' }]} />
            {!data ? (
                <NotFound />
            ) : (
                <Grid container>
                    <RowDetailTable
                        title={'Chi tiết ' + name.toLocaleLowerCase()}
                        data={data}
                        rowDefs={[
                            { rowName: 'Tên hiển thị', dataIndex: 'tenhienthi' },
                            { rowName: 'Tên cấu hình', dataIndex: 'tencauhinh' },
                            { rowName: 'Giá trị', dataIndex: 'giatri' },
                            // {
                            //     rowName: 'Ngày tạo',
                            //     dataIndex: 'createdDate',
                            //     rowRender: (value, records) => moment(value).format('DD/MM/YYYY'), // Format ngày tạo
                            // },
                            // {
                            //     rowName: 'Người tạo',
                            //     dataIndex: 'createdBy',
                            //     rowRender: (value, records) => value?.ten || 'Chưa rõ', // Kiểm tra và hiển thị thông tin người tạo
                            // },
                        ]}
                    />
                </Grid>
            )}
        </>
    );
}

export default RoutesThietLapCauHinhLichHop;
