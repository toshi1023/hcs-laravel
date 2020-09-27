import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchAsyncProf } from '../login/loginSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/articleParts/prefectureSearch';
import axios from 'axios';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: '10px',
      paddingBottom: '20px'
    },
    
  }));

function Article() {
    const classes = useStyles();

    // stateで管理する記事一覧データを使用できるようにローカルのarticles定数に格納
    const articles = useSelector(selectArticles)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleProf = async () => {
            // 記事一覧とログイン情報を取得
            await dispatch(fetchAsyncGet())
            // await dispatch(fetchAsyncProf())
        }
        // 上で定義した非同期の関数を実行
        fetchArticleProf()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])

    // 記事一覧を生成
    const renderArticles = () => {
        return _.map(articles.articles, article => (
            <Grid item xs={12} sm={7}>
                <ArticleCard key={article.id} article={article} />
            </Grid>
        ))
    }
    return (
        <>
            <PrefectureSelects values={articles.prefectures} />
            <Grid container className={classes.gridContainer} justify="center">
                {renderArticles()}
            </Grid>
        </>
    );
}

export default Article;