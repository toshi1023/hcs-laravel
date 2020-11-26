import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserShow from './Show';
import { selectSelectedUser, fetchAsyncGetProf } from "./userSlice";
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
        paddingTop: theme.spacing(15),
        paddingBottom: theme.spacing(5),
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
                <UserShow />
            </Grid>
        </Grid>
    );
}

export default withRouter(Profile);
