import React, { createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, selectError } from '../../app/appSlice';
import { editArticle } from '../../articles/articleSlice';
import { MapContainer, TileLayer, ZoomControl, useMapEvent } from 'react-leaflet';
import { Button } from '@material-ui/core';
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

// クリックした場所の緯度経度を取得
function LocationProperty() {
    const dispatch = useDispatch()
    const map = useMapEvent('click', (e) => {
        if(window.confirm('この地点を設定しますか？')) {
            // dispatch(editArticle({latitude: e.latlng.latitude, longitude: e.latlng.longitude}))
            console.log(e.latlng)
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
                // Loginしていなければ表示しない
                localStorage.getItem('loginId') ? 
                    <MapContainer className={classes.leafletContainer} center={[34.694138, 135.196263]} zoom={13} zoomControl={false}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ZoomControl position="bottomleft" scrollWheelZoom={true} />
                        <LocationProperty />
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
