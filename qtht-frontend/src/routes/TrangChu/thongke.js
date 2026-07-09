import Grid from '@mui/material/Grid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import coSoSanXuatIcon from '../../assets/images/coSoSanXuatIcon.png';
import duAnIcon from '../../assets/images/duAnIcon.png';
import khuSanXuatIcon from '../../assets/images/khuSanXuatIcon.png';
import langNgheIcon from '../../assets/images/langNgheIcon.png';
import image_people from '../../assets/images/people.png';
import '../../styles/trangchu.scss';

export default function ThongKe({ dataThongKe }) {
    let navigate = useNavigate();

    return (
        <Grid container className="thongke-main">
            <Grid item style={{ width: '20%' }}>
                <div className="thongke-component">
                    <div className="thongke-icon">
                        <img src={image_people} style={{ width: 35, height: 35 }} />
                    </div>
                    <div>
                        <div onClick={() => navigate('/chudautu')} className="thongke-number">
                            {dataThongKe?.chuDauTu}
                        </div>
                        <div className="thongke-title">Chủ đầu tư</div>
                    </div>
                </div>
            </Grid>
            <Grid item style={{ width: '20%' }}>
                <div className="thongke-component">
                    <div className="thongke-icon">
                        <img src={duAnIcon} style={{ width: 35, height: 35 }} />
                    </div>
                    <div>
                        <div onClick={() => navigate('/duan')} className="thongke-number">
                            {dataThongKe?.duAn}
                        </div>
                        <div className="thongke-title">Dự án</div>
                    </div>
                </div>
            </Grid>
            <Grid item style={{ width: '20%' }}>
                <div className="thongke-component">
                    <div className="thongke-icon">
                        <img src={coSoSanXuatIcon} style={{ width: 35, height: 35 }} />
                    </div>
                    <div>
                        <div onClick={() => navigate('/cososanxuatkinhdoanh')} className="thongke-number">
                            {dataThongKe?.cssx}
                        </div>
                        <div className="thongke-title">Cơ sở SXKDDV</div>
                    </div>
                </div>
            </Grid>
            <Grid item style={{ width: '20%' }}>
                <div className="thongke-component">
                    <div className="thongke-icon">
                        <img src={khuSanXuatIcon} style={{ width: 35, height: 35 }} />
                    </div>
                    <div>
                        <div onClick={() => navigate('/khuSXKDDVTT')} className="thongke-number">
                            {dataThongKe?.ksx}
                        </div>
                        <div className="thongke-title">Khu SXKDDVTT</div>
                    </div>
                </div>
            </Grid>
            <Grid item style={{ width: '20%' }}>
                <div className="thongke-component">
                    <div className="thongke-icon">
                        <img src={langNgheIcon} style={{ width: 35, height: 35 }} />
                    </div>
                    <div>
                        <div onClick={() => navigate('/langnghe')} className="thongke-number">
                            {dataThongKe?.langNghe}
                        </div>
                        <div className="thongke-title">Làng nghề</div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}
