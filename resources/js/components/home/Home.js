import React from 'react';
import HcsAppBar from '../parts/appBar';
import TopImageSlider from '../parts/homeParts/slick';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: '10px',
      paddingBottom: '20px'
    }, 
}));

function Home() {
    const classes = useStyles();

    return (
        <>
            <HcsAppBar />
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={10} sm={8}>
                    <TopImageSlider />
                </Grid>
            </Grid>
        </>
    );
}

export default Home;