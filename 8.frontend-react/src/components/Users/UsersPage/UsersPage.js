import React, { useEffect, useState } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Modal from 'react-modal';
import './UsersPage.scss';
import AddUser from '../AddUser/AddUser';
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
import ConfirmModal from '../../SubComponents/ConfirmModal/ConfirmModal';
import {
    Redirect,
} from "react-router-dom";
function Users(props) {
    const [modalIsOpenRemoveUser, setIsOpenRemoveUserModal] = useState(false);
    const [data, setData] = useState([]);
    // const [addUser, onAddUser] = useState(false);
    const [successStatus, setSuccessStatus] = useState(0);
    const [modalIsOpenAddUser, setIsOpenAddUserModal] = useState(false);
    const [row, setRow] = useState("");
    const [ErrorDelete, setErrorDelete] = useState(false);
    const [dataHasChanged, setDataHasChanged] = useState(false);
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
        },
        {
            Header: 'Permission',
            accessor: "permission_id"
        },
        {
            Header: 'Update',
            width: '1em',
            Cell: ({ row }) => (
                <div id="row-button-wrapper">
                    <button className="row-button" onClick={() => {
                        openModalRemoveUser();
                        setRow(row.original);
                    }}>
                        {<i className="fa fa-trash"></i>}
                    </button>
                </div>
            )
        }

    ], []
    )

    async function getUsers() {
        axios.post('http://localhost:8005/Accounts/getUsersList', {
            businessId: localStorage.getItem('business_id'),
            headers: {
                authentication: {
                    token: localStorage.getItem('user_token'),

                }
            }
        })
            .then((response) => {
                let data = []
                for (const userValue of response.data) {
                    let temp = {
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
    }

    useEffect(async () => {
        await getUsers();
    }, [dataHasChanged]);

    function changeDataState() {
        setDataHasChanged(!dataHasChanged);
    }
    const openModalAddUser = () => {
        setIsOpenAddUserModal(true);
    }

    const closeModalAddUser = () => {
        setIsOpenAddUserModal(false);
    }

    const closeModalRemoveUser = () => {
        setIsOpenRemoveUserModal(false);
    }

    const openModalRemoveUser = () => {
        setIsOpenRemoveUserModal(true);
    }


    const DeleteUser = () => {

        axios.post('http://localhost:8005/Accounts/removeUser/', {
            userId: row.user_id,
            token: localStorage.getItem('user_token'),
            headers: { authentication: localStorage.getItem('user_token') }
        }).then(function (response) {
            setErrorDelete(false);
            closeModalRemoveUser();
            changeDataState();
        })

            .catch(function (error) {
                setErrorDelete(false);
            });
    };


    return (
        <div id="users-page" className="page-wrapper">
            <div id="btn-head-wrapper">
                <Headline id="users-page-head" text="Users" />
                <button className="add-row" onClick={() => {
                    openModalAddUser();
                }}>
                    Add User
                </button>
            </div>


            <div id="table-wrapper">

                <Table columns={columns} data={data} isPagination={true} isSort={true} />
                {/* {addUser && <Redirect to="/addUser" />} */}
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
                {successStatus === 2 && <ErrorMsg text="something went wrong please refresh the page" />}
                <Modal
                    isOpen={modalIsOpenRemoveUser}
                    onRequestClose={closeModalRemoveUser}
                    contentLabel="Remove User Modal"
                    className="modal"
                    ariaHideApp={false}
                >
                    <ConfirmModal onConfirm={DeleteUser} onDismiss={closeModalRemoveUser} text={`Are you sure you want to delete ${row.user_name}?`} errorMsg={ErrorDelete} />
                </Modal>

                <Modal
                    isOpen={modalIsOpenAddUser}
                    onRequestClose={closeModalAddUser}
                    contentLabel="Add User Modal"
                    className="modal"
                    ariaHideApp={false}
                >
                    <AddUser closeModal={closeModalAddUser} />
                </Modal>

            </div>
        </div>
    )
}

export default Users;