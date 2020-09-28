import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchAsyncProf } from '../login/loginSlice';
import { selectUsers, fetchAsyncGet } from './userSlice';
import UserList from '../parts/userParts/userList';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { List } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UserSearch from '../parts/userParts/userSearch';

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
}));

export default function User() {
    const classes = useStyles();
    // stateで管理する記事一覧データを使用できるようにローカルのarticles定数に格納
    const users = useSelector(selectUsers)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchUserProf = async () => {
            // ユーザ一覧とログイン情報を取得
            await dispatch(fetchAsyncGet())
            // await dispatch(fetchAsyncProf())
        }
        // 上で定義した非同期の関数を実行
        fetchUserProf()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    // ユーザ一覧を生成
    const renderUsers = () => {
        return (
            // <List dense className={classes.root}>
            //     {_.map(users, value => {
                    <UserList user={users} />
            //     })}
            // </List>
        )
    }
    
    return (
        <>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={6} md={6} lg={4}>
                    <UserSearch />
                    {renderUsers()}
                </Grid>
            </Grid>
        </>
    );
}
