import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import image_list from '../../assets/images/List_Up_Minimalistic.png';
import '../../styles/trangchu.scss';

export default function BieuDoTron({ thisYear }) {
    const [Data, setData] = useState([]);

    return (
        <div className="thongke-main" style={{ height: 400, minWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 10px 10px 30px' }}>
                <div className="bieudocot-label">Tỷ trọng</div>
                <div style={{ display: 'flex' }}>
                    <div className="bieudocot-nam">Năm nay</div>
                    <img src={image_list} style={{ filter: 'invert(55%) sepia(86%) saturate(310%) hue-rotate(359deg) brightness(90%) contrast(100%)' }} />
                </div>
            </div>
            <Grid container>
                <Grid item md lg xs={12}>
                    <PieChart width={250} height={300}>
                        <Pie data={Data} innerRadius={70} fill="#8884d8" paddingAngle={0} dataKey="value">
                            {Data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </Grid>
                <Grid item md lg xs={12}>
                    <div className="bieudotron">
                        {Data.map((entry, index) => (
                            <div style={{ display: 'flex' }}>
                                <div style={{ display: 'flex' }}>
                                    <div
                                        style={{
                                            width: 20,
                                            height: 8,
                                            borderRadius: 10,
                                            marginTop: 6,
                                            marginRight: 20,
                                            background: entry.color,
                                        }}
                                    ></div>
                                    <div className="bieudotron-chuthich">{entry.name}</div>
                                </div>
                                <div className="bieudotron-chuthich-solieu">{((entry.value / entry.total) * 100).toFixed() + '%'}</div>
                            </div>
                        ))}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
