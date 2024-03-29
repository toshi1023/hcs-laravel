import React, { useEffect } from 'react';
import MessageList from '../parts/messageParts/messageList';
import MessageBord from '../parts/messageParts/messageBord';
import _ from 'lodash';
import { Grid, Paper, Tabs, Tab } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import GroupIcon from '@material-ui/icons/Group';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import SnackMessages from '../parts/common/snackMessages';
import { fetchCredStart, fetchCredEnd, selectError } from '../app/appSlice';
import { selectMessages, selectShowMessages, fetchAsyncGet, reduceShowMessages, reduceMessages, reduceNewMessages } from './messageSlice';
import Echo from 'laravel-echo';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(5),
    },
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        zIndex: 1,
    },
    mobileMainContent: {
        paddingTop: theme.spacing(3),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        paddingTop: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    messageBordField: {
        paddingTop: theme.spacing(3),
    },
    messageList: {
        paddingTop: theme.spacing(6),
    },
}));

export default function Message() {
    const classes = useStyles()
    // タブ切り替え管理
    const [tab, setTab] = React.useState(1);
    const [messagePage, setMessagePage] = React.useState(true);
    const [messageListPage, setMessageListPage] = React.useState(false);
    // messages定数の値をuseEffectに反映させるためのフラグ
    const [messageFlg, setMessageFlg] = React.useState(false);
    // showMessages定数の値を更新するためのフラグ
    const [showMessageFlg, setShowMessageFlg] = React.useState(false);
    // メッセージデータの取得
    const messages = useSelector(selectMessages)
    const showMessages = useSelector(selectShowMessages)
    const errorMessages = useSelector(selectError)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchMessages = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ログインユーザのIDを検索条件にメッセージ一覧を取得
            const resultReg = await dispatch(fetchAsyncGet(localStorage.getItem('loginId')))
            
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // 新規ユーザへのメッセージの場合はメッセージ詳細タブをデフォルトに表示
                if(showMessages[0].target_id) {
                    handleTabMessage()
                    handleChange(null, 0)
                }
                // messages定数の値をuseEffectに反映させるためのフラグ
                setMessageFlg(true)
                // ロード終了
                await dispatch(fetchCredEnd()); 
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchMessages()

        /**
         * Pusherの設定
         */
        window.Echo = new Echo({
            broadcaster: 'pusher',
            // Laravelの環境変数から値を取得
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });
    
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    useEffect(() => {
        /**
         * メッセージ一覧のリアルタイム更新
         */
        var channel = window.Echo.channel('message');
        channel.listen('.my-event', function(data) {
            if(messages[0].id) {
                // メッセージリストにあるユーザからのメッセージかどうか確認
                let flg = false
                messages.map((m) => 
                    m.user_id === data.message.message.user_id_sender ? flg = true : ''
                )
                // メッセージリストの更新
                flg ? 
                    data.message.message.user_id_receiver == localStorage.getItem('loginId') ? 
                        // 受信したメッセージデータを表示
                        dispatch(reduceMessages(data.message.realtime_message_list))
                    :
                        ''
                :
                    data.message.message.user_id_receiver == localStorage.getItem('loginId') ? 
                        // 受信したメッセージデータを表示
                        dispatch(reduceNewMessages(data.message.realtime_message_list))
                    :
                        ''
            }
        })
    }, [messageFlg])

    useEffect(() => {
        /**
         * メッセージ詳細のリアルタイム更新
         */
        var channel = window.Echo.channel('message');
        channel.listen('.my-event', function(data) {
            if(showMessageFlg) {
                data.message.message.user_id_receiver == localStorage.getItem('loginId') ? 
                    dispatch(reduceShowMessages(data.message.message))
                :
                    ''
            }
        })
    }, [showMessageFlg])

    /**
     * タブ切り替え処理
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    /**
     * メッセージ一覧ページを表示(スマホ用)
     */
    const handleTabMessageList = () => {
        setMessagePage(true)
        setMessageListPage(false)
    }
    /**
     * メッセージ詳細ページを表示(スマホ用)
     */
    const handleTabMessage = () => {
        setMessagePage(false)
        setMessageListPage(true)
    }
    /**
     * メッセージ詳細ボードにメッセージを表示
     */
    const handleShowMessage = () => {
        setShowMessageFlg(true)
    }
    
    return (
        <>
            {
                // メッセージ表示
                errorMessages ? 
                    <SnackMessages errorOpen={true} />
                :
                    <SnackMessages infoOpen={true} />
            }
            <div className={classes.sectionMobile}>
                <Paper square className={classes.tab}>
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="secondary"
                        aria-label="icon label tabs example"
                    >
                        <Tab icon={<MailIcon />} label="メッセージ詳細" onClick={handleTabMessage} />
                        <Tab icon={<GroupIcon />} label="メッセージ一覧" onClick={handleTabMessageList} />
                    </Tabs>
                </Paper>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item xs={11} className={classes.mobileMainContent} hidden={messagePage}>
                        <MessageBord />
                    </Grid>
                    <Grid item xs={11} className={classes.mobileMainContent} hidden={messageListPage}>
                        <MessageList 
                            message={messages} 
                            handleShowMessage={handleShowMessage} 
                            handleChange={handleChange} 
                            handleTabMessage={handleTabMessage} 
                        />
                    </Grid>
                </Grid>
            </div>

            <div className={classes.sectionDesktop}>    
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item sm={8} className={classes.messageBordField}>
                        <Grid container justify="center">
                            <Grid item sm={8}>
                                <MessageBord />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={4} className={classes.messageList}>
                        <MessageList 
                            message={messages} 
                            handleShowMessage={handleShowMessage} 
                            handleChange={handleChange} 
                            handleTabMessage={handleTabMessage} 
                        />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
