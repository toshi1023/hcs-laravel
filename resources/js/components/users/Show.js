import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedUser, editUser, fetchAsyncGetShow } from "./userSlice";
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, Typography, List, ListItem, 
    ListItemText, ListItemAvatar, Avatar, Divider, Fab, Tooltip
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
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
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
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(2),
        marginButtom: theme.spacing(2),
        height: 300,
        width: 350,
    },
    gridContainer: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
    userName: {
        fontSize: "15px"
    },
    button: {
        marginLeft: 'auto',
    },
    tooltip: {
        fontSize: 14,
    },
}));

function UserShow(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    // stateで管理するユーザ詳細データを使用できるようにローカルのselectedUsers定数に格納
    const selectedUser = useSelector(selectSelectedUser);
    
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
        <>
            {
                // スマホの場合はユーザ一覧画面に表示しない
                window.location.pathname != '/users' ? 
                    <div className={classes.sectionMobile}>
                        <Card className={classes.root}>
                            <Grid container  spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <Tooltip title="編集" classes={{tooltip: classes.tooltip}}>
                                        <Fab color="primary" aria-label="add" className={classes.button} onClick={() => handleEditUser(selectedUser.value)}>
                                            <EditIcon />
                                        </Fab>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <CardMedia
                                        className={classes.cover}
                                        image={selectedUser.value ? selectedUser.value.users_photo_path : ''}
                                        title={selectedUser.value ? selectedUser.value.users_photo_name : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
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
                                                    <ListItemText primary="ニックネーム" secondary={selectedUser.value ? selectedUser.value.name : ''} classes={{secondary:classes.listItemText}} />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                                <ListItem>
                                                    <ListItemAvatar>
                                                    <Avatar>
                                                        <RoomIcon />
                                                    </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="都道府県" secondary={selectedUser.value ? selectedUser.value.prefecture : ''} classes={{secondary:classes.listItemText}} />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                                <ListItem>
                                                    <ListItemAvatar>
                                                    <Avatar>
                                                        <EventIcon />
                                                    </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="生年月日" secondary={selectedUser.value ? selectedUser.value.birthday : ''} classes={{secondary:classes.listItemText}} />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                                <ListItem>
                                                    <ListItemAvatar>
                                                    <Avatar>
                                                        <SupervisorAccountIcon />
                                                    </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="性別" secondary={selectedUser.value ? (selectedUser.value.gender == 1 ? '男性' : '女性') : '' } classes={{secondary:classes.listItemText}} />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                                <ListItem>
                                                    <ListItemAvatar>
                                                    <Avatar>
                                                        <CommentIcon />
                                                    </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary="自己紹介" secondary={selectedUser.value ? selectedUser.value.comment : ''} classes={{secondary:classes.listItemText}} />
                                                </ListItem>
                                                </List>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Grid>
                            </Grid>
                        </Card>
                    </div>
                : ''
            }
            <div className={classes.sectionDesktop}>
                <Card className={classes.root}>
                    <Grid container  spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Tooltip title="編集" classes={{tooltip: classes.tooltip}}>
                                <Fab color="primary" aria-label="add" className={classes.button} onClick={() => handleEditUser(selectedUser.value ? selectedUser.value : selectedUser.user)}>
                                    <EditIcon />
                                </Fab>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <CardMedia
                                className={classes.cover}
                                image={selectedUser.value != undefined ? selectedUser.value.users_photo_path : (selectedUser.user != undefined ? selectedUser.user.users_photo_path : '')}
                                title={selectedUser.value != undefined ? selectedUser.value.users_photo_name : (selectedUser.user != undefined ? selectedUser.user.users_photo_name : '')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
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
                                            <ListItemText primary="ニックネーム" secondary={selectedUser.value != undefined ? selectedUser.value.name : (selectedUser.user != undefined ? selectedUser.user.name : '')} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <RoomIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="都道府県" secondary={selectedUser.value != undefined ? selectedUser.value.prefecture : (selectedUser.user != undefined ? selectedUser.user.prefecture : '')} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <EventIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="生年月日" secondary={selectedUser.value != undefined ? selectedUser.value.birthday : (selectedUser.user != undefined ? selectedUser.user.birthday : '')} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <SupervisorAccountIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="性別" secondary={selectedUser.value != undefined ? (selectedUser.value.gender == 1 ? '男性' : '女性') : (selectedUser.user != undefined ? (selectedUser.user.gender == 1 ? '男性' : '女性') : '') } classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <CommentIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="自己紹介" secondary={selectedUser.value != undefined ? selectedUser.value.comment : (selectedUser.user != undefined ? selectedUser.user.comment : '')} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        </List>
                                    </div>
                                </CardContent>
                            </div>
                        </Grid>
                    </Grid>
                </Card>
            </div>
        </>
    );
}

export default withRouter(UserShow);
