import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import SnackMessages from '../parts/common/snackMessages';
import { selectInfo, fetchCredStart, fetchCredEnd } from '../app/appSlice';
import { fetchAsyncGetHome, selectArticles } from '../articles/articleSlice';
import ArticleCard from '../parts/articleParts/articleCard';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: '10px',
      paddingBottom: '20px'
    }, 
}));

function Home() {
    const classes = useStyles();
    const infoMessages = useSelector(selectInfo)
    const articles = useSelector(selectArticles)
    const dispatch = useDispatch()

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
        return _.map(articles.articles, article => (
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={12} sm={6}>
                    <ArticleCard key={article.id} article={article} />
                </Grid>
            </Grid>
        ))
    }

    return (
        <>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={11} sm={7}>
                    {
                        // ユーザ作成 & ログイン完了時
                        infoMessages ? 
                            <SnackMessages infoOpen={true} />
                        :
                            <SnackMessages errorOpen={true} />
                    }
                    {renderArticles()}
                </Grid>
            </Grid>
        </>
    );
}

export default Home;