import React from 'react';
import Headline from '../SubComponents/Headline/Headline';
import './Home.scss'
function Home(props) {

    return <div id="home">
        <Headline className="head-msg" text="Home page" />
    </div>
}


export default Home;