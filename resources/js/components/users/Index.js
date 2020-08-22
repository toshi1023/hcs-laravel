import React from 'react';
import HcsAppBar from '../parts/appBar';
import UserCard from '../parts/userParts/userCard';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: '10px',
        paddingBottom: '20px'
    },
    
}));

function User() {
    const classes = useStyles();
    return (
        <>
            <HcsAppBar />
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={12} sm={6}>
                    <UserCard />
                </Grid>
            </Grid>
        </>
    );
}

export default User;