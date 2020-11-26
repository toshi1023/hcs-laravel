import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import ArticleDropzone from '../parts/articleParts/dropzone';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/common/prefectureSearch';
import _ from 'lodash';
import { Grid, Paper, Tabs, Tab, Button, TextField, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import CommentIcon from '@material-ui/icons/Comment';
import styles from './myArticle.module.css';

const useStyles = makeStyles((theme) => ({
    searchField: {
        paddingTop: theme.spacing(13),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(5),
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        paddingTop: theme.spacing(3),
        zIndex: 0,
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        paddingTop: theme.spacing(4),
        position: 'fixed',
        zIndex: 1,
    },
    gridContainer: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
    },
    form: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        zIndex: 0
    },
    error: {
        marginLeft: theme.spacing(3),
        fontSize: 13,
        color: 'red',
    },
    button: {
        marginTop: theme.spacing(3),
        height: 40,
        width: 100,
        fontSize: 15
    },
    button: {
        marginLeft: 'auto',
    },
    clearButton: {
        fontSize: 15,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    input: {
        zIndex: 0
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
            const resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: localStorage.getItem('loginId')}))
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
            const resultSearch = await dispatch(fetchAsyncGet({prefecture: prefecture, user_id: localStorage.getItem('loginId')}))
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
        const resultSearch = await dispatch(fetchAsyncGet({prefecture: '', user_id: localStorage.getItem('loginId')}))
        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // 都道府県をリセット
            document.getElementById( "prefecture" ).options[0].selected ? 
                '' 
            : 
                document.getElementById( "prefecture" ).options[1].selected = true
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
                <Paper square className={classes.tab}>
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
            <Grid container className={classes.searchField}>
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
                <Grid container justify="center">
                    <Grid item xs={11} hidden={articlePage}>
                        {renderArticles()}
                    </Grid>
                    <Grid item xs={11} hidden={createPage}>
                        <h1 className={styles.createArticle}>
                            記事を作成する
                        </h1>
                        <br />
                        <Paper elevation={3}>
                            <Grid container justify="center" className={classes.form}>
                                <Grid item xs={10}>
                                    <FormControl className={classes.margin}>
                                        <div className={classes.margin}>
                                            <TextField
                                                id="title"
                                                name="title"
                                                label="タイトル"
                                                variant="outlined"
                                                style = {{width: 250}}
                                                InputLabelProps={{
                                                    className: classes.input,
                                                }}
                                            />
                                        </div>
                                        <div className={classes.margin}>
                                            <TextField
                                                id="content"
                                                name="content"
                                                label="内容"
                                                variant="outlined"
                                                style = {{width: 250}}
                                                multiline
                                                rows={4}
                                                InputLabelProps={{
                                                    className: classes.input,
                                                }}
                                            />
                                        </div>
                                        <div className={classes.margin}>
                                            <ArticleDropzone />
                                        </div>
                                        <div className={classes.margin}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                className={classes.button}
                                                // type="submit"
                                            >
                                                投稿する
                                            </Button>
                                        </div>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container justify="center">
                    <Grid item sm={8}>
                        {renderArticles()}
                    </Grid>
                    <Grid item sm={4}>
                        <Grid item sm={11}>
                            <h1 className={styles.createArticle}>
                                記事を作成する
                            </h1>
                            <br />
                            <Paper elevation={3}>
                                <Grid container justify="center" className={classes.form}>
                                    <Grid item sm={10}>
                                        <FormControl>
                                            <div className={classes.margin}>
                                                <TextField
                                                    id="title"
                                                    name="title"
                                                    label="タイトル"
                                                    variant="outlined"
                                                    style = {{width: 400}}
                                                    InputLabelProps={{
                                                        className: classes.input,
                                                    }}
                                                />
                                            </div>
                                            <div className={classes.margin}>
                                                <TextField
                                                    id="content"
                                                    name="content"
                                                    label="内容"
                                                    variant="outlined"
                                                    style = {{width: 400}}
                                                    InputLabelProps={{
                                                        fontSize: 30,
                                                        className: classes.input,
                                                    }}
                                                    multiline
                                                    rows={4}
                                                />
                                            </div>
                                            <div className={classes.margin}>
                                                <ArticleDropzone />
                                            </div>
                                            <div className={classes.margin}>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    className={classes.button}
                                                    // type="submit"
                                                >
                                                    投稿する
                                                </Button>
                                            </div>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default MyArticle;