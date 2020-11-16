/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Login from './components/users/Login';
import Home from './components/home/Home';
import Article from './components/articles/Index';
import MyArticle from './components/articles/MyArticle';
import User from './components/users/Index';
import UserShow from './components/users/Show';
import UserEdit from './components/users/Edit';
import Profile from './components/users/Profile';
import UserCreate from './components/users/Create';
import Message from './components/messages/Index';
import News from './components/news/Index';
import HcsAppBar from './components/parts/common/appBar';
import LoadItem from './components/parts/common/loadItem';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Provider } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { selectLoading, fetchCredStart, fetchCredEnd } from "./components/app/appSlice";
import { selectSelectedUser } from "./components/users/userSlice";
import store from "./store";


const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: '#f0f1f3'
  },
}));

/**
 * redux-toolkitの機能を利用するためのラッパー関数を生成
 */
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  let loading = useSelector(selectLoading);
  let selectedUsers = useSelector(selectSelectedUser);
  
  return (
    <>
      <div className={classes.background}>
        <BrowserRouter>
          <HcsAppBar />
          <Switch>
            <Route exact path="/login" render={props => <Login {...props} />} />
            <Route exact path="/" render={props => <Home {...props} />} /> {/* history.pushを活用するためにpropsを渡す */}
            <Route exact path="/articles" render={props => <Article {...props} />} />
            <Route exact path="/articles/mypage" render={props => <MyArticle {...props} />} />
            <Route exact path="/users" render={props => <User {...props} />} />
            <Route exact path="/users/create" render={props => <UserCreate {...props} />} />
            <Route exact path="/users/:id" render={props => <UserShow {...props} />} />
            <Route exact path="/users/:id/mypage" render={props => <Profile {...props} />} />
            <Route exact path="/users/:id/edit" render={props => <UserEdit {...props} />} />
            <Route exact path="/messages" render={props => <Message {...props} />} />
            <Route exact path="/news" render={props => <News {...props} />} />
          </Switch>
          {loading ? <LoadItem /> : null}
          <input type="hidden" id="loginId" />
        </BrowserRouter>
      </div>
    </>
  )
}

if (document.getElementById('app')) {
    ReactDOM.render(<AppWrapper />, document.getElementById('app'));
}