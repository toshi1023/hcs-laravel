import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd } from '../../app/appSlice';
import { selectLikes, fetchAsyncGetLikes, selectSelectedLike, fetchAsyncUpdateLikes } from '../../articles/articleSlice';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import _ from 'lodash';
import {Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Box, Menu, MenuItem} 
from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DateFormat from '../common/dateFormat';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
    backgroundColor: '#f7fad1',
    marginTop: 10,
    marginBottom: 10,
  },
  mobileRoot: {
    minWidth: 200,
    backgroundColor: '#f7fad1',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
        display: "block"
    }
  },
  sectionMobile: {
      display: "block",
      [theme.breakpoints.up("sm")]: {
          display: "none"
      }
  },
  headerTitle: {
    fontSize: 20,
  },
  headerTitleName: {
    fontSize: 20,
    color: 'blue'
  },
  headerTitleNameWoman: {
    fontSize: 20,
    color: 'red'
  },
  menuItem: {
    fontSize: 15,
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
  likesCounts: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
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
  mobileHeaderTitle: {
    fontSize: 15,
  },
  mobileHeaderTitleName: {
    fontSize: 12,
    color: 'blue'
  },
  mobileHeaderTitleNameWoman: {
    fontSize: 12,
    color: 'red'
  },
  mobileContent: {
    fontSize: 15,
  },
}));

