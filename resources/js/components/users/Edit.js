import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectEditedUser } from "./userSlice";
import { fetchCredStart, fetchCredEnd } from '../app/appSlice';
import PrefectureSelects from '../parts/common/prefectureSearch';
import DateSelects from '../parts/common/dateSelects';
import SwitchType from '../parts/common/switch';
import ProfileDropzone from '../parts/userParts/dropzone';
import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Card, CardContent, CardMedia, List, ListItem, Grid, Button, TextField,
    ListItemAvatar, Avatar, Modal, Backdrop, Fade, Tooltip,
    Input, InputLabel, InputAdornment, FormControl, FormLabel, Fab,
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
        marginTop: theme.spacing(2),
        width: 350,
    },
    formFont: {
        fontSize: 13,
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
    tooltip: {
        fontSize: 14,
    },
}));

function UserEdit(props) {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch()
    // stateから値を取得
    const editedUser = useSelector(selectEditedUser);
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
            // // 都道府県一覧を取得
            // const resultReg = await dispatch(fetchAsyncGetPrefectures())
            // if (fetchAsyncGetPrefectures.fulfilled.match(resultReg)) {
                // ユーザの登録している都道府県が選択されている状態でセット
                document.getElementById("prefecture").value = editedUser.value.prefecture
                // ユーザの登録している生年月日が選択されている状態でセット
                setBirthday(true)
                // ロード終了
                await dispatch(fetchCredEnd());       
            // }
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
        console.log(state)
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
                        <Grid item xs={12} sm={12} md={6}>
                        <div className={classes.paper}>
                            <Grid container>
                                <h2>画像の編集</h2>
                                <Button className={classes.closeIcon} onClick={handleClose}>
                                    <CancelIcon />
                                </Button>
                            </Grid>
                            {/* ドラッグ&ドロップ */}
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={8}>
                                    <ProfileDropzone /> 
                                </Grid>
                            </Grid>
                        </div>
                        </Grid>
                    </Grid>
                    </Fade>
                </Modal>
            </div>
            <Grid item xs={12} sm={12} md={6}>
                <Card className={classes.root}>
                    <Grid container  spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Tooltip title="保存" classes={{tooltip: classes.tooltip}}>
                                <Fab color="primary" aria-label="add">
                                    <SaveIcon style={{ fontSize: 'large' }} />
                                </Fab>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <CardMedia
                                className={classes.cover}
                                image={editedUser.value.users_photo_path}
                                title={editedUser.value.users_photo_name}
                                onClick={handleOpen}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
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
                                            <FormControl className={classes.margin} onBlur={() => setBirthday(false)}>
                                                <FormLabel style={{fontSize: 11}} display="block">生年月日</FormLabel>
                                                <DateSelects fontSize={13} />
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
                                                    value={state.gender}
                                                />
                                            </FormControl>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                            <Avatar>
                                                <CommentIcon />
                                            </Avatar>
                                            </ListItemAvatar>
                                            <FormControl className={classes.margin}>
                                                <TextField
                                                    id="comment"
                                                    label="自己紹介"
                                                    multiline
                                                    rows={3}
                                                    defaultValue={editedUser.value.comment}
                                                    InputLabelProps={{
                                                        classes: {
                                                            root: classes.formFont,
                                                        }
                                                    }}
                                                    InputProps={{
                                                        classes: {
                                                          input: classes.formFont,
                                                        },
                                                    }}
                                                />
                                            </FormControl>
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
