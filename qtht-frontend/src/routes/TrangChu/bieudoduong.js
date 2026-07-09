import React, { useEffect, useState } from 'react';
import image_list from '../../assets/images/List_Up_Minimalistic.png';
import '../../styles/trangchu.scss';

import { Area, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const data = Array.apply(null, Array(12)).map((array, index) => ({
    name: `${index + 1}`,
    uv: 0,
}));

export default function Bieudoduong({ thisYear }) {
    const [dataThisYear, setDataThisYear] = useState([]);
    useEffect(() => {
        setDataThisYear([]);
    }, [thisYear]);
    const RenderLegend = (props) => {
        const { payload } = props;
        return (
            <div style={{ display: 'flex', justifyContent: 'start', marginTop: 20 }}>
                {payload.map((entry, index) => (
                    <div style={{ display: 'flex', marginLeft: 50 }}>
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
                        <div className="bieudocot-legend-label">Đã hoàn thành</div>
                    </div>
                ))}
            </div>
        );
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#000000ba', borderRadius: 5, padding: 10, color: '#fff' }}>
                    <div>{label}</div>
                    <div>{`Khu vực triển khai: ${payload[0].value}`}</div>
                </div>
            );
        }

        return null;
    };
    return (
        <div container className="thongke-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 10px 10px 30px' }}>
                <div className="bieudocot-label">Khu vực triển khai</div>
                <div style={{ display: 'flex' }}>
                    <div className="bieudocot-nam">Năm nay</div>
                    <img src={image_list} style={{ filter: 'invert(55%) sepia(86%) saturate(310%) hue-rotate(359deg) brightness(90%) contrast(100%)' }} />
                </div>
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                    <ComposedChart
                        data={dataThisYear}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cd9a44" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#cd9a44" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" align="left" content={<RenderLegend />} />
                        <Area type="monotone" dataKey="uv" fill="url(#colorUv)" stroke="#cd9a44" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
