import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost/api/api_messages'
const token = localStorage.localToken


/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('messages/index', async(conditions) => {
    const res = await axios.get(`${apiUrl}?query=${conditions}`, {})
    return res.data
})

/**
 * データ作成
 */
export const fetchAsyncCreate = createAsyncThunk('messages/create', async(message) => {
    const res = await axios.post(apiUrl, message, {
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
export const fetchAsyncUpdate = createAsyncThunk('messages/edit', async(message) => {
    const res = await axios.put(`${apiUrl}/${message.id}`, message, {
        headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${token}`,
        },
    })
    return res.data
})

/**
 * データの削除処理
 */
export const fetchAsyncDelete = createAsyncThunk('messages/delete', async(id) => {
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
const messageSlice = createSlice({
    name: 'message',
    // stateの初期状態
    initialState: {
        // messages: メッセージデータは複数ある前提のため配列
        messages: [
            {
                id: '',                     // ID
                user_id_sender: '',         // 送信者ID
                user_id_receiver: '',       // 受信者ID
                sender_name: '',            // 送信者名
                receiver_name: '',          // 受信者名
                sender_photo: '',           // 送信者イメージ
                receiver_photo: '',         // 受信者イメージ
                content: '',                // 内容
                created_at: '',             // メッセージの作成日
                updated_at: '',             // メッセージの更新日
            },
        ],
        // messageの編集時に選択・保持するstate
        editedMessage: {
            id: '',                     // ID
            user_id_sender: '',         // 送信者ID
            user_id_receiver: '',       // 受信者ID
            sender_name: '',            // 送信者名
            receiver_name: '',          // 受信者名
            sender_photo: '',           // 送信者イメージ
            receiver_photo: '',         // 受信者イメージ
            content: '',                // 内容
            created_at: '',             // メッセージの作成日
            updated_at: '',             // メッセージの更新日
        },
        // messageの詳細表示をした際に保持するstate
        selectedMessage: {
            id: '',                     // ID
            user_id_sender: '',         // 送信者ID
            user_id_receiver: '',       // 受信者ID
            sender_name: '',            // 送信者名
            receiver_name: '',          // 受信者名
            sender_photo: '',           // 送信者イメージ
            receiver_photo: '',         // 受信者イメージ
            content: '',                // 内容
            created_at: '',             // メッセージの作成日
            updated_at: '',             // メッセージの更新日
        },
    },
    // Reducer (actionの処理を記述)
    reducers: {
        editMessage(state, action) {
            state.editedMessage = action.payload
        },
        selectMessage(state, action) {
            state.selectedMessage = action.payload
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                messages: action.payload, //apiから取得した記事の情報をstateのmessagesに格納
            }
        })
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            return {
                ...state,
                messages: [action.payload, ...state.messages],
            }
        })
        builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
            return {
                ...state,
                // 現在のmessages一覧の要素をmというテンポラリの変数に格納して、選択したidに一致するidには変更したデータを格納
                messages: state.messages.map((m) => 
                    m.id === action.payload.id ? action.payload : m
                ),
                // 選択されている詳細messageにも更新したデータを格納
                selectedMessage: action.payload,
            }
        })
        builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
            return {
                ...state,
                // 削除対象のmessage以外のidでフィルターをかけてstateを更新
                messages: state.messages.filter((m) => m.id !== action.payload.id),
                // 値を初期値に再設定
                selectedMessage: {
                    created_at: '',             // メッセージの作成日
                    updated_at: '',             // メッセージの更新日
                },
            }
        })
    },
})

export const { editMessage, selectMessage } = messageSlice.actions

export const selectSelectedMessage = (state) => state.message.selectedMessage
export const selectEditedMessage = (state) => state.message.editedMessage
export const selectMessages = (state) => state.message.messages

export default messageSlice.reducer