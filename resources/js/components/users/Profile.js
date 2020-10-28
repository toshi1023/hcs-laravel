import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser, fetchAsyncGetProf, editUser } from "./userSlice";
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, Typography, List, ListItem, 
    ListItemText, ListItemAvatar, Avatar, Divider, Fab
 } from "@material-ui/core";
 import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
 import EventIcon from '@material-ui/icons/Event';
 import EditIcon from '@material-ui/icons/Edit';
 import CommentIcon from '@material-ui/icons/Comment';
import RoomIcon from '@material-ui/icons/Room';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { useHistory } from "react-router-dom";
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
    },
    button: {
        marginLeft: '0 0 0 auto',
    },
}));

function Profile(props) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
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

    // 編集データの管理用stateを更新
    const handleEditUser = value => {
        // editedUserのstateを更新するReducerにdispatch
        dispatch(
            editUser({ value })
        );
        // ユーザの編集ページへリダイレクト
        history.push(`/users/${value.id}/edit`);
    };
    
    return (
        <Grid container className={classes.gridContainer} justify="center">
            <Grid item xs={12} sm={6}>
                <Card className={classes.root}>
                    <Grid container  spacing={2}>
                        <Grid item xs={8} sm={12}>
                            <Fab color="primary" aria-label="add" className={classes.button} onClick={() => handleEditUser(loginUser.user)}>
                                <EditIcon />
                            </Fab>
                        </Grid>
                        <Grid item xs={8} sm={6}>
                            <CardMedia
                                className={classes.cover}
                                image={loginUser.user.users_photo_path}
                                title={loginUser.user.users_photo_name}
                            />
                        </Grid>
                        <Grid item xs={8} sm={6}>
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <div className={styles.note}>
                                        <List className={classes.list}>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <EmojiEmotionsIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="ニックネーム" secondary={loginUser.user.name} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <RoomIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="都道府県" secondary={loginUser.user.prefecture} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <EventIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="生年月日" secondary={loginUser.user.birthday} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <SupervisorAccountIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="性別" secondary={loginUser.user.gender == 1 ? '男性' : '女性' } classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <CommentIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="自己紹介" secondary={loginUser.user.comment} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        </List>
                                    </div>
                                </CardContent>
                            </div>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

export default withRouter(Profile);
