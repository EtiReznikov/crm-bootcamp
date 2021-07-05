import './App.scss';
import Home from './components/Home/Home';
import Users from './components/Users/Users';
import ForgotPassword from './components/ForgotPassword/FogotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import MsgPage from './components/MsgPage/MsgPage';
import LinkHref from './components/Link/LinkHref';
import AddUser from './components/AddUser/AddUser';
import InviteUser from './components/InviteUser/InviteUser';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import logo from './Views/Daco_6140061.png'
import SideBar from './components/SideBar/SideBar';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import {
  useParams,
  Redirect
} from "react-router-dom";


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
    console.log("logout")
    localStorage.removeItem('user_token');
    handleUserChange(false)
  };

  //update the user when child is updating the local  storage
  const handleUserChange = (flag) => {
    setState(flag);
  }


  return (
    <Router>
      <div id="app">
        {(userState && <SideBar logout={logout} />)} 
        {(!userState && <Redirect to="/LoginSignup"/>)}

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
