import React from 'react';
import Headline from '../Headline/Headline';
import './Home.scss'
import axios from 'axios';
function Home(props) {

    

    return <div id="home">
        <Headline className="head-msg" text="Home page" />
    </div>
}

export default Home;