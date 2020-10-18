import React, { useEffect } from 'react';
import MessageList from '../parts/messageParts/messageList';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import UserSearch from '../parts/userParts/userSearch';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectMessages, fetchAsyncGet } from './messageSlice';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        paddingTop: '10px',
        paddingBottom: '20px'
    },
}));

export default function Message() {
    const classes = useStyles()
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

    return (
        <>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={6} md={6} lg={4}>
                    <UserSearch />
                    <MessageList message={messages} />
                </Grid>
            </Grid>
        </>
    );
}
