import 'react-toastify/dist/ReactToastify.css';

import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

import '../../styles/appbar.scss';
//draw sidebar
// const drawerWidth = 350;
const drawerWidth = 300;
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: '200ms',
    }),
    overflowX: 'hidden',
});
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: '200ms',
    }),
    overflowX: 'hidden',
    width: `72px`,
    [theme.breakpoints.up('sm')]: {
        width: `72px`,
    },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: '60px',
    padding: theme.spacing(0, 1),
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',

    boxSizing: 'border-box',
    '.css-12i7wg6-MuiPaper-root-MuiDrawer-paper': {
        backgroundColor: '#f6f8fc',
        border: 'none',
    },
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));
//
