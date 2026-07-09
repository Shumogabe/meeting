import React, { useEffect, useState } from 'react';
import '../../styles/trangchu.scss';

export default function TrangChu() {
    const [dataThongKe, setdataThongKe] = useState(null);
    const [loading, setloading] = useState(false);
    useEffect(() => {
        GetThongKeTrangChu();
    }, []);
    const GetThongKeTrangChu = async () => {};
    const RefreshData = async () => {};

    return <div className="body-trangchu"></div>;
}
