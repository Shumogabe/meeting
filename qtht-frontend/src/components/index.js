import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import Appcolors from '../constants/colors';
import Helper from '../helpers';
import { tableSelector } from '../redux/selector';
//icon
import QrCodeIcon from '@mui/icons-material/QrCode';
//METHOD OF TABLE
import BackupIcon from '@mui/icons-material/Backup';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import { CircularProgress, Grid, Popover, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
//BREADCRUMB
import { Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
//Form formik, button, search
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { FastField, Formik, useFormikContext } from 'formik';
import FontSize from '../constants/fontSize';
//select
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Autocomplete, FormControl, InputLabel, MenuItem } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { tooltipClasses } from '@mui/material/Tooltip';
import styled from 'styled-components';
//textfield
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
//upload input
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import FilePresentIcon from '@mui/icons-material/FilePresent';
//select time
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { vi } from 'date-fns/locale';
//table

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
//pagination
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
//modal
import Modal from '@mui/material/Modal';
//import multi
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
//pagination
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
//upload file
import Api, { time_thong_bao } from '../api2';
//PopConFirm
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//Lodash
import { AddCircleOutline, Check, Download, ExpandMore, InfoOutlined, KeyboardDoubleArrowRight, OpenInFull, Restore, ToggleOnOutlined } from '@mui/icons-material';
import { debounce, isEmpty, isEqual } from 'lodash';
// Collapse
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
// Virturlization for big data select
import { List } from 'react-virtualized';
//  Vaildate
import * as Yup from 'yup';
// DnD
import { DateTimePicker, DesktopTimePicker } from '@mui/x-date-pickers';
//
function MyComponentThaoTac(props) {
    const tableselector = useSelector(props.tableSelector);
    const [expand, setExpand] = useState(props.expand ? props.expand : true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (props.fullsize) {
            dispatch(props.tableReducer.actions.openfullsize());
        }
    }, []);

    const handlefullsize = () => {
        dispatch(props.tableReducer.actions.handlefullsize());
    };

    return (
        <div
            className="component-chitiet"
            style={{
                width: tableselector.detail && tableselector.fullsize === false ? props.width : tableselector.detail && tableselector.fullsize === true ? props.widthFullSize : '0px',
                padding: '0px',
            }}
        >
            <div>
                <div className="component-chitiet__thaotac">
                    {tableselector.detail && (
                        <Tooltip title="Đóng">
                            <KeyboardDoubleArrowRight
                                sx={{ fontSize: '23px', color: '#37352f73', cursor: 'pointer' }}
                                onClick={() => {
                                    dispatch(props.tableReducer.actions.offdetail());
                                }}
                            />
                        </Tooltip>
                    )}
                    {expand && (
                        <Tooltip title="Mở rộng">
                            <OpenInFull
                                sx={{ fontSize: '16px', color: '#37352f73', cursor: 'pointer' }}
                                onClick={() => {
                                    handlefullsize();
                                }}
                            />
                        </Tooltip>
                    )}
                </div>
                <div className="component-chitiet__content">{props.content && tableselector.detail ? props.content : ''}</div>
            </div>
        </div>
    );
}
export default function NumberPagination({ data, setTableData }) {
    const [page, setPage] = useState(1);
    const [postperpage] = useState(10);
    //lấy ra index của post cuối cùng của 1 trang = index trang hiện tại nhân số trang
    const indexOfLastPost = page * postperpage;
    //lấy ra index của post đầu tiên bằng trang cuối trừ đi số trang mỗi page
    const indexOfFirstPost = indexOfLastPost - postperpage;
    //cắt mảng post ban đầu ra theo từng trang

    useEffect(() => {
        const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
        setTableData(currentPosts);
        return () => {
            setTableData([]);
        };
    }, [data, page]);

    const handleChange = (event, value) => {
        const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
        if (currentPosts.length < postperpage) return;
        setPage(value);
    };

    return <Pagination count={Math.ceil(data / postperpage)} page={page} onChange={handleChange} />;
}
export const MyWrapperModal = ({ open, setOpen, children, style }) => {
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={{ ...style }}>{children}</Box>
            </Modal>
        </div>
    );
};

export const ImportDatas = ({ ListSave, FileSave, setOpenModal, OpenModal, dataname }) => {
    const [value, setValue] = useState('1');
    const [file, setFile] = useState([]);
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const handleChange = (event, newValue) => {
        setData([]);
        setFile([]);
        setValue(newValue);
    };
    useEffect(() => {
        return () => {
            setData([]);
            setFile([]);
            setTableData([]);
        };
    }, [OpenModal]);
    const handleTextFieldChange = (e) => {
        if (e.target.value.trim().length > 0) {
            const lines = e.target.value.split('\n');
            const newarr = lines.map((data, idx) => {
                return { stt: idx + 1, ten: data };
            });
            setData(newarr);
        } else {
            setData([]);
        }
    };
    const handleUploadfile = async (e) => {
        const files = e.target.files;
        setFile(files);
        const fileExtension = files[0].name.split('.').pop();
        if (fileExtension === 'csv') {
            try {
                const file = e.target.files[0];

                // 1. create url from the file
                const fileUrl = URL.createObjectURL(file);

                // 2. use fetch API to read the file
                const response = await fetch(fileUrl);

                // 3. get the text from the response
                const text = await response.text();

                // 4. split the text by newline
                const lines = text.split('\n');

                // 5. map through all the lines and split each line by comma.
                const _data = lines.map((line) => line.split(','));
                // CONVERT list array to list object
                const newarr = _data.map((data, idx) => {
                    return { stt: idx + 1, ten: data[0] };
                });
                // 6. call the onChange event
                setData(newarr);
            } catch (error) {
                console.error(error);
            }
        } else {
            ThongBao({ status: 'warn', message: 'Yêu cầu file có đuôi mở rộng csv' });
        }
    };
    return (
        <MyWrapperModal
            open={OpenModal}
            setOpen={setOpenModal}
            children={
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50vw',
                        height: '70vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        overflow: 'scroll',
                    }}
                >
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Copy văn bản" value="1" />
                                    <Tab label="File CSV" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <MyTextFieldArea label={`Danh sách ${dataname}`} onChange={(e) => handleTextFieldChange(e)} placeholder={`Nhập vào danh sách ${dataname}`} />
                                <div style={{ marginTop: '15px' }} />
                                <MyButton size="medium" txt={`Nhập ${dataname}`} onClick={() => ListSave(data)} />
                                <div style={{ marginTop: '15px' }} />
                                <MyTable
                                    autofit={true}
                                    columns={[
                                        { headerName: '#', field: 'stt', width: '100px', suppressSizeToFit: true, pinned: 'left' },
                                        { field: 'ten', headerName: `Tên ${dataname}` },
                                    ]}
                                    data={tableData}
                                />

                                <div style={{ marginTop: '15px' }} />
                                <NumberPagination data={data} setTableData={setTableData} />
                            </TabPanel>
                            <TabPanel value="2">
                                <MyTextFieldUploadFile value={file[0]?.name} label={'Tên file'} handleUploadfile={handleUploadfile} />
                                <div style={{ marginTop: '15px' }} />
                                <MyButton size="medium" txt={`Nhập ${dataname}`} onClick={() => ListSave(data)} />
                                <div style={{ marginTop: '15px' }} />
                                <MyTable
                                    autofit={true}
                                    columns={[
                                        { headerName: '#', field: 'stt', width: '100px', suppressSizeToFit: true, pinned: 'left' },
                                        { field: 'ten', headerName: `Tên ${dataname}` },
                                    ]}
                                    data={tableData}
                                />
                                <div style={{ marginTop: '15px' }} />
                                <NumberPagination data={data} setTableData={setTableData} />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Box>
            }
        />
    );
};
export function MyPagination1({ pagination, data }) {
    const { getRows, setData, rawData, Count } = pagination;
    const [page, setPage] = useState(0);
    const [prePages, setPrePages] = useState([]);
    const [limit, setLimit] = useState(10);
    useEffect(() => {
        setLimit(rawData?.pageSize ? rawData?.pageSize : 10);
        setPage(rawData?.pageNumber ? rawData?.pageNumber : 1);
    }, [rawData]);
    //Thêm mới
    useEffect(() => {
        if (data?.[0]?.refreshKey) {
            setPrePages([]);
            setPage(0);
        }
    }, [data]);
    //End Thêm mới
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        getRows(parseInt(event.target.value), 1, 0);
        setPrePages([]);
        setPage(0);
    };
    const handleNext = () => {
        if (page + 1 < prePages.length) {
            setData(Helper.addSttToTableDataSource(prePages[page + 1]?.records, page + 1, limit));
            setPage(page + 1);
        } else {
            if (prePages.length < page + 1) {
                setPrePages([...prePages, rawData?.data]);
                getRows(limit, page + 1, page + 1);
                setPage(page + 1);
            } else {
                getRows(limit, page + 1, page + 1);
                setPage(page + 1);
            }
        }
    };
    const handlePre = () => {
        if (page - 1 <= prePages.length) {
            //data đã được lưu trong mảng
            setData(Helper.addSttToTableDataSource(prePages[page - 2], page - 1, limit));
            setPage(page - 1);
        } else {
            setPrePages([...prePages, rawData?.data]);
            setData(Helper.addSttToTableDataSource(prePages[page - 1]?.data, page - 1, limit));
            setPage(page - 1);
        }
    };
    return (
        <Grid container direction="row" justifyContent="flex-end" alignItems="center" marginTop={1}>
            {Count ? (
                <Box sx={{ minWidth: 80, height: 30, display: 'flex', alignItems: 'center', mr: '10px' }}>
                    <Typography
                        sx={{
                            fontSize: FontSize.textFieldLabel,
                            textAlign: 'center',
                        }}
                        variant="body2"
                        color={'#000000b3'}
                    >
                        <strong>{(page - 1) * limit + 1} </strong>
                        {'-'}
                        <strong>{page * limit >= Count ? Count : page * limit} </strong>
                        {' của '}
                        <strong>{Count}</strong>
                    </Typography>
                </Box>
            ) : (
                <></>
            )}
            <Box sx={{ minWidth: 80, height: 30 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Dòng</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={limit} label="Dòng" onChange={handleChangeRowsPerPage} sx={{ height: 30 }}>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid>
                <IconButton aria-label="delete" disabled={page <= 1} onClick={handlePre} color="primary">
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton aria-label="delete" disabled={page * limit >= Count ? true : false} color="primary" onClick={handleNext}>
                    <ChevronRightIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}
export function MyPagination({ pagination, data }) {
    const { getRows, setData, rawData, Count } = pagination;
    const [page, setPage] = useState(0);
    const [prePages, setPrePages] = useState([]);
    const [limit, setLimit] = useState(10);
    useEffect(() => {
        setLimit(rawData?.limit ? rawData?.limit : 10);
    }, [rawData]);
    //Thêm mới
    useEffect(() => {
        if (data?.[0]?.refreshKey) {
            setPrePages([]);
            setPage(0);
        }
    }, [data]);
    //End Thêm mới
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value));
        getRows(parseInt(event.target.value), undefined, 0);
        setPrePages([]);
        setPage(0);
    };
    const handleNext = () => {
        if (page + 1 < prePages.length) {
            setData(Helper.addSttToTableDataSource(prePages[page + 1]?.records, page + 1, limit));
            setPage(page + 1);
        } else {
            if (prePages.length < page + 1) {
                setPrePages([...prePages, rawData]);
                getRows(limit, rawData?.anchor, page + 1);
                setPage(page + 1);
            } else {
                getRows(limit, rawData?.anchor, page + 1);
                setPage(page + 1);
            }
        }
    };
    const handlePre = () => {
        if (page < prePages.length) {
            //data đã được lưu trong mảng
            setData(Helper.addSttToTableDataSource(prePages[page - 1]?.records, page - 1, limit));
            setPage(page - 1);
        } else {
            setPrePages([...prePages, rawData]);
            setData(Helper.addSttToTableDataSource(prePages[page - 1]?.records, page - 1, limit));
            setPage(page - 1);
        }
    };
    return (
        <Grid container direction="row" justifyContent="flex-end" alignItems="center" marginTop={1}>
            {Count ? (
                <Box sx={{ minWidth: 80, height: 30, display: 'flex', alignItems: 'center', mr: '10px' }}>
                    <Typography
                        sx={{
                            fontSize: FontSize.textFieldLabel,
                            textAlign: 'center',
                        }}
                        variant="body2"
                        color={'#000000b3'}
                    >
                        <strong>{page * limit + 1} </strong>
                        {'-'}
                        <strong>{(page + 1) * limit >= Count ? Count : (page + 1) * limit} </strong>
                        {' of '}
                        <strong>{Count}</strong>
                    </Typography>
                </Box>
            ) : (
                <></>
            )}
            <Box sx={{ minWidth: 80, height: 30 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Dòng</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={limit} label="Dòng" onChange={handleChangeRowsPerPage} sx={{ height: 30 }}>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Grid>
                <IconButton aria-label="delete" disabled={page <= 0} onClick={handlePre} color="primary">
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton aria-label="delete" disabled={(prePages?.length > 0 ? false : prePages?.[page]?.records.length >= limit ? false : rawData?.records?.length < limit) || (prePages?.[page]?.anchor ? false : !rawData?.anchor)} color="primary" onClick={handleNext}>
                    <ChevronRightIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}
const loadingComponent = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <CircularProgress />
        </div>
    );
};

