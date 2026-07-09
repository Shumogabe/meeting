import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyButton, MyDatePicker, MySearchBox, MyTable, MyTextField, MyThaoTac, ThongBao } from '../../../components';

// Form
import { PictureAsPdf } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { FastField } from 'formik';
import { useReactToPrint } from 'react-to-print';
import * as Yup from 'yup';
import Api from '../../../api2';
import excelIcon from '../../../assets/images/excel.png';
import wordIcon from '../../../assets/images/word.png';
import BieuDoCot from '../../../components/BieuDo/BieuDoCot';
import Helper from '../../../helpers';

var bangFilter = 'log_ql_dangnhap';

const RoutesQLNhatKyDangKyDichVu = [{ path: '', element: <QLNhatKyDangKyDichVuList /> }];

function QLNhatKyDangKyDichVuList(props) {
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
            .ListQLNhatKyDangKyDichVu(data)
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
            .ThongKeQLNhatKyDangKyDichVu()
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
            .DeleteQLNhatKyDangKyDichVu(data.ma)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa thành công!' });
                    thongKe();
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
    // Export Csv
    const handleExportExcel = useCallback(() => {
        const values = formikRef.current.values;
        const { tu_khoa, page, filter_time_from, filter_time_to } = values;
        const data = { tu_khoa, page, filter_time_from: filter_time_from || 0, filter_time_to: filter_time_to || 0 };
        new Api().ExportExcelQLNhatKyDangKyDichVu({ data, fileName: bangFilter }).catch((err) => {
            ThongBao({ status: 'error', message: 'Có lỗi trong quá trình xuất file, vui lòng xem log!' });
            console.log(err);
        });
    }, []);
    // Export Word
    const handleExportWord = useCallback(() => {
        const values = formikRef.current.values;
        const { tu_khoa, page, filter_time_from, filter_time_to } = values;
        const data = { tu_khoa, page, filter_time_from: filter_time_from || 0, filter_time_to: filter_time_to || 0 };
        console.log(data);
        new Api().ExportWordQLNhatKyDangKyDichVu({ data, fileName: bangFilter }).catch((err) => {
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
                <BieuDoCot data={thongKeData} name="date" value="count" title="Nhật ký quản lý đăng ký dịch vụ" />
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
                        <Grid item xs>
                            <FastField name="tai_khoan">{({ field }) => <MyTextField label="Tài khoản" placeholder="Nhập tài khoản" {...field} />}</FastField>
                        </Grid>
                    </Grid>
                )}
            </MySearchBox>
            <Grid item xs container justifyContent="flex-end" gap={2}>
                <MyButton loading={loadingButton} txt="Xuất word" icon={<img src={wordIcon} alt="" style={{ width: '20px', height: '20px' }} />} width={'100px'} onClick={() => handleExportWord()} />
                <MyButton loading={loadingButton} txt="Xuất excel" icon={<img src={excelIcon} alt="" style={{ width: '20px', height: '20px' }} />} width={'100px'} onClick={() => handleExportExcel()} />
                <MyButton variant="outlined" txt="Xuất pdf" icon={<PictureAsPdf />} width={'100px'} onClick={() => handlePrint()} />
            </Grid>
            <MyTable
                myRef={tableRef}
                data={dataTable}
                columns={[
                    { headerName: 'STT', field: 'stt', width: '100px', suppressSizeToFit: true, pinned: 'left' },
                    {
                        field: 'tai_khoan',
                        headerName: `Tài khoản`,
                        minWidth: 200,
                        maxWidth: 300,
                        sortable: true,
                    },
                    { field: 'ip_may', headerName: `IP máy`, minWidth: 200, maxWidth: 300, sortable: true },
                    {
                        field: 'thoigian_tao',
                        headerName: `Thời gian tạo`,
                        minWidth: 300,
                        maxWidth: 350,
                        cellRenderer: (params) => {
                            return <div>{Helper.timeToVietNamDate(params?.value)}</div>;
                        },
                        sortable: true,
                    },
                    { field: 'noi_dung', headerName: `Nội dung`, flex: 1, minWidth: 300, sortable: true },
                    {
                        headerName: 'Thao tác',
                        field: 'trangthai_xoa',
                        pinned: 'right',
                        width: 120,
                        type: 'center',
                        cellRenderer: ({ value, data }) => {
                            return <MyThaoTac data={data} handleDelete={handleDelete} />;
                        },
                    },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}

export default RoutesQLNhatKyDangKyDichVu;
