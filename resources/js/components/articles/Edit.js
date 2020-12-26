import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, fetchGetInfoMessages, fetchGetErrorMessages, selectInfo, fetchOpenModal } from '../app/appSlice';
import { fetchAsyncUpdate, selectEditedArticle } from './articleSlice';
import ArticleDropzone from '../parts/articleParts/dropzone';
import SwitchType from '../parts/common/switch';
import ArticlePrefectureSelects from '../parts/articleParts/articlePrefectureSelects';
import SnackMessages from '../parts/common/snackMessages';
import { Form, Formik } from "formik"; // 入力フォームのバリデーション設定に利用
import * as Yup from "yup"; // 入力フォームのバリデーション設定に利用
import _ from 'lodash';
import { Grid, Button, TextField, FormControl, FormLabel, FormControlLabel, Paper, Radio, RadioGroup } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        marginTop: theme.spacing(5),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    form: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        zIndex: 0
    },
    closeIcon: {
        marginLeft: 'auto',
    },
    modalTitle: {
        fontWeight: 'bold',
        paddingLeft: theme.spacing(1),
    },
    latlng: {
        fontSize: 12,
        paddingRight: theme.spacing(2),
    }
  }));

  export default function ArticleEdit() {
    const classes = useStyles();
    const editedArticle = useSelector(selectEditedArticle)
    const dispatch = useDispatch();
    const childRef = useRef();
    // stateの初期設定
    const [state, setState] = React.useState({
        // 保存対象の値
        prefecture: editedArticle.prefecture,
        latitude: editedArticle.latitude,
        longitude: editedArticle.longitude,
        title: '',
        content: '',
        type: false,
    });
    // ラジオボタン用のstate
    const [value, setValue] = React.useState('current');
    const handleChangeRadio = (event) => {
        setValue(event.target.value);
    };
    // DBに保存しているデータをセット
    const handleSetDB = () => {
        setState({
            ...state,
            latitude: editedArticle.latitude,
            longitude: editedArticle.longitude,
        })
    }
    // 位置情報の取得用Mapを別タブで表示
    const handleOpenMap = () => {
        // 新規タブを開いてページを遷移
        // window.open('https://hcs-laravel/map/location', "Get Location")
        window.open('http://localhost/map/location', "Get Location")
    }

    // 新規タブから設定された緯度経度をstateにセット
    const receiveMessage = (event) => {
        // if (event.origin !== "https://hcs-laravel") {
        //     // 指定ドメイン以外は受け付けない
        //     return;
        // }
        if (event.origin !== "http://localhost") {
            // 指定ドメイン以外は受け付けない
            return;
        }
        setState({ 
            ...state,
            latitude: JSON.parse(event.data).lat,
            longitude: JSON.parse(event.data).lng,
        })
        return;
    }
    
    useEffect(() => {
        // 非同期の関数を定義
        const fetchPrefectures = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 新規タブから送信された位置情報を取得
            window.addEventListener("message", receiveMessage, false)

            // ユーザの登録している都道府県が選択されている状態でセット
            document.getElementById("modalFormPrefecture").value = editedArticle.prefecture
            // ロード終了
            await dispatch(fetchCredEnd());

            // 新規タブからの位置情報取得処理を終了
            return () => window.removeEventListener("message", receiveMessage)
        }
        // 上で定義した非同期の関数を実行
        fetchPrefectures()
    }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある
    
    /**
     * 値のセット
     */
    const setPrefecture = () => {
        setState({
            ...state,
            prefecture: document.getElementById("modalFormPrefecture").value,
            prefectureCheck: false,
        })
    }
    const setTitle = (value) => {
        setState({
            ...state,
            title: value,
        })
    }
    const setContent = (value) => {
        setState({
            ...state,
            content: value,
        })
    }
    const setType = () => {
        setState({
            ...state,
            type: document.getElementById("modalTypeSwitch").checked
        })
    }

    // Modalの非表示設定
    const handleClose = () => {
        dispatch(fetchOpenModal(false))
    };

    // 画像の保存処理(ArticleDropzoneコンポーネントで実施)
    const doAction = (values) => {
        return childRef.current.onSubmitArticleImage(values)
    }
    
    return (
        <>
            <Grid container justify="center">
                <Grid item xs={10} sm={6} md={4}>
                <Paper className={classes.paper}>
                    <Grid container>
                        <h3 className={classes.modalTitle}>記事の編集</h3>
                        <Button className={classes.closeIcon} onClick={handleClose}>
                            <CancelIcon />
                        </Button>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={10} sm={10} md={10}> 
                            <Formik
                                initialErrors={{ modalTitle: "required", modalContent: "required" }}
                                initialValues={{ 
                                    modalTitle: editedArticle.title,
                                    modalContent: editedArticle.content,
                                }}
                                onSubmit={async (values) => {
                                    // ユーザ登録処理
                                    let formData = new FormData(document.forms.form);
                                    formData.append('prefecture', document.getElementById("modalFormPrefecture").value)
                                    formData.append('title', values.mobileTitle)
                                    formData.append('content', values.mobileContent)
                                    formData.append('type', document.getElementById("modalTypeSwitch").checked)
                                    
                                    // 記事の登録処理
                                    createClicked(formData)
                                }}
                                validationSchema={Yup.object().shape({
                                    modalTitle: Yup.string()
                                                    .required("タイトルの入力は必須です"),
                                    modalContent: Yup.string()
                                                        .required("内容の入力は必須です"),
                                })}
                            >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                errors,
                                touched,
                                isValid,
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    <FormControl className={classes.margin}>
                                        <div className={classes.margin} onBlur={setPrefecture}>
                                            <ArticlePrefectureSelects 
                                                labelFlg={editedArticle.prefecture ? false : undefined} 
                                                id="modalFormPrefecture" 
                                                fontSize={15} 
                                            />
                                        </div>
                                        <div className={classes.margin}>
                                            <FormLabel style={{ fontSize: 13 }}>位置情報</FormLabel>
                                            <RadioGroup aria-label="location" name="location" value={value} onChange={handleChangeRadio}>
                                                <FormControlLabel value="current" control={<Radio onClick={handleSetDB} />} label={<span className={classes.latlng}>位置情報は更新しない</span>} />
                                                <FormControlLabel value="map" control={<Radio onClick={handleOpenMap} />} label={<span className={classes.latlng}>Mapから取得</span>} />
                                            </RadioGroup>
                                            <span className={classes.latlng}>緯度：{state.latitude}</span>
                                            <span className={classes.latlng}>経度：{state.longitude}</span>
                                        </div>
                                        <div className={classes.margin} onBlur={() => {setTitle(document.getElementById("modalTitle").value)}}>
                                            <TextField
                                                id="modalTitle"
                                                name="modalTitle"
                                                label="タイトル"
                                                variant="outlined"
                                                style = {{width: 250}}
                                                InputLabelProps={{
                                                    className: classes.input,
                                                }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.modalTitle}
                                            />
                                            {touched.title && errors.title ? (
                                                <div className={classes.error}>{errors.title}</div>
                                            ) : null}
                                        </div>
                                        <div className={classes.margin} onBlur={() => {setContent(document.getElementById("modalContent").value)}}>
                                            <TextField
                                                id="modalContent"
                                                name="modalContent"
                                                label="内容"
                                                variant="outlined"
                                                style = {{width: 250}}
                                                multiline
                                                rows={4}
                                                InputLabelProps={{
                                                    className: classes.input,
                                                }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.modalContent}
                                            />
                                            {touched.content && errors.content ? (
                                                <div className={classes.error}>{errors.content}</div>
                                            ) : null}
                                        </div>
                                        <div className={classes.margin} onClick={setType}>
                                            <SwitchType 
                                                id="modalTypeSwitch"
                                                switchLabel={{true: '会員限定', false: '全員'}}
                                                labelPlacement='bottom'
                                                checked={state.type}
                                                value={editedArticle ? editedArticle.type : values.type}
                                            />
                                        </div>
                                        <div className={classes.margin}>
                                            <ArticleDropzone ref={childRef} />
                                        </div>
                                        <div className={classes.margin}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                className={classes.button}
                                                disabled={!isValid} 
                                                type="submit"
                                            >
                                                投稿する
                                            </Button>
                                        </div>
                                    </FormControl>
                                </Form>
                            )}
                            </Formik>
                        </Grid>
                    </Grid>
                </Paper>
                </Grid>
            </Grid>
        </>
    );
}