export const MyTable = ({ columns, handlePrint, pagination, overlayNoRowsTemplate, loading = false, gridOptions = {}, autofit, myRef, openDraw, resizable, rowDragEntireRow, suppressMovable, autoHeight = true, rowHeight, offScrollHorizontal = false, getRowChange, handleCellEditingStopped, onCellValueChanged, rowClassRules, suppressRowHoverHighlight = false, getRowStyle, setGridApiProp, singleClickEdit = false, onRowClicked, onCellClicked, borderLeft = false, data, ...props }) => {
    const gridRef = useRef();
    const [gridApi, setGridApi] = React.useState(null);
    const tableReducer = useSelector(tableSelector);
    // Auto size to fit
    useEffect(() => {
        if (!myRef) {
            if (autofit === true) {
                setTimeout(function () {
                    if (gridRef.current !== null) {
                        gridRef.current.api.sizeColumnsToFit();
                    }
                }, 200);
            }
        } else {
            if (autofit === true) {
                setTimeout(function () {
                    if (myRef.current !== null) {
                        myRef.current.api.sizeColumnsToFit();
                    }
                }, 200);
            }
        }
    }, [tableReducer.autofit, openDraw]);
    //  loading
    useEffect(() => {
        if (!myRef) {
            if (loading) {
                gridRef.current?.api?.showLoadingOverlay();
            } else {
                gridRef.current?.api?.hideOverlay();
                if (data <= 0) {
                    gridRef.current?.api?.showNoRowsOverlay();
                }
            }
        } else {
            if (loading) {
                myRef.current?.api?.showLoadingOverlay();
            } else {
                myRef.current?.api?.hideOverlay();
                if (data <= 0) {
                    myRef.current?.api?.showNoRowsOverlay();
                }
            }
        }
    }, [loading]);
    // On grid ready
    function onGridReady(params) {
        setGridApi(params.api);
        if (setGridApiProp != null) {
            setGridApiProp(params.api);
        }
        if (autofit === true) {
            params.api.sizeColumnsToFit();
        }
    }

    // const sizeToFit = useCallback(() => {
    //   if (autofit === true) {
    //     setTimeout(
    //     function() {
    //       gridRef.current.api.sizeColumnsToFit();
    //     },
    //     300
    //   );
    //   }
    // }, []);
    // Drag stop
    const onDragStopped = (value) => {
        const rows = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => rows.push(node.data));
        getRowChange(rows);
    };
    // Oncell edit
    const onCellEditingStopped = useCallback((event) => {
        if (handleCellEditingStopped != null) {
            handleCellEditingStopped(event);
        }
    }, []);
    // Col defs
    const defaultColDef = useMemo(() => {
        return {
            resizable: resizable ? resizable : false,
            editable: false,
            suppressMovable: suppressMovable ? suppressMovable : true,
            filter: false,
            wrapText: true,
            autoHeight: autoHeight,
            minWidth: 50,
            sortable: false,
            headerClass: 'my-header-class',
            cellStyle: {
                fontSize: '13px',
                borderLeft: borderLeft && '1px solid #eeeeed',
                fontWeight: '400',
                fontFamily: '',
                color: '#344767',
                lineHeight: '1.5',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '8px',
                paddingBottom: '8px',
            },
            ...props,
        };
    }, []);
    // Define column types
    const columnTypes = useMemo(() => {
        return {
            center: {
                cellClass: 'center-class',
                headerClass: 'center-class',
            },
        };
    }, []);
    // const [clickedCell, setClickedCell] = useState(null);
    // const tableRef = useRef();
    // const menuRef = useRef();
    // useClickOutside([tableRef, menuRef], () => setClickedCell(null));

    return (
        <div className="example-wrapper" style={{ height: '100%', width: '100%' }}>
            <div className="ag-theme-alpine" id="myGrid" style={{ height: 'fit-content', width: '100%' }}>
                <AgGridReact
                    ref={myRef ? myRef : gridRef}
                    rowData={data}
                    gridOptions={{ ...gridOptions, enableCellTextSelection: true, ensureDomOrder: true, onCellClicked: onCellClicked, rowSelection: 'multiple' }}
                    columnTypes={columnTypes}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    groupSelectsChildren={true}
                    // enableRangeSelection={true}
                    rowDragManaged={true}
                    rowHeight={rowHeight ? rowHeight : 41}
                    onDragStopped={onDragStopped}
                    onRowClicked={(row) => {
                        if (onRowClicked) {
                            onRowClicked(row.data);
                        }
                    }}
                    reactiveCustomComponents={true}
                    rowDragEntireRow={rowDragEntireRow ? rowDragEntireRow : false}
                    animateRows={true}
                    getRowStyle={(params) => {
                        if (params.node.rowIndex % 2 !== 0) {
                            return { background: '#f8f8f8' };
                        }
                    }}
                    overlayNoRowsTemplate={`<div class="ag-overlay-no-row-template">Không có dữ liệu</div>`}
                    loadingOverlayComponent={loadingComponent}
                    overlayLoadingTemplate="Đang tải dữ liệu"
                    onGridReady={onGridReady}
                    // onGridColumnsChanged = {sizeToFit}
                    onCellEditingStopped={onCellEditingStopped}
                    domLayout="autoHeight"
                    suppressHorizontalScroll={offScrollHorizontal}
                    onCellValueChanged={onCellValueChanged}
                    singleClickEdit={true}
                    rowClassRules={rowClassRules}
                    stopEditingWhenCellsLoseFocus={true}
                    suppressRowHoverHighlight={suppressRowHoverHighlight}
                    // onCellClicked={(e) => setClickedCell(e)}
                ></AgGridReact>
                {pagination && (window.location.pathname.includes('thiet-lap-cau-hinh-') ? <MyPagination1 data={data} pagination={{ ...pagination }} /> : <MyPagination data={data} pagination={{ ...pagination }} />)}
            </div>
            {/* {clickedCell && <MenuTable config={clickedCell} ref={menuRef} />} */}
        </div>
    );
};

