import './App.scss';
import Home from './components/Home/Home';
import Button from './components/Button/Button';
import Users from './components/Users/Users';
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
      <div>
        <div id="head">
        {/* <Menu items={appState.menuItems}></Menu> */}
        

          {

            (localStorage.getItem('user_token') && 
            <Link to="/" onClick={onClick}>Logout</Link>) ||
            <Link to="/LoginSignup" >SignIn/ SignUp</Link>
          }
  
          <Link to="/Users">Users</Link>
          <Link to="/Calendar">Calender</Link>
       
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
          <Route path="forgetPass">
            
          </Route>
    
        </Switch>
      </div>
    </Router>
  );
}

export default App;
