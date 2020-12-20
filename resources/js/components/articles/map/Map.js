import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, selectError } from '../../app/appSlice';
import { selectArticles, fetchAsyncGet, selectLikes, selectSearchUser, searchUser } from '../articleSlice';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import SnackMessages from '../../parts/common/snackMessages';
import _ from 'lodash';
// import { Card, CardContent, CardMedia } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import styles from './map.module.css';

const useStyles = makeStyles((theme) => ({
    media: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginButtom: theme.spacing(1),
        maxWidth: '100%',
        height: 'auto',
    },
}))

function Map() {
    const classes = useStyles();
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

    return (
        <>
            {
                // メッセージ表示
                errorMessages ? 
                    <SnackMessages errorOpen={true} />
                :
                    ''
            }
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
                            </Popup>
                        </Marker>
                    ))
                }
            </MapContainer>
        </>
    )
}

export default Map
