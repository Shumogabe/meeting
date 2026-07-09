import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyBreadCrumbs, MyButton, MySearchBox, MySelect, MyTable, MyTextField, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { Chip, FormControlLabel, Grid, Link, Switch } from '@mui/material';
import { FastField, Form, Formik } from 'formik';
import { isEmpty } from 'lodash';
import * as Yup from 'yup';
import Api from '../../../api2';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';

const RoutesQuanLyDanhMucMayChu = [
    { path: '', element: <MayChuList /> },
    { path: 'them-moi', element: <MayChuForm /> },
    { path: 'cap-nhat/:id', element: <MayChuForm /> },
    { path: 'chi-tiet/:id', element: <MayChuChiTiet /> },
];

function MayChuList(props) {
    const [searchForm, setSearchForm] = useState({ tu_khoa: '', limit: 10, anchor: null });
    const formikRef = useRef(null);
    const validationSchema = Yup.object().shape({});
    const [dataTable, setDataTable] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [rawData, setRawData] = useState({});
    const [Count, setCount] = useState();
    const [timeOutId, setTimeOutId] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const values = formikRef.current?.values;
        if (values) {
            getApi(values);
        }
    }, []);

    useEffect(() => {
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
            .ListMayChu(data)
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
        data.activated = data?.activated === true ? false : true;
        new Api()
            .SubmitMayChu(data)
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

    const handleEdit = useCallback(
        (data) => {
            navigate(`cap-nhat/${data?.id}`);
        },
        [navigate],
    );

    const handleDetail = useCallback(
        (data) => {
            navigate(`chi-tiet/${data?.id}`);
        },
        [navigate],
    );

    const handleDelete = useCallback((data) => {
        if (!data?.id) return;
        new Api()
            .DeleteMayChu(data.id)
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
        if (!data?.id) return;
        new Api()
            .RemoveMayChu(data.id)
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
        if (!data?.id) return;
        new Api()
            .RestoreMayChu(data.id)
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
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục máy chủ' }]} />
            <MySearchBox
                defaultExpand={false}
                name="tu_khoa"
                formikRef={formikRef}
                showState={false}
                initialValues={searchForm}
                validationSchema={validationSchema}
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
                        headerName: 'Tiêu đề',
                        field: 'title',
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
                    { headerName: 'Địa chỉ IP - Domain', field: 'ip', flex: 1 },
                    {
                        headerName: 'Trạng thái hoạt động',
                        field: 'activated',
                        width: 200,
                        type: 'center',
                        cellRenderer: ({ value }) => {
                            return <Chip label={value ? 'Đang hoạt động' : 'Ngừng hoạt động'} color={value ? 'primary' : 'error'} variant="outlined" size="small" />;
                        },
                    },
                    {
                        headerName: 'Trạng thái mặc định',
                        field: 'default',
                        width: 200,
                        type: 'center',
                        cellRenderer: ({ value }) => {
                            return <Chip label={value ? 'Đang mặc định' : 'Ngừng mặc định'} color={value ? 'primary' : 'error'} variant="outlined" size="small" />;
                        },
                    },
                    {
                        headerName: 'Thao tác',
                        field: 'activated',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} active={{ state: value, name: 'hoạt động', callback: handleKichHoat }} handleEdit={handleEdit} handleDelete={formikRef.current?.values?.trangthai_xoa !== 'Đã xóa' && handleRemove} handleDetail={handleDetail} handleRestore={formikRef.current?.values?.trangthai_xoa === 'Đã xóa' && handleRestore} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}

function MayChuForm() {
    const { id } = useParams(null);
    const [rawData, setRawData] = useState([]);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeOutId, setTimeOutId] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'Tiêu đề đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                // const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.title === value);
                return isUnique;
            }),
        ip: Yup.string()
            .required('Không được bỏ trống!')
            .test('unique', 'IP đã tồn tại', async (value, context) => {
                // console.log(context.parent);
                // console.log(value);
                // console.log(rawData.records);
                if (id || !rawData || !rawData.records) return true;
                // const bangDuLieu = value?.ten_dangnhap;
                const isUnique = !rawData.records.some((record) => record.ip === value);
                return isUnique;
            }),
        iss: Yup.string().required('Không được bỏ trống!'),
        aud: Yup.string().required('Không được bỏ trống!'),
    });
    useEffect(() => {
        getApi();
    }, []);
    const getApi = () => {
        const data = {};
        new Api()
            .ListMayChu(data)
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
    useLayoutEffect(() => {
        if (id) {
            setLoading(true);
            new Api()
                .GetMayChu(id)
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
        new Api()
            .SubmitMayChu(values)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: (id ? 'Cập nhật' : 'Thêm mới') + ' thành công.' });
                    navigate('/quan-ly-danh-muc-may-chu');
                } else {
                    ThongBao({ code: res.code, message: res.message });
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục đơn vị', link: '/quan-ly-danh-muc-may-chu' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
    //             <LoadingComponent type="skeleton" />
    //         </>
    //     );
    // }

    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục máy chủ', link: '/quan-ly-danh-muc-may-chu' }, { name: id ? 'Cập nhật' : 'Thêm mới' }]} />
            {id && isEmpty(formData) ? (
                <NotFound />
            ) : (
                <Grid>
                    <Formik initialValues={formData} enableReinitialize nableReinitialize validationSchema={validationSchema} validateOnMount={false} validateOnBlur={false} onSubmit={submitForm}>
                        {({ values, errors, handleSubmit, submitCount, setFieldValue, ...propsForm }) => (
                            <Form onSubmit={handleSubmit} autoComplete="false">
                                <Grid item container direction="column" gap={2}>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FastField name="title">{({ field, form, meta }) => <MyTextField required={true} label="Tiêu đề" placeholder="Tiêu đề" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="ip">{({ field, form, meta }) => <MyTextField required={true} label="Địa chỉ IP - Domain" placeholder="Địa chỉ IP - Domain" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FastField name="iss">{({ field, form, meta }) => <MyTextField required={true} label="Iss" placeholder="Iss" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="aud">{({ field, form, meta }) => <MyTextField required={true} label="Aud" placeholder="Aud" errors={(submitCount || meta.touched) && meta.error} helperText={(submitCount || meta.touched) && meta.error} {...field} />}</FastField>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FormControlLabel control={<Switch checked={values?.activated} onChange={(event) => setFieldValue('activated', event.target.checked)} name="activated" color="primary" />} label="Trạng thái hoạt động" />
                                        </Grid>
                                        <Grid item xs>
                                            <FormControlLabel control={<Switch checked={values?.default} onChange={(event) => setFieldValue('default', event.target.checked)} name="default" color="primary" />} label="Trạng thái mặc định" />
                                        </Grid>
                                    </Grid>
                                    {/* <Grid item xs container spacing={2}>
                                        <Grid item xs>
                                            <FastField name="createdDate">{({ field }) => <MyTextField label="Ngày tạo" value={moment(field.value).format('DD/MM/YYYY')} disabled />}</FastField>
                                        </Grid>
                                        <Grid item xs>
                                            <FastField name="createdBy">{({ field }) => <MyTextField label="Tạo bởi" value={field.value?.ten || 'Chưa rõ'} disabled />}</FastField>
                                        </Grid>
                                    </Grid> */}
                                    <Grid item xs container justifyContent="flex-end" gap={2}>
                                        <MyButton variant="outlined" txt="Trở lại" width="100px" onClick={() => navigate('/quan-ly-danh-muc-may-chu')} />
                                        <MyButton type="submit" txt={id ? 'Cập nhật' : 'Thêm mới'} width="100px" onClick={handleSubmit} />
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            )}
        </>
    );
}

function MayChuChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);
    const { id } = useParams(null);

    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetMayChu(id)
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
    //             <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục máy chủ', link: '/quan-ly-danh-muc-may-chu' }, { name: 'Chi tiết' }]} />
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }

    return (
        <>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Danh mục máy chủ', link: '/quan-ly-danh-muc-may-chu' }, { name: 'Chi tiết' }]} />
            {!data ? (
                <NotFound />
            ) : (
                <Grid container>
                    <RowDetailTable
                        title="Chi tiết máy chủ"
                        data={data}
                        rowDefs={[
                            { rowName: 'Tiêu đề', dataIndex: 'title' },
                            { rowName: 'Địa chỉ IP - Domain', dataIndex: 'ip' },
                            {
                                rowName: 'Trạng thái hoạt động',
                                dataIndex: 'activated',
                                rowRender: (value, records) => (value ? 'Đang hoạt động' : 'Ngưng hoạt động'), // Hiển thị trạng thái
                            },
                            {
                                rowName: 'Trạng thái mặc định',
                                dataIndex: 'default',
                                rowRender: (value, records) => (value ? 'Có' : 'Không'), // Hiển thị giá trị mặc định
                            },
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

export default RoutesQuanLyDanhMucMayChu;
