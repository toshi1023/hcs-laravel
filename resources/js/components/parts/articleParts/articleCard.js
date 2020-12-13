import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArticleCardExpand from './articleCardExpand';
import { fetchCredStart, fetchCredEnd, fetchGetInfoMessages, fetchGetErrorMessages } from '../../app/appSlice';
import { 
  selectLikes, fetchAsyncGetLikes, fetchAsyncUpdateLikes, selectComments, selectCommentsCounts, 
  fetchAsyncGetComments, fetchAsyncUpdateComments
} from '../../articles/articleSlice';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import {Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Box, Typography, Menu, MenuItem} 
from '@material-ui/core';
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
  label: {
    fontSize: 20
  },
  content: {
    fontSize: 17
  },
  bottomFont: {
    paddingLeft: 10,
    fontSize: 15
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
  mobileLabel: {
    fontSize: 18,
  },
  mobileContent: {
    fontSize: 15,
  },
}));

export default function ArticleCard(props) {
  const classes = useStyles();
  const likes = useSelector(selectLikes)
  const comments = useSelector(selectComments)
  const commentsCounts = useSelector(selectCommentsCounts)
  const dispatch = useDispatch()

  useEffect(() => {
    // 非同期の関数を定義
    const fetchArticleEnv = async () => {
      // Loading開始
      await dispatch(fetchCredStart())
      // いいね一覧を取得
      const resultReg = await dispatch(fetchAsyncGetLikes({user_id: localStorage.getItem('loginId')}))
      // コメント一覧を取得
      const resultCommnets = await dispatch(fetchAsyncGetComments())
      
      if (fetchAsyncGetLikes.fulfilled.match(resultReg) && fetchAsyncGetComments.fulfilled.match(resultCommnets)) {
        // ロード終了
        await dispatch(fetchCredEnd());       
      }
      // ロード終了
      await dispatch(fetchCredEnd());  
    }
    // 上で定義した非同期の関数を実行
    fetchArticleEnv()
    
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

  /**
   * コメントの保存処理
   */
  const commentsUpdate = async (value) => {
    // ロード開始
    await dispatch(fetchCredStart())
    
    const result = await dispatch(fetchAsyncUpdateComments(value))
    if (fetchAsyncUpdateComments.fulfilled.match(result)) {
        // infoメッセージの表示
        result.payload.info_message ? dispatch(fetchGetInfoMessages(result)) : dispatch(fetchGetErrorMessages(result))
        // コメントを再取得
        await dispatch(fetchAsyncGetComments())
        // ロード終了
        await dispatch(fetchCredEnd()); 
        return;
    }
    // ロード終了
    await dispatch(fetchCredEnd()); 
    return;
  }
  // console.log(likes.data != undefined ? likes.data : '')
  return (
    _.map(props.article != undefined ? props.article : '', article => (
      <>
        {/* スマホ版 */}
        {
          // 記事の公開が限定されている場合
          article.type == 1 ? 
            localStorage.getItem('localToken') ? 
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
                    <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#1b2538', color: 'white' }}>
                      <CardContent>
                      <Typography paragraph><span className={classes.mobileLabel}>内容:</span></Typography>
                      <Typography paragraph>
                          <span className={classes.mobileContent}>{article.content}</span>
                      </Typography>
                      </CardContent>
                    </Box>
                    <Typography className={classes.subHeader}>{DateFormat(article.updated_at)}</Typography>
                  </CardContent>
                  {/* 拡張のデザイン */}
                  {/* <ArticleCardExpand 
                    article={article} 
                    likes={likes.data != undefined ? likes.data : ''} 
                    likesUpdate={likesUpdate}
                    comments={comments} 
                    commentsCounts={commentsCounts}
                    commentsUpdate={commentsUpdate} 
                  /> */}
                </Card>
              </div>
            :
              ''
          :
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
                  <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#1b2538', color: 'white' }}>
                    <CardContent>
                    <Typography paragraph><span className={classes.mobileLabel}>内容:</span></Typography>
                    <Typography paragraph>
                        <span className={classes.mobileContent}>{article.content}</span>
                    </Typography>
                    </CardContent>
                  </Box>
                  <Typography className={classes.subHeader}>{DateFormat(article.updated_at)}</Typography>
                </CardContent>
                {/* 拡張のデザイン */}
                {/* <ArticleCardExpand 
                  article={article} 
                  likes={likes.data != undefined ? likes.data : ''} 
                  likesUpdate={likesUpdate}
                  comments={comments} 
                  commentsCounts={commentsCounts}
                  commentsUpdate={commentsUpdate} 
                /> */}
              </Card>
            </div>
        }

        {/* PC版 */}
        {
          // 記事の公開が限定されている場合
          article.type == 1 ? 
            localStorage.getItem('localToken') ? 
              <div className={classes.sectionDesktop}>
                <Card className={classes.root}>
                  <CardHeader
                    avatar={
                      // プロフィール画像
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
                    <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#1b2538', color: 'white' }}>
                      <CardContent>
                      <Typography paragraph><span className={classes.label}>内容:</span></Typography>
                      <Typography paragraph>
                          <span className={classes.content}>{article.content}</span>
                      </Typography>
                      </CardContent>
                    </Box>
                    <Typography className={classes.subHeader}>{DateFormat(article.updated_at)}</Typography>
                  </CardContent>
                  {/* 拡張のデザイン */}
                  <ArticleCardExpand 
                    article={article} 
                    likes={likes.data != undefined ? likes.data : ''} 
                    likesUpdate={likesUpdate} 
                    comments={comments} 
                    commentsCounts={commentsCounts} 
                    commentsUpdate={commentsUpdate} 
                  />
                </Card>
              </div>
            :
              ''
          :
            <div className={classes.sectionDesktop}>
              <Card className={classes.root}>
                <CardHeader
                  avatar={
                    // プロフィール画像
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
                  <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#1b2538', color: 'white' }}>
                    <CardContent>
                    <Typography paragraph><span className={classes.label}>内容:</span></Typography>
                    <Typography paragraph>
                        <span className={classes.content}>{article.content}</span>
                    </Typography>
                    </CardContent>
                  </Box>
                  <Typography className={classes.subHeader}>{DateFormat(article.updated_at)}</Typography>
                </CardContent>
                {/* 拡張のデザイン */}
                <ArticleCardExpand 
                  article={article} 
                  likes={likes.data != undefined ? likes.data : ''} 
                  likesUpdate={likesUpdate} 
                  comments={comments} 
                  commentsCounts={commentsCounts} 
                  commentsUpdate={commentsUpdate} 
                />
              </Card>
            </div>
        }
      </>
    ))
  );
}