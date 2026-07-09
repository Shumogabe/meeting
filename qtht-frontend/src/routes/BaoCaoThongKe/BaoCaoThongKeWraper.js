import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { MyBreadCrumbs } from '../../components';
import { DanhMucGroup } from './configMenu';
function BaoCaoThongKeWraper({ name, group, path, ...props }) {
    const groupData = useMemo(() => DanhMucGroup.find((vl) => vl.id === group), [group]);
    return (
        <div style={{ overflow: 'hidden' }}>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Báo cáo thống kê', link: `/bao-cao-thong-ke` }, { name: groupData.label, link: `/bao-cao-thong-ke/${group}` }, { name: name || 'Không tìm thấy chỉ mục' }]} />

            <Outlet name={name} />
        </div>
    );
}

export default BaoCaoThongKeWraper;
