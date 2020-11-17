import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectArticles, fetchAsyncGet } from './articleSlice';
import { selectUsers, fetchAsyncGetFriends } from '../users/userSlice';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/common/prefectureSearch';
import MessageCard from '../parts/common/messageCard';
import FriendList from '../parts/articleParts/friendList';
import _ from 'lodash';
import { Grid, Paper, Tabs, Tab, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import GroupIcon from '@material-ui/icons/Group';
import styles from '../app/bodyTitle.module.css';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
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
    }
  }));

function Article() {
    const classes = useStyles();
    // タブ用のstate
    const [value, setValue] = React.useState(0);
    const [articlePage, setArticlePage] = React.useState(false);
    const [friendListPage, setFriendListPage] = React.useState(true);
    // stateで管理する記事一覧データを使用できるようにローカルのarticles定数に格納
    const articles = useSelector(selectArticles)
    const friends = useSelector(selectUsers)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleProf = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 記事一覧を取得
            const resultReg = await dispatch(fetchAsyncGet({prefecture: '', id: ''}))
            // 友達一覧を取得
            const resultFriends = await dispatch(fetchAsyncGetFriends(localStorage.getItem('loginId')))
            if (fetchAsyncGet.fulfilled.match(resultReg) && fetchAsyncGetFriends.fulfilled.match(resultFriends)) {
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
            const resultSearch = await dispatch(fetchAsyncGet({prefecture: prefecture, id: ''}))
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
        const resultSearch = await dispatch(fetchAsyncGet({prefecture: '', id: ''}))
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
        setFriendListPage(true)
    }
    // 友達一覧ページを表示(スマホ用)
    const handleTabFriendList = () => {
        setArticlePage(true)
        setFriendListPage(false)
    }
    
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
            {/* スマホ版 */}
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
                        <Tab icon={<GroupIcon />} label="友達の記事を探す" onClick={handleTabFriendList} />
                    </Tabs>
                </Paper>
                <div onBlur={getSearchPrefecture}>
                    <Grid container>
                        <Grid item xs={5}>
                            <PrefectureSelects values={articles.prefectures} fontSize={15} />
                        </Grid>
                        <Grid item xs={5}>
                            <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleSearchClear}>
                                検索クリア
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item xs={11} hidden={articlePage}>
                        {renderArticles()}
                    </Grid>
                    <Grid item xs={11} hidden={friendListPage}>
                        <h1 className={styles.friendList}>
                            フレンドの記事を見る
                        </h1>
                        <br />
                        {
                            localStorage.getItem('loginId') ? 
                                <FriendList friend={friends} handleChange={handleChange} handleTabArticle={handleTabArticle} />
                            : <MessageCard />
                        }
                    </Grid>
                </Grid>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <div onBlur={getSearchPrefecture}>
                    <Grid container>
                        <Grid item md={1}>
                            <PrefectureSelects values={articles.prefectures} fontSize={15} />
                        </Grid>
                        <Grid item md={1}>
                            <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleSearchClear}>
                                検索クリア
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item xs={11} sm={8}>
                        {renderArticles()}
                    </Grid>
                    <Grid item sm={4} className={classes.sectionDesktop}>
                        <Grid item sm={11}>
                            <h1 className={styles.friendList}>
                                フレンドの記事を見る
                            </h1>
                        </Grid>
                        <br />
                        {
                            localStorage.getItem('loginId') ? 
                                <FriendList friend={friends} />
                            : <MessageCard />
                        }  
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default Article;