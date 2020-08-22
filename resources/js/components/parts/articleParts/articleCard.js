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
import Box from '@material-ui/core/Box';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyIcon from '@material-ui/icons/Reply';
import DateFormat from '../dateFormat';
import Carousel from '../Carousel';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    backgroundColor: '#e5ecf8',
  },
  headerTitleName: {
    fontSize: 20,
    color: 'blue'
  },
  headerTitleNameWoman: {
    fontSize: 20,
    color: 'red'
  },
  bottomFont: {
    paddingLeft: 10,
    fontSize: 15
  },
  subHeader: {
    fontSize: 15,
    color: '#808080'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  media: {
    height: 200,
    width: '100%',
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

  const nickNameDesign = () => {
    if(props.article.gender === 1) {
      return <Typography className={classes.headerTitleNameWoman}>{props.article.nickName}</Typography>
    }
    return <Typography className={classes.headerTitleName}>{props.article.nickName}</Typography>
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
        //   プロフィール画像の予定
          <Avatar 
            aria-label="article" 
            className={classes.large} 
            style={{ fontSize: 15 }}
            src={props.article.prof_photo_path}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon style={{ fontSize: 20 }} />
          </IconButton>
        }
        title={nickNameDesign()}
        subheader={<Typography className={classes.subHeader}>{DateFormat(props.article.updated_at)}</Typography>}
      />
      <CardMedia
        className={classes.media}
        image={props.article.article_photo_path}
        title={props.article.title}
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
          <FavoriteIcon style={{ fontSize: 20 }} />
        </IconButton>
        {/* 'シェア'ボタンのデザイン */}
        <IconButton aria-label="share">
          <ShareIcon style={{ fontSize: 20 }} />
        </IconButton>
        <Typography className={classes.bottomFont}>{props.article.prefecture}</Typography>
        {/* 拡張ボタンの設定 */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon style={{ fontSize: 20 }} />
        </IconButton>
      </CardActions>
      {/* 拡張のデザイン */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#1b2538', color: 'white' }}>
          <CardContent>
            <Typography paragraph><h2>内容:</h2></Typography>
            <Typography paragraph>
              <h3>{props.article.content}</h3>
            </Typography>
          </CardContent>
        </Box>
        <Typography className={classes.bottomFont}>コメント： 3 件
          <IconButton aria-label="reply">
            <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
          </IconButton>
        </Typography>
      </Collapse>
      {/* // 拡張のデザイン */}
    </Card>
  );
}