import React, { useEffect, useState, useMemo } from 'react';
import Table from '../Table/Table';
import axios from 'axios';
import Headline from '../Headline/Headline';
import Button from '../Button/Button';
import Rollbar from "rollbar";
import './Users.scss';
import {
    Redirect,
    useParams,
} from "react-router-dom";
function Users(props) {

    const [data, setData] = useState([]);
    const [addUser, onAddUser] = useState(false);
    const columns = React.useMemo(() => [
        {
            Header: 'Name',
            accessor: "user_name"
        },
        {
            Header: 'Email',
            accessor: "user_email"
        },
        {
            Header: 'Phone Number',
            accessor: "user_phone"
        }, {
            Header: 'Permission',
            accessor: "permission_id"
        },
    ], []
    )

    useEffect(() => {
        (async () => {
            console.log(localStorage.getItem('user_token'))
            await axios.post('http://crossfit.com:8005/getUsersList', {
                headers: { authentication: localStorage.getItem('user_token') }
            }).
                then((response) => {
                    setData(response.data);
                })
                .catch(function (error) {
                    
                });
        })();
    }, []);





    return (
        <div id="users-page">
                <Button
                    className="add-user-btn"
                    onClick={() => {
                        onAddUser(true);
                    }
                    }
                    text="Add User"
                />
            
                <Headline id="user-page-header" text="Users" />
            

          

            <Table columns={columns} data={data} />
            {addUser && <Redirect to="/addUser" />}






        </div>

    )
}

export default Users;