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

require('./components/Home');


import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Article from './components/Article';
import User from './components/User';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: '#ecf7f7'
  }
}));

function App() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.background}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={props => <Home {...props} />} /> {/* history.pushを活用するためにpropsを渡す */}
            {/* <Route exact path="/articles" render={props => <Article {...props} />} /> */}
            <Route exact path="/users" render={props => <User {...props} />} />
          </Switch>
        </BrowserRouter> 
      </div>
    </>
  )
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}