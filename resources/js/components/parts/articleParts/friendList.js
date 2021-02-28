import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { selectFriends, fetchAsyncGetFriends, fetchAsyncGetFriendsPagination } from '../../users/userSlice';
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

export default function FriendList(props) {
    const classes = useStyles();
    const friends = useSelector(selectFriends)
    const dispatch = useDispatch();

    useEffect(() => {
        // 非同期の関数を定義
        const fetchFriend = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 友達一覧を取得
            const resultReg = await dispatch(fetchAsyncGetFriends(localStorage.getItem('loginId')))
            if (fetchAsyncGetFriends.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());
            }
            // ロード終了
            await dispatch(fetchCredEnd());
        }
        // 上で定義した非同期の関数を実行
        fetchFriend()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    /**
     * 選択したページ用のデータを取得
     */
    const handleGetData = async (page) => {
        // Loading開始
        await dispatch(fetchCredStart())

        const resultReg = await dispatch(fetchAsyncGetFriendsPagination(page))

        if (fetchAsyncGetFriendsPagination.fulfilled.match(resultReg)) {
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
                    _.map(friends.data, value => {
                
                        return (
                            <>
                                {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
                                {
                                    value.auth_friends !== undefined ? 
                                        <>
                                            <ListItem
                                                key={value.target_id}
                                                button
                                                onClick={() => props.handleFriendArticles(value.target_id)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={`Avatar n°${value.target_id}`}
                                                        src={`${value.auth_friends.users_photo_path}`}
                                                        className={classes.avatar}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    id={value.target_id}
                                                    primary={`${value.auth_friends.name}`}
                                                    classes={{ primary: classes.list }}
                                                    style={{
                                                        color: value.auth_friends.gender == 1 ? "blue" : "red"
                                                    }}
                                                />
                                            </ListItem>
                                            <hr />
                                        </>
                                    :
                                        ''
                                }
                            </>
                        );
                    })
                }
            </List>
            <BasicPagination count={friends.last_page} handleGetData={handleGetData} />
        </>
    );
}
