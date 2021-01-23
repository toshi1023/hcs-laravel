/**
 * ログインチェック用のミドルウェア
 * ※サーバ側でセッションが切れている場合、強制ログインを実行
 * @param {*} store 
 */
const SessionCheck = store => next => (action) => {
    if(action.payload !== undefined && action.payload.status === -1) {
        if(localStorage.getItem('localToken')) {
            // localStorageのTokenとIDを削除(ログアウト処理)
            localStorage.removeItem("loginId");
            localStorage.removeItem("localToken");
            localStorage.removeItem("loginPhoto");
            // セッション切れのアラートを表示
            window.alert(action.payload.error_message)
            // ログインページへ遷移
            window.location.href = '/login'
        }
    }
    // 次の処理へ移行
    next(action)
}

export default SessionCheck
