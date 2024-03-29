import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost/api/api_messages'
// const apiUrl = 'http://hcs-laravel/api/api_messages'
const token = localStorage.localToken


/**
 * 一覧データの取得
 */
export const fetchAsyncGet = createAsyncThunk('messages/index', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}?query=${conditions}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
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
 * メッセージデータの取得
 */
export const fetchAsyncGetShow = createAsyncThunk('messages/show', async(conditions) => {
    try {
        const res = await axios.get(`${apiUrl}/show?queryUserId=${conditions.user_id}&queryUserIdTarget=${conditions.user_id_target}`, {
            headers: {
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
 * データの作成
 */
export const fetchAsyncCreate = createAsyncThunk('messages/create', async(message) => {
    try {
        const res = await axios.post(`${apiUrl}/update`, message, {
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
export const fetchAsyncUpdate = createAsyncThunk('messages/update', async(message) => {
    try {
        const res = await axios.post(`${apiUrl}/update`, message, {
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
 * データの削除処理
 */
export const fetchAsyncDelete = createAsyncThunk('messages/delete', async(id) => {
    try {
        // deleteの場合は第2引数で渡すデータはない
        await axios.delete(`${apiUrl}/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
        // メッセージボードに表示するメッセージ内容
        showMessages: [{
            id: '',                     // ID
            target_id: '',              // メッセージ相手のID
            content: '',                // 内容
            created_at: '',             // メッセージの作成日
            updated_at: '',             // メッセージの更新日
            name: '',                   // メッセージ相手のニックネーム
            gender: '',                 // メッセージ相手の性別
            user_photo_path: '',        // メッセージ相手のプロフィール画像
        }],
    },
    // Reducer (actionの処理を記述)
    reducers: {
        // Pusherから受け取ったデータを処理
        reduceMessages(state, action) {
            return {
                ...state,
                messages: state.messages.map((m) => 
                    m.user_id === action.payload.user_id ? action.payload : m
                ),
            }
        },
        // Pusherから受け取ったデータを処理
        reduceNewMessages(state, action) {
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        },
        // Pusherから受け取ったデータを処理
        reduceShowMessages(state, action) {
            return {
                ...state,
                showMessages: [...state.showMessages, action.payload], 
            }
        },
        // usersページから遷移したとき
        reduceSetShowMessage(state, action) {
            return {
                ...state,
                showMessages: action.payload, 
            }
        },
    },
    // 追加Reducer (Api通信の処理を記述)
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                messages: action.payload.message_lists, //apiから取得した記事の情報をstateのmessagesに格納
            }
        })
        builder.addCase(fetchAsyncGetShow.fulfilled, (state, action) => {
            return {
                ...state,
                showMessages: action.payload.messages,
            }
        })
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            // エラーが返ってきた場合
            if(action.payload.error_message) {
                return {
                    ...state,
                    showMessages: [...state.showMessages],
                    messages: [...state.messages]
                }  
            }
            
            // 正常に完了した場合
            return {
                ...state,
                showMessages: [action.payload.messages],  // 初回のshwMessagesデータを更新しないとfetchAsyncUpdateに処理が移らない
                messages: [...state.messages, action.payload.message_lists]
            }
        })
        builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
            // エラーが返ってきた場合
            if(action.payload.error_message) {
                return {
                    ...state,
                    showMessages: [...state.showMessages],
                    messages: [...state.messages]
                }  
            }
            
            // 正常に完了した場合
            return {
                ...state,
                showMessages: [...state.showMessages, action.payload.messages],
                // 現在のmessages一覧の要素をmというテンポラリの変数に格納して、選択したidに一致するidには変更したデータを格納
                messages: state.messages.map((m) => 
                    m.user_id === action.payload.message_lists.user_id ? action.payload.message_lists : m
                ),
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

export const { editMessage, reduceMessages, reduceNewMessages, reduceShowMessages, reduceSetShowMessage } = messageSlice.actions

export const selectSelectedMessage = (state) => state.message.selectedMessage
export const selectEditedMessage = (state) => state.message.editedMessage
export const selectMessages = (state) => state.message.messages
export const selectShowMessages = (state) => state.message.showMessages

export default messageSlice.reducer