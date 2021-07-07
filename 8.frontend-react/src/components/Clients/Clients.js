import React, { useEffect, useState, useMemo } from 'react';
import Table from '../Table/Table';
import axios from 'axios';
import Headline from '../Headline/Headline';
import Button from '../Button/Button';
import './Clients.scss';
import Modal from 'react-modal';
import AddClient from '../AddClient/AddClient';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
function Clients(props) {
    const [data, setData] = useState([]);
    const [modalIsOpenAddUser, setIsOpenAddUserModal] = useState(false);
    const [modalIsOpenRemoveUser, setIsOpenRemoveUserModal] = useState(false);
    const [row, setRow] = useState("");
    const [errorMsg, setErrorMsg] = useState(false);

    const columns = useMemo(() => [
        {
            Header:
                <div id="name-warper">
                    <span id="name-head">Name</span>
                    <div id="sort-name-warper">
                        <button class="sort-btn" ><i class="fa fa-sort-up"></i></button>
                        <button class="sort-btn"><i class="fa fa-sort-down"></i></button>
                    </div>
                </div>,
            accessor: "client_name",
        },
        {
            Header: 'Phone',
            accessor: "client_phone"
        },
        {
            Header: 'Update',
            width: '1em',
            Cell: ({ row }) => (
                <div id="row-button-warper">
                    <button class="row-button" onClick={() => {
                        openModalRemoveUser();
                        setRow(row.original);
                    }
                        // (e) => removeClient(e, row)
                    }>{<i class="fa fa-trash"></i>}</button>
                    <button class="row-button" onClick={(e) => updateClient(e, row)}>{<i class="fa fa-edit"></i>}</button>
                </div>)
        },
    ], []
    );

    function openModalRemoveUser() {
        setIsOpenRemoveUserModal(true);
    }

    const closeModalRemoveUser = () => {
        setIsOpenRemoveUserModal(false);
    }

    function openModalAddUser() {
        setIsOpenAddUserModal(true);
    }

    const closeModalAddUser = () => {
        console.log("delete")
        setIsOpenAddUserModal(false);
    }



 

    function updateClient(e, row) {
        console.log(row.original)
    }

    useEffect(() => {
        (async () => {
            console.log("use")
            await axios.post('http://localhost:991/clients/getClients/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    setData(response.data);
                })
                .catch(function (error) {

                });
        })();
    }, []);

    const sortByNameDesc = (isDesc) =>{
        axios.post('http://localhost:991/clients/sortByName/', {
            isDesc: isDesc,
            business_id: localStorage.getItem('business_id'),
        }).then(function (response) {
            console.log(response.data)
            if (response.data === true) {
                // console.log()
                // closeModalRemoveUser();
            }
            else {
                // // openModalRemoveUser();
                // //TODO: handle error
                // console.log("error")
                // // setErrorMsg(true);
            }
        })

            .catch(function (error) {
                console.log(error)
            });
    }
   //TODO ask Yonatan^
    const DeleteClient = () => {
        console.log(row);

        axios.post('http://localhost:991/clients/removeClient/', {
            clientId: row.client_id
        }).then(function (response) {
            console.log(response.data)
            if (response.data === true) {
                console.log()
                closeModalRemoveUser();
            }
            else {
                // openModalRemoveUser();
                //TODO: handle error
                console.log("error")
                // setErrorMsg(true);
            }
        })

            .catch(function (error) {
                console.log(error)
            });
    };




    return (
        <div id="clients-page">
            <Headline id="user-page-header" text="Clients" />
            <div id="table-warper">
                <div id="button-warper">
                    <Button
                        className="add-client-btn"
                        onClick={openModalAddUser}
                        text={<i class="fa fa-user-plus"></i>}
                    />
                </div>
                <Table columns={columns} data={data} />
            </div>
            <Modal
                isOpen={modalIsOpenAddUser}
                onRequestClose={closeModalAddUser}
                contentLabel="Add Client Modal"
                className="modal"
            >
                <AddClient closeModal={closeModalAddUser} />
            </Modal>
            <Modal
                isOpen={modalIsOpenRemoveUser}
                onRequestClose={closeModalRemoveUser}
                contentLabel="Remove Client Modal"
                className="modal"
            >
                <ConfirmModal onConfirm={DeleteClient} onDismiss={closeModalRemoveUser} text={`Are you sure you want to delete ${row.client_name}?`} />
            </Modal>
        </div>
    )
}

export default Clients;