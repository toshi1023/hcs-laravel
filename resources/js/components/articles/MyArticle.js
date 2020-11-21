import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/common/prefectureSearch';
import _ from 'lodash';
import { Grid, Avatar, Fab, Tooltip, Paper, Tabs, Tab, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import CommentIcon from '@material-ui/icons/Comment';
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
    clearButton: {
        fontSize: 15,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
    }
  }));

function MyArticle() {
    const classes = useStyles();
    // タブ用のstate
    const [value, setValue] = React.useState(0);
    const [articlePage, setArticlePage] = React.useState(false);
    const [createPage, setCreatePage] = React.useState(true);
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

    // 検索条件のクリア
    const handleSearchClear = async () => {
        // Loading開始
        await dispatch(fetchCredStart())
        
        // 記事一覧を取得
        const resultSearch = await dispatch(fetchAsyncGet({prefecture: '', id: localStorage.getItem('loginId')}))
        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());
    }

    // タブ切り替え処理
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // 記事一覧ページを表示(スマホ用)
    const handleTabArticle = () => {
        setArticlePage(false)
        setCreatePage(true)
    }
    // 友達一覧ページを表示(スマホ用)
    const handleTabCreate = () => {
        setArticlePage(true)
        setCreatePage(false)
    }
    
    // 記事一覧を生成
    const renderArticles = () => {
        return (
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={12} sm={6}>
                    <ArticleCard article={articles.articles} />
                </Grid>
            </Grid>
        )
    }
    return (
        <>
            {/* タブ(スマホ版のみ) */}
            <div className={classes.sectionMobile}>
                <Paper square className={classes.root}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="secondary"
                        aria-label="icon label tabs example"
                        >
                        <Tab icon={<CommentIcon />} label="記事一覧" onClick={handleTabArticle} />
                        <Tab icon={<CreateIcon />} label="記事作成" onClick={handleTabCreate} />
                    </Tabs>
                </Paper>
            </div>

            {/* 検索デザイン */}
            <Grid container>
                <Grid item xs={5} md={1}>
                    <div onBlur={getSearchPrefecture}>
                        <PrefectureSelects values={articles.prefectures} fontSize={15} />
                    </div>
                </Grid>
                <Grid item xs={5} md={1}>
                    <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleSearchClear}>
                        検索クリア
                    </Button>
                </Grid>
            </Grid>

            {/* スマホ版 */}
            <div className={classes.sectionMobile}>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item xs={11} hidden={articlePage}>
                        {renderArticles()}
                    </Grid>
                    <Grid item xs={11} hidden={createPage}>
                        <h1 className={styles.createArticle}>
                            記事を作成する
                        </h1>
                        <br />
                        
                    </Grid>
                </Grid>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item sm={8}>
                        {renderArticles()}
                    </Grid>
                    <Grid item sm={4} className={classes.sectionDesktop}>
                        <Grid item sm={11}>
                            <h1 className={styles.createArticle}>
                                記事を作成する
                            </h1>
                        </Grid>
                        <br />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default MyArticle;