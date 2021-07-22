import './App.scss';
import Home from './components/DashBoard/Home/Home';
import Users from './components/Users/UsersPage/UsersPage';
import ForgotPassword from './components/authentication/ForgotPassword/FogotPassword';
import ResetPassword from './components/authentication/ResetPassword/ResetPassword';
import MsgPage from './components/SubComponents/MsgPage/MsgPage';
import AddUser from './components/Users/AddUser/AddUser';
import InviteUser from './components/Users/InviteUser/InviteUser';
import SideBar from './components/SideBar/SideBar';
import Clients from './components/Clients/ClientsPage/ClientsPage';
import Classes from './components/Classes/ClassesPage/ClassesPage';
import PackagesPage from './components/Packages/PackagesPage/PackagesPage';
import Map from './components/Map/Map';
import 'react-pro-sidebar/dist/css/styles.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import LoginWrapper from './components/authentication/LoginWrapper/LoginWrapper'
import { useState, useEffect } from 'react';
import CalendarPage from './components/CalendarPage/CalendarPage';


function App(props) {
  const [userState, setState] = useState(localStorage.getItem('user_token'));
  //logout the user
  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('business_id');
    handleUserChange(false)
    window.location = '/loginSignup'
  };
  //update the user when child is updating the local  storage
  const handleUserChange = (flag) => {
    setState(flag);
  }

  useEffect((props) => {
    const pathArray = window.location.pathname.split('/');
    const path = pathArray[1];
    if (!userState && (path !== 'forgotPassword' && path !== 'resetPassword' && path !== 'loginSignup' && path !== 'inviteUser')) {
      window.location = '/loginSignup';
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
          <Route path="/calendar">
            <CalendarPage />
          </Route>
          <Route path="/loginSignup">
            <LoginWrapper onUserChange={handleUserChange} isLogin={true} isRegister={false} />
          </Route>
          <Route path="/users">
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
          <Route path="/clients">
            <Clients />
          </Route>
          <Route path="/classes">
            <Classes />
          </Route>
          <Route path="/packages">
            <PackagesPage />
          </Route>
          <Route path="/map">
            <Map/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
