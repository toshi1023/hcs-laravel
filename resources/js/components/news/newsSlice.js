import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost/api/api_news'
// const apiUrl = 'http://hcs-laravel/api/api_news'
const token = localStorage.localToken


/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('news/index', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}?query=${conditions}`, {
            headers: {
                'Content-Type': 'application/json',
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
 * 詳細データ(初期表示用)の取得
 */
export const fetchAsyncGetShow = createAsyncThunk('news/initShow', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}/show?query=${conditions}`, {
            headers: {
                'Content-Type': 'application/json',
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
const newsSlice = createSlice({
    name: 'news',
    // stateの初期状態
    initialState: {
        // news: ニュースデータは複数ある前提のため配列
        news: [
            {
                id: '',                     // ID
                type: '',                   // ニュースタイプ
                title: '',                  // タイトル
                content: '',                // 内容
                member_flg: '',             // 公開対象者
                created_at: '',             // ニュースの作成日
                updated_at: '',             // ニュースの更新日
            },
        ],
        // ニュースの詳細表示をした際に保持するstate
        selectedNews: {
            id: '',                     // ID
            type: '',                   // ニュースタイプ
            title: '',                  // タイトル
            content: '',                // 内容
            member_flg: '',             // 公開対象者
            created_at: '',             // ニュースの作成日
            updated_at: '',             // ニュースの更新日
        },
    },
    // Reducer (actionの処理を記述)
    reducers: {
        selectNews(state, action) {
            state.selectedNews = action.payload
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                news: action.payload,
            }
        })
        builder.addCase(fetchAsyncGetShow.fulfilled, (state, action) => {
            return {
                ...state,
                selectedNews: action.payload,
            }
        })
    },
})

export const { selectNews } = newsSlice.actions

export const selectSelectedNews = (state) => state.news.selectedNews
export const selectNewsList = (state) => state.news.news

export default newsSlice.reducer