import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const loginUrl = 'http://localhost/api/login'
// const apiUrl = 'http://localhost/api/api_users'
const loginUrl = 'http://hcs-laravel/api/login'
const apiUrl = 'http://hcs-laravel/api/api_users'
const token = localStorage.localToken

/**
 * Login処理の非同期関数
 */
// auth: 認証に関わる情報(authen)を渡す引数
export const fetchAsyncLogin = createAsyncThunk('login/post', async(auth) =>{
    // axios: 引数1: URL, 引数2: 渡すデータ, 引数3: メタ情報
    try {
        const res = await axios.post(loginUrl, auth, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        // Apiからの返り値
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * Loginユーザの取得用非同期関数
 */
export const fetchAsyncGetProf = createAsyncThunk('prof/get', async(id) =>{
    try {
        // axios: 引数1: URL, 引数2: メタ情報
        const res = await axios.get(`${apiUrl}/${id}?query=${id}`, {})
        // Apiからの返り値
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('users/index', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}?query=${conditions.user_name}&queryId=${conditions.user_id}`)
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * 詳細データ(初期表示用)の取得
 */
export const fetchAsyncGetShow = createAsyncThunk('users/initShow', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}/show?query=${conditions}`, {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        })
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * データ作成
 */
export const fetchAsyncCreate = createAsyncThunk('users/create', async(user) => {
    try {
        const res = await axios.post(apiUrl, user, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * データの更新
 */
export const fetchAsyncUpdate = createAsyncThunk('users/edit', async(user) => {
    try {
        const res = await axios.put(`${apiUrl}/${user.id}`, user, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})
/**
 * 画像データの保存
 */
export const fetchAsyncImage = createAsyncThunk('users/image', async(data) => {
    try {
        const res = await axios.post(`${apiUrl}/${data.getAll('id')}`, data, {
            headers: {
                'X-HTTP-Method-Override': 'PUT',
                'Content-Type': 'multipart/form-data',
                // Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * データの削除処理
 */
export const fetchAsyncDelete = createAsyncThunk('users/delete', async(id) => {
    try {
        // deleteの場合は第2引数で渡すデータはない
        await axios.delete(`${apiUrl}/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
        })
        return id
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * 都道府県データの取得用非同期関数
 */
export const fetchAsyncGetPrefectures = createAsyncThunk('prefectures/get', async() =>{
    try {
        // axios: 引数1:  引数2: メタ情報
        const res = await axios.get(prefectureUrl, {})
        // Apiからの返り値
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * 友達一覧データの取得
 */
export const fetchAsyncGetFriends = createAsyncThunk('friends/index', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}/${conditions}/friends?query=${conditions}`)
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})
/**
 * 友達申請データの取得(プロフィールページ表示用)
 */
export const fetchAsyncGetFriendsApply = createAsyncThunk('friends/apply', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}/${conditions}/friends/apply?query=${conditions}`)
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})
/**
 * 友達データの更新
 */
export const fetchAsyncUpdateFriends = createAsyncThunk('friends/update', async(user) => {
    try {
        const res = await axios.post(`${apiUrl}/${user.user_id}/friends/update`, user, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
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
        friendStatus: [{
            id: '',                     // ID
            name: '',                   // ユーザ名
            prefecture: '',             // 都道府県
            status: '',                 // 申請状況
        }],
        messageHistory: [{
            user_id: ''                 // ユーザID
        }]
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
            // 認証に失敗した場合はリターン
            if (action.payload.status == 401) {
                return;
            }
            // 認証に成功した場合は、ブラウザのlocalStorageにTokenとIDを保存
            localStorage.setItem("localToken", action.payload.token)
            localStorage.setItem("loginId", action.payload.id)
            localStorage.setItem("loginPhoto", action.payload.login_user_photo)
        })
        builder.addCase(fetchAsyncImage.fulfilled, (state, action) => {
            // 認証に失敗した場合はリターン
            if (action.payload.status == 401) {
                return;
            }
        })
        builder.addCase(fetchAsyncGetProf.fulfilled, (state, action) => {
            return {
                ...state,
                selectedUser: action.payload,
            }
        })
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                users: action.payload.users, //apiから取得した記事の情報をstateのusersに格納
                friendStatus: action.payload.friends,
                messageHistory: action.payload.messages
            }
        })
        builder.addCase(fetchAsyncGetShow.fulfilled, (state, action) => {
            return {
                ...state,
                selectedUser: action.payload,
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
        builder.addCase(fetchAsyncGetPrefectures.fulfilled, (state, action) => {
            return {
                ...state,
                prefectures: action.payload,
            }
        })
        builder.addCase(fetchAsyncGetFriendsApply.fulfilled, (state, action) => {
            return {
                ...state,
                users: action.payload.friends,
                friendStatus: action.payload.friendStatus
            }
        })
        builder.addCase(fetchAsyncGetFriends.fulfilled, (state, action) => {
            return {
                ...state,
                users: action.payload.friends,
            }
        })
        builder.addCase(fetchAsyncUpdateFriends.fulfilled, (state, action) => {
            return {
                ...state,
                friendStatus: [action.payload.friend, ...state.friendStatus],
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
export const selectFriendStatus = (state) => state.user.friendStatus
export const selectMessageHistory = (state) => state.user.messageHistory

export default userSlice.reducer