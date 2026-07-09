import React from 'react';
import { PropTypes } from 'prop-types';
import { useLocation } from 'react-router-dom';
import NotFound from '../../components/404';

function AuthenLayout({ auth, children }) {
    const location = useLocation();
    // current path name
    const currentPath = location.pathname;
    // authen here
    if (auth) {
        return <>{children}</>;
    } else {
        return <NotFound isAuth={auth} />;
    }
}
AuthenLayout.propTypes = {
    children: PropTypes.node.isRequired,
    auth: PropTypes.bool.isRequired,
};
export default AuthenLayout;
