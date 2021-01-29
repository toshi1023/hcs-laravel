import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchCredStart, fetchCredEnd, selectModal, fetchOpenModal, 
    selectInfo, fetchGetInfoMessages, fetchGetErrorMessages 
} from '../app/appSlice';
import { fetchAsyncUpdate, selectEditedArticle } from './articleSlice';
import ArticleDropzone from '../parts/articleParts/dropzone';
import SwitchType from '../parts/common/switch';
import ArticlePrefectureSelects from '../parts/articleParts/articlePrefectureSelects';
import SnackMessages from '../parts/common/snackMessages';
import { Form, Formik } from "formik"; // 入力フォームのバリデーション設定に利用
import * as Yup from "yup"; // 入力フォームのバリデーション設定に利用
import _ from 'lodash';
import { Grid, Button, TextField, FormControl, FormLabel, Paper, Modal, Backdrop, Fade } from '@material-ui/core';
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
    },
    modal: {
        overflow:'scroll',
    },
  }));

  export default function ArticleEdit() {
    const classes = useStyles();
    const editedArticle = useSelector(selectEditedArticle)
    const open = useSelector(selectModal)
    const infoMessages = useSelector(selectInfo)
    const dispatch = useDispatch();
    const childRef = useRef();
    // stateの初期設定
    const [state, setState] = React.useState({
        // 保存対象の値
        id: editedArticle.id,
        prefecture: editedArticle.prefecture,
        latitude: editedArticle.latitude,
        longitude: editedArticle.longitude,
        title: editedArticle.title,
        content: editedArticle.content,
        type: editedArticle.type,
        articles_photo_name: editedArticle.articles_photo_name,
        image_id: editedArticle.image_id,
    });
    
    useEffect(() => {
        // 非同期の関数を定義
        const fetchPrefectures = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
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

    
    /**
     * Modalの非表示設定
     */
    const handleClose = () => {
        dispatch(fetchOpenModal(false))
    };

    /**
     * 画像の保存処理(ArticleDropzoneコンポーネントで実施)
     * @param {*} values 
     */
    const doAction = (values) => {
        return childRef.current.onSubmitArticleImage(values)
    }

    /**
     * 記事の更新処理
     */
    const updateClicked = async (values) => {
        // ロード開始
        await dispatch(fetchCredStart())
        
        // 画像の保存
        doAction(values).then(async (value) => {
            const result = await dispatch(fetchAsyncUpdate(value))
            if (fetchAsyncUpdate.fulfilled.match(result)) {
                // infoメッセージの表示
                result.payload.info_message ? dispatch(fetchGetInfoMessages(result)) : dispatch(fetchGetErrorMessages(result))
                // ロード終了
                await dispatch(fetchCredEnd()); 
                return;
            }
        })

        // ロード終了
        await dispatch(fetchCredEnd()); 
        return;
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
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Grid container justify="center">
                        <Grid item xs={11} sm={6} md={4}>
                        <Paper className={classes.paper}>
                            <Grid container>
                                <h3 className={classes.modalTitle}>記事の編集</h3>
                                <Button className={classes.closeIcon} onClick={handleClose}>
                                    <CancelIcon />
                                </Button>
                            </Grid>
                            <Grid container justify="center">
                                <Grid item xs={10}> 
                                    <Formik
                                        initialErrors={{ modalTitle: "required", modalContent: "required" }}
                                        initialValues={{ 
                                            modalTitle: editedArticle.title,
                                            modalContent: editedArticle.content,
                                        }}
                                        onSubmit={async (values) => {
                                            // ユーザ登録処理
                                            let formData = new FormData(document.forms.form);
                                            formData.append('id', state.id)
                                            formData.append('prefecture', state.prefecture)
                                            formData.append('title', values.modalTitle)
                                            formData.append('content', values.modalContent)
                                            formData.append('type', state.type)
                                            formData.append('image_id', state.image_id)
                                            formData.append('articles_photo_name', state.articles_photo_name)

                                            // 記事の登録処理
                                            updateClicked(formData)
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
                                                    <br />
                                                    <span className={classes.latlng}>緯度：{editedArticle.latitude}</span>
                                                    <span className={classes.latlng}>経度：{editedArticle.longitude}</span>
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
                                                        checked={editedArticle.type}
                                                        value={editedArticle ? editedArticle.type : values.type}
                                                    />
                                                </div>
                                                <div className={classes.margin}>
                                                    <ArticleDropzone ref={childRef} edit={true} />
                                                </div>
                                                <div className={classes.margin}>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        className={classes.button}
                                                        disabled={!isValid} 
                                                        type="submit"
                                                    >
                                                        更新する
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
                </Fade>
            </Modal>
        </>
    );
}
