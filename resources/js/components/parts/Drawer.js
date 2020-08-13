import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import CommentIcon from '@material-ui/icons/Comment';
import GroupIcon from '@material-ui/icons/Group';
import MapIcon from '@material-ui/icons/Map';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
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
      onClick: () => history.push('/')
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