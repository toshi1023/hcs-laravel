import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectSelectedUser } from "../../users/userSlice";
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
import ReplyIcon from '@material-ui/icons/Reply';
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
    addIcon: {
        color: "blue",
        fontSize: 30
    },
    successIcon: {
        color: "green",
        fontSize: 30
    },
}));

export default function UserList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([1]);
    const [add, setAdd] = React.useState(false);
    const [reply, setReply] = React.useState([1]);
    // selectedUserのstateを変数に代入
    const selectedUsers = useSelector(selectSelectedUser);
    const dispatch = useDispatch();
    // ページ遷移の関数をセット
    const history = useHistory();

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

    const handleToggleReply = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setReply(newChecked);
      };

    const handleAdd = () => {
        if(add) {
            setAdd(false)
        } else {
            setAdd(true)
        }
    }

    // 詳細データの管理用stateを更新
    const handleSetUser = value => {
        // selectedUserのstateを更新するReducerにdispatch
        dispatch(
            selectUser({ value })
        );
        // ユーザの詳細ページへリダイレクト
        history.push(`/users/${value.id}`);
    };
    
    return (
        <List dense className={classes.root}>
            {_.map(props.user.users, value => {
                //     const labelId = `user-list-${value.id}`;
                
                return (
                    <>
                        {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
                        <ListItem
                            key={value.id}
                            button
                            onClick={() => handleSetUser(value)}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${value.id}`}
                                    src={`${value.users_photo_path}`}
                                    className={classes.avatar}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                id={value.id}
                                primary={`${value.name}`}
                                classes={{ primary: classes.list }}
                                style={{
                                    color: value.gender == 1 ? "blue" : "red"
                                }}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    style={{ backgroundColor: "#d0ddf5", marginRight: 5 }}
                                >
                                    <ReplyIcon
                                        edge="end"
                                        onChange={handleToggleReply(value.id)}
                                        inputProps={{ 'aria-labelledby': value.id }}
                                        className={classes.addIcon}
                                    />
                                </IconButton>
                                <IconButton
                                    style={
                                        add ? { backgroundColor: "#CCFFCC" } : { backgroundColor: "#d0ddf5" }
                                    }
                                    onClick={handleAdd}
                                >
                                    {
                                        add ? 
                                        <HowToRegIcon 
                                            edge="end"
                                            onChange={handleToggleAdd(value.id)}
                                            inputProps={{
                                                "aria-labelledby": value.id
                                            }}
                                            className={classes.successIcon}
                                        /> : 
                                        <PersonAddIcon
                                            edge="end"
                                            onChange={handleToggleAdd(value.id)}
                                            inputProps={{
                                                "aria-labelledby": value.id
                                            }}
                                            className={classes.addIcon}
                                        />
                                    }
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <hr />
                    </>
                );
            })}
        </List>
    );
}

// return (
//   <>
//     {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
//     <ListItem key={props.user.value.id} button onClick={() => handleSetUser(props.user.value)}>
//       <ListItemAvatar>
//         <Avatar
//           alt={`Avatar n°${props.user.value.id}`}
//           src={`${props.user.value.prof_photo_path}`}
//           className={classes.avatar}
//         />
//       </ListItemAvatar>
//       <ListItemText
//         id={props.user.value.id}
//         primary={`${props.user.value.name}`}
//         classes={{primary: classes.list}}
//         style={{color: (props.user.value.gender == 1 ? 'blue' : 'red')}}
//       />
//       <ListItemSecondaryAction>
//         <IconButton style={{backgroundColor: '#d0ddf5'}}>
//           <PersonAddIcon
//             edge="end"
//             onChange={handleToggle(props.user.value.id)}
//             inputProps={{ 'aria-labelledby': props.user.value.id }}
//             className={classes.icon}
//           />
//         </IconButton>
//       </ListItemSecondaryAction>
//     </ListItem>
//     <hr />
//   </>
// );
