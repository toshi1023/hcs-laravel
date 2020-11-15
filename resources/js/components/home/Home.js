import React from 'react';
import { useSelector } from 'react-redux';
import TopImageSlider from '../parts/homeParts/slick';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import SnackMessages from '../parts/common/snackMessages';
import { selectInfo } from '../app/appSlice';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: '10px',
      paddingBottom: '20px'
    }, 
}));

function Home() {
    const classes = useStyles();
    const infoMessages = useSelector(selectInfo)

    return (
        <>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={8} sm={8}>
                    {
                        // ユーザ作成 & ログイン完了時
                        infoMessages ? 
                            <SnackMessages infoOpen={true} />
                        :
                            <SnackMessages errorOpen={true} />
                    }
                    {/* <TopImageSlider /> */}
                </Grid>
            </Grid>
        </>
    );
}

export default Home;