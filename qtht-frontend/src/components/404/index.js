import React from 'react';
import { KeyboardBackspaceOutlined, SentimentVeryDissatisfied } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound({ is404 = false, isAuth = true, ...props }) {
    return (
        <div style={{ width: '100%', height: 'calc(100vh - 200px)', marginTop: '40px' }}>
            <div style={{ width: '100%', height: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <SentimentVeryDissatisfied color="disabled" sx={{ fontSize: '200px' }} />
                <div style={{ position: 'absolute', bottom: '-70px', left: 0, right: 0, textAlign: 'center' }}>
                    <Typography fontSize="60px" fontWeight={'bold'} textTransform="uppercase" color="#bdbdbd">
                        {isAuth ? (is404 ? '404' : 'NOT FOUND!') : 'UNAUTHENTICATED'}
                    </Typography>
                </div>
            </div>
            <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                <div style={{ color: '#7a757d' }}>{isAuth ? (is404 ? 'Không tìm thấy trang hoặc trang không tồn tại.' : 'Không tìm thấy bản ghi, bản ghi không tồn tại hoặc đã xóa.') : 'Không có quyền truy cập!'}</div>
                <div style={{ color: '#7a757d' }}>{'Liên hệ đội ngũ hỗ trợ để có câu trả lời sớm nhất, xin lỗi vì sự bất tiện này !'}</div>
            </div>
            <div style={{ width: '100%', height: 'fit-content', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                {isAuth ? (
                    <Tooltip title="Trở về trang trước">
                        <Link to={-1}>
                            <KeyboardBackspaceOutlined color="disabled" sx={{ fontSize: '150px', ':hover': { color: '#7a757d', cursor: 'pointer' } }} />
                        </Link>
                    </Tooltip>
                ) : (
                    <Tooltip title="Đăng nhập">
                        {!isAuth && (
                            <Link to={'/logout'}>
                                <KeyboardBackspaceOutlined color="disabled" sx={{ fontSize: '150px', ':hover': { color: '#7a757d', cursor: 'pointer' } }} />
                            </Link>
                        )}
                    </Tooltip>
                )}
            </div>
        </div>
    );
}

export default NotFound;