export const ThongBao = ({ code, message, status }) => {
    // toast.success('🦄 Wow so easy!', {
    //     position: 'top-right',
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: 'light',
    //     transition: Bounce,
    // });
    // const time_thong_bao = 5000;
    if (code) {
        switch (code) {
            case 200:
                return toast.success(message ? message : 'Thành công', { autoClose: time_thong_bao });
            case 299:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: message ? message : 'Có lỗi xảy ra' });
                return toast.warn(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
            case 500:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: message ? message : 'Có lỗi xảy ra' });
                return toast.error(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
            case 400:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Cú pháp không hợp lệ' });
                return toast.error('Cú pháp không hợp lệ', { autoClose: time_thong_bao });
            case 401:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Không xác thực' });
                return toast.error('Không xác thực', { autoClose: time_thong_bao });
            case 404:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Không tìm thấy dữ liệu' });
                return toast.error('Không tìm thấy dữ liệu', { autoClose: time_thong_bao });
            case 408:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Hết thời gian yêu cầu máy chủ' });
                return toast.error('Hết thời gian yêu cầu máy chủ', { autoClose: time_thong_bao });
            case 502:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Hệ thống không phản hồi' });
                return toast.error('Hệ thống không phản hồi', { autoClose: time_thong_bao });
            case 503:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Máy chủ không phản hồi do quá thời gian' });
                return toast.error('Máy chủ không phản hồi do quá thời gian', { autoClose: time_thong_bao });
            default:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: message ? message : 'Có lỗi xảy ra' });
                return toast.error(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
        }
    } else {
        switch (status) {
            case 'success':
                return toast.success(message ? message : 'Thành công', { autoClose: time_thong_bao });
            case 'warn':
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: message ? message : 'Có lỗi xảy ra' });
                return toast.warn(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
            case 'error':
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: message ? message : 'Có lỗi xảy ra' });
                return toast.error(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
            case 'info':
                return toast.info(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
            default:
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: message ? message : 'Có lỗi xảy ra' });
                return toast.error(message ? message : 'Có lỗi xảy ra', { autoClose: time_thong_bao });
        }
    }
};

