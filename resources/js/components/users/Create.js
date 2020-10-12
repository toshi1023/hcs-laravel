import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Input, InputLabel, InputAdornment, FormControl, FormLabel, Button, Grid, Card, CardHeader,CardContent} from '@material-ui/core';
import styled from "styled-components";
import ProfileDropzone from '../parts/userParts/dropzone';
import SwitchType from '../parts/switch';
import dateSelects from '../parts/common/dateSelects';
import {
    fetchAsyncCreate, 
    fetchAsyncUpdate, 
    editUser, 
    selectEditedUser
} from './userSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        minWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
    },
    margin: {
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        width: 350,
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
    button: {
        marginLeft: theme.spacing(4),
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

  // ユーザデータ編集のデータを使用できるようにローカルのarticles定数に格納
  const editedUser = useSelector(selectEditedUser)
  const dispatch = useDispatch()

//   useEffect(() => {
//       // 非同期の関数を定義
//       const fetchUserProf = async () => {
//           // ユーザ作成とログイン情報を取得
//           await dispatch(fetchAsyncCreate())
//           // await dispatch(fetchAsyncProf())
//       }
//       // 上で定義した非同期の関数を実行
//       fetchUserProf()
//       // dispatchをuseEffectの第2引数に定義する必要がある
//   }, [dispatch])

  // stateのeditUserの値を変えるアクションをdispatch
  const handleInputChange = (e) => {
    editUser.id === 0 ? dispatch(editUser({ 
                            id: 0,
                            email: e.target.value,
                            password: e.target.value,
                            nickName: e.target.value,
                            birthday: e.target.value,
                            gender: e.target.value,
                            image: e.target.value,
                        }))
                        : dispatch(editUser({ 
                            id: editedUser.id,
                            email: e.target.value,
                            password: e.target.value,
                            nickName: e.target.value,
                            birthday: e.target.value,
                            gender: e.target.value,
                            image: e.target.value,
                        }))
  }

  const setBirthday = () => {
      let year = document.getElementById("selectYear").value
      let month = document.getElementById("selectMonth").value
      let day = document.getElementById("selectDay").value

      return `${year}-${month}-${day}`
  }

    // 作成(stateのeditedUserの値をApiで送信)
    const createClicked = () => {
        let birthday = setBirthday()
        console.log(birthday)
        dispatch(fetchAsyncCreate(editedUser))
        dispatch(editUser({ id: 0, title: '' }))
    }

    // 更新(stateのeditedUserの値をApiで送信)
    const updateClicked = () => {
        let birthday = setBirthday()
        console.log(birthday)
        dispatch(fetchAsyncUpdate(editedUser))
        dispatch(editUser({ id: 0, title: '' }))
    }

  return (
    <>
        <div className={classes.root}>
            <Grid container justify="center">
                <Grid item xs={12} sm={8} md={8} lg={8}>
                    <Card className={classes.card}>
                        <CardHeader 
                            title={
                                <Title>New Create Account</Title>
                            }
                            className={classes.header}
                        />
                        <Grid container>
                            <Grid item sm={12} md={8} lg={6}>
                                <CardContent>
                                    <Link to="/login" style={{fontSize: 13, width: 150}}>ログインはこちら</Link>
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <InputLabel htmlFor="input-with-icon-adornment" className={classes.formFont}>メールアドレス</InputLabel>
                                            <Input
                                                id="input-with-icon-adornment"
                                                startAdornment={
                                                    <InputAdornment position="start" />
                                                }
                                                className={classes.formFont}
                                                required
                                            />
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <InputLabel htmlFor="input-with-icon-adornment" className={classes.formFont}>パスワード</InputLabel>
                                            <Input
                                                id="input-with-icon-adornment"
                                                startAdornment={
                                                    <InputAdornment position="start" />
                                                }
                                                type="password"
                                                className={classes.formFont}
                                                required
                                            />
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <InputLabel htmlFor="input-with-icon-adornment" className={classes.formFont}>ニックネーム</InputLabel>
                                            <Input
                                                id="input-with-icon-adornment"
                                                startAdornment={
                                                    <InputAdornment position="start" />
                                                }
                                                className={classes.formFont}
                                                required
                                            />
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <FormLabel style={{fontSize: 15}} display="block">生年月日</FormLabel>
                                            {dateSelects()}
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <FormLabel style={{fontSize: 15}} display="block">性別</FormLabel>
                                            <SwitchType switchLabel={{true: '男性', false: '女性'}} />
                                        </FormControl>
                                    </div>
                                </CardContent>
                            </Grid>
                            <Grid item sm={12} md={12} lg={6}>
                                <CardContent>
                                    <div>
                                        <FormControl className={classes.margin}>
                                            <InputLabel htmlFor="input-with-icon-adornment" style={{fontSize: 15}}>プロフィール画像</InputLabel>
                                        </FormControl>
                                    </div>

                                    {/* ドラッグ&ドロップ */}
                                    <ProfileDropzone />

                                </CardContent>
                            </Grid>
                            <Grid item sm={12} md={12} lg={6}>
                                <CardContent>
                                    <div>
                                        <FormControl>
                                            {
                                                // 作成と編集でボタン表記と処理を切り分け
                                                editUser.id === 0 ? (
                                                    <Button variant="contained" color="primary" className={classes.button} onClick={createClicked}>作成する</Button>
                                                ) : (
                                                    <Button variant="contained" color="primary" className={classes.button} onClick={updateClicked}>更新する</Button>
                                                )
                                            }
                                        </FormControl>
                                    </div>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </div>
    </>
  );
}