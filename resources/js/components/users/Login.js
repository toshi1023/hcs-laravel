import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Input, InputLabel, InputAdornment, FormControl, Button, Grid, Card, CardHeader, CardContent} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import styled from "styled-components";
import { Link, useHistory } from 'react-router-dom';
import SwitchType from '../parts/common/switch';
import { Form, Formik } from "formik"; // 入力フォームのバリデーション設定に利用
import * as Yup from "yup"; // 入力フォームのバリデーション設定に利用
import SnackMessages from '../parts/common/snackMessages';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCredStart,
    fetchCredEnd,
    fetchGetInfoMessages,
    fetchGetErrorMessages,
    selectError,
} from '../app/appSlice';
import {
    fetchAsyncLogin,
    fetchAsyncGetShow,
} from './userSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(20),
        marginBottom: theme.spacing(10),
        minWidth: 300,
        margin: `${theme.spacing(1)}px auto`,
    },
    subTitle: {
        fontFamily: 'Cabin Sketch, cursive',
        fontSize: 25
    },
    margin: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        minWidth: 300,
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
        marginTop: theme.spacing(3),
        height: 40,
        width: 100,
        fontSize: 15
    },
}));

export default function Login() {
  const history = useHistory();
  const classes = useStyles();
  const errorMessages = useSelector(selectError)
  const dispatch = useDispatch();
  // stateの初期設定
  const [open, setOpen] = React.useState(true);
    
  return (
    <>
        <Grid container justify="center">
            {
                // ユーザ作成 & ログイン完了時
                errorMessages ? 
                    <SnackMessages errorOpen={true} />
                :
                    <SnackMessages infoOpen={true} />
            }
            <Card className={classes.root}>
                <CardHeader 
                    title={
                        <span className={classes.subTitle}>Login</span>
                    }
                    className={classes.header}
                />
                <Grid item xs={12} md={12}>
                    <SnackMessages errorOpen={open} />
                    <CardContent>
                        <Link to="/users/create" style={{fontSize: 13, width: 150}}>新規会員登録はこちら</Link>
                        <Formik
                            initialErrors={{ name: "required" }}
                            initialValues={{ name: "", password: "" }}
                            onSubmit={async (values) => {
                                // ロード開始
                                await dispatch(fetchCredStart());
                                // ログイン実行
                                const login = await dispatch(fetchAsyncLogin(values));
                                // ログインに失敗した場合
                                if(login.payload.status == 401) {
                                    // エラーメッセージを表示
                                    login.payload.error_message ? dispatch(fetchGetErrorMessages(login)) : ''
                                    // 常時SnackMessagesがtrueになるようstateを設定
                                    !open ? setOpen(true) : ''
                                    // ロード終了
                                    await dispatch(fetchCredEnd());
                                    return;
                                }
                                // ログインに成功した場合
                                if (fetchAsyncLogin.fulfilled.match(login)) {
                                    // ログインユーザのプロフィールを取得
                                    await dispatch(fetchAsyncGetShow(localStorage.getItem('loginId')));
                                    // infoメッセージの表示
                                    login.payload.info_message ? dispatch(fetchGetInfoMessages(login)) : ''
                                    // Topページに遷移
                                    history.push(`/`)
                                    // ロード終了
                                    await dispatch(fetchCredEnd());
                                } 
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required("IDはの入力は必須です"),
                                password: Yup.string()
                                             .required("パスワードの入力は必須です")
                                             .min(6, '6文字以上を入れてください'),
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
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <InputLabel htmlFor="input-with-icon-adornment" className={classes.formFont}>ログインID</InputLabel>
                                            <Input
                                            id="input-with-icon-adornment"
                                            name="name"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                <AccountCircle />
                                                </InputAdornment>
                                            }
                                            className={classes.formFont}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.name}
                                            required
                                            />
                                        </FormControl>
                                        {touched.name && errors.name ? (
                                            <div className={classes.error}>{errors.name}</div>
                                        ) : null}
                                    </div>
                                    
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <InputLabel htmlFor="input-with-icon-adornment" className={classes.formFont}>パスワード</InputLabel>
                                            <Input
                                            id="input-with-icon-adornment"
                                            name="password"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                <AccountCircle />
                                                </InputAdornment>
                                            }
                                            type="password"
                                            className={classes.formFont}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            required
                                            />
                                        </FormControl>
                                        {touched.password && errors.password ? (
                                            <div className={classes.error}>{errors.password}</div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <FormControl>
                                            <Grid container>
                                                <Grid item md={8} className={classes.button}>
                                                    <Button variant="contained" color="primary" disabled={!isValid} type="submit">ログイン</Button>
                                                </Grid>
                                                {/* <Grid item md={6} spacing={10}>
                                                    <SwitchType />
                                                </Grid>   */}
                                            </Grid>
                                        </FormControl>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Grid>
            </Card>
        </Grid>
    </>
  );
}