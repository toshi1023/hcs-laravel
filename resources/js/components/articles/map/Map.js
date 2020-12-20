import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, selectError } from '../../app/appSlice';
import { selectArticles, fetchAsyncGet, searchUser } from '../articleSlice';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import MessageCard from '../../parts/common/messageCard';
import SnackMessages from '../../parts/common/snackMessages';
import _ from 'lodash';
import { Grid, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import styles from './map.module.css';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    media: {
        marginTop: theme.spacing(1),
        marginButtom: theme.spacing(1),
        maxWidth: '100%',
        height: 'auto',
    },
    searchMapUserButton: {
        marginTop: theme.spacing(1),
        width: '100%',
        fontSize: 13,
    }
}))

function Map() {
    const classes = useStyles();
    const history = useHistory();
    const articles = useSelector(selectArticles)
    const errorMessages = useSelector(selectError)
    const dispatch = useDispatch()

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleGet = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 記事一覧を取得
            const resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: ''}))
            
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // errorが出た場合はメッセージを表示
                resultReg.payload.error_message ? dispatch(fetchGetErrorMessages(resultReg)) : ''
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticleGet()
        
    }, [dispatch])

    // 記事ページへ遷移
    const handleSearch = async(value) => {
        // Loading開始
        await dispatch(fetchCredStart())
        // 記事一覧を取得
        const resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: value}))
            
        if (fetchAsyncGet.fulfilled.match(resultReg)) {
            // errorが出た場合はメッセージを表示
            resultReg.payload.error_message ? dispatch(fetchGetErrorMessages(resultReg)) : ''
            // 検索用ユーザのIDをセット
            dispatch(searchUser(value))
            // ロード終了
            await dispatch(fetchCredEnd())
            // エラーが無ければページ遷移
            if(!resultReg.payload.error_message) {
                history.push('/articles')
            }
        }
        // ロード終了
        await dispatch(fetchCredEnd())
    }

    return (
        <>
            {
                // メッセージ表示
                errorMessages ? 
                    <SnackMessages errorOpen={true} />
                :
                    ''
            }
            {
                // Loginしていなければ表示しない
                localStorage.getItem('loginId') ? 
                    <MapContainer className={styles.leafletContainer} center={[34.694138, 135.196263]} zoom={13} zoomControl={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomleft" scrollWheelZoom={true} />
                        {
                            _.map(articles, article => (
                                <Marker key={article.id} position={[article.latitude, article.longitude]}>
                                    <Popup>
                                        {
                                            article.gender == 0 ? 
                                                <h2 style={{ color: 'red' }}>{article.name}</h2>
                                            :
                                                <h2 style={{ color: 'blue' }}>{article.name}</h2>
                                        }
                                        <img className={classes.media} src={article.articles_photo_path} />
                                        <span>{article.title}</span>
                                        <br />
                                        <Button variant="contained" color="primary" className={classes.searchMapUserButton} onClick={() => handleSearch(article.user_id)}>
                                            このユーザの記事を見に行く
                                        </Button>
                                    </Popup>
                                </Marker>
                            ))
                        }
                    </MapContainer>
                : 
                    <div className={styles.wrap}>
                        <div className={styles.message}>
                            {/* <Grid container>
                                <Grid item xs={12} sm={12}> */}
                                    <MessageCard />
                                {/* </Grid>
                            </Grid> */}
                        </div>
                    </div>
            }
        </>
    )
}

export default Map
