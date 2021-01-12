import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, fetchAsyncUpdateFriends, selectFriendStatus } from "../../users/userSlice";
import { makeStyles } from "@material-ui/core/styles";
import {
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
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
    addIcon: {
        color: "blue",
        fontSize: 30
    },
    applyIcon: {
        color: "#f8cc6c",
        fontSize: 30
    },
    successIcon: {
        color: "green",
        fontSize: 30
    },
}));

export default function FriendList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([1]);
    const [add, setAdd] = React.useState(false);
    const dispatch = useDispatch();

    const handleToggleAdd = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    /**
     * 詳細データの管理用stateを更新
     * @param {*} value 
     */
    const handleSetUser = value => {
        // selectedUserのstateを更新するReducerにdispatch
        dispatch(
            selectUser({ value })
        );
        // ページ最上部に戻る
        window.scrollTo(0, 0)
        // ユーザ詳細タブへ切り替え(スマホのみ)
        if(window.matchMedia('(max-width: 767px)').matches) {
            // タブ切り替え
            props.handleChange(null, 0)
            props.handleTabUser()
        }
    }

    return (
        <List dense className={classes.root}>
            {_.map(props.user, value => {
                return (
                    <>
                        {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
                        {
                            value.auth_friends != undefined ? 
                                <>
                                    <ListItem
                                        key={value.auth_friends.id}
                                        button
                                        onClick={() => handleSetUser(value)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`Avatar n°${value.auth_friends.id}`}
                                                src={`${value.auth_friends.users_photo_path}`}
                                                className={classes.avatar}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            id={value.auth_friends.id}
                                            primary={`${value.auth_friends.name}`}
                                            classes={{ primary: classes.list }}
                                            style={{
                                                color: value.auth_friends.gender == 1 ? "blue" : "red"
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                style={
                                                    value.status === 2 ? 
                                                        // 承認済み
                                                        { backgroundColor: "#CCFFCC" } 
                                                    :
                                                        // 申請中
                                                        { backgroundColor: "#f4f5ab" }
                                                }
                                                disabled
                                            >
                                                {
                                                    value.status === 2 ? 
                                                        // 承認済み
                                                        <HowToRegIcon 
                                                            edge="end"
                                                            onChange={handleToggleAdd(value.id)}
                                                            inputProps={{
                                                                "aria-labelledby": value.id
                                                            }}
                                                            className={classes.successIcon}
                                                        /> 
                                                    : 
                                                        // 申請中
                                                        <ContactMailIcon
                                                            edge="end"
                                                            onChange={handleToggleAdd(value.id)}
                                                            inputProps={{
                                                                "aria-labelledby": value.id
                                                            }}
                                                            className={classes.applyIcon}
                                                        />
                                                }
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <hr />
                                </>
                            :
                                ''
                        }
                        
                    </>
                );
            })}
        </List>
    );
}
