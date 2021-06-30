import React from 'react';
import axios from 'axios';
import MsgPage from '../MsgPage/MsgPage';
import logo from '../../Views/Daco_6140061.png'
import Headline from '../Headline/Headline';
import './Home.scss'
function Home(props) {
   //TODO: add middleware to all axios
    return  <div id="home"><img id="logo" src={logo} />
    <Headline className="head-msg" text="This is home page"/>
    </div>
    // <div onClick= {()=>{
    
    //     axios.post('http://crossfit.com:8005/home', { },{
    //         headers: {'authentication': localStorage.getItem('user_token') }
    //       })
    //       .then(function (response) {

    //       })
    //       .catch(function (error) {
    //         localStorage.removeItem('user_token');
    //       });
    // }}
    // >This is home page</div>
}

export default Home;