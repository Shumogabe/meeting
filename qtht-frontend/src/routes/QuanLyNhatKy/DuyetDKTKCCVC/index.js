import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyDatePicker, MySearchBox, MyTable, MyTextField, ThongBao } from '../../../components';

// Form
import { Grid } from '@mui/material';
import { FastField } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api2';
import Helper from '../../../helpers';
const RoutesNhatKyDuyetDKTKCCVC = [{ path: '', element: <List /> }];

function List(props) {
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
        const data = { tu_khoa, limit, anchor, page, filter_time_from: rest?.filter_time_from || 0, filter_time_to: rest?.filter_time_to || 0, ...rest };
        new Api()
            .ListDuyetTaiKhoanCCVC(data)
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

    return (
        <>
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
                    </Grid>
                )}
            </MySearchBox>
            <MyTable
                data={dataTable}
                columns={[
                    { headerName: 'STT', field: 'stt', width: '100px', suppressSizeToFit: true, pinned: 'left' },
                    {
                        field: 'ten',
                        headerName: `Tên người dùng`,
                        minWidth: 200,
                        maxWidth: 300,
                    },
                    { field: 'ten_dangnhap', headerName: `Tên đăng nhập`, minWidth: 200, maxWidth: 300 },
                    {
                        field: 'thoi_gian_duyet',
                        headerName: `Thời gian duyệt`,
                        minWidth: 300,
                        maxWidth: 350,
                        cellRenderer: (params) => {
                            return <div>{Helper.timeToVietNamDate(params?.value)}</div>;
                        },
                    },
                    { field: 'don_vi', headerName: `Đơn vị`, minWidth: 250 },
                    { field: 'nguoi_duyet', headerName: `Người duyệt`, minWidth: 250 },
                    { field: 'trang_thai_duyet', headerName: `Trạng thái duyệt`, minWidth: 200, flex: 1 },
                    // { field: 'noi_dung', headerName: `Nội dung`, minWidth: 200 },
                ]}
                loading={loadingTable}
                pagination={{ rawData: rawData, getRows: getRows, setData: setDataTable, Count: Count }}
            />
        </>
    );
}

export default RoutesNhatKyDuyetDKTKCCVC;
