import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { selectUsers } from '../users/userSlice';

// const apiUrl = 'http://localhost/api/api_articles'
const apiUrl = 'http://hcs-laravel/api/api_articles'
const token = localStorage.localToken

/**
 * Home画面用データの取得
 */
export const fetchAsyncGetHome = createAsyncThunk('articles/home', async() => {
    try {
        // 記事の取得（検索条件が設定されていれば検索条件の沿った内容をリターン）
        const res = await axios.get(`${apiUrl}/home`)
        
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * 記事一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('articles/index', async(conditions) => {
    try {
        // 記事の取得（検索条件が設定されていれば検索条件の沿った内容をリターン）
        const res = await axios.get(`${apiUrl}?queryPrefecture=${conditions.prefecture}&queryId=${conditions.user_id}`)
        
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})

/**
 * 記事データ作成
 */
export const fetchAsyncCreate = createAsyncThunk('articles/create', async(article) => {
    try {
        const res = await axios.post(apiUrl, article, {
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
 * 記事データの更新
 */
export const fetchAsyncUpdate = createAsyncThunk('articles/edit', async(article) => {
    try {
        const res = await axios.put(`${apiUrl}/${id}`, article, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `JWT ${token}`,
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
export const fetchAsyncImage = createAsyncThunk('articles/image', async(data) => {
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
 * 記事データの削除処理
 */
export const fetchAsyncDelete = createAsyncThunk('articles/delete', async(id) => {
    try {
        // deleteの場合は第2引数で渡すデータはない
        const res = await axios.delete(`${apiUrl}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `JWT ${token}`,
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
 * いいね一覧データの取得
 */
export const fetchAsyncGetLikes = createAsyncThunk('articles/likes/index', async(conditions) => {
    try {
        // いいねの取得（検索条件が設定されていれば検索条件の沿った内容をリターン）
        const res = await axios.get(`${apiUrl}/likes?query=${conditions.user_id}`)
        
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})
/**
 * いいねデータの更新
 */
export const fetchAsyncUpdateLikes = createAsyncThunk('articles/likes/update', async(conditions) => {
    try {
        // いいねの更新
        const res = await axios.post(`${apiUrl}/likes`, conditions, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `JWT ${token}`,
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
 * コメント一覧データの取得
 */
export const fetchAsyncGetComments = createAsyncThunk('articles/comments/index', async() => {
    try {
        // コメントの取得
        const res = await axios.get(`${apiUrl}/comments`)
        
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        return err.response.data
    }
})
/**
 * コメントデータの保存
 */
export const fetchAsyncUpdateComments = createAsyncThunk('articles/comments/update', async(conditions) => {
    try {
        // コメントの更新
        const res = await axios.post(`${apiUrl}/comments`, conditions, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `JWT ${token}`,
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
        // articleの作成・編集時に保持するstate
        editedArticle: {
            prefecture: '',                // 都道府県
            latitude: '',                  // 緯度
            longitude: '',                 // 経度
            title: '',                     // 記事のタイトル
            content: '',                   // 記事の内容
            type: false,                   // 公開対象
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
        likes: [
            {
                article_id: '',         // 記事ID
                user_id: '',            // ユーザID
                likes_counts: ''        // いいね数
            }
        ],
        selectedLike: {
            article_id: '',
            likes_flg: '',
            likes_counts: ''
        },
        comments: [
            {
                article_id: '',         // 記事ID
                user_id: '',            // ユーザID
                comment: '',            // コメント
                users_photo_path: '',   // ユーザのプロフィール画像
                user_name: '',          // ユーザ名
            }
        ],
        commentsCounts: [
            {
                article_id: '',         // 記事ID
                comments_counts: '',    // コメント数
            }
        ],
        searchedUser: {
            user_id: '',
        },
        selectedUser: {
            user_id: '',
        }
    },
    // Reducer (actionの処理を記述)
    reducers: {
        editArticle(state, action) {
            state.editedArticle = action.payload
        },
        selectArticle(state, action) {
            state.selectedArticle = action.payload
        },
        openModal(state, action) {
            state.editedModal = action.payload
        },
        selectLike(state, action) {
            state.selectedLike = action.payload
        },
        searchUser(state, action) {
            state.searchedUser.user_id = action.payload
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncGetHome.fulfilled, (state, action) => {
            return {
                ...state,
                articles: action.payload.articles, //apiから取得した記事の情報をstateのarticlesに格納
            }
        })
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                articles: action.payload.articles, //apiから取得した記事の情報をstateのarticlesに格納
            }
        })
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            return {
                ...state,
                articles: [action.payload.article, ...state.articles],
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
                articles: state.articles.filter((a) => a.id != action.payload.id),
            }
        })
        builder.addCase(fetchAsyncGetLikes.fulfilled, (state, action) => {
            return {
                ...state,
                likes: action.payload.likes, //apiから取得したいいねの情報をstateのlikesに格納
            }
        })
        builder.addCase(fetchAsyncUpdateLikes.fulfilled, (state, action) => {
            return {
                ...state,
                selectedLike: action.payload, //apiから取得した更新後のいいねの情報をstateのselectedLikeに格納
            }
        })
        builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
            return {
                ...state,
                comments: action.payload.comments, //apiから取得したコメントの情報をstateのcommentsに格納
                commentsCounts: action.payload.comments_counts, //apiから取得したコメント数の情報をstateのcommentsに格納
            }
        })
    },
})

export const { editArticle, selectArticle, searchUser } = articleSlice.actions

export const selectSelectedArticle = (state) => state.article.selectedArticle
export const selectEditedArticle = (state) => state.article.editedArticle
export const selectArticles = (state) => state.article.articles
export const selectLikes = (state) => state.article.likes
export const selectSelectedLike = (state) => state.article.selectedLike
export const selectComments = (state) => state.article.comments
export const selectCommentsCounts = (state) => state.article.commentsCounts
export const selectSearchUser = (state) => state.article.searchedUser

export default articleSlice.reducer