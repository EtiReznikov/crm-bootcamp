import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Button from '../../SubComponents/Button/Button';
import './ClientsPage.scss';
import Modal from 'react-modal';
import AddClient from '../AddClient/AddClient';
import ConfirmModal from '../../SubComponents/ConfirmModal/ConfirmModal';
import EditClient from '../EditClient/EditClient';
function Clients(props) {
    const [data, setData] = useState([]);
    const [modalIsOpenAddUser, setIsOpenAddUserModal] = useState(false);
    const [modalIsOpenRemoveUser, setIsOpenRemoveUserModal] = useState(false);
    const [modalIsOpenEditUser, setIsOpenEditUserModal] = useState(false);
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);

    const columns = useMemo(() => [
        {
            Header: "Name",
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
                <div id="row-button-wrapper">
                    <button class="row-button" onClick={() => {
                        openModalRemoveUser();
                        setRow(row.original);
                    }}>
                        {<i class="fa fa-trash"></i>}
                    </button>
                    <button class="row-button" onClick={() => {
                        openModalEditUser();
                        setRow(row.original);
                    }}>
                        {<i class="fa fa-edit"></i>}
                    </button>
                </div>)
        },
    ], []
    );

    function changeDataState() {
        setDataHasChanged(!dataHasChanged);
    }
    const openModalRemoveUser = () => {
        setIsOpenRemoveUserModal(true);
    }

    const closeModalRemoveUser = () => {
        setIsOpenRemoveUserModal(false);
    }

    const openModalAddUser = () => {
        setIsOpenAddUserModal(true);
    }

    const closeModalAddUser = () => {
        setIsOpenAddUserModal(false);
    }
    const openModalEditUser = () => {
        setIsOpenEditUserModal(true);
    }

    const closeModalEditUser = () => {
        setIsOpenEditUserModal(false);
    }

    useEffect(() => {
        (async () => {
            await axios.post('http://localhost:991/clients/getClients/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    setData(response.data);
                })
                .catch(function (error) {

                });
        })();
    }, [dataHasChanged]);

   
    const DeleteClient = () => {
       
        axios.post('http://localhost:991/clients/removeClient/', {
            clientId: row.client_id
        }).then(function (response) {
            closeModalRemoveUser();
            changeDataState();
            //TODO: handle error

        })

            .catch(function (error) {
                console.log(error)
            });
    };




    return (
        <div id="clients-page">
            <Headline id="user-page-header" text="Clients" />
            <div id="table-wrapper">
                <div id="button-wrapper">
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
                ariaHideApp={false}
            >
                <AddClient closeModal={closeModalAddUser} changeDataState={changeDataState} />
            </Modal>
            <Modal
                isOpen={modalIsOpenRemoveUser}
                onRequestClose={closeModalRemoveUser}
                contentLabel="Remove Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <ConfirmModal onConfirm={DeleteClient} onDismiss={closeModalRemoveUser} text={`Are you sure you want to delete ${row.client_name}?`} />
            </Modal>
            <Modal
                isOpen={modalIsOpenEditUser}
                onRequestClose={closeModalEditUser}
                contentLabel="Edit Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <EditClient closeModal={closeModalEditUser} changeDataState={changeDataState} clientData={row} />
            </Modal>
        </div>
    )
}

export default Clients;