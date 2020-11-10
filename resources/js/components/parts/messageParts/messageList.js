import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {List, ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar, Avatar, IconButton, Badge, Typography} from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: '#f7fad1',
  },
  list: {
    marginLeft: 10,
  },
  avatar: {
    // Avatarのサイズ変更
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  sender_name: {
    marginLeft: 10,
    fontSize: 15,
  },
  icon: {
    color: 'blue',
    fontSize: 30
  },
}));

/**
 * Typographyのカスタマイズ
 */
const theme = createMuiTheme();
theme.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
};

export default function MessageList(props) {
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
      {_.map(props.message.messages, value => {
        const labelId = `checkbox-list-secondary-label-${value.id}`;
        
        return (
          <>
            <ListItem key={value.id} button >
              <ListItemAvatar>
                <Avatar
                  alt={value.user_id_sender}
                  src={value.sender_photo}
                  className={classes.avatar}
                />
                <p className={classes.name} style={{color: (value.gender == 1 ? 'blue' : 'red')}}>{value.name}</p>
              </ListItemAvatar>
              <div style={{ width: '70%', whiteSpace: 'nowrap' }}>
                <ListItemText 
                  id={labelId} 
                  primary={
                    <ThemeProvider theme={theme}>
                      <Typography variant="h3" noWrap>{value.content}</Typography>
                    </ThemeProvider>
                  } 
                  classes={{primary: classes.list}}
                />
              </div>
              <ListItemSecondaryAction>
                <Badge badgeContent={1} color="secondary">
                  <IconButton style={{backgroundColor: '#d0ddf5'}}>
                    <ReplyIcon
                      edge="end"
                      onChange={handleToggle(value)}
                      inputProps={{ 'aria-labelledby': labelId }}
                      className={classes.icon}
                    />
                  </IconButton>
                </Badge>
              </ListItemSecondaryAction>
            </ListItem>
            <hr />
          </>
        );
      })}
    </List>
  );
}