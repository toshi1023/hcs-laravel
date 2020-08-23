import React from 'react';
import HcsAppBar from '../parts/appBar';
import UserList from '../parts/userParts/userList';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import UserSearch from '../parts/userParts/userSearch';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: '10px',
        paddingBottom: '20px'
    },
}));

export default function User() {
    const classes = useStyles();
    return (
        <>
            <HcsAppBar />
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={6} md={6} lg={4}>
                    <UserSearch />
                    <UserList />
                </Grid>
            </Grid>
        </>
    );
}
