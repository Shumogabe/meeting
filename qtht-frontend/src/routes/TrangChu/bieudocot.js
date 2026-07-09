import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import image_list from '../../assets/images/List_Up_Minimalistic.png';
import '../../styles/trangchu.scss';
const data = Array.apply(null, Array(12)).map((array, index) => ({
    name: `${index + 1}`,
    uv: 0,
}));
const data_dulieu = [
    {
        name: '2010',
        uv: 4000000,
    },
    {
        name: '2011',
        uv: 3000000,
    },
    {
        name: '2012',
        uv: 6000000,
    },
    {
        name: '2013',
        uv: 8000000,
    },
    {
        name: '2014',
        uv: 3678000,
    },
    {
        name: '2015',
        uv: 5065200,
    },
];
export default function BieuDoCot({ dataThongKe }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (dataThongKe) setData(dataThongKe.tongTienNopPhi_TheoNam ? dataThongKe?.tongTienNopPhi_TheoNam : []);
    }, [dataThongKe]);
    const RenderLegend = (props) => {
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
                        <div className="bieudocot-legend-label">Tổng tiền</div>
                    </div>
                ))}
            </div>
        );
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#000000ba', borderRadius: 5, padding: 10, color: '#fff' }}>
                    <div>{`Năm ${label}`}</div>
                    <div>{`Tổng tiền: ${payload[0].value}`}</div>
                </div>
            );
        }

        return null;
    };
    return (
        <div className="thongke-main" style={{ height: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 10px 10px 30px' }}>
                <div className="bieudocot-label">TỔNG TIỀN THU THEO NĂM</div>
                <div style={{ display: 'flex' }}>
                    <div className="bieudocot-nam">Năm nay</div>
                    <img src={image_list} style={{ filter: '#2b713a' }} alt="" />
                </div>
            </div>
            <div style={{ height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" align="right" content={<RenderLegend />} />
                        <Bar dataKey="uv" fill="#2b713a" barSize={6} radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
