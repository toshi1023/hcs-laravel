import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/common/prefectureSearch';
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
            // Loading開始
            await dispatch(fetchCredStart())
            // 記事一覧を取得
            const resultReg = await dispatch(fetchAsyncGet(document.getElementById("prefecture").value))
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticleProf()
        
    }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある


    // 都道府県の検索条件をもとに記事の絞り込み
    const getSearchPrefecture = () => {
        // 非同期の関数を定義
        const fetchArticleSearch = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 都道府県情報をセット
            let prefecture = document.getElementById("prefecture").value
            if(prefecture == '全都道府県') {
                prefecture = ''
            }
            // 記事一覧を取得
            const resultSearch = await dispatch(fetchAsyncGet(prefecture))
            if (fetchAsyncGet.fulfilled.match(resultSearch)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticleSearch()
    }
    
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
            <div onBlur={getSearchPrefecture}>
                <PrefectureSelects values={articles.prefectures} />
            </div>
            <Grid container className={classes.gridContainer} justify="center">
                {renderArticles()}
            </Grid>
        </>
    );
}

export default Article;