import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { fetchAsyncGetShow, selectSelectedNews } from '../../news/newsSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatarOfficial: {
    backgroundColor: 'green',
  },
  avatarWarning: {
    backgroundColor: red[500],
  },
  subHeaderTitle: {
    fontSize: 15,
  },
  subHeaderDate: {
    fontSize: 13,
    color: '#808080'
  },
  content: {
      fontSize: 15,
  }
}));

export default function NewsCard(props) {
    const classes = useStyles();
    const selectedNews = useSelector(selectSelectedNews)
    const dispatch = useDispatch()
    let typeFlg = props.news.value != undefined ? props.news.value.type : (selectedNews.news != undefined ? selectedNews.news.type : '')
    // 最新ニュースを初期表示
    useEffect(() => {
        // 非同期の関数を定義
        const fetchNewsShow = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ログイン有無で取得条件を変更
            let resultReg;
            localStorage.getItem('loginId') ? resultReg = await dispatch(fetchAsyncGetShow()) : resultReg = await dispatch(fetchAsyncGetShow(0))
            if (fetchAsyncGetShow.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd())       
            }
            // ロード終了
            await dispatch(fetchCredEnd())
        }
        // 上で定義した非同期の関数を実行
        fetchNewsShow()
    }, [dispatch])

    return (
        <Card className={classes.root}>
        <CardHeader
            avatar={
                typeFlg == 1 ? 
                    <Avatar aria-label="recipe" className={classes.avatarOfficial} style={{ fontSize: 15 }}>
                        公式
                    </Avatar>
                : 
                    <Avatar aria-label="recipe" className={classes.avatarWarning} style={{ fontSize: 15 }}>
                        警告
                    </Avatar>
            }
            title={<Typography className={classes.subHeaderTitle}>{props.news.value != undefined ? props.news.value.title : (selectedNews.news != undefined ? selectedNews.news.title : '')}</Typography>}
            subheader={<Typography className={classes.subHeaderDate}>{props.news.value != undefined ? props.news.value.updated_at : (selectedNews.news != undefined ? selectedNews.news.updated_at : '')}</Typography>}
        />
        <CardMedia
            className={classes.media}
            image=""
            title="Paella dish"
        />
        <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
                <span className={classes.content}>
                    {props.news.value != undefined ? props.news.value.content : (selectedNews.news != undefined ? selectedNews.news.content : '')}
                </span>
            </Typography>
        </CardContent>
        </Card>
    );
}