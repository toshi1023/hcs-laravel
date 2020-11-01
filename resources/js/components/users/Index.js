import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectUsers, fetchAsyncGet } from './userSlice';
import UserList from '../parts/userParts/userList';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { TextField, InputAdornment, IconButton, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

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
    // stateで管理するユーザ一覧データを使用できるようにローカルのusers定数に格納
    const users = useSelector(selectUsers)
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
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
        }
        // 上で定義した非同期の関数を実行
        fetchUser()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    // ユーザ検索の値を管理
    const handleChange = (event) => {
        setState({
          ...state,
          userName: event.target.value,
        })
    }
    const handleDelete = () => {
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

    // ユーザ一覧を生成
    const renderUsers = () => {
        return (
            <UserList user={users} />
        )
    }
    
    return (
        <>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={6} md={6} lg={4}>
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
                                onChange={handleChange}
                            />
                            <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleDelete} >
                                クリア
                            </Button>
                        </div>
                    </form>
                    {renderUsers()}
                </Grid>
            </Grid>
        </>
    );
}
