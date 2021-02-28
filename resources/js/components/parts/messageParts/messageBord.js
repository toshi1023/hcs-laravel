import React, { useEffect } from 'react';
import _ from 'lodash';
import { Paper, Box, CardContent, Avatar, Chip, FormControl, IconButton, TextField, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGetErrorMessages } from '../../app/appSlice';
import { selectShowMessages, fetchAsyncCreate, fetchAsyncUpdate } from '../../messages/messageSlice';
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
        overflow: 'scroll'
    },
    messageBord: {
        height: theme.spacing(70),
        overflow: 'auto'
    },
    avatar: {
        // Avatarのサイズ変更
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    content: {
        fontSize: 15,
        whiteSpace: 'pre-line',  // 文字データに改行コードが含まれる場合、改行を実行
    },
    mobileContent: {
        fontSize: 12,
        whiteSpace: 'pre-line',  // 文字データに改行コードが含まれる場合、改行を実行
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
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        display: 'flex'
    },
    messageBox: {
        // メッセージを1データごとに改行させる
        overflow: 'hidden'
    }
}));

export default function MessageBord() {
    const classes = useStyles()
    const dispatch = useDispatch()
    // メッセージデータの取得
    const messages = useSelector(selectShowMessages)
    const [state, setState] = React.useState({
        user_id_receiver: '',
        user_id_sender: localStorage.getItem('loginId'),
        content: ''
    })

    // スクロール位置を最下部に調整(※実装中)
    useEffect(() => {
        // messageボードの要素の取得
        let mobileElement = document.getElementById('mobileScrollInner');
        // let element = document.getElementById('scrollInner');
        let element = document.documentElement;
        // 枠の底辺を取得
        let mobileBottom = mobileElement.scrollHeight;
        let bottom = element.scrollHeight - element.clientHeight;
        document.getElementById('mobileScrollInner').scrollTop = 100
        document.getElementById('scrollInner').scrollTop = 100
        // console.log(document.getElementById('mobileScrollInner').scrollTop)
        // console.log(mobileElement.clientHeight)
        // スクロールの実行
        // mobileBottom.scroll(0, mobileBottom);
        // mobileElement.scrollTop = mobileBottom
        // window.scroll(0, bottom);
    }, [messages])
    
    /**
     * メッセージの取得
     */
    const handleSetMessage = (value) => {
        setState({
            ...state,
            user_id_receiver: messages[0].target_id,
            user_id_sender: localStorage.getItem('loginId'),
            content: value
        })
    }

    /**
     * メッセージの保存処理実行
     */
    const onSubmit = async () => {
        let resultReg;
        // 新規ユーザとのメッセージか既存ユーザとのメッセージか判別
        messages[0].content === undefined ? 
            // メッセージの保存処理(新規ユーザ)
            resultReg = await dispatch(fetchAsyncCreate(state))
        :
            // メッセージの保存処理(既存ユーザ)
            resultReg = await dispatch(fetchAsyncUpdate(state))
        
        // errorメッセージがある場合は表示
        resultReg.payload.error_message ? dispatch(fetchGetErrorMessages(resultReg)) : ''

        // 入力値の初期化
        document.getElementById('message').value = ''
        
        setState({ 
            ...state,
            content: ''
        })
    }
    
    return (
        <>
            {/* スマホ版 */}
            <div className={classes.sectionMobile}>
                {
                    // ユーザ名を表示
                    messages != undefined ?
                        messages[0].gender == 1 ?
                            <Chip label={messages[0].name} className={classes.mobileContent} color="primary" />
                        :
                            <Chip label={messages[0].name} className={classes.mobileContent} color="secondary" />
                    : ''
                }
                <div id="mobileScrollInner">
                    <Paper className={classes.mobileMessageBord}>
                        {
                            messages != undefined ?
                                _.map(messages, value => {
                                    return (
                                        <div className={classes.messageBox} key={value.id}>
                                            {
                                                value.user_id_sender == localStorage.getItem('loginId') ?
                                                    <Box component="div" key={value.id} m={1} borderRadius={16} className={classes.rightBox}>
                                                        <CardContent>
                                                            <span key={value.id} className={classes.mobileContent}>{value.content}</span>
                                                        </CardContent>
                                                    </Box>
                                                : 
                                                    <div>
                                                        <Box component="div" key={value.id} m={1} borderRadius={16} className={classes.leftBox}>
                                                            <Avatar
                                                                src={value.users_photo_path}
                                                                className={classes.avatar}
                                                            />
                                                            <CardContent>
                                                                <span key={value.id} className={classes.mobileContent}>{value.content}</span>
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
                </div>
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
                            style={{marginLeft: 10, minWidth: 290, backgroundColor: 'white'}}
                            onChange={(e) => handleSetMessage(e.target.value)}
                            value={state.content}
                            multiline
                        />
                    </FormControl>
                </div>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                {
                    // ユーザ名を表示
                    messages != undefined ?
                        messages[0].gender == 1 ?
                            <Chip label={messages[0].name} className={classes.content} color="primary" />
                        :
                            <Chip label={messages[0].name} className={classes.content} color="secondary" />
                    : ''
                }
                <div id="scrollInner">
                    <Paper className={classes.messageBord}>
                        {
                            messages != undefined ?
                                _.map(messages, value => {
                                    return (
                                        <div className={classes.messageBox} key={value.id}>
                                            {
                                                value.user_id_sender == localStorage.getItem('loginId') ?
                                                    <Box component="div" key={value.id} m={1} borderRadius={16} className={classes.rightBox}>
                                                        <CardContent>
                                                            <span key={value.id} className={classes.content}>{value.content}</span>
                                                        </CardContent>
                                                    </Box>
                                                : 
                                                    <div>
                                                        <Box component="div" key={value.id} m={1} borderRadius={16} className={classes.leftBox}>
                                                            <Avatar
                                                                src={value.users_photo_path}
                                                                className={classes.avatar}
                                                            />
                                                            <CardContent>
                                                                <span key={value.id} className={classes.content}>{value.content}</span>
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
                </div>
                <div className={classes.messageField}>
                    <FormControl>
                        <div style={{display: 'flex'}}>
                            <Grid container justify="center">
                                <Grid item sm={12}>
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
                                        style={{ marginLeft: 10, minWidth: 500, backgroundColor: 'white' }}
                                        onChange={(e) => handleSetMessage(e.target.value)}
                                        value={state.content}
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </FormControl>
                </div>
            </div>
        </>
    );
}
