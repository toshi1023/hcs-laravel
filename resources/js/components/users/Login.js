import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HcsAppBar from '../parts/appBar';
import {Input, InputLabel, InputAdornment, FormControl, Button, Grid, Card, CardHeader, CardContent} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import SwitchType from '../parts/switch';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        minWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
    },
    margin: {
        marginLeft: theme.spacing(4),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
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
    button: {
        marginLeft: theme.spacing(4),
        marginTop: theme.spacing(3),
        height: 40,
        width: 100,
        fontSize: 15
    },
}));

const Title = styled.h1`
  font-family: 'Cabin Sketch', cursive;
`;

export default function Login() {
  const classes = useStyles();

  return (
    <>
        <HcsAppBar />
        <Grid container justify="center">
            <Card className={classes.root}>
                <CardHeader 
                    title={
                        <Title>Login</Title>
                    }
                    className={classes.header}
                />
                <Grid item xs={12} md={12} spacing={3}>
                    <CardContent>
                        <Link to="/users/create" style={{fontSize: 13, width: 150}}>新規会員登録はこちら</Link>
                        <div>
                            <FormControl className={classes.margin}>
                                <InputLabel htmlFor="input-with-icon-adornment" className={classes.formFont}>ログインID</InputLabel>
                                <Input
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
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
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
                                }
                                type="password"
                                className={classes.formFont}
                                required
                                />
                            </FormControl>
                        </div>
                        <div>
                            <FormControl>
                                <Grid container>
                                    <Grid item md={8} className={classes.button}>
                                        <Button variant="contained" color="primary" >ログイン</Button>
                                    </Grid>
                                    {/* <Grid item md={6} spacing={10}>
                                        <SwitchType />
                                    </Grid>   */}
                                </Grid>
                            </FormControl>
                        </div>
                    </CardContent>
                </Grid>
            </Card>
        </Grid>
    </>
  );
}