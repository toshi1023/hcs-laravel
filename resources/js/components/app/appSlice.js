import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
        //
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

export default appSlice.reducer