import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  tooltip: {
    fontSize: 14,
  },
  list: {
    marginLeft: theme.spacing(1),
    fontSize: 15
  },
}));

export default function CommentList(props) {
  const classes = useStyles();
  
  return (
    <List className={classes.root} onClick={() => reloadComment(props.articleId)} key={props.articleId}>
        {_.map(props.comments, comment => {
          if (comment != undefined && comment.article_id === props.articleId) {
            return (
              <div>
                  {
                    <div>
                        <ListItem alignItems="flex-start" key={comment.id}>
                            <ListItemAvatar key={comment.id}>
                              <Tooltip title={comment.users.name} classes={{tooltip: classes.tooltip}} key={comment.id}>
                                <Avatar alt={comment.users.name} src={comment.users.users_photo_path} key={comment.id} />
                              </Tooltip>
                            </ListItemAvatar>
                            <ListItemText
                                primary={comment.comment}
                                classes={{ primary: classes.list }}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                  }
              </div>
            )
          }
        })}
    </List>
  );
}