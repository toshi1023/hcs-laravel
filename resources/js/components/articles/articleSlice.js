import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const apiUrl = 'http://localhost/api/api_articles'
const apiUrl = 'http://hcs-laravel/api/api_articles'
const token = localStorage.localToken

/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('articles/index', async(conditions) => {
    const res = await axios.get(`${apiUrl}?query=${conditions}`)
    return res.data
})

/**
 * データ作成
 */
export const fetchAsyncCreate = createAsyncThunk('articles/create', async(article) => {
    const res = await axios.post(apiUrl, article, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
        },
    })
    return res.data
})

/**
 * データの更新
 */
export const fetchAsyncUpdate = createAsyncThunk('articles/edit', async(article) => {
    const res = await axios.put(`${apiUrl}/${task.id}`, article, {
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
export const fetchAsyncDelete = createAsyncThunk('articles/delete', async(id) => {
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
const articleSlice = createSlice({
    name: 'article',
    // stateの初期状態
    initialState: {
        // articles: apiのエンドポイントで管理されているデータのため配列
        articles: [
            {
                user_id: 0,                 // ユーザid
                name: '',                   // 投稿者のニックネーム
                users_photo_path: '',       // 投稿者のプロフィール画像
                prefecture: '',             // 都道府県
                article_id: 0,              // 記事のid
                articles_photo_name: '',    // 記事の画像名
                title: '',                  // 記事タイトル
                content: '',                // 記事の内容
                articles_photo_path: '',    // 記事の画像パス
                type: 0,                    // 公開対象
                type_name: '',              // 公開対象名
                latitude: '',               // 緯度
                longitude: '',              // 経度
                created_at: '',             // 記事の作成日
                updated_at: '',             // 記事の更新日
            },
        ],
        // articleの編集時に選択・保持するstate
        editArticle: {
            user_id: 0,                 // ユーザid
            prefecture: '',             // 都道府県
            article_id: 0,              // 記事のid
            articles_photo_name: '',    // 記事の画像名
            title: '',                  // 記事タイトル
            content: '',                // 記事の内容
            articles_photo_path: '',    // 記事の画像パス
            type: 0,                    // 公開対象
            latitude: '',               // 緯度
            longitude: '',              // 経度
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
        // articleの詳細表示をした際に保持するstate
        selectedArticle: {
            user_id: 0,                 // ユーザid
            name: '',                   // 投稿者のニックネーム
            users_photo_path: '',       // 投稿者のプロフィール画像
            prefecture: '',             // 都道府県
            article_id: 0,              // 記事のid
            articles_photo_name: '',    // 記事の画像名
            title: '',                  // 記事タイトル
            content: '',                // 記事の内容
            articles_photo_path: '',    // 記事の画像パス
            type: 0,                    // 公開対象
            type_name: '',              // 公開対象名
            latitude: '',               // 緯度
            longitude: '',              // 経度
            delete_flg: '',             // 削除フラグ
            created_at: '',             // 記事の作成日
            updated_at: '',             // 記事の更新日
        },
    },
    // Reducer (actionの処理を記述)
    reducers: {
        editArticle(state, action) {
            state.editArticle = action.payload
        },
        selectArticle(state, action) {
            state.selectedArticle = action.payload
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                articles: action.payload, //apiから取得した記事の情報をstateのarticlesに格納
            }
        })
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            return {
                ...state,
                articles: [action.payload, ...state.articles],
            }
        })
        builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
            return {
                ...state,
                // 現在のarticles一覧の要素をaというテンポラリの変数に格納して、選択したidに一致するidには変更したデータを格納
                articles: state.articles.map((a) => 
                    a.id === action.payload.id ? action.payload : a
                ),
                // 選択されている詳細articleにも更新したデータを格納
                selectedArticle: action.payload,
            }
        })
        builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
            return {
                ...state,
                // 削除対象のarticle以外のidでフィルターをかけてstateを更新
                articles: state.articles.filter((a) => a.id !== action.payload.id),
                // 値を初期値に再設定
                selectedArticle: {
                    user_id: 0,                 // ユーザid
                    name: '',                   // 投稿者のニックネーム
                    users_photo_path: '',       // 投稿者のプロフィール画像
                    prefecture: '',             // 都道府県
                    article_id: 0,              // 記事のid
                    articles_photo_name: '',    // 記事の画像名
                    title: '',                  // 記事タイトル
                    content: '',                // 記事の内容
                    articles_photo_path: '',    // 記事の画像パス
                    type: 0,                    // 公開対象
                    type_name: '',              // 公開対象名
                    latitude: '',               // 緯度
                    longitude: '',              // 経度
                    delete_flg: '',             // 削除フラグ
                    created_at: '',             // 記事の作成日
                    updated_at: '',             // 記事の更新日
                },
            }
        })
    },
})

export const { editArticle, selectArticle } = articleSlice.actions

export const selectSelectedArticle = (state) => state.article.selectedArticle
export const selectEditedArticle = (state) => state.article.editedArticle
export const selectArticles = (state) => state.article.articles

export default articleSlice.reducer