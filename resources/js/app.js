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

require('./components/home/Home');


import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/users/Login';
import Home from './components/home/Home';
import Article from './components/articles/Index';
import User from './components/users/Index';
import UserCreate from './components/users/Create';
import Message from './components/messages/Message';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Provider } from "react-redux";
import store from "./store";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: '#f0f1f3'
  }
}));

function App() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.background}>
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/login" render={props => <Login {...props} />} />
              <Route exact path="/" render={props => <Home {...props} />} /> {/* history.pushを活用するためにpropsを渡す */}
              <Route exact path="/articles" render={props => <Article {...props} />} />
              <Route exact path="/users" render={props => <User {...props} />} />
              <Route exact path="/users/create" render={props => <UserCreate {...props} />} />
              <Route exact path="/messages" render={props => <Message {...props} />} />
            </Switch>
          </BrowserRouter> 
        </Provider>
      </div>
    </>
  )
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}