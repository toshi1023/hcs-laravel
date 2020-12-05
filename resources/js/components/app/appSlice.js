import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const prefectureUrl = 'http://localhost/api/api_prefectures'
// const prefectureUrl = 'http://hcs-laravel/api/api_prefectures'

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
 * Slice(store)の設定
 */
const appSlice = createSlice({
    name: 'app',
    // stateの初期状態
    initialState: {
        // isLoading: ローディングフラグを管理
        isLoading: false,
        // infoメッセージの管理
        infoMessages: '',
        // errorメッセージの管理
        errorMessages: [],
        // prefectures: 都道府県データを管理
        prefectures: {

        },
    },
    // Reducer (actionの処理を記述)
    reducers: {
        // Lodingの開始
        fetchCredStart(state) {
            state.isLoading = true;
        },
        // Lodingの終了
        fetchCredEnd(state) {
            state.isLoading = false;
        },
        // infoメッセージの取得
        fetchGetInfoMessages(state, action) {
            state.infoMessages = action.payload
        },
        // errorメッセージの取得
        fetchGetErrorMessages(state, action) {
            state.errorMessages = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGetPrefectures.fulfilled, (state, action) => {
            return {
                ...state,
                prefectures: action.payload,
            }
        })
    },
})

export const {
    fetchCredStart,
    fetchCredEnd,
    fetchGetInfoMessages,
    fetchGetErrorMessages,
  } = appSlice.actions;

export const selectLoading = (state) => state.app.isLoading
export const selectInfo = (state) => state.app.infoMessages
export const selectError = (state) => state.app.errorMessages
export const selectPrefectures = (state) => state.app.prefectures

export default appSlice.reducer