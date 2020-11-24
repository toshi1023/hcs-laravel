import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectUsers, selectSelectedUser, fetchAsyncGet, fetchAsyncGetShow } from './userSlice';
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
    },
    mobileMainContent: {
        paddingTop: theme.spacing(10),
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
    const [value, setValue] = React.useState(1);
    const [userPage, setUserPage] = React.useState(true);
    const [userListPage, setUserListPage] = React.useState(false);
    // stateで管理するユーザ一覧データを使用できるようにローカルのusers定数に格納
    const users = useSelector(selectUsers)
    const selectedUser = useSelector(selectSelectedUser)
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
            const resultReg = await dispatch(fetchAsyncGet(document.getElementById("userSearch").value))
            const resultShow = await dispatch(fetchAsyncGetShow(''))
            if (fetchAsyncGet.fulfilled.match(resultReg) && fetchAsyncGetShow.fulfilled.match(resultShow)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
        }
        // 上で定義した非同期の関数を実行
        fetchUser()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    // ユーザ検索の値を管理
    const handleChangeName = (event) => {
        setState({
          ...state,
          userName: event.target.value,
        })
    }
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

    // 検索条件をもとにユーザの絞り込み
    const getSearchUser = () => {
        // 非同期の関数を定義
        const fetchUserSearch = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ユーザを取得
            const resultSearch = await dispatch(fetchAsyncGet(state.userName))
            
            if (fetchAsyncGet.fulfilled.match(resultSearch)) {
                setState({
                    ...state,
                    userName: '',
                })
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchUserSearch()
    }

    // タブ切り替え処理
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // ニュース一覧ページを表示(スマホ用)
    const handleTabUserList = () => {
        setUserPage(true)
        setUserListPage(false)
    }
    // ニュース詳細ページを表示(スマホ用)
    const handleTabUser = () => {
        setUserPage(false)
        setUserListPage(true)
    }

    // ユーザ一覧を生成
    const renderUsers = () => {
        return (
            <UserList user={users} handleChange={handleChange} handleTabUser={handleTabUser} />
        )
    }
    
    return (
        <>
            {/* スマホ版 */}
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
                            {renderUsers()}
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
                                localStorage.getItem('loginId') ? 
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
                        {renderUsers()}
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
