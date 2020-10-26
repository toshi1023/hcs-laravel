import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectEditedUser } from "./userSlice";
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import ProfileDropzone from '../parts/userParts/dropzone';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, Typography, List, ListItem, Grid,
    ListItemText, ListItemAvatar, Avatar, Divider, Modal, Backdrop, Fade
 } from "@material-ui/core";
 import EventIcon from '@material-ui/icons/Event';
 import CommentIcon from '@material-ui/icons/Comment';
 import CloseIcon from '@material-ui/icons/Close';
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
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(5),
        marginButtom: theme.spacing(2),
        height: 280
    },
    gridContainer: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
    userName: {
        fontSize: "15px"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    },
    closeIcon: {
        marginLeft: 'auto',
    },
}));

function UserEdit(props) {
    const classes = useStyles();
    const theme = useTheme();
    // Modal設定
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    // stateで管理する編集用のユーザデータを使用できるようにローカルのeditedUsers定数に格納
    const editedUsers = useSelector(selectEditedUser);
    
    return (
        <Grid container className={classes.gridContainer} justify="center">
            {/* 
                画像の編集用モーダル 
            */}
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                >
                    <Fade in={open}>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                        <div className={classes.paper}>
                            <Grid container>
                                <h2>画像の編集</h2>
                                <CloseIcon className={classes.closeIcon} onClick={handleClose} />
                            </Grid>
                            {/* ドラッグ&ドロップ */}
                            <Grid container justify="center">
                                <Grid item xs={12} sm={8}>
                                    <ProfileDropzone /> 
                                </Grid>
                            </Grid>
                        </div>
                        </Grid>
                    </Grid>
                    </Fade>
                </Modal>
            </div>
            <Grid item xs={12} sm={6}>
                <Card className={classes.root}>
                    <Grid item xs={8} sm={6}>
                        <CardMedia
                            className={classes.cover}
                            image={editedUsers.value.users_photo_path}
                            title={editedUsers.value.users_photo_name}
                            onClick={handleOpen}
                        />
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                                <div className={styles.note}>
                                    <h1>{editedUsers.name}</h1>
                                    <List className={classes.list}>
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <RoomIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="都道府県" secondary={editedUsers.value.prefecture} classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <EventIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="生年月日" secondary={editedUsers.value.birthday} classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <SupervisorAccountIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="性別" secondary={editedUsers.value.gender == 1 ? '男性' : '女性' } classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <CommentIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="自己紹介" secondary={editedUsers.value.comment} classes={{secondary:classes.listItemText}} />
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

export default withRouter(UserEdit);
