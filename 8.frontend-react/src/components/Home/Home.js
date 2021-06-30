import React from 'react';
import axios from 'axios';

function Home(props) {
    return  <div onClick= {()=>{
        axios.post('http://crossfit.com:8005/home', { },{
            headers: {'authentication': localStorage.getItem('user_token') }
          })
          .then(function (response) {

          })
          .catch(function (error) {
            localStorage.removeItem('user_token');
          });
    }}
    >This is home page</div>
}

export default Home;