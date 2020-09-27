import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedUser } from '../../users/userSlice';
import { makeStyles } from '@material-ui/core/styles';
import {List, ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar, Avatar, IconButton} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: '#f7fad1',
  },
  list: {
    marginLeft: 10,
    fontSize: 20
  },
  avatar: {
    // Avatarのサイズ変更
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  icon: {
    color: 'blue',
    fontSize: 30
  },
}));

export default function UserList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);
  const selectedUsers = useSelector(selectSelectedUser)
  const dispatch = useDispatch()

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    
    setChecked(newChecked);
  };

  // 詳細データの管理用stateを更新
  const handleSetUser = (value) => {
    dispatch(selectedUsers({
      id: value.id,
      prof_photo_name: value.prof_photo_name, 
      prof_photo_path: value.prof_photo_path,
      name: value.name,
      prefecture: value.prefecture,
      birthday: value.birthday,
      gender: value.gender,
      email: value.email,
      status: value.status,
      delete_flg: value.delete_flg,
      created_at: value.created_at,
      updated_at: value.updated_at,
    }))
    console.log(value)
  }

  return (
    <List dense className={classes.root}>
      {_.map(props.user.users, value => {
        const labelId = `user-list-${value.id}`;
        
        return (
          <>
            {/* onClickの記載は関数実行を防ぐため、この記述がマスト */}
            <ListItem key={value.id} button onClick={() => handleSetUser(value)}>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value.id}`}
                  src={`${value.prof_photo_path}`}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText 
                id={labelId} 
                primary={`${value.name}`} 
                classes={{primary: classes.list}} 
                style={{color: (value.gender == 1 ? 'blue' : 'red')}}
              />
              <ListItemSecondaryAction>
                <IconButton style={{backgroundColor: '#d0ddf5'}}>
                  <PersonAddIcon
                    edge="end"
                    onChange={handleToggle(value.id)}
                    inputProps={{ 'aria-labelledby': labelId }}
                    className={classes.icon}
                  />
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