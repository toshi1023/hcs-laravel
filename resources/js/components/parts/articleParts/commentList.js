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
    <List className={classes.root}>
        {_.map(props.comments, comment => {
            return (
                <div>
                    {
                        comment.article_id === props.articleId 
                        ?
                            <div>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                      <Tooltip title={comment.user_name} classes={{tooltip: classes.tooltip}}>
                                        <Avatar alt={comment.user_name} src={comment.users_photo_path} />
                                      </Tooltip>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={comment.comment}
                                        classes={{ primary: classes.list }}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                        :
                            ''
                    }
                </div>
            )
        })}
    </List>
  );
}