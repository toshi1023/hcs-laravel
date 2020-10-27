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
import { selectMessage } from '../messages/messageSlice';

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
  // ユーザデータ編集のデータを使用できるようにローカルのeditedUser定数に格納
  const editedUser = useSelector(selectEditedUser)
  const dispatch = useDispatch()
   // stateの初期設定
  const [state, setState] = React.useState({
      id: editedUser.id,
      email: editedUser.email,
      password: editedUser.password,
      name: editedUser.name,
      birthday: editedUser.birthday,
      gender: editedUser.gender,
      image: editedUser.image,
  });

  /**
   * 値のセット
   */
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
  const setName = (e) => {
    setState({
        ...state,
        name: e.target.value,
    })
  }
  const setBirthday = () => {
      let year = document.getElementById("selectYear").value
      let month = document.getElementById("selectMonth").value
      let day = document.getElementById("selectDay").value
      setState({...state, birthday: `${year}-${month}-${day}`})
      return `${year}-${month}-${day}`
  }
  const setGender = (e) => {
    setState({
        ...state,
        gender: document.getElementById("genderSwitch").checked,
    })
  }

    // 作成(stateのeditedUserの値をApiで送信)
    const createClicked = () => {
        dispatch(fetchAsyncCreate(state))
        dispatch(editUser({ id: 0, title: '' }))
    }

    // 更新(stateのeditedUserの値をApiで送信)
    const updateClicked = () => {
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
                                                onChange={setEmail}
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
                                                onChange={setPassword}
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
                                                onChange={setName}
                                            />
                                        </FormControl>
                                    </div>
                                    <div onBlur={setBirthday}>
                                        <FormControl className={classes.margin}>
                                            <FormLabel style={{fontSize: 15}} display="block">生年月日</FormLabel>
                                            {dateSelects()}
                                        </FormControl>
                                    </div>
                                    <div onClick={setGender}>
                                        <FormControl className={classes.margin}>
                                            <FormLabel style={{fontSize: 15}} display="block">性別</FormLabel>
                                            <SwitchType 
                                                switchLabel={{true: '男性', false: '女性'}} 
                                                checked={state.gender}
                                            />
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
                                                editedUser.id === "" ? (
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