import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HcsAppBar from './parts/appBar';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        minWidth: 400,
        margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),
    },
    margin: {
        marginLeft: theme.spacing(9),
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        width: 200,
    },
    label: {
        fontSize: 100,
    },
    input: {
        fontSize: 20
    },
    label: {
        fontSize: 20
    },
}));

export default function Login() {
  const classes = useStyles();

  return (
    <>
        <HcsAppBar />
        <Grid container spacing={2}>
            <Card className={classes.root}>
                <Grid item xs={12} sm={4} spacing={3}>
                <CardContent>
                    <Grid item xs={12} sm={4} spacing={3}>
                        <div>
                            <FormControl className={classes.margin}>
                                <InputLabel htmlFor="input-with-icon-adornment" className={classes.label}>ログインID</InputLabel>
                                <Input
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
                                }
                                className={classes.input}
                                required
                                />
                            </FormControl>
                        </div>
                        <div>
                            <FormControl className={classes.margin}>
                                <InputLabel htmlFor="input-with-icon-adornment" className={classes.label}>パスワード</InputLabel>
                                <Input
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
                                }
                                type="password"
                                className={classes.input}
                                required
                                />
                            </FormControl>
                        </div>
                    </Grid>
                </CardContent>
                </Grid>
            </Card>
        </Grid>
    </>
  );
}