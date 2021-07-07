import './App.scss';
import Home from './components/Home/Home';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import MsgPage from './components/MsgPage/MsgPage';
import AddUser from './components/AddUser/AddUser';
import InviteUser from './components/InviteUser/InviteUser';
import SideBar from './components/SideBar/SideBar';
import Clients from './components/Clients/Clients';
import 'react-pro-sidebar/dist/css/styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginSignup from './components/LoginWrapper/LoginWrapper'
import { useState, useEffect } from 'react';
import Calendar from './components/Calendar/Calendar';



function App(props) {
  const [userState, setState] = useState(localStorage.getItem('user_token'));
  //logout the user
  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('business_id');
    handleUserChange(false)
    window.location='/LoginSignup'
  };
  //update the user when child is updating the local  storage
  const handleUserChange = (flag) => {
    setState(flag);
  }

  useEffect((props) => {
    const pathArray= window.location.pathname.split('/');
    const path= pathArray[1];
    if (!userState && (path !== 'ForgotPassword' && path !== 'resetPassword' && path !== 'LoginSignup')){
      window.location='/LoginSignup';
    }
  });


  return (
    <Router>
      <div id="app">
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
          <Route path="/Clients">
            <Clients />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
