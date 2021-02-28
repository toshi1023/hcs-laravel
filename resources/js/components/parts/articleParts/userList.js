import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { fetchAsyncGet, selectUsers, fetchAsyncGetPagination } from '../../users/userSlice';
import BasicPagination from '../common/pagenation';
import { makeStyles } from "@material-ui/core/styles";
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@material-ui/core";
import _ from "lodash";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 500,
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: "#f7fad1"
    },
    list: {
        marginLeft: 10,
        fontSize: 20
    },
    avatar: {
        // Avatarのサイズ変更
        width: theme.spacing(7),
        height: theme.spacing(7)
    },
}));

export default function UserList(props) {
    const classes = useStyles();
    const users = useSelector(selectUsers)
    const dispatch = useDispatch();

    useEffect(() => {
        // 非同期の関数を定義
        const fetchUser = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ユーザ一覧とログイン情報を取得
            const resultReg = await dispatch(fetchAsyncGet({user_name: '', user_id: localStorage.getItem('loginId')}))
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());
        }
        // 上で定義した非同期の関数を実行
        fetchUser()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    /**
     * 選択したページ用のデータを取得
     */
    const handleGetData = async (page) => {
        // Loading開始
        await dispatch(fetchCredStart())

        const resultReg = await dispatch(fetchAsyncGetPagination(page))

        if (fetchAsyncGetPagination.fulfilled.match(resultReg)) {
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());
    }
    
    return (
        <>
            <List dense className={classes.root}>
                {
                    _.map(users.data, value => {
                    
                        return (
                            <>
                                {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
                                <ListItem
                                    key={value.target_id}
                                    button
                                    onClick={() => props.handleFriendArticles(value.id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`Avatar n°${value.target_id}`}
                                            src={`${value.users_photo_path}`}
                                            className={classes.avatar}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        id={value.target_id}
                                        primary={`${value.name}`}
                                        classes={{ primary: classes.list }}
                                        style={{
                                            color: value.gender == 1 ? "blue" : "red"
                                        }}
                                    />
                                </ListItem>
                                <hr />
                            </>
                        );
                    })
                }
            </List>
            <BasicPagination count={users.last_page} handleGetData={handleGetData} />
        </>
    );
}
