import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, selectInfo, selectModal } from '../app/appSlice';
import { 
    selectArticles, fetchAsyncGet, selectSearchUser, 
    searchUser, selectArticlesLastPage, fetchAsyncGetScroll,
    selectArticlesPage1, selectArticlesPage2, selectArticlesPage3,
    selectArticlesPage4, selectArticlesPage5, selectArticlesCurrentPage,
    resetScrollArticle 
} from './articleSlice';
import ArticleEdit from './Edit';
import ArticleCard from '../parts/articleParts/articleCard';
import PrefectureSelects from '../parts/common/prefectureSearch';
import MessageCard from '../parts/common/messageCard';
import FriendList from '../parts/articleParts/friendList';
import UserList from '../parts/articleParts/userList';
import SnackMessages from '../parts/common/snackMessages';
import SwitchType from '../parts/common/switch';
import _ from 'lodash';
import { Grid, Paper, Tabs, Tab, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import GroupIcon from '@material-ui/icons/Group';
import styles from '../parts/common/commonParts.module.css';
import InfiniteScroll  from "react-infinite-scroller";

const useStyles = makeStyles((theme) => ({
    gridContainer: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        zIndex: 1,
    },
    mobileMainContent: {
        paddingTop: theme.spacing(10),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        paddingTop: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    searchField: {
        paddingTop: theme.spacing(10),
        zIndex: 0,
    },
    clearButton: {
        fontSize: 15,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
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

function Article() {
    const classes = useStyles();
    // タブ用のstate
    const [tab, setTab] = React.useState(0);
    const [articlePage, setArticlePage] = React.useState(false);
    const [friendListPage, setFriendListPage] = React.useState(true);
    // フレンドリストの表示フラグ
    const [state, setState] = React.useState({
        friends: true,
    })
    // 再読み込み判定
    const [hasMore, setHasMore] = React.useState(true);
    const [isFetching, setIsFetching] = React.useState(false);
    // scroll用のcurrent_pageを設定
    const [scrollPage, setScrollPage] = React.useState(localStorage.getItem('scrollPage') ? localStorage.scrollPage : 2);
    // stateで管理するデータを使用できるように定数に格納
    const articles = useSelector(selectArticles)
    const articlesPage1 = useSelector(selectArticlesPage1)
    const articlesPage2 = useSelector(selectArticlesPage2)
    const articlesPage3 = useSelector(selectArticlesPage3)
    const articlesPage4 = useSelector(selectArticlesPage4)
    const articlesPage5 = useSelector(selectArticlesPage5)
    const lastPage = useSelector(selectArticlesLastPage)
    const currentPage = useSelector(selectArticlesCurrentPage)
    const searchedUser = useSelector(selectSearchUser)
    const infoMessages = useSelector(selectInfo)
    const open = useSelector(selectModal)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleProf = async () => {
            // Loading開始
            await dispatch(fetchCredStart())

            // スクロールで取得した記事をリセット
            dispatch(resetScrollArticle(''))

            let resultReg = ''
            // Mapページからユーザ検索が実行されているかどうかで分岐
            if(searchedUser.user_id) {
                resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: searchedUser.user_id}))
            } else {
                // 記事一覧を取得
                if(localStorage.scrollPage) {
                    // "もっと記事を見る"ボタンを押下されていた場合
                    handleGetData(scrollPage)
                    localStorage.removeItem('scrollPage')
                    return;
                }
                // 記事一覧を取得
                resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: ''}))
            }
            
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
    
    /**
     * 都道府県の検索条件をもとに記事の絞り込み
     */
    const getSearchPrefecture = () => {
        // 非同期の関数を定義
        const fetchArticleSearch = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // スクロールで取得した記事をリセット
            dispatch(resetScrollArticle(''))

            // 都道府県情報をセット
            let prefecture = document.getElementById("prefecture").value

            if(prefecture == '全都道府県') {
                prefecture = ''
            }
            // 記事一覧を取得
            const resultSearch = await dispatch(fetchAsyncGet({prefecture: prefecture, user_id: searchedUser.user_id}))
            if (fetchAsyncGet.fulfilled.match(resultSearch)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // loadMoreの実行を再開
            setIsFetching(false)
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticleSearch()
    }

    /**
     * 選択したフレンドの記事を取得
     * @param {*} value 
     */
    const handleFriendArticles = async value => {

        // Loading開始
        await dispatch(fetchCredStart())
        // スクロールで取得した記事をリセット
        dispatch(resetScrollArticle(''))

        // 都道府県情報をセット
        let prefecture = document.getElementById("prefecture").value
        if(prefecture == '全都道府県') {
            prefecture = ''
        }
        // selectArticlesのstateを更新するReducerにdispatch
        const resultSearch = await dispatch(
            fetchAsyncGet({ prefecture: prefecture, user_id: value })
        )

        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // タブ切り替え(スマホ版のみ)
            handleChange(null, 0)
            handleTabArticle()

            // 検索中のユーザIDをstoreのstateに格納
            dispatch(searchUser(value))

            // loadMoreの実行を再開
            setIsFetching(false)
            
            // ロード終了
            await dispatch(fetchCredEnd());
            return;     
        }
        // ロード終了
        await dispatch(fetchCredEnd());
        return;
    }

    /**
     * 検索条件のクリア
     */
    const handleSearchClear = async () => {
        // Loading開始
        await dispatch(fetchCredStart())
        // スクロールで取得した記事をリセット
        dispatch(resetScrollArticle(''))

        // 記事一覧を取得
        const resultSearch = await dispatch(fetchAsyncGet({prefecture: '', user_id: ''}))
        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // 都道府県をリセット
            document.getElementById( "prefecture" ).options[0].selected ? 
                '' 
            : 
                document.getElementById( "prefecture" ).options[1].selected = true
            
            // 検索対象ユーザの値を削除
            dispatch(searchUser(''))
            // scrollのリセット
            setScrollPage(2)
            // loadMoreの実行を再開
            setIsFetching(false)
            setHasMore(true)
            // ロード終了
            await dispatch(fetchCredEnd())  
        }
        // ロード終了
        await dispatch(fetchCredEnd())
    }

    /**
     * 次スクロール用の記事データを取得
     * @param {*} page 
     */
    const handleGetData = useCallback(async (page) => {
        // Loading開始
        await dispatch(fetchCredStart())

        const resultReg = await dispatch(fetchAsyncGetScroll(page))

        if (fetchAsyncGetScroll.fulfilled.match(resultReg)) {
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());
    }, [scrollPage])

    /**
     * 項目を読み込むときのコールバック
     * @param {*} page 
     */
    const loadMore = async (page) => {
        // loadMoreの実行を停止
        setIsFetching(true)
        if(articles.length >= 10 && scrollPage <= lastPage) {
            handleGetData(scrollPage).then(() => {
                // ページ数が最後の場合、処理終了
                setScrollPage(scrollPage + 1)
                if (scrollPage % 5 === 0 || lastPage === scrollPage) {
                  setHasMore(false)
                  return;
                }
                // loadMoreの実行を再開
                setIsFetching(false)
            }).catch(() => {
                // loadMoreの実行を再開
                setIsFetching(false)
            })
        }
        if(lastPage !== 1 && page === 1) {
            // loadMoreの実行を再開
            setIsFetching(false)
        }
    }
    /**
     * 記事取得中のロード表示
     */
    const loader =<div className="loader" style={{fontWeight: 'bold', color: '#1b2538', fontSize: '15px'}} key={0}>Loading ...</div>
    /**
     * 50以上記事を表示した場合にボタン押下で実行
     * 表示した記事以上の記事データを取得して表示する
     */
    const handleGetMoreArticle = () => {
        // localStorageに現在のページ数を設定
        localStorage.setItem('scrollPage', scrollPage)
        // ページを再更新
        window.location.href = '/articles'
    }

    /**
     * タブ切り替え処理
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    /**
     *  記事一覧ページを表示(スマホ用)
     */
    const handleTabArticle = () => {
        setArticlePage(false)
        setFriendListPage(true)
    }
    /**
     * 友達一覧ページを表示(スマホ用)
     */
    const handleTabFriendList = () => {
        setArticlePage(true)
        setFriendListPage(false)
    }

    /**
     * フレンドリストの表示制御
     */
    const setFriends = () => {
        setState({
            ...state,
            friends: document.getElementById("friendsSwitch").checked,
        })
    }
    /**
     * フレンドリストの表示制御(スマホ版)
     */
    const setMobileFriends = () => {
        setState({
            ...state,
            friends: document.getElementById("friendsMobileSwitch").checked,
        })
    }
    
    /**
     * 記事一覧を生成
     */
    const renderArticles = () => {
        return (
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={12} sm={6}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}    //項目を読み込む際に処理するコールバック関数
                        initialLoad={false}
                        threshold={700}
                        hasMore={!isFetching && hasMore}      //読み込みを行うかどうかの判定
                        loader={lastPage === 1 ? '' : loader}         // 記事取得中のロード画面
                    >
                        {
                            articlesPage1 ? 
                                // scroll後の記事表示(1~10件)
                                <ArticleCard article={articlesPage1} />
                            :
                                // 初期表示用の記事を表示
                                <ArticleCard article={articles} />
                        }
                        {
                            // scroll後の記事表示(11~20件)
                            articlesPage2 ? 
                                <ArticleCard article={articlesPage2} />
                            :
                                ''
                        }
                        {
                            // scroll後の記事表示(21~30件)
                            articlesPage3 ? 
                                <ArticleCard article={articlesPage3} />
                            :
                                ''
                        }
                        {
                            // scroll後の記事表示(31~40件)
                            articlesPage4 ? 
                                <ArticleCard article={articlesPage4} />
                            :
                                ''
                        }
                        {
                            // scroll後の記事表示(41~50件)
                            articlesPage5 ? 
                                <ArticleCard article={articlesPage5} />
                            :
                                ''
                        }
                        {
                            // 記事が50件表示された場合は表示
                            isFetching && currentPage && currentPage % 5 === 0 ? 
                                <Button variant="contained" color="primary" className={classes.moreButton} onClick={handleGetMoreArticle}>
                                    もっと記事を見る
                                </Button>
                            :
                                ''
                        }
                    </InfiniteScroll>
                </Grid>
            </Grid>
        )
    }
    
    return (
        <>
            {
                // メッセージ表示
                infoMessages ? 
                    <SnackMessages infoOpen={true} />
                :
                    <SnackMessages errorOpen={true} />
            }
            {/* タブ(スマホ版のみ) */}
            <div className={classes.sectionMobile}>
                <Paper square className={classes.tab}>
                    <Tabs
                        value={tab}
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
            </div>

            {/* 記事の編集モーダル */}
            {
                // Modalの表示フラグがtrueの場合のみ表示
                open ? 
                    <ArticleEdit />
                :
                    ''
            }

            {/* 検索デザイン */}
            <Grid container className={classes.searchField}>
                <Grid item xs={5} md={1}>
                    <div onBlur={getSearchPrefecture}>
                        <PrefectureSelects id="prefecture" fontSize={15} />
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
                    <Grid item xs={11} hidden={friendListPage}>
                        <h1 className={styles.titleBar}>
                            ユーザで検索する
                        </h1>
                        <div onClick={setMobileFriends}>
                            <SwitchType 
                                id="friendsMobileSwitch"
                                switchLabel={{true: '友達のみ', false: '全員'}}
                                initialState={true}
                                labelPlacement='end'
                                className={classes.switchType}
                            />
                        </div>
                        <br />
                        {
                            localStorage.getItem('loginId') ? 
                                state.friends ? 
                                    <FriendList handleChange={handleChange} handleTabArticle={handleTabArticle} handleFriendArticles={handleFriendArticles} />
                                :
                                    <UserList handleFriendArticles={handleFriendArticles} />
                            : 
                                <MessageCard />
                        }
                    </Grid>
                </Grid>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item xs={11} sm={8}>
                        {renderArticles()}
                    </Grid>
                    <Grid item sm={4} className={classes.sectionDesktop}>
                        <Grid item sm={11}>
                            <h1 className={styles.titleBar}>
                                ユーザで検索する
                            </h1>
                        </Grid>
                        <div onClick={setFriends}>
                            <SwitchType 
                                id="friendsSwitch"
                                switchLabel={{true: '友達のみ', false: '全員'}}
                                initialState={true}
                                labelPlacement='end'
                                className={classes.switchType}
                            />
                        </div>
                        <br />
                        {
                            localStorage.getItem('loginId') ? 
                                state.friends ? 
                                    <FriendList handleChange={handleChange} handleTabArticle={handleTabArticle} handleFriendArticles={handleFriendArticles} />
                                :
                                    <UserList handleFriendArticles={handleFriendArticles} />
                            : 
                                <Grid container justify="center">
                                    <Grid item sm={10}>
                                        <MessageCard />
                                    </Grid>
                                </Grid>
                        }  
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default React.memo(Article);