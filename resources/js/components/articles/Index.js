import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchAsyncProf } from '../login/loginSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import HcsAppBar from '../parts/appBar';
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
    // const [articles, setArticles] = useState([]);

    // const getArticles = async () => { 
    //     await axios
    //     .get('api/articles')
    //     .then(({data}) => {
    //       setArticles({
    //         ...articles, 
    //         articles: data.articles,
    //         free_articles: data.free_articles,
    //         prefectures: data.prefectures
    //       })
    //     })
    //     .catch(() => {
    //         return '通信に失敗しました';
    //     });
    // }

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

    // 記事の取得を実行
    // useEffect(() => {
    //     getArticles()
    // },[])
    console.log(articles)
    const renderArticles = () => {
        return _.map(articles.articles, article => (
            <Grid item xs={12} sm={7}>
                <ArticleCard key={article.id} article={article} />
            </Grid>
        ))
    }
    console.log(articles)
    return (
        <>
            <HcsAppBar />
            <PrefectureSelects values={articles.prefectures} />
            <Grid container className={classes.gridContainer} justify="center">
                {renderArticles()}
            </Grid>
        </>
    );
}

export default Article;