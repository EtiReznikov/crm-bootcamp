import './App.scss';
import Home from './components/Home/Home';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import MsgPage from './components/MsgPage/MsgPage';
import LinkHref from './components/Link/LinkHref';
import AddUser from './components/AddUser/AddUser';
import InviteUser from './components/InviteUser/InviteUser';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginSignup from './components/LoginSignup/LoginSignup'
import { useState } from 'react';
import Calendar from './components/Calendar/Calendar';

function App() {

  const [userState, setState] = useState(localStorage.getItem('user_token'));

  //logput the user
  const logout = () => {
    localStorage.removeItem('user_token');
    setState(false)
  };

  //update the user when child is updating the local  storage
  const handleUserChange = (flag) => {
    setState(flag);
  }

  return (
    <Router>
      <div id="app">
        <div id="head">
          {
            /* Show menu for loggedIn user */
            (userState &&
              <>
                <span href="/" onClick={logout} >Logout</span>
                <LinkHref href="/Users" text="Users" />
                <LinkHref href="/Calendar" text="Calender" />
                <LinkHref href="/addUser" text="Add new user" />
              </>) ||
            /* Show loggedIn/ Signup link for loggedOut user */
            <LinkHref href="/LoginSignup" text="SignIn/ SignUp" />
          }
        </div>
        <hr />
        {/* Switch path for router */}
        <Switch>
          <Route exact path="/" >
            <Home />
          </Route>
          <Route path="/Calendar">
            <Calendar />
          </Route>
          <Route path="/LoginSignup">
            <LoginSignup onUserChange={handleUserChange} />
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
          <Route path="/msgPage" render={(props) =>  <MsgPage {...props}/> }/>
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
