import React, { createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, selectError } from '../../app/appSlice';
import { selectArticles, fetchAsyncGet, searchUser } from '../../articles/articleSlice';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MessageCard from '../../parts/common/messageCard';
import SnackMessages from '../../parts/common/snackMessages';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    leafletContainer: {
        width: '100%',
        height: '100vh'
    },
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

function LocationMap() {
    const classes = useStyles();
    const history = useHistory();
    const errorMessages = useSelector(selectError)
    const dispatch = useDispatch()
    const [property, setProperty] = React.useState({
        latitude: 34.694138,
        longitude: 135.196263
    })

    const handleSetProperty = (e) => {
        // console.log(mapRef.current.leafletElement.locate())
        console.log(e)
        console.log('click')
    }

    // 記事ページへ遷移
    // const handleSearch = async(value) => {
    //     // Loading開始
    //     await dispatch(fetchCredStart())
    //     // 記事一覧を取得
    //     const resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: value}))
            
    //     if (fetchAsyncGet.fulfilled.match(resultReg)) {
    //         // errorが出た場合はメッセージを表示
    //         resultReg.payload.error_message ? dispatch(fetchGetErrorMessages(resultReg)) : ''
    //         // 検索用ユーザのIDをセット
    //         dispatch(searchUser(value))
    //         // ロード終了
    //         await dispatch(fetchCredEnd())
    //         // エラーが無ければページ遷移
    //         if(!resultReg.payload.error_message) {
    //             history.push('/articles')
    //         }
    //     }
    //     // ロード終了
    //     await dispatch(fetchCredEnd())
    // }

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
                    <MapContainer className={classes.leafletContainer} center={[property.latitude, property.longitude]} zoom={13} zoomControl={false} onClick={() => handleSetProperty(e)}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomleft" scrollWheelZoom={true} />
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

export default LocationMap