export function MyThaoTac({ data, handleEdit, active, handleDetail, handleDelete, handleMap, handleFile, handleSetting, handleRestore, handleCongBo, handleBackup, handleOpenNewTab, handlePheDuyet, ...props }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [type, setType] = useState(null);

    const handleClick = (event, type) => {
        setAnchorEl(event.currentTarget);
        setType(type || 'delete');
    };

    const handleClose = () => {
        setAnchorEl(null);
        setType(null);
    };

    const handleClickDelete = () => {
        handleClose();
        handleDelete(data);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    let str;
    switch (type) {
        case 'delete':
            str = 'Xóa bản ghi này ?';
            break;
        case 'restore':
            str = 'Phục hồi bản ghi này ?';
            break;
        case 'active':
            str = active?.state ? 'Ngừng ' + active?.name : 'Kích hoạt ' + active?.name;
            break;
        default:
            str = '';
            break;
    }

    return (
        <div className="mythaotac">
            {active && (
                <Tooltip title={active?.state ? 'Ngừng ' + active?.name : 'Kích hoạt ' + active?.name} arrow>
                    <ToggleOnOutlined
                        onClick={(e) => {
                            handleClick(e, 'active');
                        }}
                        style={{ color: active?.state ? '#FF0000' : '#008000', fontSize: '20px', transform: active?.state ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                </Tooltip>
            )}
            {handlePheDuyet && (
                <Tooltip title="Phê duyệt" arrow>
                    <Check
                        onClick={() => {
                            handlePheDuyet(data);
                        }}
                        style={{ color: '#008000', fontSize: '20px' }}
                    />
                </Tooltip>
            )}
            {handleSetting ? (
                <Tooltip title="Cấu hình" arrow>
                    <SettingsIcon
                        onClick={() => {
                            handleSetting(data);
                        }}
                        style={{ color: '#616161', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            {handleMap ? (
                <Tooltip title="Xem bản đồ" arrow>
                    <LanguageOutlinedIcon
                        onClick={() => {
                            handleMap(data);
                        }}
                        style={{ color: 'rgb(18 135 43)', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            {handleFile ? (
                <Tooltip title="File đính kèm" arrow>
                    <DescriptionIcon onClick={handleFile} style={{ color: '#ff9800', fontSize: '20px' }} />
                </Tooltip>
            ) : (
                ''
            )}
            {handleDetail ? (
                <Tooltip title="Xem chi tiết" arrow>
                    <InfoOutlined
                        onClick={() => {
                            handleDetail(data);
                        }}
                        style={{ color: '#17aafd', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            {handleBackup ? (
                <Tooltip title="Tải về" arrow>
                    <Download
                        onClick={() => {
                            handleBackup(data);
                        }}
                        style={{ color: '#3163c6', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            {handleCongBo ? (
                <Tooltip title="Công bố dữ liệu" arrow>
                    <BackupIcon
                        onClick={() => {
                            handleCongBo(data);
                        }}
                        style={{ color: '#3163c6', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            {handleEdit ? (
                <Tooltip title="Sửa" arrow>
                    <ModeOutlinedIcon
                        onClick={() => {
                            handleEdit(data);
                        }}
                        style={{ color: '#FFA500', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            {handleDelete ? (
                <Tooltip title="Xóa" arrow>
                    <DeleteOutlineIcon onClick={handleClick} style={{ color: '#FF0000', fontSize: '20px' }} />
                </Tooltip>
            ) : (
                ''
            )}
            {handleRestore ? (
                <Tooltip title="Phục hồi" arrow>
                    <Restore onClick={(e) => handleClick(e, 'restore')} style={{ color: '#168d42', fontSize: '20px' }} />
                </Tooltip>
            ) : (
                ''
            )}
            {handleOpenNewTab ? (
                <Tooltip title="QR Code" arrow>
                    <QrCodeIcon
                        onClick={() => {
                            handleOpenNewTab(data);
                        }}
                        style={{ color: '#3163c6', fontSize: '20px' }}
                    />
                </Tooltip>
            ) : (
                ''
            )}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ padding: '3px' }}>
                    <span style={{ display: 'inline-flex', fontSize: '15px', alignItems: 'center', gap: '2px' }}>
                        <ReportIcon sx={{ color: 'orange', fontSize: 'inherit' }} />
                        <Typography color={'#00000099'} fontSize="inherit" whiteSpace="wrap">
                            {str}
                        </Typography>
                    </span>
                    <div style={{ display: 'flex', fontSize: '14px', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Typography onClick={handleClose} color={'#00000099'} fontSize="inherit" whiteSpace="wrap" sx={{ cursor: 'pointer', p: '3px', ':hover': { opacity: 0.6 } }}>
                            Hủy
                        </Typography>
                        <Typography
                            onClick={() => {
                                switch (type) {
                                    case 'delete':
                                        handleClickDelete();
                                        break;
                                    case 'restore':
                                        handleClose();
                                        handleRestore(data);
                                        break;
                                    case 'active':
                                        handleClose();
                                        active.callback(data);
                                        break;
                                    default:
                                        break;
                                }
                            }}
                            color={type === 'delete' ? '#FF0000' : '#FFA500'}
                            fontSize="inherit"
                            whiteSpace="wrap"
                            sx={{ cursor: 'pointer', p: '3px', ':hover': { opacity: 0.6 } }}
                        >
                            Đồng ý
                        </Typography>
                    </div>
                </div>
            </Popover>
        </div>
    );
}
export const Cross = (props) => {
    const { pt, pb, color, width } = props;
    return (
        <Grid sx={{ paddingTop: pt ? pt : 1, paddingBottom: pb ? pb : 1 }}>
            <Grid sx={{ borderTop: width ? width : 1, borderColor: color ? color : '#dee2e6' }}></Grid>
        </Grid>
    );
};
export const MyBreadCrumbs = (props) => {
    let navigate = useNavigate(); //chuyển trang

    const link = (value) => {
        if (value !== undefined) {
            // if(link)
            navigate(value);
        }
    };
    return (
        <div role="presentation" className="my-breadcrumb" style={{ marginBottom: '5px' }}>
            <Breadcrumbs aria-label="breadcrumb">
                {props.title &&
                    props.title.map((e, index) => {
                        return (
                            <Link
                                key={index}
                                underline="hover"
                                onClick={() => {
                                    link(e.link);
                                }}
                                color={index === props.title.length - 1 ? '#2b713a' : 'inherit'}
                                fontSize="15px"
                            >
                                {e.name}
                            </Link>
                        );
                    })}
            </Breadcrumbs>
        </div>
    );
};

export const MyButton = React.forwardRef(({ variant, color, loading, height, size, type, onClick, disabled, icon, width, fontSizeIcon, txt, handleUploadfile, uploadfile, marginRightStartIcon, multiple = false, ...rest }, ref) => {
    return (
        <LoadingButton type={type} loading={loading ? loading : false} loadingPosition={'center'} onClick={onClick} disabled={disabled != null ? !disabled : false} style={{ height: height ? height : '33px', minWidth: width, textTransform: 'none', boxShadow: 'none' }} size={size ? size : 'small'} startIcon={icon} color={color ? color : 'primary'} variant={variant ? variant : 'contained'} {...rest}>
            <div style={{ fontSize: '15px', paddingTop: 0, textAlign: 'center', lineHeight: '15px' }}>{txt}</div>
            {uploadfile === true ? (
                <input
                    type="file"
                    hidden
                    multiple={multiple}
                    onClick={(event) => {
                        event.target.value = null;
                    }}
                    onChange={(item) => handleUploadfile(item)}
                />
            ) : (
                ''
            )}
        </LoadingButton>
    );
});

export const Search = React.forwardRef(({ width, required, helperText, label, height, ...rest }, ref) => {
    return (
        <div style={{ width: width }}>
            <TextField
                {...rest}
                helperText={helperText}
                variant="outlined"
                type="search"
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon sx={{ fontSize: '20px' }} />
                        </InputAdornment>
                    ),
                    sx: {
                        height: height ? height : '33px',
                        color: '#3a4c6b',
                        fontSize: FontSize.textField,
                        '& .MuiOutlinedInput-input': {
                            padding: '12px 0px 12px 15px!important',
                        },
                    },
                }}
                sx={{
                    '.MuiFormHelperText-root': {
                        color: '#f44335 !important',
                        marginTop: '5px !important',
                        paddingLeft: '5px !important',
                        fontSize: '13px',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: helperText ? '#e91e63 !important' : '#cbd5e0 !important',
                        },
                        '&:hover fieldset': {
                            borderColor: '#a0a0a0 !important',
                        },
                        '&.Mui-focused fieldset': {
                            border: helperText ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                        },
                    },
                }}
            />
        </div>
    );
});

export const MyForm = ({ width, formikRef, childrenSearch, children, customSearch, dataFormik, validationSchema, onSubmitAPI, handleAdd, showSearch, showExcel, handleExportExcel, handleImportExcel, handleChange, editable = true, showFormikState, isql, kvtk }) => {
    return (
        <Grid item sx={{ width: width ? width : null }}>
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                innerRef={formikRef}
                enableReinitialize={true}
                initialValues={dataFormik}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    onSubmitAPI(values, actions);
                }}
                render={(props) => (
                    <form onSubmit={props.handleSubmit} autoComplete="false">
                        <div>
                            {children ? children(props) : null}
                            {showSearch ? (
                                <div className="myform__select" style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    {customSearch ? (
                                        <TextField
                                            name="search"
                                            placeholder="Tìm kiếm..."
                                            variant="outlined"
                                            type="search"
                                            value={props.values.search}
                                            onChange={(e) => {
                                                props.setFieldValue('search', e.target.value);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {props.values.search.length > 0 ? (
                                                            <IconButton
                                                                onClick={() => {
                                                                    props.setFieldValue('search', '');
                                                                }}
                                                            >
                                                                <ClearIcon fontSize="small" />
                                                            </IconButton>
                                                        ) : (
                                                            <SearchIcon sx={{ fontSize: '20px' }} />
                                                        )}
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    height: '33px',
                                                    color: '#3a4c6b',
                                                    fontSize: FontSize.textField,
                                                    '& .MuiOutlinedInput-input': {
                                                        padding: '12px 0px 12px 15px!important',
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '.MuiFormHelperText-root': {
                                                    color: '#f44335 !important',
                                                    marginTop: '5px !important',
                                                    paddingLeft: '5px !important',
                                                    fontSize: '13px',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: '#cbd5e0 !important',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#a0a0a0 !important',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: '1px solid #1a73e8 !important',
                                                    },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <FastField name="search" render={({ field }) => <Search placeholder="Tìm kiếm..." {...field} />} />
                                    )}

                                    <MyButton
                                        txt="Tìm kiếm"
                                        type="submit"
                                        // style={{width: 150, height: 26}}
                                        icon={<SearchRoundedIcon />}
                                    />
                                    {editable && handleAdd && !kvtk && (
                                        <MyButton
                                            onClick={handleAdd}
                                            txt="Thêm mới"
                                            // style={{width: 160, height: 26}}
                                            icon={<AddIcon />}
                                        />
                                    )}

                                    {showExcel && editable && <MyButton txt="Xuất File Excel" color="#1da51de6" onClick={handleExportExcel} icon={<DescriptionIcon />} />}

                                    {showExcel && editable && <MyButton txt="Nhập File Excel" color="#1da51de6" onClick={handleImportExcel} icon={<UploadFileIcon />} />}
                                    {childrenSearch ? childrenSearch : null}
                                </div>
                            ) : (
                                ''
                            )}

                            {showFormikState && <DisplayFormikState values={props.values} errors={props.errors} />}
                        </div>
                    </form>
                )}
            />
        </Grid>
    );
};

const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));
const filterOptions = createFilterOptions({
    ignoreCase: true,
    matchFrom: 'start',
    limit: 10,
});
// Virtual
const ListBoxComponent = React.forwardRef(function ListBoxComponent(props, ref) {
    const { children, role, ...other } = props;
    const itemCount = Array.isArray(children) ? children.length : 0;
    const itemSize = 45;
    const listHeight = itemCount <= 8 ? itemCount * itemSize : 250;
    return (
        <div ref={ref} style={{ paddingTop: 5 }}>
            <div {...other} style={{ overflow: 'hidden', padding: 0, display: 'flex' }}>
                <List
                    height={listHeight}
                    width={1}
                    style={{ width: '100%' }}
                    containerStyle={{ width: '100%', maxWidth: '100%' }}
                    rowHeight={itemSize}
                    overscanCount={5}
                    rowCount={itemCount}
                    rowRenderer={(props) => {
                        // console.log(props);
                        return React.cloneElement(children[props.index], {
                            style: { ...props?.style, display: '-webkit-box', WebkitBoxOrient: 'vertical', maxHeight: 45, height: 'fit-content', fontSize: 14, paddingLeft: 5, WebkitLineClamp: 2, overflow: 'hidden' },
                        });
                    }}
                    role={role}
                />
            </div>
        </div>
    );
});

export const MySelect = ({ width, multiple, clearAble, isFilterOptions, required, helperText, onChange, value, label, name, tooltip = false, tooltipContent, options, placeholder, errors, height, disabled, offPaddingBottom, disableClearable = false, defaultValue, ...rest }) => {
    const newOptions = useMemo(() => {
        const arr = Helper.filterAndKeepFirstDuplicate(options, name);
        return arr;
    }, [options, name]);
    return (
        <div
            style={{
                width: width ? width : '100%',
                paddingBottom: offPaddingBottom ? '0px !important' : FontSize.DivLabelMarginBottom,
                alignSelf: 'self-start',
            }}
        >
            {required ? (
                <Typography
                    sx={{
                        marginBottom: label ? FontSize.LabelMarginBottom : '0px !important',
                        fontSize: FontSize.textFieldLabel,
                    }}
                    variant="body2"
                    color={errors ? '#f44335' : '#000000b3'}
                >
                    {label}
                    <span style={{ color: 'red' }}> *</span>
                </Typography>
            ) : (
                <Typography
                    sx={{
                        marginBottom: label ? FontSize.LabelMarginBottom : '0px !important',
                        fontSize: FontSize.textFieldLabel,
                    }}
                    variant="body2"
                    color={errors ? '#f44335' : '#000000b3'}
                >
                    {label}
                </Typography>
            )}
            <Autocomplete
                value={value}
                fullWidth
                multiple={multiple}
                options={newOptions}
                filterOptions={isFilterOptions && filterOptions}
                disableClearable={clearAble ? !clearAble : disableClearable ? disableClearable : value ? false : true}
                defaultValue={defaultValue ? defaultValue : undefined}
                onChange={onChange}
                isOptionEqualToValue={(option, value) => isEqual(option, value)}
                popupIcon={<KeyboardArrowDownIcon style={{ color: '#8080808a', fontSize: '20px' }} />}
                ListboxComponent={newOptions?.length > 100 ? ListBoxComponent : null}
                getOptionLabel={(option) => (typeof option === 'string' ? option : typeof option === 'object' ? option?.[name] || '' : '')}
                renderOption={(props, option, { selected }) => {
                    return (
                        <li {...props}>
                            <Typography color={'#344767e3'} sx={{ fontSize: '14px' }}>
                                {typeof option === 'string' ? option : typeof option === 'object' ? option[name] : ''}
                            </Typography>
                        </li>
                    );
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        padding: '4.5px',
                        paddingLeft: '15px',
                        color: Appcolors.textFiled,
                        fontSize: FontSize.textField,
                        textOverflow: 'ellipsis',
                        backgroundColor: disabled ? Appcolors.backgroundDisabled : 'white',
                        height: height ? height : '33px',
                        '& .MuiAutocomplete-input': {
                            height: '100%',
                            padding: '0px',
                            textOverflow: 'ellipsis',
                        },
                        '& .MuiAutocomplete-tag': {
                            height: '100%',
                            marginBottom: '-2px',
                        },
                    },
                }}
                disabled={disabled}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        helperText={errors && helperText}
                        placeholder={placeholder}
                        sx={{
                            '.MuiFormHelperText-root': {
                                color: '#f44335 !important',
                                marginTop: '5px !important',
                                marginRight: '0px',
                                marginLeft: '0px',
                                paddingLeft: '5px !important',
                                fontSize: '13px',
                            },

                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: errors ? '#e91e63 !important' : '#cbd5e0 !important',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#a0a0a0 !important',
                                },
                                '&.Mui-focused fieldset': {
                                    border: errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                                },
                            },
                            '.MuiOutlinedInput-input.Mui-disabled': {
                                WebkitTextFillColor: Appcolors.textFiledDisabled,
                            },
                        }}
                        variant="outlined"
                    />
                )}
                renderTags={(list) => {
                    let displayList = list.map((item) => Object.values(item)[1]).join(', ');

                    // Render <span> elements instead of <Chip> components.
                    return <span>{displayList}</span>;
                }}
                {...rest}
            />
        </div>
    );
};

export const DisplayFormikState = ({ errors, values, ...props }) => {
    const displayProps = { values, errors, ...props };
    return (
        <div style={{ margin: '1rem 0', maxWidth: 'calc(100vw - 370px)', overflowX: 'auto' }}>
            <h3 style={{ fontFamily: 'monospace' }} />
            <pre
                style={{
                    background: '#f6f8fa',
                    fontSize: 20,
                    padding: '.5rem',
                }}
            >
                <strong>props</strong> = {JSON.stringify(displayProps, null, 2)}
            </pre>
        </div>
    );
};

export const MyTextField = ({ width, required, helperText, placeholder, label, height, disabled, errors, type, onClear, onChange, onBlur, onClick, value, acreage, InputProps, ...props }) => {
    return (
        <div style={{ width: width ? width : '100%', alignSelf: 'self-start' }}>
            {required ? (
                <Typography sx={{ marginBottom: FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
                    {label}
                    {acreage ? (
                        <span>
                            (m<sup>2</sup>):
                        </span>
                    ) : null}
                    {required && <span style={{ color: 'red' }}> *</span>}
                </Typography>
            ) : (
                <Typography sx={{ marginBottom: FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
                    {label}
                </Typography>
            )}
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <TextField
                    {...props}
                    variant="outlined"
                    placeholder={placeholder || 'Nhập ' + (label?.toLowerCase() || '...')}
                    type={type ? type : 'text'}
                    fullWidth
                    value={value ? value : ''}
                    disabled={disabled}
                    onChange={onChange}
                    onFocus={onClick}
                    onBlur={onBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    helperText={errors && helperText}
                    InputProps={
                        InputProps
                            ? InputProps
                            : {
                                  sx: {
                                      backgroundColor: disabled ? Appcolors.backgroundDisabled : 'white',
                                      height: height ? height : '33px !important',
                                      color: Appcolors.textFiled,
                                      fontSize: FontSize.textField,
                                      '& .MuiOutlinedInput-input': {
                                          textOverflow: 'ellipsis',
                                      },
                                      '& .MuiOutlinedInput-input.Mui-disabled': {
                                          WebkitTextFillColor: Appcolors.textFiledDisabled,
                                      },
                                      '& fieldset': {
                                          borderColor: errors ? '#e91e63 !important' : '#cbd5e0 !important',
                                      },
                                      '&:hover fieldset': {
                                          borderColor: '#a0a0a0 !important',
                                      },
                                      '&.Mui-focused fieldset': {
                                          border: errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                                      },
                                  },
                              }
                    }
                    sx={{
                        '.MuiFormHelperText-root': {
                            color: '#f44335 !important',
                            marginTop: '5px !important',
                            marginRight: '0px',
                            marginLeft: '0px',
                            paddingLeft: '5px !important',
                            fontSize: '13px',
                        },
                    }}
                />
            </div>
        </div>
    );
};
export const MyTextFieldArea = ({ width, placeholder, required, onChange, helperText, label, height, disabled, type, errors, ...rest }) => {
    const areaRef = useRef(null);
    return (
        <div style={{ width: width, paddingBottom: FontSize.DivLabelMarginBottom }}>
            <Typography sx={{ marginBottom: FontSize.LabelMarginBottom, fontSize: '14px' }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </Typography>

            <TextField
                {...rest}
                ref={areaRef}
                placeholder={placeholder || 'Nhập ' + (label?.toLowerCase() || '...')}
                helperText={errors && helperText}
                variant="outlined"
                multiline
                disabled={disabled}
                // rows={rows}
                type={type ? type : 'search'}
                fullWidth
                onChange={onChange}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{errors && <ReportOutlinedIcon style={{ fontSize: '16px', color: '#f44335' }} />}</InputAdornment>,
                    sx: {
                        color: '#3a4c6b',
                        fontSize: FontSize.textField,
                        padding: '7px!important',
                        backgroundColor: disabled ? Appcolors.backgroundDisabled : 'white',
                        '& .MuiOutlinedInput-input': {
                            textOverflow: 'ellipsis',
                        },
                        '& fieldset': {
                            borderColor: errors ? '#e91e63 !important' : '#cbd5e0 !important',
                        },
                        '&:hover fieldset': {
                            borderColor: '#a0a0a0 !important',
                        },
                        '&.Mui-focused fieldset': {
                            border: '1px solid #1a73e8 !important',
                        },

                        '.MuiFormHelperText-root': {
                            color: '#f44335 !important',
                            marginTop: '5px !important',
                            paddingLeft: '5px !important',
                            fontSize: '13px',
                        },

                        '& .MuiOutlinedInput-input.Mui-disabled': {
                            WebkitTextFillColor: '#00000099',
                        },
                    },
                }}
            />
        </div>
    );
};
export const MyTextFieldUploadFile = React.forwardRef(({ width, required, helperText, label, height, errors, type, value, disabled, handleUploadfile, handleDowloadfile, dowloadFile, ...rest }, ref) => {
    return (
        <div style={{ width: width ? width : '100%', paddingBottom: FontSize.DivLabelMarginBottom }}>
            {required ? (
                <Typography sx={{ marginBottom: FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
                    {label}
                    <span style={{ color: 'red' }}> *</span>
                </Typography>
            ) : (
                <Typography sx={{ marginBottom: FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
                    {label}
                </Typography>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
                <TextField
                    {...rest}
                    helperText={errors && helperText}
                    variant="outlined"
                    fullWidth
                    disabled={disabled}
                    value={value}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{value !== '' ? <div style={{ display: 'flex', gap: '10px' }}>{dowloadFile && <AttachFileIcon onClick={handleDowloadfile} style={{ fontSize: '16px', color: '#63c2de', cursor: 'pointer' }} />}</div> : <></>}</InputAdornment>,
                        sx: {
                            height: height ? height : '33px !important',
                            color: Appcolors.textFiled,
                            fontSize: FontSize.textField,
                            '& .MuiOutlinedInput-input': {
                                textOverflow: 'ellipsis',
                            },
                        },
                    }}
                    sx={{
                        backgroundColor: disabled ? Appcolors.backgroundDisabled : 'white',
                        '.MuiFormHelperText-root': {
                            color: '#f44335 !important',
                            marginTop: '5px !important',
                            paddingLeft: '5px !important',
                            fontSize: '13px',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: errors ? '#e91e63 !important' : '#cbd5e0 !important',
                            },
                            '&:hover fieldset': {
                                borderColor: '#a0a0a0 !important',
                            },
                            '&.Mui-focused fieldset': {
                                border: errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                            },
                        },
                        '& .MuiOutlinedInput-input.Mui-disabled': {
                            WebkitTextFillColor: Appcolors.textFiledDisabled,
                        },
                    }}
                />
                {disabled ? (
                    ''
                ) : (
                    <MyButton
                        icon={<FilePresentIcon />}
                        txt="Tải tài liệu"
                        component="label"
                        style={{ height: '33px', width: '130px' }}
                        uploadfile={true}
                        handleUploadfile={(item) => {
                            handleUploadfile(item);
                        }}
                    />
                )}
            </div>
        </div>
    );
});

export const MyTextFieldUploadMultiFile = React.forwardRef(({ width, required, helperText, label, height, errors, data = [], multi = true, loading, handleUploadfile, handleDelete, handleDowloadfile, dowloadFile = true, saveFile, checkSave, ...rest }, ref) => {
    return (
        <div style={{ width: width ? width : '100%', paddingBottom: 8 }}>
            {required ? (
                <Typography sx={{ marginBottom: '5px !important' }} variant="body2" color={helperText || errors ? '#f44335' : '#000000b3'}>
                    {label}
                    <span style={{ color: 'red' }}> *</span>
                </Typography>
            ) : (
                <Typography sx={{ marginBottom: '5px !important' }} variant="body2" color={helperText || errors ? '#f44335' : '#000000b3'}>
                    {label}
                </Typography>
            )}
            <div style={{ display: 'flex', gap: '10px' }} className="fileGiayChungNhanItem">
                <div>
                    <MyButton
                        loading={loading}
                        icon={<FilePresentIcon />}
                        txt="Tải tài liệu"
                        component="label"
                        style={{ height: '33px', width: '140px' }}
                        uploadfile={true}
                        multiple={multi ? true : false}
                        handleUploadfile={(item) => {
                            handleUploadfile(item);
                        }}
                    />

                    {!loading && (
                        <Box width="100%" gap={1} sx={{ display: 'flex' }}>
                            {data &&
                                data.map((item, idx) => {
                                    return (
                                        <TextField
                                            {...rest}
                                            helperText={helperText || errors}
                                            variant="standard"
                                            fullWidth
                                            value={item.file_name}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {item.file_name !== '' ? (
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                {dowloadFile && (
                                                                    <AttachFileIcon
                                                                        onClick={() => handleDowloadfile(item)}
                                                                        style={{
                                                                            fontSize: '16px',
                                                                            color: '#63c2de',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    />
                                                                )}
                                                                <DeleteIcon
                                                                    onClick={() => handleDelete(item)}
                                                                    style={{
                                                                        fontSize: '16px',
                                                                        color: 'orange',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    height: height ? height : '33px !important',
                                                    color: '#3a4c6b',
                                                    fontSize: '14px',
                                                    '& .MuiOutlinedInput-input': {
                                                        textOverflow: 'ellipsis',
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '.MuiFormHelperText-root': {
                                                    color: '#f44335 !important',
                                                    marginTop: '5px !important',
                                                    paddingLeft: '5px !important',
                                                    fontSize: '13px',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: helperText || errors ? '#e91e63 !important' : '#cbd5e0 !important',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#a0a0a0 !important',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        border: helperText || errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                                                    },
                                                },
                                            }}
                                        />
                                    );
                                })}
                        </Box>
                    )}
                </div>

                {checkSave && (
                    <MyButton
                        onClick={(event) => {
                            saveFile();
                        }}
                        style={{ height: '33px', width: '140px' }}
                        txt="Cập nhật"
                        icon={<SaveIcon />}
                    />
                )}
            </div>
        </div>
    );
});

export const MyDatePicker = ({ label, ...props }) => {
    const [value, setValue] = React.useState(props?.value ? new Date(props?.value * 1000) : null);
    useEffect(() => {
        if (props?.value) {
            setValue(new Date(props?.divide ? props?.value * 3600000 : props?.value * 1000));
        } else {
            setValue(null);
        }
    }, [props?.value]);

    const handleChange = (newValue) => {
        try {
            if (props?.range === 'from') {
                newValue.setHours(0, 0, 0, 0);
            } else if (props?.range === 'to') {
                newValue.setHours(23, 0, 0, 0);
            }
            setValue(newValue);
            props.onChange(Math.floor(newValue.getTime() / (props?.divide || 1000)));
        } catch {}
    };

    return (
        <LocalizationProvider adapterLocale={vi} dateAdapter={AdapterDateFns}>
            <Typography
                sx={{
                    marginBottom: label ? FontSize.LabelMarginBottom : '0px !important',
                    fontSize: FontSize.textFieldLabel,
                }}
                variant="body2"
                color={props.errors ? '#f44335' : '#000000b3'}
            >
                {label}
                {props.required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            <DesktopDatePicker
                className="DesktopDatePicker"
                disabled={props.disabled}
                maxDate={props.maxDate ? props.maxDate : new Date()}
                minDate={props.minDate ? props.minDate : new Date(1990, 1, 13)}
                value={value}
                inputFormat={props.inputFormat ? props.inputFormat : 'dd/MM/yyyy'}
                openTo={props.openTo ? props.openTo : 'day'}
                onChange={handleChange}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        height: '33px',
                        '& fieldset': {
                            borderColor: props.errors ? '#e91e63 !important' : '#cbd5e0 !important',
                        },
                        '&:hover fieldset': {
                            borderColor: '#a0a0a0 !important',
                        },
                        '&.Mui-focused fieldset': {
                            border: props.errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                        },
                    },
                }}
                slotProps={{
                    field: {
                        onClear: () => {
                            setValue(null);
                            props.onChange(null);
                        },
                        clearable: true,
                        inputProps: {
                            readOnly: props?.inputAble ? false : true,
                        },
                        // readOnly: true,
                    },
                }}
            />
            {/* {errorsMess} */}
        </LocalizationProvider>
    );
};
export const MyTimePicker = ({ value, label, views, disabled, range, onChange, divide, required, maxDate = null, minDate = null, ...props }) => {
    const [timeValue, setTimeValue] = React.useState(value ? new Date(value * 1000) : null);
    useEffect(() => {
        if (value) {
            setTimeValue(new Date(divide ? value * 3600000 : value * 1000));
        } else {
            setTimeValue(null);
        }
    }, [value]);

    const handleChange = (newValue) => {
        try {
            if (range === 'from') {
                newValue.setHours(0, 0, 0, 0);
            } else if (range === 'to') {
                newValue.setHours(23, 0, 0, 0);
            }
            setTimeValue(newValue);
            onChange(Math.floor(newValue.getTime() / (divide || 1000)));
        } catch {}
    };

    const errorsMess = props?.errors ? <span style={{ color: '#f44335', marginTop: 5, paddingLeft: 5, fontSize: 13 }}>{props?.errors || props?.helperText}</span> : null;
    return (
        <LocalizationProvider adapterLocale={vi} dateAdapter={AdapterDateFns}>
            <Typography
                sx={{
                    marginBottom: label ? FontSize.LabelMarginBottom : '0px !important',
                    fontSize: FontSize.textFieldLabel,
                }}
                variant="body2"
                color={props.errors ? '#f44335' : '#000000b3'}
            >
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            <DesktopTimePicker
                ampm={false}
                className="DesktopTimePicker"
                disabled={disabled}
                value={timeValue}
                onChange={handleChange}
                views={views}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        height: '33px',
                        backgroundColor: props?.backgroundColor || '#fff',
                        '& fieldset': {
                            borderColor: props.errors ? '#e91e63 !important' : '#cbd5e0 !important',
                        },
                        '&:hover fieldset': {
                            borderColor: '#a0a0a0 !important',
                        },
                        '&.Mui-focused fieldset': {
                            border: props.errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                        },
                    },
                }}
                slotProps={{
                    field: {
                        onClear: () => {
                            setTimeValue(null);
                            props.onChange(null);
                        },
                        clearable: true,
                        inputProps: {
                            readOnly: props?.inputAble ? false : true,
                        },
                        readOnly: props?.inputAble ? false : true,
                        // readOnly: true,
                    },
                }}
            />
            {errorsMess}
        </LocalizationProvider>
    );
};
export const MyDateTimePicker = ({ value, label, views, disabled, range, onChange, divide, required, maxDate = null, minDate = null, ...props }) => {
    const [dateValue, setDateValue] = React.useState(value ? new Date(value * 1000) : null);
    useEffect(() => {
        if (value) {
            setDateValue(new Date(divide ? value * 3600000 : value * 1000));
        } else {
            setDateValue(null);
        }
    }, [value]);

    const handleChange = (newValue) => {
        try {
            if (range === 'from') {
                newValue.setHours(0, 0, 0, 0);
            } else if (range === 'to') {
                newValue.setHours(23, 0, 0, 0);
            }
            setDateValue(newValue);
            onChange(Math.floor(newValue.getTime() / (divide || 1000)));
        } catch {}
    };
    return (
        <LocalizationProvider adapterLocale={vi} dateAdapter={AdapterDateFns}>
            <Typography
                sx={{
                    marginBottom: label ? FontSize.LabelMarginBottom : '0px !important',
                    fontSize: FontSize.textFieldLabel,
                }}
                variant="body2"
                color={props.errors ? '#f44335' : '#000000b3'}
            >
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
            <DateTimePicker
                ampm={false}
                className="DesktopDatePicker"
                disabled={disabled}
                maxDate={maxDate ? maxDate : new Date()}
                minDate={minDate ? minDate : new Date(1990, 1, 13)}
                value={dateValue}
                inputFormat={props.inputFormat ? props.inputFormat : 'dd/MM/yyyy'}
                openTo={props.openTo ? props.openTo : 'day'}
                onChange={handleChange}
                views={views}
                sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                        height: '33px',
                        backgroundColor: props?.backgroundColor || '#fff',
                        '& fieldset': {
                            borderColor: props.errors ? '#e91e63 !important' : '#cbd5e0 !important',
                        },
                        '&:hover fieldset': {
                            borderColor: '#a0a0a0 !important',
                        },
                        '&.Mui-focused fieldset': {
                            border: props.errors ? '1px solid #e91e63 !important' : '1px solid #1a73e8 !important',
                        },
                    },
                }}
                slotProps={{
                    field: {
                        onClear: () => {
                            setDateValue(null);
                            props.onChange(null);
                        },
                        clearable: true,
                        inputProps: {
                            readOnly: props?.inputAble ? false : true,
                        },
                        // readOnly: true,
                    },
                }}
            />
        </LocalizationProvider>
    );
};
export const UploadMultiFile = (props) => {
    const [listFile, setListFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const { file, handleChangeFile, saveFile, checkSave, accessToken, errors, helperText, required, multi } = props;

    useEffect(() => {
        if (file !== null) {
            setListFile(file);
        } else {
            setListFile([]);
        }
    }, [file]);

    const handleUploadMultFile = (event) => {
        setLoading(true);
        var checkFile = event.target.files;
        var formData = new FormData();
        if (checkFile && checkFile.length > 0) {
            for (let i = 0; i < checkFile.length; i++) {
                const fileUpload = checkFile[i];
                if (!fileUpload) return;
                formData.append('file', fileUpload);
            }
            new Api()
                .UploadFile({ token: accessToken, data: formData })
                .then((result) => {
                    if (result?.length > 0) {
                        if (multi === false) {
                            handleChangeFile([...result]);
                            setLoading(false);
                        } else {
                            handleChangeFile([...listFile, ...result]);
                            setLoading(false);
                        }
                    }
                })
                .catch((err) => {});
        }
    };
    const handleRemoveItem = (targetObj, array, field) => {
        return array.reduce((accumulator, currentObj) => {
            if (currentObj[field] === targetObj[field]) {
                return accumulator;
            } else {
                return [...accumulator, currentObj];
            }
        }, []);
    };

    const removeFile = (item) => {
        const newData = handleRemoveItem(item, listFile, 'file_path');
        setListFile(newData);
        handleChangeFile(newData);
    };

    const dowloadFile = (item) => {
        var data = {
            bucket_name: item.bucket_name,
            file_path: item.file_path,
            file_oid: item.file_oid,
            file_name: item.file_name,
        };
        new Api()
            .DownloadFile({ token: accessToken, data: data })
            .then((result) => {})
            .catch((err) => {});
    };
    return (
        <div>
            <MyTextFieldUploadMultiFile multi={multi} loading={loading} required={required} label={props.title ? props.title : 'Tên file'} data={listFile} handleDowloadfile={(item) => dowloadFile(item)} handleDelete={(item) => removeFile(item)} handleUploadfile={handleUploadMultFile} saveFile={saveFile} checkSave={checkSave} errors={errors} helperText={helperText} />
        </div>
    );
};
export const ViewFile = (props) => {
    const { file, accessToken, label } = props;

    const dowloadFile = (file) => {
        var data = {
            bucket_name: file?.bucket_name,
            file_path: file?.file_path,
            file_oid: file?.file_oid,
            file_name: file?.file_name,
        };
        new Api()
            .DownloadFile({ token: accessToken, data: data })
            .then((result) => {})
            .catch((err) => {});
    };
    return (
        <div>
            <Typography sx={{ marginBottom: FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={'#000000b3'}>
                {label}
            </Typography>
            <TextField
                variant="standard"
                fullWidth
                value={file?.file_name}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {file?.file_name !== '' ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {dowloadFile && (
                                        <AttachFileIcon
                                            onClick={() => dowloadFile(file)}
                                            style={{
                                                fontSize: '16px',
                                                color: '#63c2de',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <></>
                            )}
                        </InputAdornment>
                    ),
                    sx: {
                        height: '33px !important',
                        color: '#3a4c6b',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-input': {
                            textOverflow: 'ellipsis',
                        },
                    },
                }}
                sx={{
                    '.MuiFormHelperText-root': {
                        color: '#f44335 !important',
                        marginTop: '5px !important',
                        paddingLeft: '5px !important',
                        fontSize: '13px',
                    },
                    '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                            borderColor: '#a0a0a0 !important',
                        },
                        '&.Mui-focused fieldset': {
                            border: '1px solid #1a73e8 !important',
                        },
                    },
                }}
            />
        </div>
    );
};

export const MyMultiSelect = memo(function MyMultiSelect({ label, width, onChange, clearable, options, height, placeholder, required, helperText, errors, name, ...rest }) {
    const newOptions = useMemo(() => {
        const arr = Helper.filterAndKeepFirstDuplicate(options, name);
        return arr;
    }, [options, name]);

    const sxstyle = {
        '&.Mui-focused .MuiInputLabel-formControl': { top: -4, left: 5, marginRight: 0, paddingRight: 0 },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { paddingRight: '12px', paddingLeft: '8px', fontSize: '15px', borderWidth: '1px !important' },
        '&.css-1txtcdy-MuiAutocomplete-root .MuiOutlinedInput-root': { padding: '0px' },
        '& .MuiInputBase-input': { color: '#0c6cba', height: '20px', fontSize: FontSize.textField, '&::placeholder': { opacity: 0.5, color: '#3a4c6b' } },
        '.MuiInputLabel-formControl': { top: -6, fontSize: '14px' },
        '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#a0a0a0 !important' } },
        '&  .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
            padding: '4px',
            backgroundColor: '#ffffff',
        },
        '& .MuiOutlinedInput-notchedOutline ': {
            borderColor: '#cbd5e0 !important',
        },

        '.css-afbfrq-MuiButtonBase-root-MuiChip-root.Mui-disabled': {
            color: Appcolors.textFiledDisabled,
            opacity: 1,
        },
    };

    const requiredTypo = required ? (
        <Typography sx={{ marginBottom: label && FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
            {label}
            <span style={{ color: 'red' }}> *</span>
        </Typography>
    ) : (
        <Typography sx={{ marginBottom: label && FontSize.LabelMarginBottom, fontSize: FontSize.textFieldLabel }} variant="body2" color={errors ? '#f44335' : '#000000b3'}>
            {label}
        </Typography>
    );

    const renderOption = (props, option, { selected }) => (
        <li style={{ padding: 0, fontSize: '14px' }} {...props}>
            <Checkbox icon={<RadioButtonUncheckedIcon fontSize="small" />} checkedIcon={<CheckCircleIcon fontSize="small" />} style={{ marginRight: 0 }} checked={selected} />
            {typeof option === 'string' ? option : typeof option === 'object' ? option[name] : ''}
        </li>
    );

    const errorsMess = errors ? <span style={{ color: '#f44335', marginTop: 5, paddingLeft: 5, fontSize: 13 }}>{'Thông tin bắt buộc'}</span> : null;

    return (
        <div style={{ width: width }}>
            {requiredTypo}
            <Autocomplete
                size="small"
                multiple
                aria-required
                disableClearable={!clearable}
                sx={sxstyle}
                id="checkboxes-tags-demo"
                options={newOptions}
                popupIcon={<KeyboardArrowDownIcon style={{ color: '#8080808a', fontSize: '20px' }} />}
                disableCloseOnSelect
                filterSelectedOptions
                onChange={(option, value, reason, detail) => {
                    onChange(option, value, reason, detail);
                }}
                isOptionEqualToValue={(option, value) => isEqual(option, value)}
                getOptionLabel={(option) => (typeof option === 'string' ? option : typeof option === 'object' ? option[name] : '')}
                ListboxComponent={newOptions?.length > 100 ? ListBoxComponent : null}
                renderOption={renderOption}
                style={{ width: width }}
                renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
                {...rest}
            />
            {errorsMess}
        </div>
    );
});

export const PopConfirm = (props) => {
    const { open, handleClose, handleConfirm, title, content } = props;
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{title || 'Tiêu đề'}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content || 'Nội dung'}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Hủy
                </Button>
                <Button onClick={handleConfirm} autoFocus>
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export const MySelectButton = (props) => {
    return (
        <div style={{ width: '100%', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {props.select && props.select}
            {props.isButton && <AddCircleOutline style={{ height: '33px', width: '28px', cursor: 'pointer' }} className="capPhep-input-buttonAdd" onClick={props.onClick} />}
        </div>
    );
};
// NewUpdate HQ_Ver2 24/1/2024
// Collapse
export const HQCollapseForm = ({ title, children, defaultExpanded = false, ...props }) => {
    return (
        <div style={{ width: '100%' }}>
            <Accordion
                defaultExpanded={defaultExpanded}
                sx={{
                    boxShadow: 'none',
                    backgroundColor: props.backgroundColor || '#f2f2f2',
                    '& .expanded-min-height': {
                        minHeight: '46px',
                    },
                }}
                classes={{ expanded: 'expanded-min-height' }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                        padding: '0 16px 0 0',
                        '&:hover': {
                            backgroundColor: '#ccc',
                            borderRadius: '2px',
                            transition: 'background-color 0.5s ease',
                        },
                        '& .MuiAccordionSummary-content': {
                            marginY: '10px',
                        },
                        '& .myCustomExpaned': {
                            marginY: '10px',
                        },
                        '&.MuiAccordionSummary-root.myCustomExpaned': {
                            minHeight: '46px',
                        },
                    }}
                    classes={{ expanded: 'myCustomExpaned' }}
                >
                    <Typography variant="body2" style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", fontSize: '15px', paddingLeft: '5px' }}>
                        <strong style={{ display: 'flex' }}>
                            {title || 'Tiêu đề'}
                            {/* Notification when edit */}
                            <div style={{ marginLeft: '20px' }}>{}</div>
                        </strong>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>{children || 'Không có nội dung'}</AccordionDetails>
            </Accordion>
        </div>
    );
};
// Modal thêm nhanh
export const HQModalHotAdd = (props) => {
    const { title, handleClose, open, children, style, dataSet } = props;
    return (
        <Modal open={open} onClose={() => handleClose(false)} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box sx={{ width: '20vw', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 1, padding: 2, ...style }}>
                <Typography variant="h6" gutterBottom>
                    {title || 'Tiêu đề Modal'}
                </Typography>
                <Grid container spacing={1} direction="column" className="hq_modal_child_content">
                    {children || 'Nội dung Modal'}
                    {dataSet && (
                        <Grid item container mt={1} xs justifyContent={'flex-end'}>
                            <MyButton
                                txt="Thêm"
                                onClick={() => {
                                    // lấy data từ object modal
                                    const dumbData = dataSet?.propsForm.values[dataSet?.dummyKey];
                                    // nếu modal chuyên biệt để tạo đối tượng có mã định danh thì thêm status = new vào.
                                    if (dumbData?.maDinhDanh) {
                                        dumbData.status = 'new';
                                    }
                                    // Set value mới cho propsForm
                                    dataSet?.propsForm?.setFieldValue(dataSet?.key, dataSet?.multiple ? [...(dataSet?.key ? [] : dataSet?.key), dumbData] : dumbData);
                                    // Set mảng object mới
                                    dataSet?.setCurrent([dumbData, ...dataSet.current]);
                                    // reset dummy/dữ liệu giả
                                    dataSet?.propsForm?.setFieldValue(dataSet?.dummyKey, undefined);
                                    // Đóng modal
                                    handleClose(false);
                                }}
                                style={{ width: 120 }}
                                icon={<AddIcon />}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Modal>
    );
};
export const RowDetailTable = ({ title, data, hiddenEmpty = false, rowDefs = [], ...props }) => {
    return (
        <Grid container>
            {title && (
                <Grid item xs={12} container justifyContent={'flex-start'} fontWeight={'600'} fontSize={'17px'} paddingBottom={'12px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                    {title || 'Tiêu đề bảng'}
                </Grid>
            )}
            <Grid item xs={12} container direction="column">
                {rowDefs.map((row, index) => {
                    return (
                        <Grid key={index} item xs container direction="row" borderBottom="solid 1px #ccc" borderTop={index === 0 ? 'solid 1px #ccc' : ''}>
                            <Grid item xs={4} style={{ minWidth: '100px', height: '100%' }} padding="10px" justifyContent={'flex-start'} bgcolor={'#f2f2f2'} fontWeight={'600'} fontSize={'15px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                {row?.rowName}
                            </Grid>
                            <Grid item xs={8} style={{ minWidth: '100px' }} padding="10px" justifyContent={'flex-start'} fontSize={'15px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                {row?.rowRender ? row.rowRender(data?.[row?.dataIndex], data) : <div dangerouslySetInnerHTML={{ __html: (typeof data?.[row?.dataIndex] === 'string' && data?.[row?.dataIndex]?.replace(/\n/g, '<br/>')) || data?.[row?.dataIndex] || '-/-' }}></div>}
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};
export const ColDetailTable = ({ title, data = [], colDefs = [], ...props }) => {
    return (
        <Grid container>
            {title && (
                <Grid item xs={12} container justifyContent={'flex-start'} fontWeight={'600'} fontSize={'17px'} paddingBottom={'12px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                    {title || 'Tiêu đề bảng'}
                </Grid>
            )}
            <Grid item xs={12} container direction="row">
                {colDefs.map((col, headerIndex) => (
                    <Grid key={headerIndex} item width={col?.width} xs={col?.width ? false : true} container borderBottom="solid 1px #ccc">
                        <Grid item xs padding="10px" textAlign={col?.align} justifyContent={'flex-start'} bgcolor={'#f2f2f2'} fontWeight={'600'} fontSize={'15px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                            {col?.headerName}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
            {data?.length >= 1 ? (
                data?.map((value, rowIndex) => (
                    <Grid key={rowIndex} item xs={12} container direction="row">
                        {colDefs.map((col, colIndex) => (
                            <Grid key={colIndex} item width={col?.width} xs={col?.width ? false : true} container borderBottom="solid 1px #ccc">
                                <Grid item xs padding="10px" textAlign={col?.align} justifyContent={'flex-start'} fontSize={'15px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                    {value?.[col?.dataIndex] ? (col?.rowRender ? col.rowRender(value?.[col?.dataIndex], value) : value?.[col?.dataIndex]?.replace(/\n/g, '<br/>') || '-/-') : '-/-'}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                ))
            ) : (
                <Grid item xs={12} container direction="row" padding={'5px'} justifyContent="center">
                    Không có dữ liệu
                </Grid>
            )}
        </Grid>
    );
};

export const TableFile = ({ title, files = [], ...props }) => {
    const dowloadFile = (item) => {
        var data = {
            bucket_name: item.bucket_name,
            file_path: item.file_path,
            file_oid: item.file_oid,
            file_name: item.file_name,
        };
        new Api()
            .DownloadFile({ data: data })
            .then((result) => {})
            .catch((err) => {});
    };
    return (
        <Grid container>
            {title && (
                <Grid item xs={12} container justifyContent={'flex-start'} fontWeight={'600'} fontSize={'17px'} paddingBottom={'12px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                    {title || 'Tiêu đề bảng'}
                </Grid>
            )}
            <Grid item xs={12} container direction="row">
                <Grid item xs container borderBottom="solid 1px #ccc">
                    <Grid item xs padding="10px" justifyContent={'flex-start'} bgcolor={'#f2f2f2'} fontWeight={'600'} fontSize={'16px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                        Tên văn bản
                    </Grid>
                    <Grid item xs padding="10px" justifyContent={'flex-start'} bgcolor={'#f2f2f2'} fontWeight={'600'} fontSize={'16px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                        Nội dung văn bản
                    </Grid>
                    <Grid item xs padding="10px" justifyContent={'flex-start'} bgcolor={'#f2f2f2'} fontWeight={'600'} fontSize={'16px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                        Số trang quy đổi
                    </Grid>
                    <Grid item width={'140px'} padding="10px" textAlign={'center'} bgcolor={'#f2f2f2'} fontWeight={'600'} fontSize={'16px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                        File đính kèm
                    </Grid>
                </Grid>
            </Grid>
            {files?.length >= 1 ? (
                files?.map((value) => {
                    if (!isEmpty(value)) {
                        return (
                            <Grid item xs={12} container direction="row">
                                <Grid item xs container borderBottom="solid 1px #ccc">
                                    <Grid item xs padding="10px" justifyContent={'flex-start'} fontSize={'14px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                        {value?.tenVanBan || ''}
                                    </Grid>
                                    <Grid item xs padding="10px" justifyContent={'flex-start'} fontSize={'14px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                        {value?.noiDungDuLieu || ''}
                                    </Grid>
                                    <Grid item xs padding="10px" justifyContent={'flex-start'} fontSize={'14px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                        {value?.soTrangA4QuyDoi || ''}
                                    </Grid>
                                    <Grid item width={'140px'} padding="10px" textAlign={'center'} fontSize={'14px'} fontFamily={'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'}>
                                        <Download
                                            sx={{ color: '#168d42', cursor: 'pointer' }}
                                            onClick={() => {
                                                dowloadFile(value);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        );
                    } else {
                        return null;
                    }
                })
            ) : (
                <Grid item xs={12} container direction="row" padding={'5px'} justifyContent="center">
                    Không có tệp đính kèm
                </Grid>
            )}
        </Grid>
    );
};
// Auto submit formik search box
const AutoSubmitToken = ({ autoSubmit, ...props }) => {
    const { values, submitForm } = useFormikContext();
    useEffect(() => {
        if (autoSubmit) {
            submitForm();
        }
    }, [values, submitForm]);

    return null;
};
export const MySearchBox = ({ initialValues, formikRef, validationSchema, name, onSubmit, children, autoSubmit, saveFilter, clearFilter, loadingButton = false, defaultExpand = false, ...props }) => {
    /*
        - ClearFiltet và SaveFilter dành cho việc gọi hàm xóa lọc và lưu lọc
        - Children là thành phần search box khi expand
        - name là default key cho ô tìm kiếm chính searchbox vd: TuKhoa
        - defaultExpand là mặc định mở hay đóng cho search box
        - autoSubmit là tự động cập nhật/submit form khi có thay đổi
        - ValidateSchema là validate của form
        - inittialValues là giá trị khởi tạo và định nghĩa mặc định của form
    */
    const [expanded, setExpanded] = useState(false);
    const defaultValidationSchema = Yup.object({});
    const textInput = useRef(null);
    useEffect(() => {
        if (defaultExpand) {
            setExpanded(true);
        }
    }, [defaultExpand]);

    const handleExpand = () => {
        setExpanded(!expanded);
    };
    const handleClear = (setFieldValue, handleSubmit) => {
        textInput.current.value = '';
        setFieldValue(name || 'search', '');
    };
    const handleSubmitForm = (values) => {
        if (autoSubmit > 0) {
            debounceSubmit(values);
        } else {
            onSubmit(values);
        }
    };
    const debounceSubmit = debounce(async (values) => {
        onSubmit(values);
    }, autoSubmit || 0);
    return (
        <div style={{ marginBottom: '15px', width: '100%', height: 'fit-content' }}>
            <Formik initialValues={initialValues ? initialValues : { search: '' }} enableReinitialize innerRef={(f) => (formikRef.current = f)} onSubmit={(values) => handleSubmitForm(values)} validationSchema={validationSchema || defaultValidationSchema}>
                {({ handleSubmit, setFieldValue, handleChange, resetForm, values, errors, ...propsForm }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <Accordion expanded={expanded} sx={{ boxShadow: 'none' }}>
                                <AccordionSummary
                                    id="panel-header"
                                    aria-controls="panel-content"
                                    expandIcon={
                                        <Tooltip title={expanded ? 'Thu gọn' : 'Mở rộng'}>
                                            <ExpandMore onClick={handleExpand} />
                                        </Tooltip>
                                    }
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        padding: 0,
                                        '&.custom-focus-visible': {
                                            backgroundColor: 'white',
                                        },
                                    }}
                                    classes={{ focusVisible: 'custom-focus-visible' }}
                                >
                                    {/* Default search yêu cầu phải có name */}
                                    <FastField name={name || 'search'}>
                                        {({ field }) => (
                                            <TextField
                                                inputRef={textInput}
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                placeholder="Nhập từ khóa"
                                                InputProps={{
                                                    // startAdornment: (
                                                    //   <InputAdornment position="start">
                                                    //     <SearchIcon sx={{ fontSize: '18px' }} />
                                                    //   </InputAdornment>
                                                    // ),
                                                    endAdornment: <InputAdornment position="end">{<ClearIcon sx={{ display: values[name] ? 'block' : 'none', fontSize: '18px', cursor: 'pointer' }} onClick={() => handleClear(setFieldValue)} />}</InputAdornment>,
                                                    sx: {
                                                        backgroundColor: 'white',
                                                        height: props?.height ? props.height : '33px !important',
                                                        color: Appcolors.textFiled,
                                                        fontSize: FontSize.textField,
                                                        '& .MuiOutlinedInput-input': {
                                                            textOverflow: 'ellipsis',
                                                        },
                                                        '& .MuiOutlinedInput-input.Mui-disabled': {
                                                            WebkitTextFillColor: Appcolors.textFiledDisabled,
                                                        },
                                                    },
                                                }}
                                                sx={{
                                                    marginRight: '15px',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: '#cbd5e0 !important',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: '#a0a0a0 !important',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            border: '1px solid #1a73e8 !important',
                                                        },
                                                    },
                                                }}
                                                {...field}
                                            />
                                        )}
                                    </FastField>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        {props.customButton?.map((button, idx) => (
                                            <MyButton key={idx} txt={button?.title} width={button?.width || '100px'} onClick={button?.action} />
                                        ))}

                                        <MyButton loading={loadingButton} txt="Tìm kiếm" width={'100px'} type="submit" />
                                    </div>
                                    {/* <MyButton txt="Tìm kiếm" type="submit" width="100px" /> */}
                                </AccordionSummary>
                                {/* Expanded search */}
                                <AccordionDetails sx={{ padding: '8px 0 0' }}>
                                    {children && (
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <div style={{ flex: 1, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{typeof children === 'function' ? children({ handleSubmit, setFieldValue, handleChange, values, errors, ...propsForm }) : children}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginRight: '40px', marginLeft: '15px' }}>
                                                <MyButton
                                                    loading={loadingButton}
                                                    variant="outlined"
                                                    txt="Xóa lọc"
                                                    width={'100px'}
                                                    color="error"
                                                    onClick={async () => {
                                                        resetForm();
                                                        handleSubmit(values);
                                                        if (clearFilter) {
                                                            clearFilter(values);
                                                        }
                                                    }}
                                                />
                                                {saveFilter && (
                                                    <MyButton
                                                        loading={loadingButton}
                                                        txt="Lưu lọc"
                                                        width={'100px'}
                                                        onClick={async () => {
                                                            saveFilter(values);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                            <AutoSubmitToken autoSubmit={autoSubmit} />
                            {props?.showState && <DisplayFormikState values={values} errors={errors} />}
                        </form>
                    );
                }}
            </Formik>
        </div>
    );
};