export default function ArticleCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false)
  const likes = useSelector(selectLikes)
  const selectedLike = useSelector(selectSelectedLike)
  const dispatch = useDispatch()

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    // 非同期の関数を定義
    const fetchArticleLikes = async () => {
      // Loading開始
      await dispatch(fetchCredStart())
      // いいね一覧を取得
      const resultReg = await dispatch(fetchAsyncGetLikes({user_id: localStorage.getItem('loginId')}))
      
      if (fetchAsyncGetLikes.fulfilled.match(resultReg)) {
        // ロード終了
        await dispatch(fetchCredEnd());       
      }
      // ロード終了
      await dispatch(fetchCredEnd());  
    }
    // 上で定義した非同期の関数を実行
    fetchArticleLikes()
    
  }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある
  
  // 性別によって名前の色を色分け
  const nickNameDesign = (value) => {
    if(value.gender === 1) {
      return (
        <div>
          <div className={classes.sectionDesktop}>
            <Typography className={classes.headerTitleName}>{value.name}</Typography>
          </div>
          <div className={classes.sectionMobile}>
            <Typography className={classes.mobileHeaderTitleName}>{value.name}</Typography>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div className={classes.sectionDesktop}>
          <Typography className={classes.headerTitleNameWoman}>{value.name}</Typography>
        </div>
        <div className={classes.sectionMobile}>
          <Typography className={classes.mobileHeaderTitleNameWoman}>{value.name}</Typography>
        </div>
      </div>
    )
  }
  
  // 記事の削除処理
  const deleteArticle = () => {
    if (confirm('この記事を削除しますか？')) {
      // 記事の削除処理

      return;
    }
    return;
  }

  // 操作ボタンのクリック時
  const handleButton = () => {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <IconButton aria-label="settings" {...bindTrigger(popupState)}>
              <MoreVertIcon style={{ fontSize: 20 }} />
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem className={classes.menuItem} onClick={popupState.close}><EditIcon style={{ marginRight: 5, color: 'blue' }} />編集</MenuItem>
              <MenuItem className={classes.menuItem} onClick={popupState.close, deleteArticle}><DeleteForeverIcon style={{ marginRight: 5, color: 'red' }} />削除</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
  }

  /**
   * いいねの更新処理
   */
  const likesUpdate = async (article_id) => {
    // Loading開始
    await dispatch(fetchCredStart())
    // いいねの更新処理
    const resultReg = await dispatch(fetchAsyncUpdateLikes({article_id: article_id, user_id: localStorage.getItem('loginId')}))
    
    if (fetchAsyncUpdateLikes.fulfilled.match(resultReg)) {
      // いいねを再取得
      await dispatch(fetchAsyncGetLikes({user_id: localStorage.getItem('loginId')}))
      // ロード終了
      await dispatch(fetchCredEnd());       
    }
    // ロード終了
    await dispatch(fetchCredEnd());  
  }
  
  return (
    _.map(props.article, article => (
      <>
        {/* スマホ版 */}
        <div className={classes.sectionMobile}>
          <Card className={classes.mobileRoot}>
            <CardHeader
              avatar={
              //   プロフィール画像
                <Avatar 
                  aria-label="article" 
                  className={classes.large} 
                  style={{ fontSize: 15 }}
                  src={article.users_photo_path}
                />
              }
              action={
                // ログインユーザが生成した記事以外は表示しないように設定
                article.user_id == localStorage.getItem('loginId') ? 
                  handleButton()
                : ''
              }
              title={<Typography className={classes.mobileHeaderTitle}>{article.title}</Typography>}
              subheader={nickNameDesign(article)}
            />
            <CardMedia
              className={classes.media}
              image={article.articles_photo_path}
              title={article.title}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {/* 文字列の省略設定(一定数を表示した後、...で省略) */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h2 style={{ overflow: 'hidden',  whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    <span className={classes.mobileContent}>{article.content}</span>
                  </h2>
                </div>
              </Typography>
              <Typography className={classes.subHeader}>{DateFormat(article.updated_at)}</Typography>
            </CardContent>
            <CardActions disableSpacing>
              {
                localStorage.getItem('localToken') ? 
                <div>
                  {/* 'いいね'ボタンのデザイン */}
                  <IconButton aria-label="add to favorites" onClick={() => likesUpdate(article.id)}>
                    {
                      // いいねボタンのアクティブフラグ
                      likes.likes != undefined ? 
                        (_.map(likes.likes, like => (
                          like.find(element => element.article_id === article.id).user_id
                        ))[0] == null ? 
                          <FavoriteIcon style={{ fontSize: 20 }} />
                        : <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                        )
                      : ''
                    }
                  </IconButton>
                  <span className={classes.likesCounts}>
                    {
                      // いいね数の取得・表示
                      likes.likes != undefined ? 
                        _.map(likes.likes, like => (
                          like.find(element => element.article_id === article.id).likes_counts
                        )) 
                      : ''
                    }
                  </span>
                  {/* シェア'ボタンのデザイン */}
                  <IconButton aria-label="share">
                    <ShareIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </div>
                : ''
              }
              <Typography className={classes.bottomFont}>{article.prefecture}</Typography>
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
                    <span className={classes.mobileContent}>{article.content}</span>
                  </Typography>
                </CardContent>
              </Box>
              <Typography className={classes.bottomFont}>コメント： 3 件
              {
                localStorage.getItem('localToken') ? 
                <IconButton aria-label="reply">
                  <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                </IconButton>
                : ''
              }
              </Typography>
            </Collapse>
            {/* // 拡張のデザイン */}
          </Card>
        </div>

        {/* PC版 */}
        <div className={classes.sectionDesktop}>
          <Card className={classes.root}>
            <CardHeader
              avatar={
              //   プロフィール画像
                <Avatar 
                  aria-label="article" 
                  className={classes.large} 
                  style={{ fontSize: 15 }}
                  src={article.users_photo_path}
                />
              }
              action={
                // ログインユーザが生成した記事以外は表示しないように設定
                article.user_id == localStorage.getItem('loginId') ? 
                  handleButton()
                : ''
              }
              title={<Typography className={classes.headerTitle}>{article.title}</Typography>}
              subheader={nickNameDesign(article)}
            />
            <CardMedia
              className={classes.media}
              image={article.articles_photo_path}
              title={article.title}
            />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {/* 文字列の省略設定(一定数を表示した後、...で省略) */}
                <div style={{ width: '100%', whiteSpace: 'nowrap' }}>
                  <h2 className="overflow-ellipsis">
                    {article.content}
                  </h2>
                </div>
              </Typography>
              <Typography className={classes.subHeader}>{DateFormat(article.updated_at)}</Typography>
            </CardContent>
            <CardActions disableSpacing>
              {
                localStorage.getItem('localToken') ? 
                <div>
                  {/* 'いいね'ボタンのデザイン */}
                  <IconButton aria-label="add to favorites" onClick={() => likesUpdate(article.id)}>
                    {
                        likes.likes != undefined ? 
                          (_.map(likes.likes, like => (
                            like.find(element => element.article_id === article.id).user_id
                          ))[0] == null ? 
                            <FavoriteIcon style={{ fontSize: 20 }} />
                          : <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                          )
                        : ''
                    }
                  </IconButton>
                  <span className={classes.likesCounts}>
                    {
                      // いいね数の取得・表示
                      likes.likes != undefined ? 
                        _.map(likes.likes, like => (
                          like.find(element => element.article_id === article.id).likes_counts
                        )) 
                      : ''
                    }
                  </span>
                  {/* シェア'ボタンのデザイン */}
                  <IconButton aria-label="share">
                    <ShareIcon style={{ fontSize: 20 }} />
                  </IconButton>
                </div>
                : ''
              }
              <Typography className={classes.bottomFont}>{article.prefecture}</Typography>
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
                    <h3>{article.content}</h3>
                  </Typography>
                </CardContent>
              </Box>
              <Typography className={classes.bottomFont}>コメント： 3 件
              {
                localStorage.getItem('localToken') ? 
                <IconButton aria-label="reply">
                  <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                </IconButton>
                : ''
              }
              </Typography>
            </Collapse>
            {/* // 拡張のデザイン */}
          </Card>
        </div>
      </>
    ))
  );
}