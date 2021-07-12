import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Button from '../../SubComponents/Button/Button';
import './ClientsPage.scss';
import Modal from 'react-modal';
import AddClient from '../AddClient/AddClient';
import ConfirmModal from '../../SubComponents/ConfirmModal/ConfirmModal';
function Clients(props) {

    const [modalIsOpenAddClient, setIsOpenAddClientModal] = useState(false);
    const [modalIsOpenRemoveClient, setIsOpenRemoveClientModal] = useState(false);
    const [modalIsOpenEditClient, setIsOpenEditClientModal] = useState(false);
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
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
                        openModalRemoveClient();
                        setRow(row.original);
                    }}>
                        {<i class="fa fa-trash"></i>}
                    </button>
                    <button class="row-button" onClick={() => {
                        setIsEdit(true);
                        setRow(row.original);
                        openModalAddClient();
                        
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
    const openModalRemoveClient = () => {
        setIsOpenRemoveClientModal(true);
    }

    const closeModalRemoveClient = () => {
        setIsOpenRemoveClientModal(false);
    }

    const openModalAddClient = () => {
        setIsOpenAddClientModal(true);
    }

    const closeModalAddClient = () => {
        setIsOpenAddClientModal(false);
    }
    const openModalEditClient = () => {
        setIsOpenEditClientModal(true);
    }

    const closeModalEditClient = () => {
        setIsOpenEditClientModal(false);
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
            closeModalRemoveClient();
            changeDataState();
            //TODO: handle error

        })

            .catch(function (error) {
                console.log(error)
            });
    };

    const OnAddClientClick = () => {
        setIsEdit(false);
        openModalAddClient();
    }

    return (
        <div id="clients-page">
            <Headline id="user-page-header" text="Clients" />
            <div id="table-wrapper">
                <div id="button-wrapper">
                    <Button
                        className="add-client-btn"
                        onClick={OnAddClientClick}
                        text={<i class="fa fa-user-plus"></i>}
                    />
                </div>
                <Table columns={columns} data={data} />
            </div>
            <Modal
                isOpen={modalIsOpenAddClient}
                onRequestClose={closeModalAddClient}
                contentLabel="Add Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <AddClient closeModal={closeModalAddClient} changeDataState={changeDataState} clientData={row} isEdit={isEdit}  />
            </Modal>
            <Modal
                isOpen={modalIsOpenRemoveClient}
                onRequestClose={closeModalRemoveClient}
                contentLabel="Remove Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <ConfirmModal onConfirm={DeleteClient} onDismiss={closeModalRemoveClient} text={`Are you sure you want to delete ${row.client_name}?`} />
            </Modal>
            {/* <Modal
                isOpen={modalIsOpenEditClient}
                onRequestClose={closeModalEditClient}
                contentLabel="Edit Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <EditClient closeModal={closeModalEditClient} changeDataState={changeDataState} clientData={row} />
            </Modal> */}
        </div>
    )
}

export default Clients;