import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider, } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import DraftsIcon from '@material-ui/icons/Drafts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCredStart, fetchCredEnd, } from '../../app/appSlice';
import { selectNewsList, fetchAsyncGetPagination } from '../../news/newsSlice';
import BasicPagination from '../common/pagenation';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 200,
    },
    list: {
        marginLeft: 10,
        fontSize: 15
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
}));

const NewsList = (props) => {
    const classes = useStyles()
    const news = useSelector(selectNewsList)
    const dispatch = useDispatch()

    /**
     * 選択したページ用のデータを取得
     */
    const handleGetData = useCallback(async (page) => {
        // Loading開始
        await dispatch(fetchCredStart())
        
        const resultReg = await dispatch(fetchAsyncGetPagination(page))
        
        if (fetchAsyncGetPagination.fulfilled.match(resultReg)) {
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());
    }, [news])
    
    
    return (
        <>
            <div className={classes.sectionMobile}>
                <Divider />
                    <List component="nav" aria-label="main mailbox folders">
                        {_.map(news.data, value => {
                            return (
                                <ListItem 
                                    key={value.id} 
                                    onClick={() => props.handleSetNews(value)}
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
                    <BasicPagination count={news.last_page} handleGetData={handleGetData} />
                <Divider />
            </div>
            <div className={classes.sectionDesktop}>
            <div className={classes.topMargin}></div>
                <Divider />
                    <List component="nav" aria-label="main mailbox folders">
                        {_.map(news.data, value => {
                            return (
                                <ListItem 
                                    key={value.id} 
                                    onClick={() => props.handleSetNews(value)}
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
                <BasicPagination count={news.last_page} handleGetData={handleGetData} />
            </div>
        </>
    )
}

export default React.memo(NewsList)
