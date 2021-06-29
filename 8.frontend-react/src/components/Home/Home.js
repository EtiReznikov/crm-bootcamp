import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home(props) {
    return  <div onClick= {()=>{
        axios.post('http://crossfit.com:8005/home', { },{
            headers: {'authentication': localStorage.getItem('user_token') }
          })
          .then(function (response) {

            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
            localStorage.removeItem('user_token');
          });
    }}
    >This is home page</div>
}

export default Home;