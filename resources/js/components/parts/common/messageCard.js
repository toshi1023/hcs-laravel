import React from 'react';
import { Card, CardContent, Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import styles from './commonParts.module.css';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        backgroundColor: '#1b2538',
    },
    message: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#cc8686',
    },
    mobileMessage: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#cc8686',
    },
    button: {
        fontSize: 15
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
}))

const MessageCard = () => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <>
            {/* スマホ版 */}
            <div className={classes.sectionMobile}>
                <Card className={styles.wrap} variant="outlined">
                    <CardContent>
                        <div className={styles.avatarInner}>
                            <Avatar className={classes.large}>
                                <LockOpenIcon style={{ fontSize: 30 }} />
                            </Avatar>
                        </div>
                        <div className={styles.messageInner}>
                            <span className={classes.mobileMessage}>
                                会員登録が必須です
                            </span>
                        </div>
                        <div className={styles.buttonInner}>
                            <Button variant="contained" color="primary" className={classes.button} onClick={() => history.push('/users/create')}>
                                会員登録ページへ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Card className={styles.wrap} variant="outlined">
                    <CardContent>
                        <div className={styles.avatarInner}>
                            <Avatar className={classes.large}>
                                <LockOpenIcon style={{ fontSize: 30 }} />
                            </Avatar>
                        </div>
                        <div className={styles.messageInner}>
                            <span className={classes.message}>
                                会員登録が必須です
                            </span>
                        </div>
                        <div className={styles.buttonInner}>
                            <Button variant="contained" color="primary" className={classes.button} onClick={() => history.push('/users/create')}>
                                会員登録ページへ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default MessageCard
