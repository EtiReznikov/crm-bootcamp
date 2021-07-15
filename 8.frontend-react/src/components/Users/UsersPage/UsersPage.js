import React, { useEffect, useState } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Button from '../../SubComponents/Button/Button';

import './UsersPage.scss';
import {
    Redirect,
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
            console.log(localStorage.getItem('business_id'))
            await axios.post('http://crossfit.com:8005/Accounts/getUsersList', {
                businessId: localStorage.getItem('business_id'),
                headers: {
                    authentication: {
                        token: localStorage.getItem('user_token'),

                    }
                }
            })
                .then((response) => {
                    console.log(response.data)
                    let data = []
                    for (const userValue of response.data) {
                        let temp= {
                            user_name: userValue.user_name, 
                            user_phone: userValue.user_phone,
                            permission_id: userValue.permission_id === 0 ? 'Manager' : 'Trainer',
                            user_email: userValue.user_email,
                            user_id: userValue.user_id
                        }
                        data.push(temp)
                    }
                    setData(data);
                })
                .catch(function (error) {

                    if (error.response.data.status === 10) {
                        localStorage.removeItem('user_token');
                        localStorage.removeItem('business_id');
                    }
                    setSuccessStatus(error.response.data.status);
                });
        })();
    }, []);

    return (
        <div id="users-page" className="page-wrapper">
            <div id="btn-head-wrapper">
                <Headline id="users-page-head" text="Users" />
                <button className="add-row" onClick={() => {
                            onAddUser(true);
                        }}>
                    Add User
                </button>
            </div>
            {/* <Headline id="user-page-header" text="Users" /> */}

            <div id="table-wrapper">

                {/* <div id="button-wrapper">

                    <Button
                        className="add-user-btn"
                        onClick={() => {
                            onAddUser(true);
                        }
                        }
                        text={<i className="fa fa-user-plus"></i>}
                    />
                    {<Button
                        className="remove-user-btn"
                        //TODO add remove function
                        text={<i className="fa fa-user-times"></i>}
                    /> 

                </div> */}

                <Table columns={columns} data={data} />
                {addUser && <Redirect to="/addUser" />}
                {successStatus === 10 && <Redirect to={{
                    pathname: "/msgPage",
                    state: {
                        icon: "fa fa-exclamation-circle",
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
                        icon: "fa fa-exclamation-circle",
                        headLine: "Something went wrong",
                        text_1: "please ",
                        link: "/users",
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