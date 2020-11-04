import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/common/prefectureSearch';
import _ from 'lodash';
import { Grid, Avatar, Fab, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import styles from './myArticle.module.css';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: '10px',
      paddingBottom: '20px'
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    tooltip: {
        fontSize: 14,
    },
    button: {
        marginLeft: 'auto',
    },
  }));

function MyArticle() {
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
            const resultReg = await dispatch(fetchAsyncGet({prefecture: '', id: localStorage.getItem('loginId')}))
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
            const resultSearch = await dispatch(fetchAsyncGet({prefecture: prefecture, id: localStorage.getItem('loginId')}))
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
                <PrefectureSelects values={articles.prefectures} fontSize={15} />
            </div>
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={12} sm={7}>
                    <div className={styles.field}>
                        <Avatar 
                            aria-label="article" 
                            className={classes.large} 
                            style={{ fontSize: 15 }}
                            src={localStorage.getItem('loginPhoto')}
                        />
                        <Tooltip title="新規投稿" classes={{tooltip: classes.tooltip}}>
                            <Fab color="primary" aria-label="add" className={classes.button}>
                                <EditIcon />
                            </Fab>
                        </Tooltip>
                    </div>
                </Grid>
                {renderArticles()}
            </Grid>
        </>
    );
}

export default MyArticle;