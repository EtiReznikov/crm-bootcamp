import './App.scss';
import Home from './components/Home/Home';
import Button from './components/Button/Button';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import InvalidLink from './components/InvalidLink/InvalidLink';
import LinkHref from './components/Link/LinkHref';
// import Menu from './components/Menu/Menu';
import MenuItem from './components/menuItem/MenuItem';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect 
} from "react-router-dom";
import LoginSignup from './components/LoginSignup/LoginSignup'
import { useState, useEffect } from 'react';
// import menuItem from './components/menuItem/MenuItem';
import Calendar from './components/Calendar/Calendar';

function App() {



  const [appState, setState] = useState({
    localStorageStatus: false,

  }
  );



  const onClick = () => {
    localStorage.removeItem('user_token');
    setState({ ...appState, localStorageStatue: false })

  };

 
  useEffect(() => {

    // setState({...appState, localStorageStatue: localStorage.getItem('user_token') })
  });


  return (
    <Router>
      <div id="app">
        <div id="head">
        {/* <Menu items={appState.menuItems}></Menu> */}
          {
            (localStorage.getItem('user_token') && 
            <LinkHref href="/" onClick={onClick} text="Logout" />) ||
            <LinkHref href="/LoginSignup" text="SignIn/ SignUp"/>
          }
          <LinkHref href="/Users" text="Users" />
          <LinkHref href="/Calendar" text="Calender" />


       
          </div>
        <hr />


        <Switch>
        <Route exact path="/">
            <Home />
          </Route>
        <Route path="/Calendar">
            <Calendar />
          </Route>
          <Route path="/LoginSignup">
            <LoginSignup />
          </Route>
          
          <Route path="/Users">
            <Users />
          </Route>
          <Route path="/forgotPassword">
            <ForgotPassword />
          </Route>
          <Route path="/resetPassword/:token">
            <ResetPassword />
          </Route>
          <Route path="/linkInvalid">
            <InvalidLink />
          </Route>
    
        </Switch>
      </div>
    </Router>
  );
}

export default App;
