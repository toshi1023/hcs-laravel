import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Input, InputLabel, InputAdornment, FormControl, FormLabel, Button, Grid, Card, CardHeader,CardContent} from '@material-ui/core';
import {useDropzone} from 'react-dropzone';
import styled from "styled-components";
import HcsAppBar from '../parts/appBar';
import ProfileDropzone from '../parts/userParts/dropzone';
import SwitchType from '../parts/switch';
import dateSelects from '../parts/common/dateSelects';

const useStyles = makeStyles((theme) => ({
    root: {
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

    /**
     * ファイルのドラッグ&ドロップ設定
     */
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone()
    const files = acceptedFiles.map(file => (
        <li className={classes.fileText}>{file.path}</li>
    ));
        console.log(getRootProps)
  return (
    <>
        <HcsAppBar />
        <Grid container justify="center">
        <Grid item xs={12} sm={8} md={8} lg={8}>
            <Card className={classes.root}>
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
                            <ProfileDropzone />
                        </CardContent>
                    </Grid>
                    <Grid item sm={12} md={12} lg={6}>
                        <CardContent>
                            <div>
                                <FormControl>
                                    <Button variant="contained" color="primary" className={classes.button}>作成する</Button>
                                </FormControl>
                            </div>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
        </Grid>
    </>
  );
}