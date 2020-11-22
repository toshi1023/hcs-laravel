import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Box, CardContent, CardActions, Typography, IconButton, Tooltip, TextField } from '@material-ui/core';
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

    /**
     * 拡張ページの表示
     */
    const handleExpandedClick = () => {
        setExpanded(!expanded)
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
                            props.likes.likes != undefined ? 
                                (_.map(props.likes.likes, like => (
                                like.find(element => element.article_id === props.article.id).user_id
                                ))[0] == null ? 
                                <FavoriteIcon style={{ fontSize: 17 }} />
                                : <FavoriteIcon style={{ fontSize: 17, color: 'red' }} />
                                )
                            : ''
                            }
                        </IconButton>
                        <span className={classes.likesCounts}>
                            {
                            // いいね数の取得・表示
                            props.likes.likes != undefined ? 
                                _.map(props.likes.likes, like => (
                                like.find(element => element.article_id === props.article.id).likes_counts
                                )) 
                            : ''
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
                        <span className={classes.commentCounts}>3</span>
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
                    <Typography paragraph><span className={classes.mobileLabel}>コメント:</span></Typography>
                    <Typography paragraph>
                        <span className={classes.mobileComment}>コメント機能を搭載予定</span>
                    </Typography>
                    </CardContent>
                </Box>
                {
                    localStorage.getItem('localToken') ? 
                        <div className={classes.commentField}>
                            <IconButton color="primary" aria-label="add">
                                <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                            </IconButton>
                            <TextField
                                id="title"
                                name="title"
                                label="コメント"
                                variant="outlined"
                                style = {{marginLeft: 10, minWidth: 250, backgroundColor: 'white'}}
                                multiline
                            />
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
                                props.likes.likes != undefined ? 
                                    (_.map(props.likes.likes, like => (
                                    like.find(element => element.article_id === props.article.id).user_id
                                    ))[0] == null ? 
                                    <FavoriteIcon style={{ fontSize: 20 }} />
                                    : <FavoriteIcon style={{ fontSize: 20, color: 'red' }} />
                                    )
                                : ''
                                }
                            </IconButton>
                        </Tooltip>
                        <span className={classes.likesCounts}>
                            {
                            // いいね数の取得・表示
                            props.likes.likes != undefined ? 
                                _.map(props.likes.likes, like => (
                                like.find(element => element.article_id === props.article.id).likes_counts
                                )) 
                            : ''
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
                        <span className={classes.commentCounts}>3</span>
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
                    <Typography paragraph><span className={classes.label}>コメント:</span></Typography>
                    <Typography paragraph>
                        <span className={classes.comment}>コメント機能を搭載予定</span>
                    </Typography>
                    </CardContent>
                </Box>
                {
                    localStorage.getItem('localToken') ? 
                    <div className={classes.commentField}>
                        <Tooltip title="投稿する" classes={{tooltip: classes.tooltip}}>
                            <IconButton color="primary" aria-label="add">
                                <ReplyIcon style={{ fontSize: 20, color: 'blue' }} />
                            </IconButton>
                        </Tooltip>
                        <TextField
                            id="title"
                            name="title"
                            label="コメント"
                            variant="outlined"
                            style = {{marginLeft: 10, minWidth: 400, backgroundColor: 'white'}}
                            multiline
                        />
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
