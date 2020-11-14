import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Input, InputLabel, InputAdornment, FormControl, FormLabel, Button, Grid, Card, CardHeader,CardContent} from '@material-ui/core';
import styled from "styled-components";
import ProfileDropzone from '../parts/userParts/dropzone';
import SwitchType from '../parts/common/switch';
import DateSelects from '../parts/common/dateSelects';
import PrefectureSelects from '../parts/common/prefectureSearch';
import { Form, Formik } from "formik"; // 入力フォームのバリデーション設定に利用
import * as Yup from "yup"; // 入力フォームのバリデーション設定に利用
import SnackMessages from '../parts/common/snackMessages';
import { fetchCredStart, fetchCredEnd, fetchGetInfoMessages, fetchGetErrorMessages } from '../app/appSlice';
import {
    fetchAsyncCreate, 
    fetchAsyncGetPrefectures,
    fetchAsyncLogin,
    selectEditedUser,
    selectPrefectures,
} from './userSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minWidth: 300,
    },
    card: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        minWidth: 300,
        margin: `${theme.spacing(1)}px auto`,
    },
    margin: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: 300,
    },
    header: {
        textAlign: 'center',
        fontSize: 80,
        paddingTop: "5%",
        backgroundColor: '#1b2538',
        display: 'flex',
        color: 'white'
    },
    formFont: {
        fontSize: 20
    },
    error: {
        marginLeft: theme.spacing(3),
        fontSize: 13,
        color: 'red',
    },
    button: {
        marginLeft: theme.spacing(3),
        marginTop: theme.spacing(1),
        height: 40,
        width: 100,
        fontSize: 15
    },
    preview: {
        paddingTop: 30,
        paddingLeft: 30,
        paddingBottom: 15
    },
    fileText: {
        paddingLeft: 30,
        fontSize: 15,
    }
}));

const Title = styled.h1`
  font-family: 'Cabin Sketch', cursive;
`;

export default function UserCreate() {
    const classes = useStyles();
    const childRef = useRef();
    const history = useHistory();
    const dispatch = useDispatch()
    // ユーザデータ編集のデータを使用できるようにローカルのeditedUser定数に格納
    const editedUser = useSelector(selectEditedUser)
    const prefectures = useSelector(selectPrefectures)
    // stateの初期設定
    const [state, setState] = React.useState({
        // 保存対象の値
        email: editedUser.email,
        password: editedUser.password,
        name: editedUser.name,
        birthday: editedUser.birthday,
        prefecture: editedUser.prefecture,
        gender: editedUser.gender,
        // 生年月日と都道府県チェック
        birthdayCheck: true,
        prefectureCheck: true,
    });

    useEffect(() => {
        // 非同期の関数を定義
        const fetchPrefectures = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 都道府県一覧を取得
            const resultReg = await dispatch(fetchAsyncGetPrefectures())
            if (fetchAsyncGetPrefectures.fulfilled.match(resultReg)) {
                // ロード終了
                await dispatch(fetchCredEnd());       
            }
        }
        // 上で定義した非同期の関数を実行
        fetchPrefectures()
        
    }, [dispatch]) // dispatchをuseEffectの第2引数に定義する必要がある

    /**
     * 値のセット
     */
    const setEmail = (value) => {
        setState({
            ...state,
            email: value,
        })
    }
    const setPassword = (value) => {
        setState({
            ...state,
            password: value,
        })
    }
    const setName = (value) => {
        setState({
            ...state,
            name: value,
        })
    }
    const setBirthday = () => {
        let year = Number(document.getElementById("selectYear").value) ? Number(document.getElementById("selectYear").value) : document.getElementById("selectYear").value
        let month = Number(document.getElementById("selectMonth").value) ? Number(document.getElementById("selectMonth").value) : document.getElementById("selectMonth").value
        let day = Number(document.getElementById("selectDay").value) ? Number(document.getElementById("selectDay").value) : document.getElementById("selectDay").value
        
        // 年月日を正しく選択した場合
        if(typeof(year) != 'string' && typeof(month) != 'string' && typeof(day) != 'string') {
            setState({...state, 
                birthday: `${year}-${month}-${day}`,
                birthdayCheck: false,
            })
            return;
        }
        setState({...state, birthday: `${year}-${month}-${day}`})
        return;
    }
    const setPrefecture = () => {
        setState({
            ...state,
            prefecture: document.getElementById("prefecture").value,
            prefectureCheck: false,
        })
    }
    const setGender = () => {
        setState({
            ...state,
            gender: document.getElementById("genderSwitch").checked,
        })
    }

    const doAction = (id) => {
        childRef.current.onSubmit(id)
    }
  
    // 作成(stateのeditedUserの値をApiで送信)
    async function createClicked() {
        // ロード開始
        await dispatch(fetchCredStart())
        const result = await dispatch(fetchAsyncCreate(state))
        if (fetchAsyncCreate.fulfilled.match(result)) {
            // 画像の保存
            doAction(result.payload.id)
            // ログイン処理
            await dispatch(fetchAsyncLogin(result.payload))
            // infoメッセージの表示
            result.payload.info_message ? dispatch(fetchGetInfoMessages(result)) : dispatch(fetchGetErrorMessages(result))
            // Topページに遷移
            history.push(`/`)
            // ロード終了
            await dispatch(fetchCredEnd()); 
            return;
        }
        // ロード終了
        await dispatch(fetchCredEnd()); 
        return;
    }

  return (
    <>
        <div className={classes.root}>
            <Grid container justify="center">
                <Grid item xs={12} sm={7} md={7} lg={7}>
                    <Card className={classes.card}>
                        <CardHeader 
                            title={
                                <Title>New Create Account</Title>
                            }
                            className={classes.header}
                        />
                        <Formik
                            initialErrors={{ name: "required" }}
                            initialValues={{ 
                                email: "",
                                password: "",
                                name: "",
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
                                             .required("パスワードの入力は必須です")
                                             .min(6, '6文字以上を入れてください'),
                                name: Yup.string().required("ニックネームはの入力は必須です"),
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
                                        <Link to="/login" style={{fontSize: 13, width: 150}}>ログインはこちら</Link>
                                        
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
                                                    <PrefectureSelects values={prefectures.prefectures} name="prefecture" fontSize={15} />
                                                </FormControl>
                                                {touched.prefecture && errors.prefecture ? (
                                                    <div className={classes.error}>{errors.prefecture}</div>
                                                ) : null}
                                            </div>
                                            <div onClick={setGender}>
                                                <FormControl className={classes.margin}>
                                                    <FormLabel style={{fontSize: 15}} name="gender" display="block">性別</FormLabel>
                                                    <SwitchType 
                                                        switchLabel={{true: '男性', false: '女性'}} 
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
                                                    作成する
                                                </Button>
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Grid>
                            </Grid>
                            </Form>
                        )}
                        </Formik>
                    </Card>
                </Grid>
            </Grid>
        </div>
    </>
  );
}