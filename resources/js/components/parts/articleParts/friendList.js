import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { fetchAsyncGet, searchUser } from '../../articles/articleSlice';
import { selectUsers, fetchAsyncGetFriends } from '../../users/userSlice';
import UserList from './userList';
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
    const friends = useSelector(selectUsers)
    const dispatch = useDispatch();

    useEffect(() => {
        // 非同期の関数を定義
        const fetchUser = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 友達一覧を取得
            const resultReg = await dispatch(fetchAsyncGetFriends(localStorage.getItem('loginId')))
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
        }
        // 上で定義した非同期の関数を実行
        fetchUser()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    // 選択したフレンドの記事を取得
    const handleFriendArticles = async value => {

        // Loading開始
        await dispatch(fetchCredStart())
        // 都道府県情報をセット
        let prefecture = document.getElementById("prefecture").value
        if(prefecture == '全都道府県') {
            prefecture = ''
        }
        // selectArticlesのstateを更新するReducerにdispatch
        const resultSearch = await dispatch(
            fetchAsyncGet({ prefecture: prefecture, user_id: value.target_id })
        )

        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // タブ切り替え(スマホ版のみ)
            props.handleChange ?  props.handleChange(null, 0) : ''
            props.handleTabArticle ? props.handleTabArticle() : ''

            // 検索中のユーザIDをstoreのstateに格納
            dispatch(searchUser(value.target_id))
            
            // ロード終了
            await dispatch(fetchCredEnd());
            return;     
        }
        // ロード終了
        await dispatch(fetchCredEnd());
        return;
    }
    
    return (
        <List dense className={classes.root}>
            {
                props.friendList ? 
                    _.map(friends, value => {
                
                        return (
                            <>
                                {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
                                <ListItem
                                    key={value.target_id}
                                    button
                                    onClick={() => handleFriendArticles(value)}
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
                :
                    <UserList handleFriendArticles={handleFriendArticles} />
            }
        </List>
    );
}
