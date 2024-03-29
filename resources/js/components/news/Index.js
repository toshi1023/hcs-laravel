import React, { useEffect } from 'react';
import NewsCard from '../parts/newsParts/newsCard';
import NewsList from '../parts/newsParts/newsList';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Tabs, Tab } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import DnsIcon from '@material-ui/icons/Dns';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { fetchAsyncGet, selectNews, selectSelectedNews } from './newsSlice';

const useStyles = makeStyles((theme) => ({
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        zIndex: 1,
    },
    topMargin: {
        marginTop: theme.spacing(4),
    },
    mobileMainContent: {
        paddingTop: theme.spacing(10),
        backgroundColor: theme.palette.background.paper,
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(27),
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        paddingTop: theme.spacing(7),
        paddingBottom: theme.spacing(5),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default function News() {
    const classes = useStyles()
    const [tab, setTab] = React.useState(1);
    const [newsPage, setNewsPage] = React.useState(true);
    const [newsListPage, setNewsListPage] = React.useState(false);
    const selectedNews = useSelector(selectSelectedNews)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchNews = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ログイン有無で取得条件を変更
            let resultReg;
            localStorage.getItem('loginId') ? resultReg = await dispatch(fetchAsyncGet()) : resultReg = await dispatch(fetchAsyncGet(0))
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd())    
            }
            // ロード終了
            await dispatch(fetchCredEnd())
        }
        // 上で定義した非同期の関数を実行
        fetchNews()
    }, [dispatch])
    
    /**
     * タブ切り替え処理
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    /**
     * ニュース一覧ページを表示(スマホ用)
     */
    const handleTabNewsList = () => {
        setNewsPage(true)
        setNewsListPage(false)
    }
    /**
     * ニュース詳細ページを表示(スマホ用)
     */
    const handleTabNews = () => {
        setNewsPage(false)
        setNewsListPage(true)
    }

    /**
     * 選択したニュースを詳細に表示
     * @param {*} value 
     */
    const handleSetNews = value => {
        dispatch(
            selectNews({ value })
        )
        // 表示ページの切り替え(スマホのみ)
        if(window.matchMedia('(max-width: 767px)').matches) {
            // タブの切り替え
            handleChange(null, 0)
            // ニュース詳細ページの表示
            handleTabNews()
        }
    }

    return (
        <>
            {/* スマホ版 */}
            <div className={classes.sectionMobile}>
                <Grid container>
                    <Paper square className={classes.tab}>
                        <Tabs
                            value={tab}
                            onChange={handleChange}
                            variant="fullWidth"
                            indicatorColor="secondary"
                            textColor="secondary"
                            aria-label="icon label tabs example"
                        >
                            <Tab icon={<InfoIcon />} label="ニュース詳細" onClick={handleTabNews} />
                            <Tab icon={<DnsIcon />} label="ニュース一覧" onClick={handleTabNewsList} />
                        </Tabs>
                    </Paper>
                    <Grid container justify="center" hidden={newsPage} className={classes.topMargin}>
                        <Grid item xs={11} className={classes.mobileMainContent}>
                            <NewsCard news={selectedNews} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} hidden={newsListPage} className={classes.topMargin}>
                        <div className={classes.mobileMainContent}>
                            <NewsList handleSetNews={handleSetNews} />
                        </div>
                    </Grid>
                </Grid>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container>
                    <Grid item sm={8} className={classes.topMargin}>
                        <Grid container justify="center">
                            <Grid item sm={6}>
                                <NewsCard news={selectedNews} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={4} className={classes.topMargin}>
                        <div className={classes.tab}>
                            <NewsList handleSetNews={handleSetNews} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}