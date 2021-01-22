import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import appReducer from './components/app/appSlice';
import articleReducer from './components/articles/articleSlice';
import userReducer from './components/users/userSlice';
import messageReducer from './components/messages/messageSlice';
import newsReducer from './components/news/newsSlice';
import SessionCheck from './components/middleware/sessionCheck';

/**
 * Reducerを結合
 */
const reducer = combineReducers({
    app: appReducer,
    article: articleReducer,
    user: userReducer,
    message: messageReducer,
    news: newsReducer,
});

/**
 * Storeを生成
 */
export default configureStore({ 
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // 'serializableCheck'を削除(※formDataでのデータ登録に警告を出さないようにするため)
        serializableCheck: false,
      }).concat(SessionCheck), 
});