import React, { useEffect, useState, useMemo } from 'react';
import Table from '../Table/Table';
import axios from 'axios';
import Headline from '../Headline/Headline';
import Button from '../Button/Button';

import './Users.scss';
import {
    Redirect,
    useParams,
} from "react-router-dom";
function Users(props) {

    const [data, setData] = useState([]);
    const [addUser, onAddUser] = useState(false);
    const [successStatus, setSuccessStatus] = useState(0);
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
            await axios.post('http://crossfit.com:8005/getUsersList', {
                headers: { authentication: localStorage.getItem('user_token') }
            }).
                then((response) => {
                    setData(response.data);
                })
                .catch(function (error) {
                    if (error.response.data.message === 'token invalid') {
                        localStorage.removeItem('user_token');
                        setSuccessStatus(1);
                    }
                    else {
                        setSuccessStatus(2);
                    }

                });
        })();
    }, []);

    return (
        <div id="users-page">

            <Headline id="user-page-header" text="Users" />

            <div id="table-warper">
                <div id="button-warper">
                    <Button
                        className="add-user-btn"
                        onClick={() => {
                            onAddUser(true);
                        }
                        }
                        text={<i class="fa fa-user-plus"></i>}
                    />
                    <Button
                        className="remove-user-btn"
                        //TODO add remove function
                        text={<i class="fa fa-user-times"></i>}
                    />
                  
                </div>
                
                <Table columns={columns} data={data} />
                {addUser && <Redirect to="/addUser" />}
                {successStatus === 1 && <Redirect to={{
                    pathname: "/msgPage",
                    state: {
                        headLine: "Something went wrong",
                        text_1: "please ",
                        link: "/LoginSignUp",
                        aText: "click here",
                        text_2: " to login again.",
                        className: "msg-page-link"
                    }
                }} />
                }
                {successStatus === 2 && <Redirect to={{
                    pathname: "/msgPage",
                    state: {
                        headLine: "Something went wrong",
                        text_1: "please ",
                        link: "/Users",
                        aText: "click here",
                        text_2: " to try again.",
                        className: "msg-page-link"
                    }
                }} />
                }

            </div>
        </div>
    )
}

export default Users;