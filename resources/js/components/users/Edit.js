import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectEditedUser } from "./userSlice";
import { fetchCredStart, fetchCredEnd, fetchOpenModal, selectModal } from '../app/appSlice';
import PrefectureSelects from '../parts/common/prefectureSearch';
import DateSelects from '../parts/common/dateSelects';
import SwitchType from '../parts/common/switch';
import ProfileDropzone from '../parts/userParts/dropzone';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    CardContent, Grid, Button, Modal, Backdrop, Fade,
    Input, InputLabel, InputAdornment, FormControl, FormLabel
 } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
        backgroundColor: "#f7fad1",
        display: "flex",
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: "#f7fad1",
    },
    listItemText:{
        fontSize:'12px',
    },
    details: {
        display: "flex",
        flexDirection: "column"
    },
    mainContent: {
        paddingTop: theme.spacing(15),
        zIndex: 0,
    },
    content: {
        flex: "1 0 auto",
    },
    cover: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(5),
        marginButtom: theme.spacing(2),
        height: 300,
        width: 350,
        border: '2px #DDDDDD dashed',
    },
    gridContainer: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
    userName: {
        fontSize: "15px"
    },
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '90%',
    },
    formFont: {
        fontSize: 15,
    },
    error: {
        marginLeft: theme.spacing(1),
        fontSize: 12,
        color: 'red',
    },
    modal: {
        overflow:'scroll',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        marginTop: theme.spacing(5),
    },
    closeIcon: {
        marginLeft: 'auto',
    },
    tooltip: {
        fontSize: 14,
    },
    modalTitle: {
        fontWeight: 'bold',
        paddingLeft: theme.spacing(1),
    },
}));

