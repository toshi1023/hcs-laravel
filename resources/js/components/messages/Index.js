import React, { useEffect } from 'react';
import MessageList from '../parts/messageParts/messageList';
import _ from 'lodash';
import { Grid, Paper, Tabs, Tab } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import GroupIcon from '@material-ui/icons/Group';
import { makeStyles } from '@material-ui/core/styles';
import UserSearch from '../parts/userParts/userSearch';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectMessages, fetchAsyncGet } from './messageSlice';

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
        paddingTop: theme.spacing(2),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(3),
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
    mobileMessageBord: {
        height: theme.spacing(60),
    },
    messageBord: {
        height: theme.spacing(70),
    }
}));

export default function Message() {
    const classes = useStyles()
    // タブ切り替え管理
    const [value, setValue] = React.useState(1);
    const [messagePage, setMessagePage] = React.useState(true);
    const [messageListPage, setMessageListPage] = React.useState(false);
    // メッセージデータの取得
    const messages = useSelector(selectMessages)
    const dispatch = useDispatch()
    
    useEffect(() => {
        // 非同期の関数を定義
        const fetchMessages = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ログインユーザのIDを検索条件にメッセージ一覧を取得
            const resultReg = await dispatch(fetchAsyncGet(localStorage.getItem('loginId')))
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchMessages()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    // タブ切り替え処理
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // メッセージ一覧ページを表示(スマホ用)
    const handleTabMessageList = () => {
        setMessagePage(true)
        setMessageListPage(false)
    }
    // メッセージ詳細ページを表示(スマホ用)
    const handleTabMessage = () => {
        setMessagePage(false)
        setMessageListPage(true)
    }

    return (
        <>
            <div className={classes.sectionMobile}>
                <Paper square className={classes.tab}>
                    <Tabs
                        value={value}
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
                        <Paper className={classes.mobileMessageBord}>
                            メッセージ
                        </Paper>
                    </Grid>
                    <Grid item xs={11} className={classes.mobileMainContent} hidden={messageListPage}>
                        <UserSearch />
                        <MessageList message={messages} />
                    </Grid>
                </Grid>
            </div>

            <div className={classes.sectionDesktop}>    
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item sm={8} className={classes.messageBordField}>
                        <Grid container justify="center">
                            <Grid item sm={8}>
                                <Paper className={classes.messageBord}>
                                    メッセージ
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={4}>
                        <UserSearch />
                        <MessageList message={messages} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
