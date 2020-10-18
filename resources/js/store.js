import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import appReducer from './components/app/appSlice';
import articleReducer from './components/articles/articleSlice';
import userReducer from './components/users/userSlice';
import messageReducer from './components/messages/messageSlice';

/**
 * Reducerを結合
 */
const reducer = combineReducers({
    app: appReducer,
    article: articleReducer,
    user: userReducer,
    message: messageReducer,
});

/**
 * Storeを生成
 */
export default configureStore({ reducer });