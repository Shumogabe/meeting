import React, { useCallback, useEffect, useState } from 'react';
import { Box, Popover, Tooltip as TooltipMui, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import image_list from '../../assets/images/List_Up_Minimalistic.png';
import './index.scss';
export default function BieuDoCot({ data = [], title = 'Tiêu đề', name = 'name', value = 'value', handleThongKe, ...props }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortBy, setSortBy] = useState('ngày');

    useEffect(() => {
        if (handleThongKe) {
            handleThongKe({ months: sortBy === 'tháng' ? 24 : 0, years: sortBy === 'năm' ? 10 : 0, quarters: sortBy === 'quý' ? 12 : 0 });
        }
    }, [sortBy]);

    const RenderLegend = useCallback((props) => {
        const { payload } = props;
        return (
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                {payload.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', marginLeft: 50 }}>
                        <div
                            style={{
                                width: 20,
                                height: 8,
                                borderRadius: 10,
                                marginTop: 3,
                                marginRight: 5,
                                background: entry.color,
                            }}
                        ></div>
                        <div className="bieudocot-legend-label">Bản ghi</div>
                    </div>
                ))}
            </div>
        );
    }, []);
    const CustomTooltip = useCallback(({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#000000ba', borderRadius: 5, padding: 10, color: '#fff' }}>
                    <div>{`${label}`}</div>
                    <div>{`Tổng: ${payload[0].value}`}</div>
                </div>
            );
        }

        return null;
    }, []);
    const CustomTick = useCallback(
        (props) => {
            const { x, y, stroke, payload } = props;

            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor={data?.length > 12 ? 'end' : 'middle'} fill="#666" transform={data?.length > 12 ? 'rotate(-35)' : 'rotate(0)'} style={{ fontSize: '12px' }}>
                        {payload.value}
                    </text>
                </g>
            );
        },
        [data],
    );
    const handleDropDown = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, []);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 10px 10px 30px' }}>
                <div className="bieudocot-label">{title}</div>
                <TooltipMui title="Thống kê theo">
                    <div style={{ display: 'flex', cursor: 'pointer' }} onClick={handleDropDown}>
                        <div className="bieudocot-nam">{sortBy === 'ngày' ? '30 ngày gần nhất' : 'Theo ' + sortBy}</div>
                        <img src={image_list} style={{ filter: '#2b713a' }} alt="" />
                    </div>
                </TooltipMui>
            </div>
            {handleThongKe && (
                <Popover
                    sx={{ zIndex: 1200 }}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => {
                        setAnchorEl(null);
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    {['ngày', 'tháng', 'năm', 'quý'].map((value, index) => (
                        <Box
                            sx={{ ':hover': { backgroundColor: '#ccc' }, backgroundColor: sortBy === value ? '#c2c2c2' : '' }}
                            key={index}
                            onClick={() => {
                                setSortBy(value);
                            }}
                        >
                            <Typography sx={{ px: 2, py: 1, cursor: 'pointer', userSelect: 'none', ':hover': { backgroundColor: '$ccc' } }}>{'Theo ' + value}</Typography>
                        </Box>
                    ))}
                </Popover>
            )}
            <div style={{ height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        title={title}
                        desc="Mô tả"
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            bottom: 35,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={name} interval={0} height={60} dy={25} tick={<CustomTick />} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" align="right" content={<RenderLegend />} />
                        <Bar dataKey={value} fill="#2b713a" barSize={6} radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
