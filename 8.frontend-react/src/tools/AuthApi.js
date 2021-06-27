
import axios from 'axios';

function authIsValid() {
    const token = localStorage.getItem('user_token');
    if (!token) return false;
    axios.post('http://crossfit.com:8005/AuthApi', {
        token: token
    })
        // .then((response) => {
        //     console.log(response.data)
        //     console.log("status " + response.data.status)
        //     setState({
        //         ...formState,
        //         errorStatus: response.data.status,
        //     })

        //     localStorage.setItem('user_token', response.data.token);
        //     window.location.href = "http://localhost:3000";

        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
}

