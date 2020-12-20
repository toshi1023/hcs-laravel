import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCredStart, fetchCredEnd, fetchGetInfoMessages, fetchGetErrorMessages, fetchOpenModal, selectInfo, selectModal } from '../app/appSlice';
import { selectArticles, fetchAsyncGet, fetchAsyncCreate } from './articleSlice';
import ArticleEdit from './Edit';
import ArticleDropzone from '../parts/articleParts/dropzone';
import ArticleCard from '../parts/articleParts/articleCard';
import SwitchType from '../parts/common/switch';
import PrefectureSelects from '../parts/common/prefectureSearch';
import ArticlePrefectureSelects from '../parts/articleParts/articlePrefectureSelects';
import SnackMessages from '../parts/common/snackMessages';
import { Form, Formik } from "formik"; // 入力フォームのバリデーション設定に利用
import * as Yup from "yup"; // 入力フォームのバリデーション設定に利用
import _ from 'lodash';
import { Grid, Paper, Tabs, Tab, Button, TextField, FormControl, FormLabel, Modal, Backdrop, Fade, } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';
import CommentIcon from '@material-ui/icons/Comment';
import styles from './myArticle.module.css';

const useStyles = makeStyles((theme) => ({
    searchField: {
        paddingTop: theme.spacing(13),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(5),
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        paddingTop: theme.spacing(3),
        zIndex: 0,
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        paddingTop: theme.spacing(4),
        position: 'fixed',
        zIndex: 1,
    },
    gridContainer: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(2),
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
    error: {
        marginLeft: theme.spacing(3),
        fontSize: 13,
        color: 'red',
    },
    button: {
        marginTop: theme.spacing(3),
        height: 40,
        width: 100,
        fontSize: 15
    },
    button: {
        marginLeft: 'auto',
    },
    clearButton: {
        fontSize: 15,
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    input: {
        zIndex: 0
    },
    modal: {
        overflow:'scroll',
    },
  }));

function MyArticle() {
    const classes = useStyles();
    const childRef = useRef();
    // タブ用のstate
    const [tab, setTab] = React.useState(0);
    const [articlePage, setArticlePage] = React.useState(false);
    const [createPage, setCreatePage] = React.useState(true);
    // stateで管理する記事一覧データを使用できるようにローカルのarticles定数に格納
    const articles = useSelector(selectArticles)
    const infoMessages = useSelector(selectInfo)
    const open = useSelector(selectModal)
    const dispatch = useDispatch()
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
    
    // 画像の保存処理(ArticleDropzoneコンポーネントで実施)
    const doAction = (values) => {
        return childRef.current.onSubmitArticleImage(values)
    }
  
    // 作成(stateの値をApiで送信)
    async function createClicked(values) {
        // ロード開始
        await dispatch(fetchCredStart())
        
        // 画像の保存
        doAction(values).then(async (value) => {
            const result = await dispatch(fetchAsyncCreate(value))
            if (fetchAsyncCreate.fulfilled.match(result)) {
                // infoメッセージの表示
                result.payload.info_message ? dispatch(fetchGetInfoMessages(result)) : dispatch(fetchGetErrorMessages(result))
                // 記事の再読み込み
                await dispatch(fetchAsyncGet({prefecture: '', user_id: localStorage.getItem('loginId')}))
                // ロード終了
                await dispatch(fetchCredEnd()); 
                return;
            }
        })

        // ロード終了
        await dispatch(fetchCredEnd()); 
        return;
    }

    useEffect(() => {
        // 非同期の関数を定義
        const fetchArticleProf = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 記事一覧を取得
            const resultReg = await dispatch(fetchAsyncGet({prefecture: '', user_id: localStorage.getItem('loginId')}))
            if (fetchAsyncGet.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticleProf()
        
    }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある


    // 都道府県の検索条件をもとに記事の絞り込み
    const getSearchPrefecture = () => {
        // 非同期の関数を定義
        const fetchArticleSearch = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 都道府県情報をセット
            let prefecture = document.getElementById("prefecture").value
            if(prefecture == '全都道府県') {
                prefecture = ''
            }
            // 記事一覧を取得
            const resultSearch = await dispatch(fetchAsyncGet({prefecture: prefecture, user_id: localStorage.getItem('loginId')}))
            if (fetchAsyncGet.fulfilled.match(resultSearch)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
            // ロード終了
            await dispatch(fetchCredEnd());  
        }
        // 上で定義した非同期の関数を実行
        fetchArticleSearch()
    }

    // 検索条件のクリア
    const handleSearchClear = async () => {
        // Loading開始
        await dispatch(fetchCredStart())
        
        // 記事一覧を取得
        const resultSearch = await dispatch(fetchAsyncGet({prefecture: '', user_id: localStorage.getItem('loginId')}))
        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // 都道府県をリセット
            document.getElementById( "prefecture" ).options[0].selected ? 
                '' 
            : 
                document.getElementById( "prefecture" ).options[1].selected = true
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());
    }

    // タブ切り替え処理
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    // 記事一覧ページを表示(スマホ用)
    const handleTabArticle = () => {
        setArticlePage(false)
        setCreatePage(true)
    }
    // 友達一覧ページを表示(スマホ用)
    const handleTabCreate = () => {
        setArticlePage(true)
        setCreatePage(false)
    }

    // Modalの非表示設定
    const handleClose = () => {
        dispatch(fetchOpenModal(false))
    };
    
    // 記事一覧を生成
    const renderArticles = () => {
        return (
            <Grid container className={classes.gridContainer} justify="center">
                <Grid item xs={12} sm={6}>
                    <ArticleCard article={articles} />
                </Grid>
            </Grid>
        )
    }
    
    // 記事の編集モーダルを生成
    const renderEditModal = () => {
        return (
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
                    <ArticleEdit />
                </Fade>
            </Modal>
        )
    }

    return (
        <>
            {/* タブ(スマホ版のみ) */}
            <div className={classes.sectionMobile}>
                <Paper square className={classes.tab}>
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="secondary"
                        aria-label="icon label tabs example"
                        >
                        <Tab icon={<CommentIcon />} label="記事一覧" onClick={handleTabArticle} />
                        <Tab icon={<CreateIcon />} label="記事作成" onClick={handleTabCreate} />
                    </Tabs>
                </Paper>
            </div>

            {
                // メッセージ表示
                infoMessages ? 
                    <SnackMessages infoOpen={true} />
                :
                    <SnackMessages errorOpen={true} />
            }

            {/* 記事の編集モーダル */}
            {renderEditModal()}

            {/* 検索デザイン */}
            <Grid container className={classes.searchField}>
                <Grid item xs={5} md={1}>
                    <div onBlur={getSearchPrefecture}>
                        <PrefectureSelects id="prefecture" fontSize={15} />
                    </div>
                </Grid>
                <Grid item xs={5} md={1}>
                    <Button variant="contained" color="primary" className={classes.clearButton} onClick={handleSearchClear}>
                        検索クリア
                    </Button>
                </Grid>
            </Grid>

            {/* スマホ版 */}
            <div className={classes.sectionMobile}>
                <Grid container justify="center">
                    <Grid item xs={11} hidden={articlePage}>
                        {renderArticles()}
                    </Grid>
                    <Grid item xs={11} hidden={createPage}>
                        <h1 className={styles.createArticle}>
                            記事を作成する
                        </h1>
                        <br />
                        <Paper elevation={3}>
                            <Grid container justify="center" className={classes.form}>
                                <Grid item xs={10}>
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
                                                        initialState={false}
                                                        labelPlacement='bottom'
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
                        </Paper>
                    </Grid>
                </Grid>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container justify="center">
                    <Grid item sm={8}>
                        {renderArticles()}
                    </Grid>
                    <Grid item sm={4}>
                        <Grid item sm={11}>
                            <h1 className={styles.createArticle}>
                                記事を作成する
                            </h1>
                            <br />
                            <Paper elevation={3}>
                                <Grid container justify="center" className={classes.form}>
                                    <Grid item sm={10}>
                                        <Formik
                                            initialErrors={{ title: "required", content: "required" }}
                                            initialValues={{ 
                                                title: '',
                                                content: '',
                                            }}
                                            onSubmit={async (values) => {
                                                // ユーザ登録処理
                                                let formData = new FormData(document.forms.form);
                                                formData.append('prefecture', document.getElementById("formPrefecture").value)
                                                formData.append('title', values.title)
                                                formData.append('content', values.content)
                                                formData.append('type', document.getElementById("typeSwitch").checked ? 1 : 0)
                                                
                                                // 記事の登録処理
                                                createClicked(formData)
                                            }}
                                            validationSchema={Yup.object().shape({
                                                title: Yup.string()
                                                        .required("タイトルの入力は必須です"),
                                                content: Yup.string()
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
                                            <Form id="form" onSubmit={handleSubmit}>
                                                <FormControl>
                                                    <div className={classes.margin}  onBlur={setPrefecture}>
                                                        <ArticlePrefectureSelects id="formPrefecture" fontSize={15} />
                                                    </div>
                                                    <div className={classes.margin}  onBlur={() => {setTitle(document.getElementById("title").value)}}>
                                                        <TextField
                                                            id="title"
                                                            name="title"
                                                            label="タイトル"
                                                            variant="outlined"
                                                            style = {{width: 400}}
                                                            InputLabelProps={{
                                                                className: classes.input,
                                                            }}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.title}
                                                        />
                                                        {touched.title && errors.title ? (
                                                            <div className={classes.error}>{errors.title}</div>
                                                        ) : null}
                                                    </div>
                                                    <div className={classes.margin} onBlur={() => {setContent(document.getElementById("content").value)}}>
                                                        <TextField
                                                            id="content"
                                                            name="content"
                                                            label="内容"
                                                            variant="outlined"
                                                            style = {{width: 400}}
                                                            InputLabelProps={{
                                                                fontSize: 30,
                                                                className: classes.input,
                                                            }}
                                                            multiline
                                                            rows={4}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.content}
                                                        />
                                                        {touched.content && errors.content ? (
                                                            <div className={classes.error}>{errors.content}</div>
                                                        ) : null}
                                                    </div>
                                                    <div className={classes.margin} onClick={setType}>
                                                        <FormLabel name="type" display="hidden"></FormLabel>
                                                        <SwitchType 
                                                            id="typeSwitch"
                                                            switchLabel={{true: '会員限定', false: '全員'}}
                                                            initialState={false}
                                                            labelPlacement='bottom'
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
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default MyArticle;