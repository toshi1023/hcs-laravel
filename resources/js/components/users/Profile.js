import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser, fetchAsyncGetProf } from "./userSlice";
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, Typography, List, ListItem, 
    ListItemText, ListItemAvatar, Avatar, Divider
 } from "@material-ui/core";
 import EventIcon from '@material-ui/icons/Event';
 import CommentIcon from '@material-ui/icons/Comment';
import RoomIcon from '@material-ui/icons/Room';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
        backgroundColor: "#f7fad1",
        display: "flex"
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: "#f7fad1",
    },
    listItemText:{
        fontSize:'12px',
    },
    details: {
        display: "flex",
        flexDirection: "column"
    },
    content: {
        flex: "1 0 auto",
    },
    cover: {
        margin: '60px 10px 0 10px',
        height: 280
    },
    gridContainer: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
    userName: {
        fontSize: "15px"
    }
}));

function Profile(props) {
    const classes = useStyles();
    const theme = useTheme();
    // stateで管理するユーザ詳細データを使用できるようにローカルのloginUser定数に格納
    const loginUser = useSelector(selectLoggedInUser);
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchUserProf = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ログイン情報を取得
            const resultReg = await dispatch(fetchAsyncGetProf(localStorage.getItem('loginId')))
            if (fetchAsyncGetProf.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
        }
        // 上で定義した非同期の関数を実行
        fetchUserProf()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    return (
        <Grid container className={classes.gridContainer} justify="center">
            <Grid item xs={12} sm={6}>
                <Card className={classes.root}>
                    <Grid item xs={8} sm={6}>
                        <CardMedia
                            className={classes.cover}
                            image={loginUser.user.users_photo_path}
                            title="NoImage"
                        />
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                                <div className={styles.note}>
                                    <h1>{loginUser.user.name}</h1>
                                    <List className={classes.list}>
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <RoomIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="都道府県" secondary={loginUser.value.prefecture} classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <EventIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="生年月日" secondary={loginUser.value.birthday} classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <SupervisorAccountIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="性別" secondary={loginUser.value.gender == 1 ? '男性' : '女性' } classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <CommentIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="自己紹介" secondary={loginUser.value.comment} classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    </List>
                                </div>
                            </CardContent>
                        </div>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

export default withRouter(Profile);