function UserEdit(props) {
    const classes = useStyles();
    const theme = useTheme();
    const childRef = useRef();
    const dispatch = useDispatch()
    // stateから値を取得
    const editedUser = useSelector(selectEditedUser)
    const open = useSelector(selectModal)
    // ユーザ編集用stateの初期設定
    const [state, setState] = React.useState({
        id: editedUser.value.id,
        prefecture: editedUser.value.prefecture,
        email: editedUser.value.email,
        name: editedUser.value.name,
        birthday: editedUser.value.birthday,
        birthdayYear: editedUser.value.birthday.substr(0, 4),   // 生年月日を年の値だけ取得
        birthdayMonth: editedUser.value.birthday.substr(5, 2),  // 生年月日を月の値だけ取得
        birthdayDay: editedUser.value.birthday.substr(8, 2),    // 生年月日を日の値だけ取得
        gender: editedUser.value.gender,
        comment: editedUser.value.comment,
    });
    
    useEffect(() => {
        // 非同期の関数を定義
        const fetchPrefectures = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ユーザの登録している都道府県が選択されている状態でセット
            document.getElementById("modalFormPrefecture").value = editedUser.value.prefecture
            // ユーザの登録している生年月日が選択されている状態でセット
            setBirthday(true)
            // ロード終了
            await dispatch(fetchCredEnd());
        }
        // 上で定義した非同期の関数を実行
        fetchPrefectures()
    }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある
    
    /**
     * Modalの非表示設定
     */
    const handleClose = () => {
        dispatch(fetchOpenModal(false))
    };

    /**
     * 値のセット
     */
    const setName = (e) => {
        setState({
            ...state,
            name: e.target.value,
        })
    }
    const setEmail = (e) => {
        setState({
            ...state,
            email: e.target.value,
        })
    }
    const setPassword = (e) => {
        setState({
            ...state,
            password: e.target.value,
        })
    }
    const setPrefecture = () => {
        let prefecture = document.getElementById("modalFormPrefecture").value
        if(prefecture == '全都道府県') {
            prefecture = ''
        }
        setState({
            ...state,
            prefecture: prefecture,
        })
    }
    const setComment = (e) => {
        setState({
            ...state,
            comment: e.target.value,
        })
    }
    // 生年月日の取得
    const setBirthday = (flg) => {
        if(state.birthdayYear && state.birthdayMonth && state.birthdayDay && flg) {
            document.getElementById("selectYear").value = state.birthdayYear
            document.getElementById("selectMonth").value = state.birthdayMonth
            document.getElementById("selectDay").value = state.birthdayDay
        }
        let year = document.getElementById("selectYear").value
        let month = document.getElementById("selectMonth").value
        let day = document.getElementById("selectDay").value
        setState({...state, birthday: `${year}-${month}-${day}`})
    }
    const setGender = () => {
        setState({
            ...state,
            gender: document.getElementById("genderSwitch").checked,
        })
    }

    return (
        <>
            {/* 
                ユーザの編集用モーダル 
            */}
            <div>
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
                        <Grid item xs={11} sm={6}>
                        <div className={classes.paper}>
                            <Grid container>
                                <h3 className={classes.modalTitle}>プロフィールの編集</h3>
                                <Button className={classes.closeIcon} onClick={handleClose}>
                                    <CancelIcon />
                                </Button>
                            </Grid>
                            {/* 編集フォーム */}
                            <Grid container>
                                <Grid item xs={12}>
                                    <Formik
                                        initialErrors={{ name: "required" }}
                                        initialValues={{ 
                                            email: editedUser.value.email,
                                            password: '',
                                            name: editedUser.value.name,
                                        }}
                                        onSubmit={async (values) => {
                                            // ユーザ登録処理
                                            createClicked()
                                        }}
                                        validationSchema={Yup.object().shape({
                                            email: Yup.string()
                                                    .required("メールアドレスの入力は必須です")
                                                    .email('メールアドレスの形式で入力してください'),
                                            password: Yup.string()
                                                        .min(6, '6文字以上を入れてください'),
                                            name: Yup.string()
                                            　　　　　.required("ニックネームはの入力は必須です")
                                                    .max(15, 'ニックネームは15文字以内で入力してください'),
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
                                        <Grid container>
                                            <Grid item sm={12} md={8} lg={6}>
                                                <CardContent>
                                                    <div onBlur={() => {setEmail(document.getElementById("email").value)}}>
                                                        <FormControl className={classes.margin}>
                                                            <InputLabel htmlFor="email" className={classes.formFont}>メールアドレス</InputLabel>
                                                            <Input
                                                                id="email"
                                                                name="email"
                                                                startAdornment={
                                                                    <InputAdornment position="start" />
                                                                }
                                                                className={classes.formFont}
                                                                required
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.email}
                                                            />
                                                        </FormControl>
                                                        {touched.email && errors.email ? (
                                                            <div className={classes.error}>{errors.email}</div>
                                                        ) : null}
                                                    </div>
                                                    <div onBlur={() => {setPassword(document.getElementById("password").value)}}>
                                                        <FormControl className={classes.margin}>
                                                            <InputLabel htmlFor="password" className={classes.formFont}>パスワード</InputLabel>
                                                            <Input
                                                                id="password"
                                                                name="password"
                                                                startAdornment={
                                                                    <InputAdornment position="start" />
                                                                }
                                                                type="password"
                                                                className={classes.formFont}
                                                                required
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.password}
                                                            />
                                                        </FormControl>
                                                        {touched.password && errors.password ? (
                                                            <div className={classes.error}>{errors.password}</div>
                                                        ) : null}
                                                    </div>
                                                    <div onBlur={() => {setName(document.getElementById("name").value)}}>
                                                        <FormControl className={classes.margin}>
                                                            <InputLabel htmlFor="name" className={classes.formFont}>ニックネーム</InputLabel>
                                                            <Input
                                                                id="name"
                                                                name="name"
                                                                startAdornment={
                                                                    <InputAdornment position="start" />
                                                                }
                                                                className={classes.formFont}
                                                                required
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                            />
                                                        </FormControl>
                                                        {touched.name && errors.name ? (
                                                            <div className={classes.error}>{errors.name}</div>
                                                        ) : null}
                                                    </div>
                                                    <div onBlur={setBirthday}>
                                                        <FormControl className={classes.margin}>
                                                            <FormLabel style={{fontSize: 15}} display="block">生年月日</FormLabel>
                                                            <DateSelects fontSize={15} />
                                                        </FormControl>
                                                        {touched.birthday && errors.birthday ? (
                                                            <div className={classes.error}>{errors.birthday}</div>
                                                        ) : null}
                                                    </div>
                                                    <div onBlur={setPrefecture}>
                                                        <FormControl className={classes.margin}>
                                                            <PrefectureSelects
                                                                labelFlg={editedUser.value.prefecture ? false : undefined}
                                                                id="modalFormPrefecture" 
                                                                fontSize={15} 
                                                            />
                                                        </FormControl>
                                                        {touched.prefecture && errors.prefecture ? (
                                                            <div className={classes.error}>{errors.prefecture}</div>
                                                        ) : null}
                                                    </div>
                                                    <div onClick={setGender}>
                                                        <FormControl className={classes.margin}>
                                                            <FormLabel style={{fontSize: 15}} name="gender" display="block">性別</FormLabel>
                                                            <SwitchType 
                                                                id="genderSwitch"
                                                                switchLabel={{true: '男性', false: '女性'}}
                                                                initialState={false}
                                                                labelPlacement='bottom'
                                                                checked={state.gender}
                                                                value={values.gender}
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </CardContent>
                                            </Grid>
                                            <Grid item sm={12} md={12} lg={6}>
                                                <CardContent>
                                                    <div>
                                                        <FormControl className={classes.margin}>
                                                            <InputLabel htmlFor="profileImage" style={{fontSize: 15}}>プロフィール画像</InputLabel>
                                                        </FormControl>
                                                    </div>

                                                    {/* ドラッグ&ドロップ */}
                                                    <ProfileDropzone ref={childRef} />

                                                </CardContent>
                                            </Grid>
                                            <Grid item sm={12} md={12} lg={6}>
                                                <CardContent>
                                                    <div>
                                                        <FormControl>
                                                            <Button 
                                                                variant="contained" 
                                                                color="primary" 
                                                                className={classes.button} 
                                                                disabled={!isValid || state.birthdayCheck || state.prefectureCheck} 
                                                                type="submit"
                                                            >
                                                                更新する
                                                            </Button>
                                                        </FormControl>
                                                    </div>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                        </Form>
                                    )}
                                    </Formik>
                                </Grid>
                            </Grid>
                        </div>
                        
                        </Grid>
                    </Grid>
                    </Fade>
                </Modal>
            </div>
        </>
    );
}

export default withRouter(UserEdit);
