import React from 'react';
import CommentList from './commentList';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Box, CardContent, CardActions, Typography, IconButton, 
         Tooltip, TextField, FormControl, Grid, Button } 
from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MapIcon from '@material-ui/icons/Map';
import ShareIcon from '@material-ui/icons/Share';
import CommentIcon from '@material-ui/icons/Comment';
import ReplyIcon from '@material-ui/icons/Reply';

const useStyles = makeStyles((theme) => ({
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
    likesCounts: {
        color: 'red',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    commentCounts: {
        color: 'blue',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    mobilePrefectureInfo: {
        margin: '0 0 0 auto',
        fontSize: 13,
        fontWeight: 'bold'
    },
    prefectureInfo: {
        margin: '0 0 0 auto',
        fontSize: 15,
        fontWeight: 'bold'
    },
    mobileLabel: {
        fontSize: 18
    },
    label: {
        fontSize: 20
    },
    mobileComment: {
        fontSize: 15,
    },
    comment: {
        fontSize: 17,
    },
    commentField: {
        fontSize: 17,
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    tooltip: {
        fontSize: 14,
    },
    mapButton: {
        marginLeft: theme.spacing(1),
        fontSize: 13,
    }
}))

function ArticleCardExpand (props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false)
    const [state, setState] = React.useState({
        // 保存対象の値
        article_id: props.article.id,
        user_id: localStorage.getItem('loginId'),
        comment: '',
        likesFlg: 
            props.likes ? 
                props.likes[0] != undefined ? 
                    props.likes[0].user_id 
                : false
            : false
    })
    
    /**
     * Google Mapで記事のロケーションを表示
     * @param {*} value 
     */
    const handleMapView = (value) => {
        // ロケーション情報を埋め込んだGoogle MapのURLを変数に代入
        let url = `https://www.google.com/maps?q=${value.latitude},${value.longitude}`;
        // 新規タブを開いてページを遷移
        window.open(url, "google")
    }
    
    /**
     * 拡張ページの表示
     */
    const handleExpandedClick = (value) => {
        setState({
            ...state,
            article_id: value
        })
        setExpanded(!expanded)
    }

    /**
     * コメントの取得
     */
    const handleSetComment = (value) => {
        setState({
            ...state,
            comment: value
        })
    }

    /**
     * いいね！の更新
     */
    const likesUpdate = (article_id) => {
        // ハートのアクティブ・非アクティブ化
        setState({
            ...state,
            likesFlg: !state.likesFlg
        })
        // いいね！の保存処理
        props.likesUpdate(article_id)
    }

    /**
     * コメントの保存処理実行
     */
    const onSubmit = () => {
        // コメントの保存処理
        props.commentsUpdate(state)
        // 入力値の初期化
        document.getElementById('comment').value = ''
        setState({
            ...state,
            comment: ''
        })
    }
    
    return (
        <>
          {/* スマホ版 */}
          <div className={classes.sectionMobile}>
                <CardActions disableSpacing>
                {
                    localStorage.getItem('localToken') ? 
                    <div>
                        {/* 'いいね'ボタンのデザイン */}
                        <IconButton aria-label="add to favorites" onClick={() => likesUpdate(props.article.id)}>
                            {
                                // いいねボタンのアクティブフラグ
                                state.likesFlg ? 
                                    <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                                : 
                                    <FavoriteIcon style={{ fontSize: 20 }} />
                            }
                        </IconButton>
                        <span className={classes.likesCounts}>
                            {
                                // いいね数の取得・表示
                                props.likesCounts ? 
                                    props.likesCounts.likes_counts
                                :
                                    ''
                            }
                        </span>
                        {/* コメントボタンのデザイン(拡張機能あり) */}
                        <IconButton
                            onClick={() => handleExpandedClick(props.article.id)}
                            aria-expanded={expanded}
                            aria-label="comment"
                        >
                            <CommentIcon style={{ fontSize: 17 }} />
                        </IconButton>
                        <span className={classes.commentCounts}>
                            {
                                // コメント数の取得・表示
                                props.commentsCounts != undefined ? 
                                    props.commentsCounts.find(element => element.article_id === props.article.id) != undefined ? 
                                        props.commentsCounts.find(element => element.article_id === props.article.id).comments_counts 
                                    :
                                        ''
                                : 
                                    ''
                            }
                        </span>
                        {/* シェア'ボタンのデザイン */}
                        {/* <IconButton aria-label="share">
                            <ShareIcon style={{ fontSize: 17 }} />
                        </IconButton> */}

                        {/* Mapボタンのデザイン */}
                        <Button variant="contained" color="primary" className={classes.mapButton} onClick={() => handleMapView(props.article)}>
                            <MapIcon />
                        </Button>
                    </div>
                    : ''
                }
                <Typography className={classes.mobilePrefectureInfo}>{props.article.prefecture}</Typography>
                </CardActions>
                {/* 拡張のデザイン */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#fff' }}>
                    <CardContent>
                        <CommentList comments={props.comments} articleId={props.article.id} />
                    </CardContent>
                </Box>
                {
                    localStorage.getItem('localToken') ? 
                        <div className={classes.commentField}>
                            <FormControl>
                                <Grid container justify="center">
                                    <IconButton 
                                        color="primary" 
                                        aria-label="add" 
                                        onClick={onSubmit}
                                    >
                                        <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                                    </IconButton>
                                    <Grid item xs={10}>
                                        <TextField
                                            id="comment"
                                            name="comment"
                                            label="コメント"
                                            variant="outlined"
                                            style={{minWidth: 250, backgroundColor: 'white'}}
                                            onChange={(e) => handleSetComment(e.target.value)}
                                            multiline
                                        />
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </div>
                    : ''
                }
                </Collapse>
                {/* // 拡張のデザイン */}
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
            <CardActions disableSpacing>
                {
                    localStorage.getItem('localToken') ? 
                    <div>
                        {/* 'いいね'ボタンのデザイン */}
                        <Tooltip title="いいね！" classes={{tooltip: classes.tooltip}}>
                            <IconButton aria-label="add to favorites" onClick={() => likesUpdate(props.article.id)}>
                                {
                                    // いいねボタンのアクティブフラグ
                                    state.likesFlg ? 
                                        <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                                    : 
                                        <FavoriteIcon style={{ fontSize: 20 }} />
                                }
                            </IconButton>
                        </Tooltip>
                        <span className={classes.likesCounts}>
                            {
                                // いいね数の取得・表示
                                props.likesCounts ? 
                                    props.likesCounts.likes_counts
                                :
                                    ''
                            }
                        </span>
                        {/* コメントボタンのデザイン(拡張機能あり) */}
                        <Tooltip title="コメントを見る" classes={{tooltip: classes.tooltip}}>
                            <IconButton
                                onClick={() => handleExpandedClick(props.article.id)}
                                aria-expanded={expanded}
                                aria-label="comment"
                            >
                                <CommentIcon style={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                        <span className={classes.commentCounts}>
                            {
                                // コメント数の取得・表示
                                props.commentsCounts != undefined ? 
                                    props.commentsCounts.find(element => element.article_id === props.article.id) != undefined ? 
                                        props.commentsCounts.find(element => element.article_id === props.article.id).comments_counts 
                                    :
                                        ''
                                : 
                                    ''
                            }
                        </span>
                        {/* シェア'ボタンのデザイン */}
                        {/* <Tooltip title="シェアする" classes={{tooltip: classes.tooltip}}>
                            <IconButton aria-label="share">
                                <ShareIcon style={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip> */}

                        {/* Mapボタンのデザイン */}
                        <Tooltip title="Mapで場所を確認" classes={{tooltip: classes.tooltip}}>
                            <Button variant="contained" color="primary" className={classes.mapButton} onClick={() => handleMapView(props.article)}>
                                <MapIcon />
                            </Button>
                        </Tooltip>
                    </div>
                    : ''
                }
                <Typography className={classes.prefectureInfo}>{props.article.prefecture}</Typography>
                </CardActions>
                {/* 拡張のデザイン */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box component="div" m={1} borderRadius={16} style={{ backgroundColor: '#fff' }}>
                    <CardContent>
                        <CommentList comments={props.comments} articleId={props.article.id} />
                    </CardContent>
                </Box>
                {
                    localStorage.getItem('localToken') ? 
                    <div className={classes.commentField}>
                        <FormControl>
                            <Grid container justify="center">
                                <Tooltip title="投稿する" classes={{tooltip: classes.tooltip}}>
                                    <IconButton 
                                        color="primary" 
                                        aria-label="add" 
                                        onClick={onSubmit}
                                    >
                                        <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                                    </IconButton>
                                </Tooltip>
                                <Grid item sm={10}>
                                    <TextField
                                        id="comment"
                                        name="comment"
                                        label="コメント"
                                        variant="outlined"
                                        style = {{marginLeft: 10, minWidth: 400, backgroundColor: 'white'}}
                                        onChange={(e) => handleSetComment(e.target.value)}
                                        multiline
                                    />
                                </Grid>
                            </Grid>
                        </FormControl>
                    </div>
                    : ''
                }
                </Collapse>
                {/* // 拡張のデザイン */}
            </div>  
        </>
    )
}

export default ArticleCardExpand
