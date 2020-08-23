import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {List, ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar, Avatar, IconButton} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
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

export default function UserList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);

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

  return (
    <List dense className={classes.root}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <>
            <ListItem key={value} button >
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={'https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no_image.png'}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} classes={{primary: classes.list}} />
              <ListItemSecondaryAction>
                <IconButton style={{backgroundColor: '#d0ddf5'}}>
                  <PersonAddIcon
                    edge="end"
                    onChange={handleToggle(value)}
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