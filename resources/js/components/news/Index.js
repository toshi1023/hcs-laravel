import React, { useEffect } from 'react';
import NewsCard from '../parts/newsParts/newsCard';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Grid } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import DraftsIcon from '@material-ui/icons/Drafts';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import { selectNewsList, fetchAsyncGet, selectNews, selectSelectedNews } from './newsSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
    },
    list: {
        marginLeft: 10,
        fontSize: 15
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
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
    const news = useSelector(selectNewsList)
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
    
    const handleSetNews = value => {
        dispatch(
            selectNews({ value })
        )
    }

    return (
        <Grid container>
            <Grid item sm={8}>
                <Grid container justify="center">
                    <Grid item xs={10} sm={6}>
                        <NewsCard news={selectedNews} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
                <div className={classes.root}>
                    <Divider />
                    <List component="nav" aria-label="main mailbox folders">
                        {_.map(news.news, value => {
                            return (
                                <ListItem 
                                    key={value.id} 
                                    onClick={() => handleSetNews(value)}
                                    button
                                >
                                    <ListItemIcon>
                                        <MailIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={value.title}
                                        classes={{ primary: classes.list }}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                    <Divider />
                </div>
            </Grid>
        </Grid>
    );
}