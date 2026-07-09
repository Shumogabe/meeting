import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { UserManager } from 'oidc-client';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CallbackComponent, processSilentRenew } from 'redux-oidc';
import { API_IDENTITY_URI, APP_REDIRECT_URL, APP_SILENT_REDIRECT_URL, CLIENT_ID } from './api2';

const userManagerConfig = {
    client_id: CLIENT_ID,
    redirect_uri: APP_REDIRECT_URL,
    response_type: 'id_token token',
    scope: 'openid profile CSCoreApi CSCore_NghiepVu_Api CSCore_DMS_Api CSCore_Spatial_Api CSCore_Ocelot_ApiGateway',
    authority: API_IDENTITY_URI,
    silent_redirect_uri: APP_SILENT_REDIRECT_URL,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
    monitorSession: true,
    post_logout_redirect_uri: APP_REDIRECT_URL,
};

export const userManager = new UserManager(userManagerConfig);

function CallBack(props) {
    let navigate = useNavigate();
    const successCallback = () => {
        var link = localStorage.getItem('CSCORE_LINK');
        navigate(link || '/');
    };

    const errorCallback = (err) => {
        console.error(err);
        navigate('/');
    };

    return (
        <CallbackComponent userManager={userManager} successCallback={successCallback} errorCallback={errorCallback}>
            <div className="flat">
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            </div>
        </CallbackComponent>
    );
}

const mapStateToProps = (state) => ({
    oidc: state.oidc.user,
});

export const OidcCallBack = connect(mapStateToProps)(CallBack);

export class OidcSilentRenew extends React.Component {
    componentDidMount() {
        processSilentRenew();
    }
    render() {
        return null;
    }
}
