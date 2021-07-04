import React from 'react';
import logo from '../../Views/Daco_6140061.png'
import Headline from '../Headline/Headline';
import './Home.scss'
function Home(props) {
   //TODO: add middleware to all axios
    return  <div id="home">
        {/* <img id="logo" alt="logo" src={logo} /> */}
    <Headline className="head-msg" text="Home page"/>
    </div>
}

export default Home;