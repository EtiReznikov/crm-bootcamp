import './App.scss';
import Home from './components/Home/Home';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import MsgPage from './components/MsgPage/MsgPage';
import LinkHref from './components/Link/LinkHref';
import AddUser from './components/AddUser/AddUser';
import InviteUser from './components/InviteUser/InviteUser';
import logo from './Views/Daco_6140061.png'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginSignup from './components/LoginWrapper/LoginWrapper'
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
        <div id="menu">
          {
            /* Show menu for loggedIn user */
            (userState &&
              <>
                <img className="menu-logo"  src={logo} />
                <LinkHref className="menu-item" href="/Users" text="Users" />
                <LinkHref className="menu-item" href="/Calendar" text="Calender" />
                <LinkHref className="menu-item" href="/addUser" text="Add new user" />
                <span  className="menu-item" href="/" onClick={logout} >Logout</span>
              </>) ||
            /* Show loggedIn/ Signup link for loggedOut user */
            <>
            <img className="menu-logo" src={logo} />
            <LinkHref className="menu-item" href="/LoginSignup" text="SignIn / SignUp" />
            </>
          }
        </div>
      
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
