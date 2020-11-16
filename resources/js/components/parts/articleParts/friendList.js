import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { fetchAsyncGet, selectArticles } from '../../articles/articleSlice';
import { makeStyles } from "@material-ui/core/styles";
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from "@material-ui/core";
import _ from "lodash";
import { useHistory } from "react-router-dom";

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
    // selectedUserのstateを変数に代入
    const selectedUsers = useSelector(selectArticles);
    const dispatch = useDispatch();
    // ページ遷移の関数をセット
    const history = useHistory();

    // 選択したフレンドの記事を取得
    const handleFriendArticles = async value => {
        // Loading開始
        await dispatch(fetchCredStart())
        // selectArticlesのstateを更新するReducerにdispatch
        const resultSearch = await dispatch(
            fetchAsyncGet({ prefecture: document.getElementById("prefecture").value, id: value.target_id })
        )

        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
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
            {_.map(props.friend.friends, value => {
                
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
            })}
        </List>
    );
}
