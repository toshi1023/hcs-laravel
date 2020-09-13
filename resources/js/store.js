import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import articleReducer from './components/articles/articleSlice';

/**
 * Reducerを結合
 */
const reducer = combineReducers({
    article: articleReducer,
    // login: loginReducer,
});

/**
 * Storeを生成
 */
export default configureStore({ reducer });