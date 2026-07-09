import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { MyBreadCrumbs } from '../../components';
import { QuanLyNhatKyGroup } from './configMenu';
function QuanLyNhatKyWraper({ name, group, path, ...props }) {
    const groupData = useMemo(() => QuanLyNhatKyGroup.find((vl) => vl.id === group), [group]);
    return (
        <div style={{ overflow: 'hidden' }}>
            <MyBreadCrumbs title={[{ name: 'Vận hành' }, { name: 'Quản lý nhật ký', link: `/quan-ly-nhat-ky` }, { name: name || 'Không tìm thấy chỉ mục' }]} />

            <Outlet name={name} />
        </div>
    );
}

export default QuanLyNhatKyWraper;
