import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DateFormat from './dateFormat';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    backgroundColor: '#e5ecf8',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)', // 拡張ボタンの矢印の向きを下向きに設定
    marginLeft: 'auto',        // 拡張ボタンを右端に配置
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    // 180deg: 拡張時にボタンの矢印を180°反転させる
    transform: 'rotate(180deg)',
  },
}));

export default function ArticleCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
        //   プロフィール画像の予定
          <Avatar aria-label="article">
            Root
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.article.prefecture}
        subheader={DateFormat(props.article.updated_at)}
      />
      <CardMedia
        className={classes.media}
        // image="/static/images/cards/paella.jpg"
        title="Sample Image"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {/* 文字列の省略設定(一定数を表示した後、...で省略) */}
          <div style={{ width: '100%', whiteSpace: 'nowrap' }}>
            <h2 className="overflow-ellipsis">
              {props.article.content}
            </h2>
          </div>
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* 'いいね'ボタンのデザイン */}
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        {/* 'シェア'ボタンのデザイン */}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {/* 拡張ボタンの設定 */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>

      </CardActions>
      {/* 拡張のデザイン */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph><h2>内容:</h2></Typography>
          <Typography paragraph>
            <h3>{props.article.content}</h3>
          </Typography>
        </CardContent>
      </Collapse>
      {/* // 拡張のデザイン */}
    </Card>
  );
}