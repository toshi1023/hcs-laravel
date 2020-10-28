import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectEditedUser, selectPrefectures, fetchAsyncGetPrefectures } from "./userSlice";
import { fetchCredStart, fetchCredEnd, } from '../app/appSlice';
import PrefectureSelects from '../parts/common/prefectureSearch';
import dateSelects from '../parts/common/dateSelects';
import SwitchType from '../parts/switch';
import ProfileDropzone from '../parts/userParts/dropzone';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, Typography, List, ListItem, Grid, Button,
    ListItemText, ListItemAvatar, Avatar, Divider, Modal, Backdrop, Fade,
    Input, InputLabel, InputAdornment, FormControl, FormLabel, Fab
 } from "@material-ui/core";
 import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
 import EventIcon from '@material-ui/icons/Event';
 import SaveIcon from '@material-ui/icons/Save';
 import CommentIcon from '@material-ui/icons/Comment';
 import CancelIcon from '@material-ui/icons/Cancel';
import RoomIcon from '@material-ui/icons/Room';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 200,
        backgroundColor: "#f7fad1",
        display: "flex"
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
    content: {
        flex: "1 0 auto",
    },
    cover: {
        marginLeft: theme.spacing(2),
        marginTop: theme.spacing(5),
        marginButtom: theme.spacing(2),
        height: 280
    },
    gridContainer: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
    userName: {
        fontSize: "15px"
    },
    margin: {
        marginTop: theme.spacing(2),
        width: 350,
    },
    formFont: {
        fontSize: 14,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    },
    closeIcon: {
        marginLeft: 'auto',
    },
}));

function UserEdit(props) {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch()
    // stateから値を取得
    const editedUser = useSelector(selectEditedUser);
    const prefectures = useSelector(selectPrefectures);
    // ユーザ編集用stateの初期設定
    const [state, setState] = React.useState({
        id: editedUser.value.id,
        prefecture: editedUser.value.prefecture,
        email: editedUser.value.email,
        name: editedUser.value.name,
        birthday: editedUser.value.birthday,
        gender: editedUser.value.gender,
        comment: editedUser.value.comment,
    });
    
    useEffect(() => {
        // 非同期の関数を定義
        const fetchPrefectures = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // 記事一覧を取得
            const resultReg = await dispatch(fetchAsyncGetPrefectures())
            if (fetchAsyncGetPrefectures.fulfilled.match(resultReg)) {
                // ユーザの登録している都道府県が選択されている状態でセット
                document.getElementById("prefecture").value = editedUser.value.prefecture
                // ユーザの登録している生年月日が選択されている状態でセット
                // document.getElementById("selectYear").value = editedUser.value.birthday
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
    const setPrefecture = () => {
        let prefecture = document.getElementById("prefecture").value
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
    const setBirthday = () => {
        let year = document.getElementById("selectYear").value
        let month = document.getElementById("selectMonth").value
        let day = document.getElementById("selectDay").value
        setState({...state, birthday: `${year}-${month}-${day}`})
        return `${year}-${month}-${day}`
    }
    // Modal設定
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <Grid container className={classes.gridContainer} justify="center">
            {/* 
                画像の編集用モーダル 
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
                        <Grid item xs={12} sm={6}>
                        <div className={classes.paper}>
                            <Grid container>
                                <h2>画像の編集</h2>
                                <Button className={classes.closeIcon}>
                                    <CancelIcon onClick={handleClose} />
                                </Button>
                            </Grid>
                            {/* ドラッグ&ドロップ */}
                            <Grid container justify="center">
                                <Grid item xs={12} sm={8}>
                                    <ProfileDropzone /> 
                                </Grid>
                            </Grid>
                        </div>
                        </Grid>
                    </Grid>
                    </Fade>
                </Modal>
            </div>
            <Grid item xs={12} sm={6}>
                <Card className={classes.root}>
                    <Grid container  spacing={2}>
                        <Grid item xs={8} sm={12}>
                            <Fab color="primary" aria-label="add">
                                <SaveIcon style={{ fontSize: 'large' }} />
                            </Fab>
                        </Grid>
                        <Grid item xs={8} sm={6}>
                            <CardMedia
                                className={classes.cover}
                                image={editedUser.value.users_photo_path}
                                title={editedUser.value.users_photo_name}
                                onClick={handleOpen}
                            />
                        </Grid>
                        <Grid item xs={8} sm={6}>
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <div className={styles.note}>
                                        <List className={classes.list}>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <EmojiEmotionsIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <FormControl className={classes.margin}>
                                                <InputLabel htmlFor="userName" className={classes.formFont}>ニックネーム</InputLabel>
                                                <Input
                                                    id="userName"
                                                    startAdornment={
                                                        <InputAdornment position="start" />
                                                    }
                                                    className={classes.formFont}
                                                    value={editedUser.value.name}
                                                    required
                                                    onChange={setName}
                                                />
                                            </FormControl>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <RoomIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <FormControl className={classes.margin}>
                                                <div onBlur={setPrefecture}>
                                                    <PrefectureSelects 
                                                        values={prefectures.prefectures} 
                                                        labelFlg={editedUser.value.prefecture ? false : undefined} 
                                                        fontSize={13}
                                                    />
                                                </div>
                                            </FormControl>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <EventIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <FormControl className={classes.margin}>
                                                <FormLabel style={{fontSize: 11}} display="block">生年月日</FormLabel>
                                                {dateSelects({fontSize:13})}
                                            </FormControl>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <SupervisorAccountIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <FormControl className={classes.margin}>
                                                <FormLabel style={{fontSize: 11}} display="block">性別</FormLabel>
                                                <SwitchType 
                                                    switchLabel={{true: '男性', false: '女性'}} 
                                                    checked={state.gender}
                                                />
                                            </FormControl>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <CommentIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="自己紹介" secondary={editedUser.value.comment} classes={{secondary:classes.listItemText}} />
                                        </ListItem>
                                        </List>
                                    </div>
                                </CardContent>
                            </div>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}

export default withRouter(UserEdit);