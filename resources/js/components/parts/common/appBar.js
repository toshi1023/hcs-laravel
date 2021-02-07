import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, MenuItem, Menu } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import CreateIcon from '@material-ui/icons/Create';
import MenuDrawer from "./drawer";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAsyncLogout } from '../../users/userSlice';
import {
    fetchCredStart,
    fetchCredEnd,
    fetchGetInfoMessages,
    fetchGetErrorMessages
} from '../../app/appSlice';

/**
 * ログインユーザのバッヂアイコン(material-ui転載)
 */
const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
}))(Badge);

const useStyles = makeStyles(theme => ({
    desktopTitle: {
        fontFamily: 'Cabin Sketch, cursive',
        fontSize: 30
    },
    mobileTitle: {
        fontFamily: 'Cabin Sketch, cursive',
        fontSize: 20
    },
    appBar: {
        backgroundColor: "#1b2538",
        position: 'fixed'
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        padding: theme.spacing(2),
        display: "flex",
        [theme.breakpoints.up("sm")]: {
            display: "flex"
        }
    },
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    badge: {
        marginRight: theme.spacing(1)
    }
}));

function HcsAppBar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const history = useHistory();
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const dispatch = useDispatch();
    
    /**
     * アカウントメニューを表示
     * @param {*} event 
     */
    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Mobileメニューをクローズ
     */
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    /**
     * アカウントメニューをクローズ
     */
    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    /**
     * アカウントメニューをクローズ
     */
    const handleProfileClose = () => {
        history.push('/users/mypage');
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    /**
     * メッセージアイコンクリック
     */
    const handleMessage = () => {
        history.push("/messages");
        handleMobileMenuClose();
    };

    /**
     * 記事作成アイコンクリック
     */
    const handleCreateArticle = () => {
        history.push("/articles/create");
        handleMobileMenuClose();
    };

    /**
     * Loginページへリダイレクト
     */
    const handleMenuCloseLogin = () => {
        history.push('/login')
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    /**
     * Logout処理
     */
    const handleMenuCloseLogout = async () => {
        if (confirm("ログアウトをしますか？")) {
            // ロード開始
            await dispatch(fetchCredStart());
            
            // ログアウト処理
            const resultReg = await dispatch(fetchAsyncLogout())

            if (fetchAsyncLogout.fulfilled.match(resultReg)) {   
                // メニューを閉じた後にページ遷移
                setAnchorEl(null);
                handleMobileMenuClose();
    
                // loginページへリダイレクト
                window.location.href = '/login';
            }
            
            // ロード終了
            if(!localStorage.getItem('localToken')) {
                await dispatch(fetchCredEnd());
            }
        }
    };

    /**
     * スマホサイズの時に表示されるメニューをオープン
     * @param {*} event 
     */
    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    /**
     * account & profileのメニュー設定
     */
    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {
                // ログインしているか否かで表示内容を変更
                localStorage.getItem('localToken') ? 
                <div>
                    <MenuItem onClick={handleProfileClose}>プロフィール</MenuItem>
                    <MenuItem onClick={handleMenuCloseLogout}>ログアウト</MenuItem>
                </div>
                :
                <MenuItem onClick={handleMenuCloseLogin}>ログイン</MenuItem>
                
            }
        </Menu>
    );

    /**
     * Mobileサイズの際のメニュー表示を設定
     */
    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {   // ログインしているか否かで表示内容を変更
                localStorage.getItem('localToken') ? 
                <div>
                    <MenuItem onClick={handleCreateArticle}>
                        <IconButton
                            aria-label="show new articles"
                            color="inherit"
                            className={classes.badge}
                        >
                            <Badge color="secondary">
                                <CreateIcon />
                            </Badge>
                        </IconButton>
                        <p>記事作成</p>
                    </MenuItem>
                    <MenuItem onClick={handleMessage}>
                        <IconButton
                            aria-label="show new mails"
                            color="inherit"
                        >
                            <Badge badgeContent={4} color="secondary">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <p>メッセージ</p>
                    </MenuItem>
                    {/* <MenuItem>
                        <IconButton
                            aria-label="show new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={11} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <p>通知</p>
                    </MenuItem> */}
                </div>
                : ''
            }
            
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>アカウント</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <MenuDrawer />
                    <div className={classes.title}>
                        <Typography className={classes.sectionDesktop}>
                            <span className={classes.desktopTitle} onClick={() => history.push("/")}>
                                HitcHike Community Space
                            </span>
                        </Typography>
                        <Typography className={classes.sectionMobile}>
                            <span className={classes.mobileTitle} onClick={() => history.push("/")}>
                                HitcHike Community Space
                            </span>
                        </Typography>
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                    {
                        // ログインしているか否かで表示内容を変更
                        localStorage.getItem('localToken') ? 
                        <div>
                            <IconButton
                                aria-label="show new articles"
                                color="inherit"
                                className={classes.badge}
                                onClick={handleCreateArticle}
                            >
                                <Badge color="secondary">
                                    <CreateIcon fontSize="large" />
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-label="show new mails"
                                color="inherit"
                                className={classes.badge}
                                onClick={handleMessage}
                            >
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon fontSize="large" />
                                </Badge>
                            </IconButton>
                            {/* <IconButton
                                aria-label="show new notifications"
                                color="inherit"
                                className={classes.badge}
                            >
                                <Badge badgeContent={11} color="secondary">
                                    <NotificationsIcon fontSize="large" />
                                </Badge>
                            </IconButton> */}
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <StyledBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    variant="dot"
                                >
                                    <Avatar alt="who?" src={localStorage.getItem('loginPhoto')} />{" "}
                                </StyledBadge>
                            </IconButton>
                        </div>
                        : 
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle fontSize="large" />
                        </IconButton>
                    }
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

export default withRouter(HcsAppBar);
