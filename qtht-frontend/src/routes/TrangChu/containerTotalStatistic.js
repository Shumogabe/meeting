import React, { Component } from 'react';
import '../../../styles/trangchu.scss';

export default class ContainerTotalStatistic extends Component {
    render() {
        const { functions } = this.props;
        return (
            <div style={{ minWidth: 1115 }} type="flex" justify="space-between" align="middle">
                <div span={8} className="div-dashboard">
                    <BoxTotalStatistic />
                </div>
            </div>
        );
    }
}

class BoxTotalStatistic extends Component {
    setImg = (item) => {
        // if (item === 'XẢ THẢI') {
        //     return XaThai
        // } else if (item === 'NƯỚC MẶT') {
        //     return NuocMat
        // } else if (item === 'NƯỚC BIỂN') {
        //     return NuocBien
        // } else if (item === 'KHAI THÁC NƯỚC DƯỚI ĐẤT') {
        //     return NDD
        // } else if (item === 'THĂM DÒ NƯỚC DƯỚI ĐẤT') {
        //     return NDD
        // } else if (item === 'HÀNH NGHỀ KHOAN NƯỚC') {
        //     return HanhNghe
        // }
    };
    render() {
        const { data } = this.props;
        return (
            <div>
                <div
                    style={{
                        backgrounddivor: '#CFE9F6 ',
                        borderRadius: 4,
                        maxWidth: '240px',
                        margin: 10,
                        float: 'left',
                    }}
                >
                    <div className="box-dashboard">
                        <div type="flex" style={{ borderBottom: '2px solid #fff', paddingBottom: 10 }}>
                            <div span={16} style={{ paddingLeft: 10 }}>
                                <div>
                                    <div className="title-dashboard">Tổng số đơn vị quan trắc</div>
                                    <div className="value-dashboard">100</div>
                                </div>
                                <div>
                                    {/* <div span={12} >
                                    <div type="flex" className="link hover-transform" >
                                        <div className="title-chil">xin chào</div>
                                        <div className="value-chil" style={{paddingLeft: 5}}>xin chào1</div>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgrounddivor: '#CFE9F6 ',
                        borderRadius: 4,
                        maxWidth: '240px',
                        margin: 10,
                        float: 'left',
                    }}
                >
                    <div className="box-dashboard">
                        <div type="flex" style={{ borderBottom: '2px solid #fff', paddingBottom: 10 }}>
                            <div span={16} style={{ paddingLeft: 10 }}>
                                <div>
                                    <div className="title-dashboard">Tổng số khu sản xuất</div>
                                    <div className="value-dashboard">100</div>
                                </div>
                                <div>
                                    {/* <div span={12} >
                                    <div type="flex" className="link hover-transform" >
                                        <div className="title-chil">xin chào</div>
                                        <div className="value-chil" style={{paddingLeft: 5}}>xin chào1</div>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        backgrounddivor: '#CFE9F6 ',
                        borderRadius: 4,
                        maxWidth: '240px',
                        margin: 10,
                        float: 'left',
                    }}
                >
                    <div className="box-dashboard">
                        <div type="flex" style={{ borderBottom: '2px solid #fff', paddingBottom: 10 }}>
                            <div span={16} style={{ paddingLeft: 10 }}>
                                <div>
                                    <div className="title-dashboard">Tổng số CSSXKD Dịch vụ</div>
                                    <div className="value-dashboard">100</div>
                                </div>
                                <div>
                                    {/* <div span={12} >
                                    <div type="flex" className="link hover-transform" >
                                        <div className="title-chil">xin chào</div>
                                        <div className="value-chil" style={{paddingLeft: 5}}>xin chào1</div>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        backgrounddivor: '#CFE9F6 ',
                        borderRadius: 4,
                        maxWidth: '240px',
                        margin: 10,
                        float: 'left',
                    }}
                >
                    <div className="box-dashboard">
                        <div type="flex" style={{ borderBottom: '2px solid #fff', paddingBottom: 10 }}>
                            <div span={16} style={{ paddingLeft: 10 }}>
                                <div>
                                    <div className="title-dashboard">Thanh tra kiểm tra</div>
                                    <div className="value-dashboard">100</div>
                                </div>
                                <div>
                                    {/* <div span={12} >
                                    <div type="flex" className="link hover-transform" >
                                        <div className="title-chil">xin chào</div>
                                        <div className="value-chil" style={{paddingLeft: 5}}>xin chào1</div>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        backgrounddivor: '#CFE9F6 ',
                        borderRadius: 4,
                        maxWidth: '240px',
                        margin: 10,
                        float: 'left',
                    }}
                >
                    <div className="box-dashboard">
                        <div type="flex" style={{ borderBottom: '2px solid #fff', paddingBottom: 10 }}>
                            <div span={16} style={{ paddingLeft: 10 }}>
                                <div>
                                    <div className="title-dashboard">Tổng số đề án, dự án DTM</div>
                                    <div className="value-dashboard">100</div>
                                </div>
                                <div>
                                    {/* <div span={12} >
                                    <div type="flex" className="link hover-transform" >
                                        <div className="title-chil">xin chào</div>
                                        <div className="value-chil" style={{paddingLeft: 5}}>xin chào1</div>
                                    </div>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
