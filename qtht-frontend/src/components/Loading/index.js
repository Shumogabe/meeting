import React from 'react';
import { CircularProgress, Grid, LinearProgress, Skeleton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './index.scss';
function LoadingComponent({ type, ...props }) {
    if (!type) return null;
    switch (type) {
        case 'circular':
            return (
                <div className="loading-component-wrapper-circular">
                    <CircularProgress />
                </div>
            );
        case 'linear':
            return (
                <div>
                    <LinearProgress />
                </div>
            );
        case 'skeleton':
            return (
                <Grid container direction="column" rowSpacing={1}>
                    <Grid item xs container columnSpacing={1}>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h1" lineHeight="1">
                            <Skeleton />
                        </Typography>
                    </Grid>
                    <Grid item xs container columnSpacing={1}>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs container columnSpacing={1}>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs container columnSpacing={1}>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h3">
                                <Skeleton />
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs container justifyContent="flex-end" gap={2}>
                        <Skeleton variant="rounded" width={100} height={35} />
                        <Skeleton variant="rounded" width={100} height={35} />
                    </Grid>
                </Grid>
            );
        default:
            return <div></div>;
    }
}
LoadingComponent.propTypes = {
    type: PropTypes.oneOf(['skeleton ', 'circular', 'linear']),
};
export default LoadingComponent;
