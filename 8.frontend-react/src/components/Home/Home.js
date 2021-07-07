import React from 'react';
import Headline from '../Headline/Headline';
import './Home.scss'
import axios from 'axios';
function Home(props) {

    const API_PATH = 'http://localhost:991/test/test/';
    const handleClick = () => {
        console.log("home")
        // const response = axios.get(API_PATH)
        // if(response){
        //     console.log(response);
        // }
        // else {
        //     return false;
        // }

        axios.post(API_PATH, {
            email: "",
          })
            .then((response) => {
              console.log(response)
            })
            .catch(function (error) {
              console.log("error")
            });
    }

    return <div id="home">
        <Headline className="head-msg" text="Home page" />
        <div onClick={handleClick}>CLick </div>
    </div>
}

export default Home;