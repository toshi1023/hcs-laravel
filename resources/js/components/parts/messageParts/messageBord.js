import React, { useEffect } from 'react';
import _ from 'lodash';
import { Paper, Box, CardContent, Avatar, Chip, FormControl, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { selectShowMessages } from '../../messages/messageSlice';
import ReplyIcon from '@material-ui/icons/Reply';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(5),
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    mobileMessageBord: {
        height: theme.spacing(60),
    },
    messageBord: {
        height: theme.spacing(70),
    },
    avatar: {
        // Avatarのサイズ変更
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    content: {
        fontSize: 15
    },
    mobileContent: {
        fontSize: 12,
    },
    rightBox: {
        backgroundColor: '#1b2538', 
        color: 'white', 
        float: 'right'
    },
    leftBox: {
        backgroundColor: '#1b2538', 
        color: 'white', 
        float: 'left',
        display: 'flex'
    },
    messageField: {
        fontSize: 14,
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        display: 'flex'
    },
}));

export default function MessageBord(props) {
    const classes = useStyles()
    // メッセージデータの取得
    const messages = useSelector(selectShowMessages)
    const [message, setMessage] = React.useState('')

    /**
     * メッセージの取得
     */
    const handleSetMessage = (value) => {
        setMessage(value)
    }

    /**
     * メッセージの保存処理実行
     */
    const onSubmit = () => {
        // コメントの保存処理
        // props.messageUpdate(state)
        // 入力値の初期化
        document.getElementById('message').value = ''
        setMessage('')
    }

    return (
        <>
            <div className={classes.sectionMobile}>
                {
                    // ユーザ名を表示
                    messages.messages != undefined ?
                        messages.messages[0].gender == 1 ?
                            <Chip label={messages.messages[0].name} className={classes.mobileContent} color="primary" />
                        :
                            <Chip label={messages.messages[0].name} className={classes.mobileContent} color="secondary" />
                    : ''
                }
                <Paper className={classes.mobileMessageBord}>
                    {
                        messages.messages != undefined ?
                            _.map(messages.messages, value => {
                                return (
                                    <div>
                                        {
                                            value.user_id_sender == localStorage.getItem('loginId') ?
                                                <Box component="div" m={1} borderRadius={16} className={classes.rightBox}>
                                                    <CardContent>
                                                        <span className={classes.mobileContent}>{value.content}</span>
                                                    </CardContent>
                                                </Box>
                                            : 
                                                <div>
                                                    <Box component="div" m={1} borderRadius={16} className={classes.leftBox}>
                                                        <Avatar
                                                            alt={value.user_id}
                                                            src={value.users_photo_path}
                                                            className={classes.avatar}
                                                        />
                                                        <CardContent>
                                                            <span className={classes.mobileContent}>{value.content}</span>
                                                        </CardContent>
                                                    </Box>
                                                </div>
                                        }
                                    </div>
                                )
                            })
                        : ''
                    }
                </Paper>
                <div className={classes.messageField}>
                    <FormControl>
                        <IconButton 
                            color="primary" 
                            aria-label="add" 
                            onClick={onSubmit}
                        >
                            <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                        </IconButton>
                        <TextField
                            id="message"
                            name="message"
                            label="メッセージ"
                            variant="outlined"
                            style={{marginLeft: 10, minWidth: 250, backgroundColor: 'white'}}
                            onChange={(e) => handleSetMessage(e.target.value)}
                            multiline
                        />
                    </FormControl>
                </div>
            </div>

            <div className={classes.sectionDesktop}>
                {
                    // ユーザ名を表示
                    messages.messages != undefined ?
                        messages.messages[0].gender == 1 ?
                            <Chip label={messages.messages[0].name} className={classes.content} color="primary" />
                        :
                            <Chip label={messages.messages[0].name} className={classes.content} color="secondary" />
                    : ''
                }
                <Paper className={classes.messageBord}>
                    {
                        messages.messages != undefined ?
                            _.map(messages.messages, value => {
                                return (
                                    <div>
                                        {
                                            value.user_id_sender == localStorage.getItem('loginId') ?
                                                <Box component="div" m={1} borderRadius={16} className={classes.rightBox}>
                                                    <CardContent>
                                                        <span className={classes.content}>{value.content}</span>
                                                    </CardContent>
                                                </Box>
                                            : 
                                                <div>
                                                    <Box component="div" m={1} borderRadius={16} className={classes.leftBox}>
                                                        <Avatar
                                                            alt={value.user_id}
                                                            src={value.users_photo_path}
                                                            className={classes.avatar}
                                                        />
                                                        <CardContent>
                                                            <span className={classes.content}>{value.content}</span>
                                                        </CardContent>
                                                    </Box>
                                                </div>
                                        }
                                    </div>
                                )
                            })
                        : ''
                    }
                </Paper>
                <div className={classes.messageField}>
                    <FormControl>
                        <IconButton 
                            color="primary" 
                            aria-label="add" 
                            onClick={onSubmit}
                        >
                            <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                        </IconButton>
                        <TextField
                            id="message"
                            name="message"
                            label="メッセージ"
                            variant="outlined"
                            style={{marginLeft: 10, minWidth: 250, backgroundColor: 'white'}}
                            onChange={(e) => handleSetMessage(e.target.value)}
                            multiline
                        />
                    </FormControl>
                </div>
            </div>
        </>
    );
}
