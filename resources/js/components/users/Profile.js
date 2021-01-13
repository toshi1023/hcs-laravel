import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FriendList from '../parts/userParts/friendList';
import FriendCard from '../parts/userParts/friendCard';
import { fetchAsyncGetProf, fetchAsyncGetFriendsApply, selectUsers, selectFriendStatus, selectSelectedUser, selectUser } from "./userSlice";
import { fetchCredStart, fetchCredEnd, fetchGetErrorMessages } from '../app/appSlice';
// import styles from '../parts/userParts/userParts.module.css';
import _ from "lodash";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { 
    Paper, Tabs, Tab, Grid, Button
} from "@material-ui/core";
import PersonPinIcon from '@material-ui/icons/PersonPin';
import GroupIcon from '@material-ui/icons/Group'; 
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import styles from '../parts/common/commonParts.module.css';

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
    tab: {
        width: '100%',
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        zIndex: 1,
    },
    mobileMainContent: {
        paddingTop: theme.spacing(5),
        zIndex: 0,
    },
    sectionDesktop: {
        display: "none",
        paddingTop: theme.spacing(10),
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    sectionMobile: {
        display: "block",
        paddingTop: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            display: "none"
        }
    },
    cover: {
        margin: '60px 10px 0 10px',
        height: 280
    },
    gridContainer: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(5),
    },
    userName: {
        fontSize: "15px"
    },
    button: {
        marginLeft: '0 0 0 auto',
    },
    profileButton: {
        float: 'right',
        backgroundColor: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },
}));

function Profile(props) {
    const classes = useStyles();
    // タブ切り替え管理
    const [tab, setTab] = React.useState(0);
    const [userPage, setUserPage] = React.useState(false);
    const [userListPage, setUserListPage] = React.useState(true);
    // stateで管理するユーザ情報を取得
    const selectedUser = useSelector(selectSelectedUser)
    const friends = useSelector(selectUsers)
    const friendStatus = useSelector(selectFriendStatus)
    const dispatch = useDispatch()
    const history = useHistory();
    // プロフィールをローカルstateで管理
    const [profile, setProfile] = React.useState('');
    
    useEffect(() => {
        // 非同期の関数を定義
        const fetchUserProf = async () => {
            // Loading開始
            await dispatch(fetchCredStart())
            // ログイン情報を取得
            const resultReg = await dispatch(fetchAsyncGetProf(localStorage.getItem('loginId')))
            // ログイン情報の取得に失敗した場合
            resultReg.payload.error_message ? dispatch(fetchGetErrorMessages(resultReg)) : ''
            
            // 申請中の友達一覧を取得
            const resultFriends = await dispatch(fetchAsyncGetFriendsApply(localStorage.getItem('loginId')))
            
            if (fetchAsyncGetProf.fulfilled.match(resultReg) && fetchAsyncGetFriendsApply.fulfilled.match(resultFriends)) {
                // ログインユーザのプロフィール情報をローカルstateに管理
                setProfile({
                    profile: selectedUser.user
                })
                // ロード終了
                await dispatch(fetchCredEnd());
            }
            // ロード終了
            await dispatch(fetchCredEnd());
        }
        // 上で定義した非同期の関数を実行
        fetchUserProf()
        // dispatchをuseEffectの第2引数に定義する必要がある
    }, [dispatch])
    
    /**
     * タブ切り替え処理
     * @param {*} event 
     * @param {*} newValue 
     */
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    /**
     * ユーザ一覧ページを表示(スマホ用)
     */
    const handleTabUserList = () => {
        setUserPage(true)
        setUserListPage(false)
    }
    /**
     * ユーザ詳細ページを表示(スマホ用)
     */
    const handleTabUser = () => {
        setUserPage(false)
        setUserListPage(true)
    }
    /**
     * ログインユーザのプロフィールを再表示
     */
    const handleGetProfile = () => {
        console.log(profile)
        console.log(selectedUser)
        dispatch(selectUser(profile))
    }
    
    return (
        <>
            {/* スマホ版 */}
            <div className={classes.sectionMobile}>
                <Paper square className={classes.tab}>
                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="secondary"
                        aria-label="icon label tabs example"
                    >
                        <Tab icon={<PersonPinIcon />} label="ユーザ詳細" onClick={handleTabUser} />
                        <Tab icon={<GroupIcon />} label="フレンド一覧" onClick={handleTabUserList} />
                    </Tabs>
                </Paper>
                <div className={classes.mobileMainContent}>
                    <Grid container className={classes.gridContainer} justify="center">
                        <Grid item xs={11} hidden={userPage}>
                            <Grid container justify="center">
                                <FriendCard />
                            </Grid>
                        </Grid>
                        <Grid item xs={11} hidden={userListPage}>
                            <h1 className={styles.titleBar}>
                                フレンド一覧
                                <Button variant="outlined" color="primary" className={classes.profileButton} onClick={handleGetProfile}>
                                    プロフィールを表示
                                </Button>
                            </h1>
                            <br />
                            <FriendList user={friends} friendStatus={friendStatus} handleChange={handleChange} handleTabUser={handleTabUser} />
                        </Grid>
                    </Grid>
                </div>
            </div>

            {/* PC版 */}
            <div className={classes.sectionDesktop}>
                <Grid container className={classes.gridContainer} justify="center">
                    <Grid item sm={8}>
                        <Grid container justify="center">
                            <Grid item sm={10}>
                                <FriendCard />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={4}>
                        <Grid item sm={11}>
                            <h1 className={styles.titleBar}>
                                フレンド一覧
                                <Button variant="outlined" color="primary" className={classes.profileButton} onClick={handleGetProfile}>
                                    プロフィールを表示
                                </Button>
                            </h1>
                        </Grid>
                        <br />
                        <FriendList user={friends} friendStatus={friendStatus} handleChange={handleChange} handleTabUser={handleTabUser} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default withRouter(Profile);
