import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectError } from '../../app/appSlice';
import { MapContainer, TileLayer, ZoomControl, useMapEvent } from 'react-leaflet';
import SnackMessages from '../../parts/common/snackMessages';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

// MapのURL
const URL = 'http://localhost/articles/create'
// const URL = 'https://hcs-laravel/articles/create'

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

// クリックした場所の緯度経度を取得
function LocationProperty() {
    const dispatch = useDispatch()
    const map = useMapEvent('click', (e) => {
        let message = `この地点を設定しますか？\n\n緯度：${e.latlng.lat}\n経度：${e.latlng.lng}`
        if(window.confirm(message)) {
            // 記事作成ページに緯度経度データを送信
            window.opener.postMessage(JSON.stringify({lat: e.latlng.lat, lng: e.latlng.lng}), URL)
            // 設定後にこのページを閉じる
            window.close()
        }
    })
    return null
}

function LocationMap() {
    const classes = useStyles();
    const errorMessages = useSelector(selectError)

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
                <MapContainer className={classes.leafletContainer} center={[34.694138, 135.196263]} zoom={13} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomleft" scrollWheelZoom={true} />
                    <LocationProperty />
                </MapContainer>
            }
        </>
    )
}

export default LocationMap
