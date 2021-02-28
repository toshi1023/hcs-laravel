import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, selectInfo, selectModal } from '../app/appSlice';
import { selectArticles, fetchAsyncGet, selectLikes, selectSearchUser, searchUser, selectArticlesLastPage } from './articleSlice';
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
    // stateで管理するデータを使用できるように定数に格納
    const articles = useSelector(selectArticles)
    const lastPage = useSelector(selectArticlesLastPage)
    const searchedUser = useSelector(selectSearchUser)
    const infoMessages = useSelector(selectInfo)
    const open = useSelector(selectModal)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleProf = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            let resultReg = ''
            // Mapページからユーザ検索が実行されているかどうかで分岐
            if(searchedUser.user_id) {
                // 記事一覧を取得
                resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: searchedUser.user_id}))
            } else {
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
            // ロード終了
            await dispatch(fetchCredEnd())  
        }
        // ロード終了
        await dispatch(fetchCredEnd())
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
                    <ArticleCard article={articles} lastPage={lastPage} />
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

export default Article;