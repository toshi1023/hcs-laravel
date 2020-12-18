import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, fetchGetInfoMessages, fetchGetErrorMessages, selectInfo, fetchOpenModal } from '../app/appSlice';
import { fetchAsyncUpdate } from './articleSlice';
import ArticleDropzone from '../parts/articleParts/dropzone';
import SwitchType from '../parts/common/switch';
import ArticlePrefectureSelects from '../parts/articleParts/articlePrefectureSelects';
import SnackMessages from '../parts/common/snackMessages';
import { Form, Formik } from "formik"; // 入力フォームのバリデーション設定に利用
import * as Yup from "yup"; // 入力フォームのバリデーション設定に利用
import _ from 'lodash';
import { Grid, Button, TextField, FormControl, Paper } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import styles from './myArticle.module.css';

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
  }));

  export default function ArticleEdit() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const childRef = useRef();
    // stateの初期設定
    const [state, setState] = React.useState({
        // 保存対象の値
        prefecture: '',
        latitude: '',
        longitude: '',
        title: '',
        content: '',
        type: false,
    });
    
    /**
     * 値のセット
     */
    const setPrefecture = () => {
        setState({
            ...state,
            prefecture: document.getElementById("formPrefecture").value,
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
            type: document.getElementById("typeSwitch").checked
        })
    }

    // Modalの非表示設定
    const handleClose = () => {
        dispatch(fetchOpenModal(false))
    };
    
    return (
        <>
            <Grid container justify="center">
                <Grid item xs={10} sm={3} md={3}>
                <Paper className={classes.paper}>
                {/* <div className={classes.paper}> */}
                    <Grid container>
                        <h3 className={classes.modalTitle}>記事の編集</h3>
                        <Button className={classes.closeIcon} onClick={handleClose}>
                            <CancelIcon />
                        </Button>
                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={10} sm={10} md={10}> 
                            <Formik
                                initialErrors={{ title: "required", content: "required" }}
                                initialValues={{ 
                                    title: '',
                                    content: '',
                                }}
                                onSubmit={async (values) => {
                                    // ユーザ登録処理
                                    let formData = new FormData(document.forms.form);
                                    formData.append('prefecture', document.getElementById("mobileFormPrefecture").value)
                                    formData.append('title', values.mobileTitle)
                                    formData.append('content', values.mobileContent)
                                    formData.append('type', document.getElementById("mobileTypeSwitch").checked)
                                    
                                    // 記事の登録処理
                                    createClicked(formData)
                                }}
                                validationSchema={Yup.object().shape({
                                    mobileTitle: Yup.string()
                                                    .required("タイトルの入力は必須です"),
                                    mobileContent: Yup.string()
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
                                            <ArticlePrefectureSelects id="mobileFormPrefecture" fontSize={15} />
                                        </div>
                                        <div className={classes.margin} onBlur={() => {setTitle(document.getElementById("title").value)}}>
                                            <TextField
                                                id="mobileTitle"
                                                name="mobileTitle"
                                                label="タイトル"
                                                variant="outlined"
                                                style = {{width: 250}}
                                                InputLabelProps={{
                                                    className: classes.input,
                                                }}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.mobileTitle}
                                            />
                                            {touched.title && errors.title ? (
                                                <div className={classes.error}>{errors.title}</div>
                                            ) : null}
                                        </div>
                                        <div className={classes.margin} onBlur={() => {setContent(document.getElementById("content").value)}}>
                                            <TextField
                                                id="mobileContent"
                                                name="mobileContent"
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
                                                value={values.mobileContent}
                                            />
                                            {touched.content && errors.content ? (
                                                <div className={classes.error}>{errors.content}</div>
                                            ) : null}
                                        </div>
                                        <div className={classes.margin} onClick={setType}>
                                            <SwitchType 
                                                id="mobileTypeSwitch"
                                                switchLabel={{true: '会員限定', false: '全員'}} 
                                                checked={state.type}
                                                value={values.type}
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
                {/* </div> */}
                </Paper>
                </Grid>
            </Grid>
        </>
    );
}
