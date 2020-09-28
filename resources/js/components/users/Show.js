import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedUser } from './userSlice';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    backgroundColor: '#f7fad1',
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    height: 300,
  },
  gridContainer: {
    paddingTop: '10px',
    paddingBottom: '20px'
  },
  userName: {
      fontSize: '15px',
  },
}));

export default function UserShow(props) {
    const classes = useStyles();
    const theme = useTheme();
    // stateで管理するユーザ詳細データを使用できるようにローカルのselectedUsers定数に格納
    const selectedUsers = useSelector(selectSelectedUser)
    const dispatch = useDispatch()
    console.log(selectedUsers)
    return (
        <Grid container className={classes.gridContainer} justify="center">
            <Grid item xs={12} sm={6}>
                <Card className={classes.root}>
                    <Grid item xs={6} sm={6}>
                        <CardMedia
                            className={classes.cover}
                            image="https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no-image2.jpg"
                            title="NoImage"
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                Root
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                都道府県：大阪府
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                生年月日：1991年1月1日
                            </Typography>
                            </CardContent>
                        </div>
                    </Grid>
                </Card>
                
            </Grid>
        </Grid>
    )
}

