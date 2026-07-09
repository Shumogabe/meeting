import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MyButton, MyDatePicker, MySearchBox, MyTable, MyTextField, MyThaoTac, RowDetailTable, ThongBao } from '../../../components';

// Form
import { PictureAsPdf } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { FastField } from 'formik';
import { isEmpty } from 'lodash';
import { useReactToPrint } from 'react-to-print';
import * as Yup from 'yup';
import Api from '../../../api2';
import excelIcon from '../../../assets/images/excel.png';
import NotFound from '../../../components/404';
import LoadingComponent from '../../../components/Loading';
import Helper from '../../../helpers';
import BieuDoCot from './../../../components/BieuDo/BieuDoCot';

var bangFilter = 'log_ql_dangnhap';

const RoutesQLNhatKyDangNhap = [
    { path: '', element: <QLNhatKyDangNhapList /> },
    { path: 'chi-tiet/:id', element: <QLNhatKyDangNhapChiTiet /> },
];

function QLNhatKyDangNhapList(props) {
    // SearchForm
    const [searchForm, setSearchForm] = useState({ tu_khoa: '', limit: 10, trangthai_xoa: null, anchor: null });
    const [thongKeData, setThongKeData] = useState([]);
    const formikRef = useRef(null);
    const validationSchema = Yup.object().shape({});
    // Table
    const [dataTable, setDataTable] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [rawData, setRawData] = useState({});
    const [Count, setCount] = useState();
    const [timeOutId, setTimeOutId] = useState();
    // Router Dom
    const navigate = useNavigate();
    // Func
    const tableRef = useRef();

    useEffect(() => {
        const values = formikRef.current.values;
        getApi(values);
        thongKe();
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
        setLoadingButton(true);
        const data = { tu_khoa, limit, anchor, page, filter_time_from: rest?.filter_time_from || 0, filter_time_to: rest?.filter_time_to || 0, ...rest };
        new Api()
            .ListQLNhatKyDangNhap(data)
            .then((res) => {
                if (res.code === 200) {
                    setDataTable(Helper.addSttToTableDataSource(res.data.records, page, limit));
                    setRawData(res.data);
                    if (res.data?.count) {
                        setCount(res.data?.count);
                    }
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                    setLoadingButton(false);
                }
            })
            .catch((err) => {
                console.log('Lỗi get list', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            })
            .finally((final) => {
                const timeOut = setTimeout(() => {
                    setLoadingTable(false);
                    setLoadingButton(false);
                }, 300);
                setTimeOutId(timeOut);
            });
    };
    const thongKe = () => {
        new Api()
            .ThongKeQLNhatKyDangNhap()
            .then((res) => {
                if (res.code === 200) {
                    const newData = res.data?.map((value) => ({ count: value?.count || 0, date: Helper.timestempToDateTime(value?.date) }));
                    setThongKeData(newData);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra, vui lòng xem log!' });
                console.log(err);
            })
            .finally((res) => {});
    };
    const handleDelete = useCallback((data) => {
        if (!data?.ma) return;
        new Api()
            .DeleteQLNhatKyDangNhap(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    getApi(formikRef.current?.values);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                }
            })
            .catch((err) => {
                console.log('Lỗi xóa', err);
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra vui lòng xem log!' });
            });
    }, []);
    const handleDetail = useCallback((data) => {
        navigate(`chi-tiet/${data?.ma}`);
    }, []);

    // Export Csv
    const handleExportExcel = useCallback(() => {
        const values = formikRef.current.values;
        const { tu_khoa, page, filter_time_from, filter_time_to } = values;
        const data = { tu_khoa, page, filter_time_from: filter_time_from || 0, filter_time_to: filter_time_to || 0 };
        new Api().ExportExcelQLNhatKyDangNhap({ data, fileName: bangFilter }).catch((err) => {
            ThongBao({ status: 'error', message: 'Có lỗi trong quá trình xuất file, vui lòng xem log!' });
            console.log(err);
        });
    }, []);
    // Print
    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
    });

    return (
        <>
            <Grid item>
                <BieuDoCot data={thongKeData} name="date" value="count" title="Nhật ký đăng nhập" />
            </Grid>
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
                    console.log(values);
                    getApi(values);
                }}
                customButton={[]}
            >
                {({ handleSubmit, setFieldValue, handleChange, values, errors, ...propsForm }) => (
                    <Grid container gap={1} alignItems="flex-end" direction="row">
                        <Grid item xs>
                            <MyDatePicker
                                label="Từ ngày"
                                value={values?.filter_time_from}
                                range="from"
                                onChange={(value) => {
                                    setFieldValue('filter_time_from', value || 0);
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            <MyDatePicker
                                label="Đến ngày"
                                value={values?.filter_time_to}
                                range="to"
                                onChange={(value) => {
                                    setFieldValue('filter_time_to', value || 0);
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            <FastField name="don_vi">{({ field }) => <MyTextField label="Đơn vị" placeholder="Nhập đơn vị" {...field} />}</FastField>
                        </Grid>
                    </Grid>
                )}
            </MySearchBox>
            <Grid item xs container justifyContent="flex-end" gap={2}>
                <MyButton loading={loadingButton} txt="Xuất excel" icon={<img src={excelIcon} alt="" style={{ width: '20px', height: '20px' }} />} width={'100px'} onClick={() => handleExportExcel()} />
                <MyButton variant="outlined" txt="Xuất pdf" icon={<PictureAsPdf />} width={'100px'} onClick={() => handlePrint()} />
            </Grid>
            <Grid item xs>
                <MyTable
                    myRef={tableRef}
                    data={dataTable}
                    columns={[
                        { headerName: 'STT', field: 'stt', pinned: 'left', width: 80, type: 'center' },
                        {
                            headerName: 'Tên đăng nhập',
                            field: 'ten_dangnhap',
                            flex: 1,
                        },
                        { headerName: 'Tên ứng dụng', field: 'ten_ung_dung', flex: 1 },
                        { headerName: 'IP đăng nhập', field: 'ip_dangnhap', flex: 1 },
                        { headerName: 'Trạng thái đăng nhập', field: 'trangthai_dangnhap', flex: 1 },
                        {
                            headerName: 'Thời gian đăng nhập',
                            field: 'thoigian_dangnhap',
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
                                return <MyThaoTac data={data} handleDetail={handleDetail} handleDelete={handleDelete} />;
                            },
                        },
                    ]}
                    loading={loadingTable}
                    pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
                />
            </Grid>
        </>
    );
}
function QLNhatKyDangNhapChiTiet() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeOutId, setTimeOutId] = useState(false);

    const { id } = useParams(null);
    useLayoutEffect(() => {
        if (!id) return;
        setLoading(true);
        new Api()
            .GetQLNhatKyDangNhap(id)
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
    //             <LoadingComponent type="circular" />
    //         </>
    //     );
    // }
    return (
        <>
            {id && isEmpty(data) ? (
                <NotFound />
            ) : (
                <Grid container gap={2}>
                    <RowDetailTable
                        title="Chi tiết nhật ký đăng nhập"
                        data={data}
                        rowDefs={[
                            {
                                rowName: 'Tên đăng nhập',
                                dataIndex: 'ten_dangnhap',
                            },
                            { rowName: 'Tên ứng dụng', dataIndex: 'ten_ung_dung' },
                            { rowName: 'IP đăng nhập', dataIndex: 'ip_dangnhap' },
                            {
                                rowName: 'Trạng thái đăng nhập',
                                dataIndex: 'trangthai_dangnhap',
                            },
                            {
                                rowName: 'Mô tả',
                                dataIndex: 'mo_ta',
                            },
                            {
                                rowName: 'Thời gian đăng nhập',
                                dataIndex: 'thoigian_dangnhap',
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

export default RoutesQLNhatKyDangNhap;
