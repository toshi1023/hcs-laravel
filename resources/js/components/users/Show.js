import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedUser } from "./userSlice";
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
        margin: '30px 10px 0 10px',
        height: 330
    },
    gridContainer: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
    userName: {
        fontSize: "15px"
    }
}));

function UserShow(props) {
    const classes = useStyles();
    const theme = useTheme();
    // stateで管理するユーザ詳細データを使用できるようにローカルのselectedUsers定数に格納
    const selectedUsers = useSelector(selectSelectedUser);
    const dispatch = useDispatch();

    return (
        <Grid container className={classes.gridContainer} justify="center">
            <Grid item xs={12} sm={6}>
                <Card className={classes.root}>
                    <Grid item xs={8} sm={6}>
                        <CardMedia
                            className={classes.cover}
                            image="https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no-image2.jpg"
                            title="NoImage"
                        />
                    </Grid>
                    <Grid item xs={8} sm={6}>
                        <div className={classes.details}>
                            <CardContent className={classes.content}>
                                <div className={styles.note}>
                                    <h1>Root</h1>
                                    <List className={classes.list}>
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <RoomIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="都道府県" secondary="大阪府" classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <EventIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="生年月日" secondary="1992年1月1日" classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <SupervisorAccountIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="性別" secondary="男性" classes={{secondary:classes.listItemText}} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                    <ListItem>
                                        <ListItemAvatar>
                                        <Avatar>
                                            <CommentIcon />
                                        </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary="自己紹介" secondary="よろしくです" classes={{secondary:classes.listItemText}} />
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

export default withRouter(UserShow);
