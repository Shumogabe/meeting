import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Close, PictureAsPdf } from '@mui/icons-material';
import { Box, CircularProgress, Grid, Modal, Tooltip, Typography } from '@mui/material';
import { FastField } from 'formik';
import { useReactToPrint } from 'react-to-print';
import * as Yup from 'yup';
import Api from '../../../api2';
import excelIcon from '../../../assets/images/excel.png';
import { MyButton, MyDatePicker, MySearchBox, MyTable, MyTextField, RowDetailTable, ThongBao } from '../../../components';
import BieuDoCot from '../../../components/BieuDo/BieuDoCot';
import Helper from '../../../helpers';
import '../../../styles/print.scss';
// Định nghĩ tên bảng dùng cho filter
var bangFilter = 'ls_tk_nhan_sms';
// Main component
export default function DanhSachGuiThongBaoSMS() {
    const [data, setData] = useState([]);
    const [thongKeData, setThongKeData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [rawData, setRawData] = useState(null);
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [expand, setExpand] = useState(false);

    // Form
    const [searchForm, setSearchForm] = useState(null);
    const [loadFilter, setLoadFilter] = useState(null);
    const validationSchema = Yup.object().shape({});
    const formikRef = useRef();
    const tableRef = useRef();

    // First render
    useEffect(() => {
        handleGetFilter();
    }, []);
    //
    useEffect(() => {
        if (loadFilter) {
            const values = formikRef.current.values;
            const noiDung = loadFilter?.noi_dung ? JSON.parse(loadFilter.noi_dung) : {};
            const newValues = { ...values, ...noiDung };
            setSearchForm(newValues);
            setExpand(true);
            getApi(newValues);
        } else {
            const values = formikRef.current.values;
            const newValues = { tu_khoa: '', limit: values?.limit || 10, anchor: values?.anchor || null };
            setSearchForm(newValues);
            getApi(newValues);
        }
    }, [loadFilter]);
    // Next new page
    const getRows = (limit, anchor, page) => {
        const values = formikRef.current.values;
        getApi({ ...values, limit, anchor, page });
    };
    // Api call / Init Func
    const getApi = ({ tu_khoa, limit, anchor, page, ...rest }) => {
        setLoading(true);
        setLoadingButton(true);

        const data = { tu_khoa, limit, anchor, page, filter_time_from: rest?.filter_time_from || 0, filter_time_to: rest?.filter_time_to || 0, ...rest };
        // Call Api
        new Api()
            .ListDanhSachGuiThongBaoSMS(data)
            .then((res) => {
                if (res.code === 200) {
                    setData(Helper.addSttToTableDataSource(res.data.records, page, limit));
                    setRawData(res.data);
                    if (res.data?.count) {
                        setCount(res.data?.count);
                    }
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                    setLoading(false);
                    setLoadingButton(false);
                }
            })
            .catch((err) => {
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra, vui lòng xem log!' });
                console.log(err);
            })
            .finally((res) => {
                setLoading(false);
                setLoadingButton(false);
            });
    };
    // Thong ke
    const thongKe = useCallback(({ months = 0, quarters = 0, years = 0 }) => {
        new Api()
            .ThongKeDanhSachGuiThongBaoSMS({ months, quarters, years })
            .then((res) => {
                if (res.code === 200) {
                    let newData;

                    if (quarters > 0) {
                        newData = res.data?.map((value) => ({ count: value?.count || 0, date: Helper.timestempToQuarter(value?.date) }));
                    } else if (years > 0) {
                        newData = res.data?.map((value) => ({ count: value?.count || 0, date: Helper.timestampToYear(value?.date) }));
                    } else if (months > 0) {
                        newData = res.data?.map((value) => ({ count: value?.count || 0, date: Helper.timestampToMonth(value?.date) }));
                    } else {
                        newData = res.data?.map((value) => ({ count: value?.count || 0, date: Helper.timestempToDateTime(value?.date) }));
                    }
                    setThongKeData(newData);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                    setLoading(false);
                }
            })
            .catch((err) => {
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra, vui lòng xem log!' });
                console.log(err);
            })
            .finally((res) => {
                setLoading(false);
            });
    }, []);
    //  Get Lọc
    const handleGetFilter = useCallback(() => {
        new Api()
            .GetFilter(bangFilter)
            .then((res) => {
                if (res.code === 200) {
                    if (res.data?.length === 0) {
                        setLoadFilter(null);
                    } else {
                        setLoadFilter(res.data);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    // Trigger func
    // Lưu lọc
    const handleSaveFilter = useCallback((values) => {
        setLoadingButton(true);
        const newData = { ...values };
        delete newData.anchor;
        delete newData.limit;
        const filterJson = JSON.stringify(newData);

        new Api()
            .SaveFilter({ ma: loadFilter?.ma || null, bang: loadFilter?.bang || bangFilter, noi_dung: filterJson })
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Lưu lọc thành công' });
                    setLoadFilter(res.data);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                    setLoadingButton(false);
                }
            })
            .catch((err) => {
                ThongBao({ status: 'error', message: 'Không thể lấy điều kiện lọc, vui lòng xem log!' });
                console.log(err);
            })
            .finally((res) => {
                setLoadingButton(false);
            });
    }, []);
    const handleClearFilter = useCallback((values) => {
        setLoadingButton(true);
        new Api()
            .DeleteFilter(bangFilter)
            .then((res) => {
                if (res.code === 200) {
                    ThongBao({ status: 'success', message: 'Xóa lọc thành công' });
                    setLoadFilter(null);
                } else {
                    ThongBao({ code: res.code, message: res?.message });
                    setLoadingButton(false);
                }
            })
            .catch((err) => {
                ThongBao({ status: 'error', message: 'Có lỗi xảy ra khi xóa lọc, vui lòng xem log!' });
                console.log(err);
            })
            .finally((res) => {
                setLoadingButton(false);
            });
    }, []);
    // Export Csv
    const handleExportExcel = useCallback(() => {
        const values = formikRef.current.values;
        const { tu_khoa, page, filter_time_from, filter_time_to } = values;
        const data = { tu_khoa, page, filter_time_from: filter_time_from || 0, filter_time_to: filter_time_to || 0 };
        new Api().ExportExcelDanhSachGuiThongBaoSMS({ data, fileName: bangFilter }).catch((err) => {
            ThongBao({ status: 'error', message: 'Có lỗi trong quá trình xuất file, vui lòng xem log!' });
            console.log(err);
        });
    }, []);
    // Print
    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
    });

    return (
        <Grid container direction="column" rowSpacing={2}>
            <Grid item xs>
                <BieuDoCot data={thongKeData} handleThongKe={thongKe} name="date" value="count" dropdown={true} title="Người dùng nhận thông báo SMS" />
            </Grid>
            <Grid item xs>
                <MySearchBox
                    defaultExpand={expand}
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
                    saveFilter={handleSaveFilter}
                    clearFilter={handleClearFilter}
                    loadingButton={loadingButton}
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
            </Grid>
            <Detail open={openModal} title="Chi tiết đăng ký tài khoản" handleClose={setOpenModal} />
            <Grid item xs container justifyContent="flex-end" gap={2}>
                <MyButton loading={loadingButton} txt="Xuất excel" icon={<img src={excelIcon} alt="" style={{ width: '20px', height: '20px' }} />} width={'100px'} onClick={() => handleExportExcel()} />
                <MyButton variant="outlined" txt="Xuất pdf" icon={<PictureAsPdf />} width={'100px'} onClick={() => handlePrint()} />
            </Grid>
            <Grid item xs>
                <MyTable
                    myRef={tableRef}
                    data={data}
                    loading={loading}
                    columns={[
                        { headerName: 'STT', field: 'stt', width: '100px', suppressSizeToFit: true, pinned: 'left' },
                        {
                            field: 'ten',
                            headerName: `Tên người dùng`,
                            minWidth: 200,
                            maxWidth: 300,
                            cellRenderer: (params) => {
                                return (
                                    <Tooltip title="Xem chi tiết">
                                        <div
                                            style={{ textDecoration: 'underline', color: '#2b713a', cursor: 'pointer' }}
                                            onClick={() => {
                                                setOpenModal(params.data);
                                            }}
                                        >
                                            {params?.value}
                                        </div>
                                    </Tooltip>
                                );
                            },
                        },
                        { field: 'ten_dangnhap', headerName: `Tên đăng nhập`, minWidth: 200, maxWidth: 300 },
                        {
                            field: 'thoi_gian_gui',
                            headerName: `Thời gian gửi`,
                            minWidth: 300,
                            maxWidth: 350,
                            cellRenderer: (params) => {
                                return <div>{Helper.timeToVietNamDate(params?.value)}</div>;
                            },
                        },
                        { field: 'don_vi', headerName: `Đơn vị`, flex: 1, minWidth: 300 },
                        // { field: 'noi_dung', headerName: `Nội dung`, minWidth: 200 },
                    ]}
                    pagination={{
                        rawData: rawData,
                        getRows: getRows,
                        setData: setData,
                        Count: count,
                    }}
                />
            </Grid>
        </Grid>
    );
}
const Detail = ({ title, handleClose, onSubmit, open, style, dataSet, width = '40vw', ...props }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (open) {
            // Get Data Here
            setData(open);
        } else {
            setData(null);
        }
    }, [open]);
    return (
        <Modal
            open={Boolean(open)}
            onClose={(event, reason) => {
                handleClose(false);
            }}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ width: width, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 1, padding: 2, ...style }}>
                <Typography fontWeight={'bold'} fontSize={'16px'} textTransform="uppercase" gutterBottom display="flex" justifyContent="space-between" color="#2b713ad9">
                    {title || 'Tiêu đề Modal'}
                    <Close onClick={() => handleClose(false)} sx={{ cursor: 'pointer', '&:hover': { opacity: '0.5' }, color: '#e94235' }} />
                </Typography>
                <Grid container maxHeight="70vh" overflow="auto">
                    {loading ? (
                        <div style={{ minHeight: '30vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <Grid container>
                            <RowDetailTable
                                data={data}
                                rowDefs={[
                                    { rowName: 'Tên người dùng', dataIndex: 'ten' },
                                    { rowName: 'Tên đăng nhập', dataIndex: 'ten_dangnhap' },
                                    {
                                        rowName: 'Thời gian gửi',
                                        dataIndex: 'thoi_gian_gui',
                                        rowRender: (value, row) => {
                                            return <div>{Helper.timeToVietNamDate(value)}</div>;
                                        },
                                    },
                                    { rowName: 'Đơn vị', dataIndex: 'don_vi' },
                                    { rowName: 'Nội dung', dataIndex: 'noi_dung' },
                                ]}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Modal>
    );
};
