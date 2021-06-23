import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginSignup from './components/LoginSignup/LoginSignup'
function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/LoginSignup">Login / Signup</Link>
          </li>
        </ul>

        <hr />

     
        <Switch>
          <Route path="/LoginSignup">
            <LoginSignup />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
