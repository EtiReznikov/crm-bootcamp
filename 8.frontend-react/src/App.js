import './App.scss';
import Home from './components/Home/Home';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import MsgPage from './components/MsgPage/MsgPage';
import AddUser from './components/AddUser/AddUser';
import InviteUser from './components/InviteUser/InviteUser';
import SideBar from './components/SideBar/SideBar';
import 'react-pro-sidebar/dist/css/styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import { withRouter } from 'react-router';
import LoginSignup from './components/LoginWrapper/LoginWrapper'
import { useState, useEffect } from 'react';
import Calendar from './components/Calendar/Calendar';



function App(props) {
  const [userState, setState] = useState(localStorage.getItem('user_token'));
  //logout the user
  const logout = () => {
    localStorage.removeItem('user_token');
    handleUserChange(false)
    window.location='/LoginSignup'
  };
  //update the user when child is updating the local  storage
  const handleUserChange = (flag) => {
    setState(flag);
  }

  useEffect((props) => {
    console.log("test1");
    if (!userState && window.location.pathname !== '/resetPassword' && window.location.pathname !== '/LoginSignup' &&  window.location.pathname !== '/forgotPassword'){
      console.log("test2");
      window.location='/LoginSignup'
    }
  }, []);


  return (
    <Router>
      <div id="app">
        {//* TODO redirect to home page */
        }
        {(userState && <SideBar logout={logout} />)}



        {/* Switch path for router */}
        <Switch>
          <Route exact path="/" >
            <Home />
          </Route>
          <Route path="/Calendar">
            <Calendar />
          </Route>
          <Route path="/LoginSignup">
            <LoginSignup onUserChange={handleUserChange} isLogin={true} isRegister={false} />
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
          <Route path="/msgPage" render={(props) => <MsgPage {...props} />} />
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
