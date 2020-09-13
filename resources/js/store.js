import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import articleReducer from './components/articles/articleSlice';
import userReducer from './components/users/userSlice';

/**
 * Reducerを結合
 */
const reducer = combineReducers({
    article: articleReducer,
    user: userReducer,
    // login: loginReducer,
});

/**
 * Storeを生成
 */
export default configureStore({ reducer });