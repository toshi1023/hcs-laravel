import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, fetchGetErrorMessages, selectError } from '../app/appSlice';
import { selectUsers, selectSelectedUser, fetchAsyncGet, fetchAsyncGetShow, selectFriendStatus } from './userSlice';
import UserList from '../parts/userParts/userList';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { TextField, InputAdornment, IconButton, Button, Paper, Tabs, Tab } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import GroupIcon from '@material-ui/icons/Group';
import { makeStyles } from '@material-ui/core/styles';
import UserShow from './Show';
import MessageCard from '../parts/common/messageCard';
import SnackMessages from '../parts/common/snackMessages';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: '10px',
        paddingBottom: '20px'
    },
    root: {
        width: '100%',
        maxWidth: 500,
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: '#f7fad1',
    },
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        zIndex: 1,
    },
    mainContent: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
    },
    mobileMainContent: {
        paddingTop: theme.spacing(10),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(10),
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
    userShow: {
        paddingTop: theme.spacing(4),
    },
    rootSearch: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: 300,
        },
    },
    text: {
        fontSize: 15
    },
    clearButton: {
        fontSize: 13,
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    }
}));

export default function User() {
    const classes = useStyles();
    // タブ切り替え管理
    const [tab, setTab] = React.useState(1);
    const [userPage, setUserPage] = React.useState(true);
    const [userListPage, setUserListPage] = React.useState(false);
    // stateで管理するユーザ一覧データを使用できるようにローカルのusers定数に格納
    const users = useSelector(selectUsers)
    const selectedUser = useSelector(selectSelectedUser)
    const friendStatus = useSelector(selectFriendStatus)
    const errorMessages = useSelector(selectError)
    const dispatch = useDispatch()
    const [state, setState] = React.useState({
        userName: null,
    })

    useEffect(() => {
        // 非同期の関数を定義
        const fetchUser = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ユーザ一覧とログイン情報を取得
            const resultReg = await dispatch(fetchAsyncGet({
                user_name: document.getElementById("userSearch").value, 
                user_id: localStorage.getItem('loginId')
            }))
            const resultShow = await dispatch(fetchAsyncGetShow(''))
            if (fetchAsyncGet.fulfilled.match(resultReg) && fetchAsyncGetShow.fulfilled.match(resultShow)) {
                // errorメッセージの表示
                resultReg.payload.error_message ? dispatch(fetchGetErrorMessages(resultReg)) : ''
                resultShow.payload.error_message ? dispatch(fetchGetErrorMessages(resultShow)) : ''
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
        }
        // 上で定義した非同期の関数を実行
        fetchUser()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    /**
     * ユーザ検索の値を管理
     * @param {*} event 
     */
    const handleChangeName = (event) => {
        setState({
          ...state,
          userName: event.target.value,
        })
    }
    /**
     * ユーザ検索の値を消去
     */
    const handleDeleteName = () => {
        setState({
          ...state,
          userName: '',
        })
        // 入力欄の文字もクリア
        document.getElementById("userSearch").value = ''
        // ユーザの再取得
        document.getElementById('search').click()
    }

    /**
     * 検索条件をもとにユーザの絞り込み
     */
    const getSearchUser = () => {
        // 非同期の関数を定義
        const fetchUserSearch = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ユーザを取得
            const resultSearch = await dispatch(fetchAsyncGet({
                user_name: state.userName, 
                user_id: localStorage.getItem('loginId')
            }))
            
            if (fetchAsyncGet.fulfilled.match(resultSearch)) {
                setState({
                    ...state,
                    userName: '',
                })
                // errorメッセージの表示
                resultSearch.payload.error_message ? dispatch(fetchGetErrorMessages(resultSearch)) : ''
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchUserSearch()
    }

    /**
     * タブ切り替え処理
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    /**
     * ユーザ一覧ページを表示(スマホ用)
     */
    const handleTabUserList = () => {
        setUserPage(true)
        setUserListPage(false)
    }
    /**
     * ユーザ詳細ページを表示(スマホ用)
     */
    const handleTabUser = () => {
        setUserPage(false)
        setUserListPage(true)
    }
    
    return (
        <>
            {
                // メッセージ表示
                errorMessages ? 
                    <SnackMessages errorOpen={true} />
                :
                    ''
            }

            {/* スマホ版 */}
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
                        <Tab icon={<PersonPinIcon />} label="ユーザ詳細" onClick={handleTabUser} />
                        <Tab icon={<GroupIcon />} label="ユーザ一覧" onClick={handleTabUserList} />
                    </Tabs>
                </Paper>
                <div className={classes.mobileMainContent}>
                    <Grid container className={classes.gridContainer} justify="center">
                        <Grid item xs={11} hidden={userPage}>
                            <Grid container justify="center">
                                {
                                    localStorage.getItem('loginId') ? 
                                        <Grid item xs={12}>
                                            <div className={classes.userShow}>
                                                <UserShow />
                                            </div>
                                        </Grid>
                                    : 
                                        <Grid item xs={12}>
                                            <div className={classes.userShow}>
                                                <MessageCard />
                                            </div>
                                        </Grid>
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={11} hidden={userListPage}>
                            <form className={classes.rootSearch} noValidate autoComplete="off">
                                <div>
                                    <TextField
                                        id="userSearch"
                                        label="Search"
                                        placeholder="ユーザ名で検索"
                                        multiline={false}
                                        // SearchIconをフィールドに埋め込み
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment>
                                                    <IconButton type="button" id="search" className={classes.iconButton} onClick={getSearchUser} aria-label="search">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            // 入力値のフォントサイズを変更
                                            classes: {
                                                input: classes.text,
                                            },
                                        }}
                                        InputLabelProps={{
                                            style: {fontSize: 15}
                                        }}
                                        onChange={handleChangeName}
                                    />
                                    <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleDeleteName} >
                                        クリア
                                    </Button>
                                </div>
                            </form>
                            <UserList user={users} friendStatus={friendStatus} handleChange={handleChange} handleTabUser={handleTabUser} />
                        </Grid>
                    </Grid>
                </div>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item sm={8}>
                        <Grid container justify="center">
                            {
                                localStorage.getItem('localToken') ? 
                                    <Grid item sm={10}>
                                        <div className={classes.userShow}>
                                            <UserShow />
                                        </div>
                                    </Grid>
                                : 
                                    <Grid item sm={6}>
                                        <div className={classes.userShow}>
                                            <MessageCard />
                                        </div>
                                    </Grid>
                            }
                        </Grid>
                    </Grid>
                    <Grid item sm={4}>
                        <form className={classes.rootSearch} noValidate autoComplete="off">
                            <div>
                                <TextField
                                    id="userSearch"
                                    label="Search"
                                    placeholder="ユーザ名で検索"
                                    multiline={false}
                                    // SearchIconをフィールドに埋め込み
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment>
                                                <IconButton type="button" id="search" className={classes.iconButton} onClick={getSearchUser} aria-label="search">
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        // 入力値のフォントサイズを変更
                                        classes: {
                                            input: classes.text,
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: {fontSize: 15}
                                    }}
                                    onChange={handleChangeName}
                                />
                                <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleDeleteName} >
                                    クリア
                                </Button>
                            </div>
                        </form>
                        <UserList user={users} friendStatus={friendStatus} handleChange={handleChange} handleTabUser={handleTabUser} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
