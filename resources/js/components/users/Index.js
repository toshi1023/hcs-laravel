import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchAsyncProf } from '../login/loginSlice';
import { selectUsers, fetchAsyncGet } from './userSlice';
import HcsAppBar from '../parts/appBar';
import UserList from '../parts/userParts/userList';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import UserSearch from '../parts/userParts/userSearch';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: '10px',
        paddingBottom: '20px'
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
    console.log(users)
    // ユーザ一覧を生成
    const renderUsers = () => {
        return (
            <UserList user={users} />
        )
    }

    return (
        <>
            <HcsAppBar />
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={6} md={6} lg={4}>
                    <UserSearch />
                    {renderUsers()}
                </Grid>
            </Grid>
        </>
    );
}
