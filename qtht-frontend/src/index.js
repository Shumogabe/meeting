import React from 'react';
import { viVN } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/index.scss';

const theme = createTheme(
    {
        palette: {
            success: {
                main: '#52c41a',
            },
            warning: {
                main: '#ff9800',
            },
            neutral: {
                main: '#64748B',
                contrastText: '#fff',
            },
            error: {
                main: '#ef5350',
            },
            primary: { main: '#2b713a' },
            // secondary: { main: '' },
        },
    },
    viVN,
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
            <App />
        </SnackbarProvider>
    </ThemeProvider>,
);
