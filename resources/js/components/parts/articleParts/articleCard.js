import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArticleCardExpand from './articleCardExpand';
import { fetchCredStart, fetchCredEnd, fetchGetInfoMessages, fetchGetErrorMessages, fetchOpenModal, selectInfo } from '../../app/appSlice';
import { 
  selectLikes, fetchAsyncUpdateLikes, selectCommentsCounts, 
  fetchAsyncGetCommentsCounts, fetchAsyncUpdateComments, editArticle, fetchAsyncDelete
} from '../../articles/articleSlice';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import {Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Box, Typography, Menu, MenuItem} 
from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DateFormat from '../common/dateFormat';
import SnackMessages from '../common/snackMessages';
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
    fontSize: 17,
    whiteSpace: 'pre-line',  // 文字データに改行コードが含まれる場合、改行を実行
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
    whiteSpace: 'pre-line',  // 文字データに改行コードが含まれる場合、改行を実行
  },
}));

export default function ArticleCard(props) {
  const classes = useStyles();
  const likes = useSelector(selectLikes)
  // const comments = useSelector(selectComments)
  const commentsCounts = useSelector(selectCommentsCounts)
  const infoMessages = useSelector(selectInfo)
  const dispatch = useDispatch()

  /**
   * 性別をトリガーにユーザ名の色分け処理を実行
   * @param {*} value 
   */
  const nickNameDesign = (value) => {
    // 記事の投稿者が男性の場合
    if(value.users != undefined ? value.users.gender === 1 : false) {
      return (
        <div>
          <div className={classes.sectionDesktop}>
            <Typography className={classes.headerTitleName}>{value.users != undefined ? value.users.name : ''}</Typography>
          </div>
          <div className={classes.sectionMobile}>
            <Typography className={classes.mobileHeaderTitleName}>{value.users != undefined ? value.users.name : ''}</Typography>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div className={classes.sectionDesktop}>
          <Typography className={classes.headerTitleNameWoman}>{value.users != undefined ? value.users.name : ''}</Typography>
        </div>
        <div className={classes.sectionMobile}>
          <Typography className={classes.mobileHeaderTitleNameWoman}>{value.users != undefined ? value.users.name : ''}</Typography>
        </div>
      </div>
    )
  }
  
  /**
   * 記事の編集モーダルを表示
   * @param {*} value 
   */
  const editModal = (value) => {
    dispatch(editArticle(value))
    dispatch(fetchOpenModal(true))
    return;
  }
  /**
   * 記事の削除処理
   * @param {*} value 
   */
  const deleteModal = async (value) => {
    if (confirm('この記事を削除しますか？')) {
      // 記事の削除処理
      const resultReg = await dispatch(fetchAsyncDelete(value))
      if (fetchAsyncDelete.fulfilled.match(resultReg)) {
        // infoメッセージの表示
        resultReg.payload.info_message ? dispatch(fetchGetInfoMessages(resultReg)) : dispatch(fetchGetErrorMessages(resultReg))     
      }
      return;
    }
    return;
  }

  /**
   * 操作ボタンのクリック時
   * @param {*} value 
   */
  const handleButton = (value) => {
    return (
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <React.Fragment>
            <IconButton aria-label="settings" {...bindTrigger(popupState)}>
              <MoreVertIcon style={{ fontSize: 20 }} />
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem className={classes.menuItem} onClick={popupState.close, () => editModal(value)}><EditIcon style={{ marginRight: 5, color: 'blue' }} />編集</MenuItem>
              <MenuItem className={classes.menuItem} onClick={popupState.close, () => deleteModal(value.id)}><DeleteForeverIcon style={{ marginRight: 5, color: 'red' }} />削除</MenuItem>
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

        // ロード終了
        await dispatch(fetchCredEnd()); 
        return;
    }
    // ロード終了
    await dispatch(fetchCredEnd()); 
    return;
  }
  
  return (
    _.map(props.article, article => (
      <>
        {
          // メッセージ表示
          infoMessages ? 
              <SnackMessages infoOpen={true} />
          :
              <SnackMessages errorOpen={true} />
        }
        {/* スマホ版 */}
        {
          // 記事の公開が限定されている場合
          article.type == 1 ? 
            localStorage.getItem('localToken') ? 
              <div className={classes.sectionMobile}>
                <Card className={classes.mobileRoot} key={article.id}>
                  <CardHeader
                    avatar={
                    //   プロフィール画像
                      <Avatar 
                        aria-label="article" 
                        className={classes.large} 
                        style={{ fontSize: 15 }}
                        src={article.users != undefined ? article.users.users_photo_path : ''}
                      />
                    }
                    action={
                      // ログインユーザが生成した記事以外は表示しないように設定
                      article.user_id == localStorage.getItem('loginId') ? 
                        handleButton(article)
                      : ''
                    }
                    title={<Typography className={classes.mobileHeaderTitle}>{article.title}</Typography>}
                    subheader={nickNameDesign(article)}
                  />
                  <CardMedia
                    className={classes.media}
                    image={article.article_images != undefined ? article.article_images[0].articles_photo_path : ''}
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
                  <ArticleCardExpand 
                    article={article} 
                    likesCounts={article.likes_counts != undefined ? article.likes_counts : ''} 
                    likes={article.likes != undefined ? article.likes : ''} 
                    likesUpdate={likesUpdate}
                    comments={article.comments != undefined ? article.comments : ''}
                    commentsCounts={article.comments_counts != undefined ? article.comments_counts : ''}
                    commentsUpdate={commentsUpdate} 
                  />
                </Card>
              </div>
            :
              ''
          :
            <div className={classes.sectionMobile}>
              <Card className={classes.mobileRoot} key={article.id}>
                <CardHeader
                  avatar={
                  //   プロフィール画像
                    <Avatar 
                      aria-label="article" 
                      className={classes.large} 
                      style={{ fontSize: 15 }}
                      src={article.users != undefined ? article.users.users_photo_path : ''}
                    />
                  }
                  action={
                    // ログインユーザが生成した記事以外は表示しないように設定
                    article.user_id == localStorage.getItem('loginId') ? 
                      handleButton(article)
                    : ''
                  }
                  title={<Typography className={classes.mobileHeaderTitle}>{article.title}</Typography>}
                  subheader={nickNameDesign(article)}
                />
                <CardMedia
                  className={classes.media}
                  image={article.article_images != undefined ? article.article_images[0].articles_photo_path : ''}
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
                <ArticleCardExpand 
                  article={article} 
                  likesCounts={article.likes_counts != undefined ? article.likes_counts : ''} 
                  likes={article.likes != undefined ? article.likes : ''} 
                  likesUpdate={likesUpdate}
                  comments={article.comments != undefined ? article.comments : ''}
                  commentsCounts={article.comments_counts}
                  commentsUpdate={commentsUpdate} 
                />
              </Card>
            </div>
        }

        {/* PC版 */}
        {
          // 記事の公開が限定されている場合
          article.type == 1 ? 
            localStorage.getItem('localToken') ? 
              <div className={classes.sectionDesktop}>
                <Card className={classes.root} key={article.id}>
                  <CardHeader
                    avatar={
                      // プロフィール画像
                      <Avatar 
                        aria-label="article" 
                        className={classes.large} 
                        style={{ fontSize: 15 }}
                        src={article.users != undefined ? article.users.users_photo_path : ''}
                      />
                    }
                    action={
                      // ログインユーザが生成した記事以外は表示しないように設定
                      article.user_id == localStorage.getItem('loginId') ? 
                        handleButton(article)
                      : ''
                    }
                    title={<Typography className={classes.headerTitle}>{article.title}</Typography>}
                    subheader={nickNameDesign(article)}
                  />
                  <CardMedia
                    className={classes.media}
                    image={article.article_images != undefined ? article.article_images[0].articles_photo_path : ''}
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
                    likesCounts={article.likes_counts != undefined ? article.likes_counts : ''} 
                    likes={article.likes != undefined ? article.likes : ''} 
                    likesUpdate={likesUpdate}
                    comments={article.comments != undefined ? article.comments : ''}
                    commentsCounts={article.comments_counts} 
                    commentsUpdate={commentsUpdate} 
                  />
                </Card>
              </div>
            :
              ''
          :
            <div className={classes.sectionDesktop}>
              <Card className={classes.root} key={article.id}>
                <CardHeader
                  avatar={
                    // プロフィール画像
                    <Avatar 
                      aria-label="article" 
                      className={classes.large} 
                      style={{ fontSize: 15 }}
                      src={article.users != undefined ? article.users.users_photo_path : ''}
                    />
                  }
                  action={
                    // ログインユーザが生成した記事以外は表示しないように設定
                    article.user_id == localStorage.getItem('loginId') ? 
                      handleButton(article)
                    : ''
                  }
                  title={<Typography className={classes.headerTitle}>{article.title}</Typography>}
                  subheader={nickNameDesign(article)}
                />
                <CardMedia
                  className={classes.media}
                  image={article.article_images != undefined ? article.article_images[0].articles_photo_path : ''}
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
                  likesCounts={article.likes_counts != undefined ? article.likes_counts : ''} 
                  likes={article.likes != undefined ? article.likes : ''} 
                  likesUpdate={likesUpdate} 
                  comments={article.comments != undefined ? article.comments : ''}
                  commentsCounts={article.comments_counts != undefined ? article.comments_counts : ''} 
                  commentsUpdate={commentsUpdate} 
                />
              </Card>
            </div>
        }
      </>
    ))
  );
}