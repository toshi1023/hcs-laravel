import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import CommentIcon from '@material-ui/icons/Comment';
import GroupIcon from '@material-ui/icons/Group';
import MapIcon from '@material-ui/icons/Map';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import InfoIcon from '@material-ui/icons/Info';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';

const useStyles = makeStyles({
  list: {
    width: 200,
  },
  fullList: {
    width: 'auto',
  },
});

const MenuDrawer = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  // URL遷移のために設定
  const { history } = props

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // リスト一覧
  const itemList = [
    {
      text: 'Home',
      icon: <HomeIcon />,
      onClick: () => history.push('/')
    },
    {
      text: 'Map',
      icon: <MapIcon />,
      onClick: () => history.push('/')
    },
    {
      text: '記事',
      icon: <CommentIcon />,
      onClick: () => history.push('/articles')
    },
    {
      text: 'フレンド',
      icon: <GroupIcon />,
      onClick: () => history.push('/users')
    },
    {
      text: 'メッセージ',
      icon: <MailIcon />,
      onClick: () => history.push('/messages')
    }, 
  ]

  // リストを実装
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {itemList.map((item, index) => {
          const { text, icon, onClick } = item
          return (
            <ListItem button key={text} onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          )
        })}
      </List>
      <Divider />
      <List>
        {['公式ニュース'].map((text, index) => (
          <ListItem button key={text} onClick={() => history.push('/')}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <List>
        {['ログイン'].map((text, index) => (
          <ListItem button key={text} onClick={() => history.push('/login')}>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <List>
        {['ログアウト'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon><InboxIcon /></ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Drawerを実装
  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
          >
            <MenuIcon />
          </IconButton>      
          <Drawer 
            anchor={anchor} 
            open={state[anchor]} 
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default withRouter(MenuDrawer)