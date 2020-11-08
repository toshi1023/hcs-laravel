import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const loginUrl = 'http://localhost/api/login'
const apiUrl = 'http://localhost/api/api_users'
const prefectureUrl = 'http://localhost/api/api_prefectures'
// const loginUrl = 'http://hcs-laravel/api/login'
// const apiUrl = 'http://hcs-laravel/api/api_users'
// const prefectureUrl = 'http://hcs-laravel/api/api_prefectures'
const token = localStorage.localToken

/**
 * Login処理の非同期関数
 */
// auth: 認証に関わる情報(authen)を渡す引数
export const fetchAsyncLogin = createAsyncThunk('login/post', async(auth) =>{
    // axios: 引数1: URL, 引数2: 渡すデータ, 引数3: メタ情報
    const res = await axios.post(loginUrl, auth, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    // Apiからの返り値
    return res.data
})
/**
 * Loginユーザの取得用非同期関数
 */
export const fetchAsyncGetProf = createAsyncThunk('prof/get', async(id) =>{
    // axios: 引数1: URL, 引数2: メタ情報
    const res = await axios.get(`${apiUrl}/${id}`, {})
    // Apiからの返り値
    return res.data
})
/**
 * 都道府県データの取得用非同期関数
 */
export const fetchAsyncGetPrefectures = createAsyncThunk('prefectures/get', async() =>{
    // axios: 引数1:  引数2: メタ情報
    const res = await axios.get(prefectureUrl, {})
    // Apiからの返り値
    return res.data
})
/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('users/index', async(conditions) => {
    const res = await axios.get(`${apiUrl}?query=${conditions}`)
    return res.data
})

/**
 * データ作成
 */
export const fetchAsyncCreate = createAsyncThunk('users/create', async(user) => {
    const res = await axios.post(apiUrl, user, {
        headers: {
            'Content-Type': 'application/json',
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    })
    return res.data
})

/**
 * データの更新
 */
export const fetchAsyncUpdate = createAsyncThunk('users/edit', async(user) => {
    const res = await axios.put(`${apiUrl}/${user.id}`, user, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
        },
    })
    return res.data
}
)
/**
 * 画像データの保存
 */
export const fetchAsyncImage = createAsyncThunk('users/image', async(user) => {
    const res = await axios.post(`${apiUrl}/${user.id}`, user, {
        headers: {
            'X-HTTP-Method-Override': 'PUT',
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${token}`,
        },
    })
    return res.data
})

/**
 * データの削除処理
 */
export const fetchAsyncDelete = createAsyncThunk('users/delete', async(id) => {
    // deleteの場合は第2引数で渡すデータはない
    await axios.delete(`${apiUrl}/${id}/`, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
        },
    })
    return id
})


/**
 * Slice(store)の設定
 */
const userSlice = createSlice({
    name: 'user',
    // stateの初期状態
    initialState: {
        // authen: ログイン用のユーザ情報を管理
        authen: {
            name: '',
            password: '',
        },
        // prefectures: 都道府県データを管理
        prefectures: {

        },
        // users: ユーザデータは複数ある前提のため配列
        users: [
            {
                id: '',                     // ID
                users_photo_name: '',       // 画像名
                users_photo_path: '',       // 画像パス
                name: '',                   // ニックネーム
                prefecture: '',             // 都道府県
                birthday: '',               // 生年月日
                gender: '',                 // 性別
                email: '',                  // メールアドレス
                comment: '',                // コメント
                status: '',                 // 会員フラグ
                delete_flg: '',             // 削除フラグ
                created_at: '',             // 記事の作成日
                updated_at: '',             // 記事の更新日
            },
        ],
        // userの編集時に選択・保持するstate
        editedUser: {
            id: '',                     // ID
            users_photo_name: '',       // 画像名
            users_photo_path: '',       // 画像パス
            name: '',                   // ニックネーム
            prefecture: '',             // 都道府県
            birthday: '',               // 生年月日
            gender: false,                 // 性別
            email: '',                  // メールアドレス
            comment: '',                // コメント
            status: '',                 // 会員フラグ
            delete_flg: '',             // 削除フラグ
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
        // userの詳細表示をした際に保持するstate
        selectedUser: {
            id: '',                     // ID
            users_photo_name: '',       // 画像名
            users_photo_path: '',       // 画像パス
            name: '',                   // ニックネーム
            prefecture: '',             // 都道府県
            birthday: '',               // 生年月日
            gender: '',                 // 性別
            email: '',                  // メールアドレス
            comment: '',                // コメント
            status: '',                 // 会員フラグ
            delete_flg: '',             // 削除フラグ
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
        // ログインuserの詳細表示をした際に保持するstate
        loggedInUser: {
            id: '',                     // ID
            users_photo_name: '',       // 画像名
            users_photo_path: '',       // 画像パス
            name: '',                   // ニックネーム
            prefecture: '',             // 都道府県
            birthday: '',               // 生年月日
            gender: '',                 // 性別
            email: '',                  // メールアドレス
            comment: '',                // コメント
            status: '',                 // 会員フラグ
            delete_flg: '',             // 削除フラグ
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
    },
    // Reducer (actionの処理を記述)
    reducers: {
        editUsername(state, action) {
            // action.payload: ユーザが入力したデータ
            state.authen.name = action.payload
        },
        editPassword(state, action) {
            // action.payload: ユーザが入力したデータ
            state.authen.password = action.payload
        },
        editUser(state, action) {
            state.editedUser = action.payload
        },
        selectUser(state, action) {
            state.selectedUser = action.payload
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            // ブラウザのlocalStorageにTokenとIDを保存
            localStorage.setItem("localToken", action.payload.token)
            localStorage.setItem("loginId", action.payload.id)
            localStorage.setItem("loginPhoto", action.payload.login_user_photo)
        })
        builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
            return {
                ...state,
                loggedInUser: action.payload,
            }
        })
        builder.addCase(fetchAsyncGetPrefectures.fulfilled, (state, action) => {
            return {
                ...state,
                prefectures: action.payload,
            }
        })
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                users: action.payload, //apiから取得した記事の情報をstateのusersに格納
            }
        })
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            return {
                ...state,
                users: [action.payload, ...state.users],
            }
        })
        builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
            return {
                ...state,
                // 現在のusers一覧の要素をuというテンポラリの変数に格納して、選択したidに一致するidには変更したデータを格納
                users: state.users.map((u) => 
                    u.id === action.payload.id ? action.payload : u
                ),
                // 選択されている詳細articleにも更新したデータを格納
                selectedUser: action.payload,
            }
        })
        builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
            return {
                ...state,
                // 削除対象のuser以外のidでフィルターをかけてstateを更新
                users: state.users.filter((u) => u.id !== action.payload.id),
                // 値を初期値に再設定
                selectedUser: {
                    created_at: '',             // 記事の作成日
                    updated_at: '',             // 記事の更新日
                },
            }
        })
    },
})

export const { editUsername, editPassword, editUser, selectUser } = userSlice.actions

export const selectAuthen = (state) => state.user.authen
export const selectPrefectures = (state) => state.user.prefectures
export const selectSelectedUser = (state) => state.user.selectedUser
export const selectLoggedInUser = (state) => state.user.loggedInUser
export const selectEditedUser = (state) => state.user.editedUser
export const selectUsers = (state) => state.user.users

export default userSlice.reducer