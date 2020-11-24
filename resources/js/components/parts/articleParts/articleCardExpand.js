import React from 'react';
import CommentList from './commentList';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Box, CardContent, CardActions, Typography, IconButton, Tooltip, TextField, FormControl } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
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
}))

function ArticleCardExpand (props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false)
    const [state, setState] = React.useState({
        // 保存対象の値
        article_id: props.article.id,
        user_id: localStorage.getItem('loginId'),
        comment: ''
    })
    // console.log(state)
    /**
     * 拡張ページの表示
     */
    const handleExpandedClick = () => {
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
                        <IconButton aria-label="add to favorites" onClick={() => props.likesUpdate(props.article.id)}>
                            {
                                // いいねボタンのアクティブフラグ
                                props.likes.find(element => element.article_id === props.article.id) != undefined
                                ? 
                                    props.likes.find(element => element.article_id === props.article.id).user_id == null 
                                    ? 
                                        <FavoriteIcon style={{ fontSize: 20 }} />
                                    : 
                                        <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                                : 
                                    ''
                            }
                        </IconButton>
                        <span className={classes.likesCounts}>
                            {
                                // いいね数の取得・表示
                                props.likes.find(element => element.article_id === props.article.id) != undefined 
                                ? 
                                    props.likes.find(element => element.article_id === props.article.id).likes_counts
                                : 
                                    ''
                            }
                        </span>
                        {/* コメントボタンのデザイン(拡張機能あり) */}
                        <IconButton
                            onClick={handleExpandedClick}
                            aria-expanded={expanded}
                            aria-label="comment"
                        >
                            <CommentIcon style={{ fontSize: 17 }} />
                        </IconButton>
                        <span className={classes.commentCounts}>
                            {
                                // コメント数の取得・表示
                                props.commentsCounts.find(element => element.article_id === props.article.id) != undefined 
                                ? 
                                    props.commentsCounts.find(element => element.article_id === props.article.id).comments_counts
                                : 
                                    ''
                                }
                        </span>
                        {/* シェア'ボタンのデザイン */}
                        <IconButton aria-label="share">
                            <ShareIcon style={{ fontSize: 17 }} />
                        </IconButton>
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
                                <IconButton 
                                    color="primary" 
                                    aria-label="add" 
                                    onClick={onSubmit}
                                >
                                    <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                                </IconButton>
                                <TextField
                                    id="comment"
                                    name="comment"
                                    label="コメント"
                                    variant="outlined"
                                    style={{marginLeft: 10, minWidth: 250, backgroundColor: 'white'}}
                                    onChange={(e) => handleSetComment(e.target.value)}
                                    multiline
                                />
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
                            <IconButton aria-label="add to favorites" onClick={() => props.likesUpdate(props.article.id)}>
                                {
                                    // いいねボタンのアクティブフラグ
                                    props.likes.find(element => element.article_id === props.article.id) != undefined
                                    ? 
                                        props.likes.find(element => element.article_id === props.article.id).user_id == null 
                                        ? 
                                            <FavoriteIcon style={{ fontSize: 20 }} />
                                        : 
                                            <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                                    : 
                                        ''
                                }
                            </IconButton>
                        </Tooltip>
                        <span className={classes.likesCounts}>
                            {
                                // いいね数の取得・表示
                                props.likes.find(element => element.article_id === props.article.id) != undefined 
                                ? 
                                    props.likes.find(element => element.article_id === props.article.id).likes_counts
                                : 
                                    ''
                            }
                        </span>
                        {/* コメントボタンのデザイン(拡張機能あり) */}
                        <Tooltip title="コメントを見る" classes={{tooltip: classes.tooltip}}>
                            <IconButton
                                onClick={handleExpandedClick}
                                aria-expanded={expanded}
                                aria-label="comment"
                            >
                                <CommentIcon style={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                        <span className={classes.commentCounts}>
                            {
                                // コメント数の取得・表示
                                props.commentsCounts.find(element => element.article_id === props.article.id) != undefined 
                                ? 
                                    props.commentsCounts.find(element => element.article_id === props.article.id).comments_counts
                                : 
                                    ''
                            }
                        </span>
                        {/* シェア'ボタンのデザイン */}
                        <Tooltip title="シェアする" classes={{tooltip: classes.tooltip}}>
                            <IconButton aria-label="share">
                                <ShareIcon style={{ fontSize: 20 }} />
                            </IconButton>
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
                            <Tooltip title="投稿する" classes={{tooltip: classes.tooltip}}>
                                <IconButton 
                                    color="primary" 
                                    aria-label="add" 
                                    onClick={() => props.commentsUpdate(state)}
                                >
                                    <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                                </IconButton>
                            </Tooltip>
                            <TextField
                                id="comment"
                                name="comment"
                                label="コメント"
                                variant="outlined"
                                style = {{marginLeft: 10, minWidth: 400, backgroundColor: 'white'}}
                                onChange={(e) => handleSetComment(e.target.value)}
                                multiline
                            />
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
