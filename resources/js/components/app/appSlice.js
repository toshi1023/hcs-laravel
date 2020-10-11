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
    },
    extraReducers: (builder) => {
        //
    },
})

export const {
    fetchCredStart,
    fetchCredEnd,
  } = appSlice.actions;

export const selectLoading = (state) => state.app.isLoading

export default appSlice.reducer