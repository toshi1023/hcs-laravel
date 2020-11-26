import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SnackMessages from '../parts/common/snackMessages';
import { selectInfo, fetchCredStart, fetchCredEnd } from '../app/appSlice';
import { fetchAsyncGetHome, selectArticles } from '../articles/articleSlice';
import ArticleCard from '../parts/articleParts/articleCard';
import { useHistory } from 'react-router-dom';
import styles from '../app/bodyTitle.module.css';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(5),
    },
    moreButton: {
        fontSize: 15,
        width: '100%',
        backgroundColor: '#1b2538',
        '&:hover': {
            backgroundColor: '#96bfe0',
        },
        color: 'white'
    },
}));

function Home() {
    const classes = useStyles();
    const infoMessages = useSelector(selectInfo)
    const articles = useSelector(selectArticles)
    const dispatch = useDispatch()
    const history = useHistory();

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticle = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 記事一覧を取得
            const resultReg = await dispatch(fetchAsyncGetHome())
    
            if (fetchAsyncGetHome.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticle()
        
    }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある

    // 記事一覧を生成
    const renderArticles = () => {
        return (
            <ArticleCard article={articles.articles} />
        )
    }

    // 記事一覧ページに遷移
    const redirectArticles = () => {
        // ページ最上部に戻る
        window.scrollTo(0, 0)
        // リダイレクト
        history.push("/articles")
    }

    return (
        <>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={7}>
                    {
                        // メッセージ表示
                        infoMessages ? 
                            <SnackMessages infoOpen={true} />
                        :
                            <SnackMessages errorOpen={true} />
                    }
                    <Grid container className={classes.gridContainer} justify="center">
                        <Grid item xs={12} sm={6}>
                            <h1 className={styles.friendList}>
                                人気記事を見る
                            </h1>
                            <br />
                            {renderArticles()}
                            <Button variant="contained" className={classes.moreButton} onClick={redirectArticles}>
                                もっと記事を見に行く
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default Home;