import './App.scss';
import Home from './components/Home/Home';
import Button from './components/Button/Button';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import InvalidLink from './components/InvalidLink/InvalidLink';
import LinkHref from './components/Link/LinkHref';
import AddUser from './components/AddUser/AddUser';
import InviteUser from './components/InviteUser/InviteUser';
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

  const [userState, setState] = useState( localStorage.getItem('user_token'));

  const logout = () => {
    console.log("click")
    localStorage.removeItem('user_token');
    setState( false )
  };


  // useEffect(() => {
  //   setState({...userState, localStorageStatue: localStorage.getItem('user_token') })
  // });

//   useEffect(() => {
//     localStorage.removeItem('user_token') 
//     props.onUserChange();
//   // removeItem();
// },[]);
  const handleUserChange = (flag) => {
    console.log("user changed")
    console.log(localStorage.getItem('user_token'));
    setState(flag);
    console.log(userState);
  }

  
  return (
    <Router>
      <div id="app">

        <div id="head">
          
          { 
            (userState &&
              <>
                <span href="/" onClick={logout} >Logout</span>
                <LinkHref href="/Users" text="Users" />
                <LinkHref href="/Calendar" text="Calender" />
                <LinkHref href="/addUser" text="Add new user" />
              </>
            ) ||
            <LinkHref href="/LoginSignup" text="SignIn/ SignUp" />
          }


        </div>
        <hr />


        <Switch>
          <Route exact path="/" >
            <Home />
          </Route>
          <Route path="/Calendar">
            <Calendar />
          </Route>
          <Route path="/LoginSignup">
            <LoginSignup onUserChange={handleUserChange}/>
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
          <Route path="/addUser">
            <AddUser />
          </Route>
          <Route path="/inviteUser/:token">
            <InviteUser onUserChange={handleUserChange} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
