import React from "react";
import { useSelector, useDispatch } from "react-redux";
import UserEdit from '../../users/Edit'; 
import { selectSelectedUser, editUser, selectFriendStatus, 
         fetchAsyncUpdateFriends, fetchAsyncGetFriendsApply,
         selectMessageHistory, selectEditedUser
} from "../../users/userSlice";
import { fetchGetInfoMessages, selectInfo, fetchOpenModal, selectModal } from '../../app/appSlice';
import { reduceSetShowMessage } from '../../messages/messageSlice';
import SnackMessages from '../common/snackMessages';
import styles from './userParts.module.css';
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, List, ListItem, IconButton, Button,
    ListItemText, ListItemAvatar, Avatar, Divider, Fab, Tooltip
 } from "@material-ui/core";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import EventIcon from '@material-ui/icons/Event';
import EditIcon from '@material-ui/icons/Edit';
import CommentIcon from '@material-ui/icons/Comment';
import RoomIcon from '@material-ui/icons/Room';
import ReplyIcon from '@material-ui/icons/Reply';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
        backgroundColor: "#f7fad1",
        display: "flex"
    },
    topMargin: {
        marginTop: theme.spacing(2),
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
        whiteSpace: 'pre-line',  // 文字データに改行コードが含まれる場合、改行を実行
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
        height: 280,
        width: '90%',
    },
    addIcon: {
        color: "blue",
        fontSize: 30
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
    applyButton: {
        marginLeft: 'auto',
        fontSize: 13,
    },
    tooltip: {
        fontSize: 14,
    },
}));

function UserCard(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState([1]);
    const [reply, setReply] = React.useState([1]);
    // stateで管理するユーザ詳細データを使用できるようにローカルのselectedUsers定数に格納
    const selectedUser = useSelector(selectSelectedUser)
    const editedUser = useSelector(selectEditedUser)
    const friendStatus = useSelector(selectFriendStatus)
    const messageHistory = useSelector(selectMessageHistory)
    const infoMessages = useSelector(selectInfo)
    const open = useSelector(selectModal)
    
    /**
     * 編集データの管理用stateを更新
     * @param {*} value 
     */
    const handleEditUser = value => {
        // editedUserのstateを更新するReducerにdispatch
        dispatch(
            editUser({ value })
        );
        // ユーザの編集モーダルを表示
        dispatch(fetchOpenModal(true))
    };

    /**
     * メッセージ用関数
     * @param {*} value 
     */
    const handleToggleReply = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setReply(newChecked);
    };

    /**
     * リプライアイコンボタンをクリック時
     * @param {*} value 
     */
    const handleSetMessage = (value) => {
        let user = ''
        // 初期表示のユーザか選択したユーザかを判別し変数に代入
        value.user ? user = value.user : user = value.value

        // データのセット
        let data = [{
            target_id: user.id,
            name: user.name,
            gender: user.gender
        }]
        dispatch(reduceSetShowMessage(data))
        history.push('/messages')
    }

    /**
     * 友達リクエストの承認
     * @param {*} value 
     */
    const handleApproval = async (value) => {
        // リクエストの承認 or 拒否
        const resultReg = await dispatch(fetchAsyncUpdateFriends({id: value.id, status: 2}))
        if (fetchAsyncUpdateFriends.fulfilled.match(resultReg)) {
            // 申請中の友達リストを再取得
            await dispatch(fetchAsyncGetFriendsApply(localStorage.getItem('loginId')))
            // infoメッセージの表示 
            await dispatch(fetchGetInfoMessages(resultReg))
        }
    }
    
    return (
        <>
            {
                // メッセージ表示
                infoMessages ? 
                    <SnackMessages infoOpen={true} />
                :
                    <SnackMessages errorOpen={true} />
            }

            {/* ユーザ編集モーダルの表示 */}
            {
                // Modalの表示フラグがtrueの場合のみ表示
                open ? 
                    <UserEdit />
                :
                    ''
            }

            <Card className={classes.root}>
                <Grid container  spacing={2}>
                    <Grid item xs={12} sm={12}>
                        {
                            // ログインユーザに一致する場合のみ"編集"ボタンを表示
                            selectedUser.user !== undefined && localStorage.getItem('loginId') == selectedUser.user.id ? 
                                <Tooltip title="編集" classes={{tooltip: classes.tooltip}}>
                                    <Fab color="primary" aria-label="add" className={classes.button} onClick={() => handleEditUser(selectedUser.value ? selectedUser.value : selectedUser.user)}>
                                        <EditIcon />
                                    </Fab>
                                </Tooltip>
                            : 
                                messageHistory[0].user_id ? 
                                    selectedUser.user !== undefined ? 
                                        messageHistory.find(element => element.user_id == selectedUser.user.id) ? 
                                            ''
                                        :
                                            // ログインユーザ以外でメッセージの履歴がないユーザには"リプライ"ボタンを表示
                                            <IconButton
                                                style={{ backgroundColor: "#d0ddf5", marginRight: 5 }} onClick={() => handleSetMessage(selectedUser)}
                                            >
                                                <ReplyIcon
                                                    edge="end"
                                                    onChange={handleToggleReply(selectedUser.user != undefined ? selectedUser.user.id : '')}
                                                    inputProps={{ 'aria-labelledby': selectedUser.user != undefined ? selectedUser.user.id : '' }}
                                                    className={classes.addIcon}
                                                />
                                            </IconButton>
                                    :
                                        selectedUser.value !== undefined ? 
                                            messageHistory.find(element => element.user_id == selectedUser.value.id) ? 
                                                ''
                                            :
                                                // ログインユーザ以外でメッセージの履歴がないユーザには"リプライ"ボタンを表示
                                                <IconButton
                                                    style={{ backgroundColor: "#d0ddf5", marginRight: 5 }} onClick={() => handleSetMessage(selectedUser)}
                                                >
                                                    <ReplyIcon
                                                        edge="end"
                                                        onChange={handleToggleReply(selectedUser.value != undefined ? selectedUser.value.id : '')}
                                                        inputProps={{ 'aria-labelledby': selectedUser.value != undefined ? selectedUser.value.id : '' }}
                                                        className={classes.addIcon}
                                                    />
                                                </IconButton>
                                        :
                                            ''
                                :
                                    ''
                        }
                        {
                            // 友達リクエストが来ているユーザを表示した場合
                            friendStatus != undefined && selectedUser.value != undefined ? 
                                selectedUser.value.target_id ? 
                                    friendStatus.find(element => element.user_id === selectedUser.value.target_id) ? 
                                        <Button variant="contained" color="primary" className={classes.applyButton} onClick={() => handleApproval(friendStatus.find(element => element.user_id === selectedUser.value.target_id))}>
                                            承認する
                                        </Button>
                                    : ''
                                : ''
                            : ''
                        }
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
        </>
    );
}

export default withRouter(UserCard);
