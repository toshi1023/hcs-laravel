import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost/api/api_users'
// const token = localStorage.localJWT

/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('users/index', async() => {
    const res = await axios.get(apiUrl, {
        // headers: {
        //     Authorization: `JWT ${token}`,
        // },
    })
    return res.data
})

/**
 * データ作成
 */
export const fetchAsyncCreate = createAsyncThunk('users/create', async(article) => {
    const res = await axios.post(apiUrl, article, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `JWT ${token}`,
        },
    })
    return res.data
})

/**
 * データの更新
 */
export const fetchAsyncUpdate = createAsyncThunk('users/edit', async(article) => {
    const res = await axios.put(`${apiUrl}/${user.id}`, article, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `JWT ${token}`,
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
            // Authorization: `JWT ${token}`,
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
        // users: apiのエンドポイントで管理されているデータのため配列
        users: [
            {
                id: '',                     // ID
                prof_photo_name: '',        // 画像名
                prof_photo_path: '',        // 画像パス
                name: '',                   // ニックネーム
                prefecture: '',             // 都道府県
                birthday: '',               // 生年月日
                gender: '',                 // 性別
                email: '',                  // メールアドレス
                status: '',                 // 会員フラグ
                delete_flg: '',             // 削除フラグ
                created_at: '',             // 記事の作成日
                updated_at: '',             // 記事の更新日
            },
        ],
        // userの編集時に選択・保持するstate
        editUser: {
            id: '',                     // ID
            prof_photo_name: '',        // 画像名
            prof_photo_path: '',        // 画像パス
            name: '',                   // ニックネーム
            prefecture: '',             // 都道府県
            birthday: '',               // 生年月日
            gender: '',                 // 性別
            email: '',                  // メールアドレス
            status: '',                 // 会員フラグ
            delete_flg: '',             // 削除フラグ
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
        // userの詳細表示をした際に保持するstate
        selectedUser: {
            id: '',                     // ID
            prof_photo_name: '',        // 画像名
            prof_photo_path: '',        // 画像パス
            name: '',                   // ニックネーム
            prefecture: '',             // 都道府県
            birthday: '',               // 生年月日
            gender: '',                 // 性別
            email: '',                  // メールアドレス
            status: '',                 // 会員フラグ
            delete_flg: '',             // 削除フラグ
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
    },
    // Reducer (actionの処理を記述)
    reducers: {
        editUser(state, action) {
            state.editUser = action.payload
        },
        selectUser(state, action) {
            state.selectedUser = action.payload
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
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

export const { editUser, selectUser } = userSlice.actions

export const selectSelectedUser = (state) => state.user.selectedUser
export const selectEditedUser = (state) => state.user.editedUser
export const selectUsers = (state) => state.user.users

export default userSlice.reducer