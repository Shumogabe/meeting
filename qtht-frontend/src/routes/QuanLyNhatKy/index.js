import React, { useEffect } from 'react';
import { Check, GridView, MoreVert, RestartAltOutlined, Search, TextRotateVertical, ViewHeadline } from '@mui/icons-material';
import { Autocomplete, Box, Grid, IconButton, InputAdornment, OutlinedInput, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Formik, useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { MyBreadCrumbs } from '../../components';
import Helper from '../../helpers';
import { commonReducerSelector, userSelector } from '../../redux/selector';
import { QuanLyNhatKyConfig, QuanLyNhatKyGroup } from './configMenu';
import './index.scss';
export default function QuanLyNhatKy() {
    const [formList, setFormList] = React.useState(QuanLyNhatKyConfig);
    const [menuType, setMenuType] = React.useState('row');
    const [loading, setLoading] = React.useState(false);
    const [initialValue, setInitialValue] = React.useState({ tuKhoa: '', nhomDanhMuc: null, sortBy: false });
    const formikRef = React.useRef(null);
    const validationSchema = Yup.object({});
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(userSelector);
    const common = useSelector(commonReducerSelector);
    useEffect(() => {
        if (id) {
            const danhMuc = QuanLyNhatKyGroup?.find((vl) => vl.id === id);
            formikRef.current?.setFieldValue('nhomDanhMuc', danhMuc);
        } else {
            formikRef.current?.setFieldValue('nhomDanhMuc', null);
        }
    }, [id]);

    return (
        <div>
            <div style={{ width: '100%' }}>
                <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý nhật ký', link: `/quan-ly-nhat-ky` }]} />
            </div>
            <div className="form-list__container">
                <div className="form-list__container--box">
                    <Formik initialValues={initialValue} innerRef={formikRef} validationSchema={validationSchema}>
                        {({ handleSubmit, setFieldValue, handleChange, resetForm, values, errors, ...propsForm }) => {
                            return (
                                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
                                    <OutlinedInput
                                        name={'tuKhoa'}
                                        placeholder="Tìm kiếm nhật ký"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Search stroke={1.5} size="1rem" />
                                            </InputAdornment>
                                        }
                                        value={values?.tuKhoa || ''}
                                        onChange={handleChange}
                                        // onInput={(e) => handleInput(e.target.value)}
                                        sx={{
                                            width: 800,
                                            height: 50,
                                            backgroundColor: '#E9EEF6',
                                            borderRadius: '20px',
                                        }}
                                    />
                                    <Box display="flex" width="100%" justifyContent="center" pt={2} gap={1}>
                                        <Autocomplete
                                            disablePortal
                                            options={QuanLyNhatKyGroup || []}
                                            value={values?.nhomDanhMuc}
                                            onChange={(e, value) => {
                                                setFieldValue('nhomDanhMuc', value || null);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{
                                                        borderRadius: '20px',
                                                        '& .MuiOutlinedInput-root': {
                                                            padding: '1px',
                                                            paddingLeft: '9px',
                                                        },
                                                    }}
                                                    {...params}
                                                    label="Phân loại"
                                                    variant="outlined"
                                                />
                                            )}
                                            renderOption={(props, option, { selected }) => {
                                                return (
                                                    <li {...props}>
                                                        <Typography color={'#344767e3'} sx={{ fontSize: '14px', display: 'flex', gap: '5px', verticalAlign: 'middle' }}>
                                                            <span>{option.icon}</span>
                                                            {option?.label || option?.name || option}
                                                        </Typography>
                                                    </li>
                                                );
                                            }}
                                            sx={{
                                                width: 250,
                                                borderRadius: '20px !important',
                                                backgroundColor: '#E9EEF6',
                                                color: '#265151',
                                                '& .MuiFormLabel-root': {
                                                    top: '-6px',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '20px !important',
                                                },
                                            }}
                                        />
                                        <Tooltip title="Sắp xếp từ A-Z">
                                            <IconButton
                                                onClick={() => {
                                                    setFieldValue('sortBy', !values?.sortBy);
                                                }}
                                                sx={{ color: values?.sortBy ? '#228b22' : '' }}
                                            >
                                                <TextRotateVertical />
                                            </IconButton>
                                        </Tooltip>
                                        {/* <Tooltip title="Sắp xếp từ A-Z">
                                            <Button variant="outlined" onClick={() => setFieldValue('sortBy', !values?.sortBy)} sx={{ backgroundColor: values?.sortBy ? '#d4e9df' : '', borderRadius: '20px' }}>
                                                <TextRotateVertical />
                                            </Button>
                                        </Tooltip> */}
                                        <Tooltip title="Xóa lọc">
                                            <IconButton
                                                onClick={() => {
                                                    resetForm();
                                                    setFormList(QuanLyNhatKyConfig);
                                                    navigate('/bao-cao-thong-ke');
                                                }}
                                            >
                                                <RestartAltOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Grid my={2} container width="100%" alignItems="center" columnSpacing={1}>
                                        <Grid item xs container justifyContent="flex-end">
                                            <Tooltip title="Dạng dòng">
                                                <Button variant="outlined" startIcon={menuType === 'row' && <Check />} onClick={() => setMenuType('row')} sx={{ backgroundColor: menuType === 'row' ? '#d4e9df' : '', borderRadius: '0', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                                    <ViewHeadline />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Dạng lưới">
                                                <Button variant="outlined" startIcon={menuType === 'grid' && <Check />} onClick={() => setMenuType('grid')} sx={{ backgroundColor: menuType === 'grid' ? '#d4e9df' : '', borderRadius: '0', borderTopRightRadius: '20px', borderBottomRightRadius: '20px', marginLeft: '-1px' }}>
                                                    <GridView />
                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="flex-end" gap={1}>
                                        <span style={{ fontWeight: '500' }}>Tổng số nhật ký:</span> <span style={{ fontWeight: 'bold', color: '#228b22' }}>{formList?.length || 0}</span>
                                    </Grid>
                                    <AutoFilterForm setFormList={setFormList} formList={formList} />
                                    {/* <DisplayFormikState values={values} errors={errors} />; */}
                                </form>
                            );
                        }}
                    </Formik>
                </div>

                {/* Menu */}
                {/* Menu */}
                <div className="form-list__container--content">
                    {menuType === 'row' ? (
                        <div className="base-row">
                            <div className="base-row__header">
                                <div className="name">Tên nhật ký</div>
                                <div className="group">Phân loại</div>
                            </div>
                            {formList.map((form, index) => (
                                <FormGrid key={uuidv4()} data={form} dataSearch={formikRef.current?.values.tuKhoa || ''} />
                            ))}
                        </div>
                    ) : (
                        <div className="base-grid">
                            {formList.map((form, index) => (
                                <FormCard key={uuidv4()} data={form} dataSearch={formikRef.current?.values.tuKhoa || ''} />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {!formList?.length > 0 && (
                        <div className="form-list__container--empty">
                            {formikRef.current?.values?.tuKhoa ? (
                                <span>
                                    Không tìm thấy nhật ký phù hợp với từ khóa
                                    <span
                                        style={{
                                            color: '#0ea5e9',
                                        }}
                                    >
                                        "{formikRef.current?.values.tuKhoa || ''}"
                                    </span>
                                </span>
                            ) : (
                                <span>Hiện không có nhật ký nào thuộc nhóm này.</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
const AutoFilterForm = ({ setFormList, formList, ...rest }) => {
    const { values, submitForm } = useFormikContext();
    useEffect(() => {
        formListSearch(values.tuKhoa, values.nhomDanhMuc, values?.sortBy);
    }, [values, submitForm]);
    // Input search
    const formListSearch = (value, danhMuc, sortBy) => {
        if (value?.length > 0 || danhMuc || sortBy) {
            let data = QuanLyNhatKyConfig.filter((form) => {
                return chuyenDoiTiengViet(form.name).includes(chuyenDoiTiengViet(value));
            }).filter((form) => {
                if (danhMuc?.id) {
                    return form?.group === danhMuc?.id;
                } else {
                    return true;
                }
            });
            if (data?.length > 0 && sortBy) {
                data = sortByPropertyName(data, 'name');
            }

            setFormList(data);
        } else {
            setFormList(QuanLyNhatKyConfig);
        }
    };
    function sortByPropertyName(arr, propertyName) {
        return arr.sort((a, b) => {
            const nameA = a[propertyName].trim().toLowerCase(); // Chuyển thành chữ thường để so sánh
            const nameB = b[propertyName].trim().toLowerCase(); // Chuyển thành chữ thường để so sánh

            // Sử dụng localeCompare để so sánh chuỗi tiếng Việt
            return nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
        });
    }
    // const debounceSearch = (value) => {
    //     formListSearch(value);
    // };
    // const handleInput = lodash.debounce(debounceSearch, 200);
    return null;
};
const FakeContent = ({ randomData = 16 }) => {
    return (
        <Stack width="100%" alignItems="center">
            <Stack width="80%" direction="row" justifyContent="space-between">
                <Stack alignItems="center">
                    <span>..............................</span>
                    <span>...................</span>
                </Stack>
                <Stack alignItems="center">
                    <span>..............................</span>
                    <span>...................</span>
                </Stack>
            </Stack>
            <Stack alignItems="center" mt={2}>
                <span>..............................</span>
            </Stack>
            <Stack width="80%" direction="row" justifyContent="space-between" mt={1} gap={1} flexWrap="wrap">
                {new Array(randomData).fill(0).map((_, index) => (
                    <Stack alignItems="center" key={index}>
                        <span style={{ marginRight: 'auto' }}>.....</span>
                        <span>..............................</span>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};
const FormGrid = React.memo(({ data, dataSearch }) => {
    const randomData = React.useMemo(() => {
        return Math.floor(Math.random() * 10) + 5;
    }, []);
    const group = React.useMemo(() => {
        return QuanLyNhatKyGroup?.find((vl) => vl?.id === data?.group);
    }, [data]);
    const formattedName = React.useMemo(() => {
        return highlightSearchTerm(data?.name, dataSearch);
    }, [data, dataSearch]);

    return (
        <NavLink to={`/quan-ly-nhat-ky/${data?.path}`} className="base-row__item">
            <div className="name">
                <span>{group?.icon}</span>
                {data?.name && dataSearch ? <span dangerouslySetInnerHTML={{ __html: formattedName }} /> : <span>{data?.name}</span>}
            </div>
            <div className="group">{group?.label}</div>
        </NavLink>
    );
});
const FormCard = React.memo(({ data, dataSearch }) => {
    const randomData = React.useMemo(() => {
        return Math.floor(Math.random() * 10) + 5;
    }, []);
    const group = React.useMemo(() => {
        return QuanLyNhatKyGroup?.find((vl) => vl?.id === data?.group);
    }, [data]);
    const formattedName = highlightSearchTerm(data?.name, dataSearch);
    return (
        <NavLink to={`/quan-ly-nhat-ky/${data?.path}`} className="form-card">
            <div className="form-card__top">
                <div className="item">
                    <span style={{ color: Helper.generateColorFromString(group.label) }}>{group?.icon}</span>
                    <div className="form-card__bottom">
                        <div className="name">{data?.name && dataSearch ? <span dangerouslySetInnerHTML={{ __html: formattedName }} /> : <span>{data?.name}</span>}</div>
                    </div>
                </div>
                <div>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            // không chuyển trang
                        }}
                    >
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="form-card__body">
                <FakeContent randomData={randomData} />
                {/* <img
                    src={data?.img}
                    alt="Aảnh xem trước biểu mẫu"
                    loading="lazy"
                    style={{
                        height: 150,
                        width: '100%',
                        paddingTop: 5,
                        paddingLeft: 2,
                        paddingRight: 2,
                        borderRadius: 10,
                    }}
                /> */}
            </div>
        </NavLink>
    );
});
// Helper Func
function chuyenDoiTiengViet(str) {
    // Chuyển đổi tiếng Việt có dấu thành tiếng Việt không dấu
    str = str.toLowerCase();
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/[đ]/g, 'd');
    str = str.replace(/[Đ]/g, 'D');
    str = str.replace(/[Đ]/g, 'D');
    return str;
}

function highlightSearchTerm(name, searchTerm) {
    if (!searchTerm) {
        return name;
    }

    const normalizedSearchTerm = chuyenDoiTiengViet(searchTerm);
    const highlightedName = name
        .split(' ')
        .map((word) => (normalizedSearchTerm?.includes(chuyenDoiTiengViet(word)) ? `<span class="highlight">${word}</span>` : word))
        .join(' ');

    return highlightedName;
}
