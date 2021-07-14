import React, { useEffect, useState, useMemo } from 'react';
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../../SubComponents/Headline/Headline';
import Button from '../../SubComponents/Button/Button';
import './ClientsPage.scss';
import Modal from 'react-modal';
import AddClient from '../AddClient/AddClient';
import ConfirmModal from '../../SubComponents/ConfirmModal/ConfirmModal';
import ErrorComponent from '../../SubComponents/ErrorComponenet/ErrorComponent';
import FileUploadModal from '../../FileUploadModal/FileUploadModal';

import Avatar from 'react-avatar';
import img from '../../../Views/logo.png'
function Clients(props) {

    const [modalIsOpenAddClient, setIsOpenAddClientModal] = useState(false);
    const [modalIsOpenRemoveClient, setIsOpenRemoveClientModal] = useState(false);
    const [modalIsOpenAddImg, setIsOpenAddImgModal] = useState(false);
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [errorMsg, setError] = useState(false);
    const [ErrorDelete, setErrorDelete] = useState(false);
    const columns = useMemo(() => [
        {
            Header: "Name",
            accessor: "client_name_avatar",
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
                    <button className="row-button" onClick={() => {
                        openModalRemoveClient();
                        setRow(row.original);
                    }}>
                        {<i className="fa fa-trash"></i>}
                    </button>
                    <button className="row-button" onClick={() => {
                        setIsEdit(true);
                        setRow(row.original);
                        openModalAddClient();

                    }}>
                        {<i className="fa fa-edit"></i>}
                    </button>
                    <button className="row-button" onClick={() => {
                        setIsEdit(true);
                        setRow(row.original);
                        openModalAddImg();

                    }}>
                        {<i className="fa fa-upload"></i>}
                    </button>
                </div>)
        },
    ], []
    );

    function changeDataState() {
        setDataHasChanged(!dataHasChanged);
    }
    const openModalRemoveClient = () => {
        setErrorDelete(false);
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

    const openModalAddImg = () => {
        setIsOpenAddImgModal(true);
    }

    const closeModalAddImg = () => {
        setIsOpenAddImgModal(false);
    }

    useEffect(() => {
        let data = [];
        (async () => {
            await axios.post('http://localhost:991/clients/getClients/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    if (response.data === "")
                        setData([]);
                    else if (Array.isArray(response.data)) {

                        console.log(response.data)
                        for (const clientValue of response.data) {
                            let temp = {
                                client_id: clientValue.client_id,
                                client_name:clientValue.client_name,
                                client_name_avatar: <div id="avatar-wrapper">
                                    <Avatar name={clientValue.client_name} src={'http://localhost:8005/uploads/' + clientValue.file} size="90" round={true} />
                                    <div id="name-row">{clientValue.client_name}</div>

                                </div>,
                                gym_id: clientValue.gym_id,
                                client_phone: clientValue.client_phone,
                                // color: classValue.color,
                                // days: days,
                                // time: obj.hours + ":" + obj.min
                            }
                            data.push(temp)
                        }
                        console.log(data)
                        setError(false);
                        setData(data);

                    }
                    else {
                        setError(true);
                    }
                })
                .catch(function (error) {
                    setError(true);
                });
        })();
    }, [dataHasChanged]);


    const DeleteClient = () => {

        axios.post('http://localhost:991/clients/removeClient/', {
            clientId: row.client_id
        }).then(function (response) {
            if (response.data === true) {
                setErrorDelete(false);
                closeModalRemoveClient();
                changeDataState();
            }
            else {
                setErrorDelete(false);
            }


        })

            .catch(function (error) {
                setErrorDelete(false);
            });
    };

    const OnAddClientClick = () => {
        setIsEdit(false);
        openModalAddClient();
    }

    return (
        <div id="clients-page" className="page-wrapper">
            {!errorMsg &&
                <>
                    <div id="btn-head-wrapper">
                        <Headline id="client-page-head" text="Clients" />
                        <button className="add-row" onClick={OnAddClientClick}>
                            Add Client
                        </button>
                    </div>
                    <div id="table-wrapper">

                        <Table columns={columns} data={data} />
                    </div>
                    <Modal
                        isOpen={modalIsOpenAddClient}
                        onRequestClose={closeModalAddClient}
                        contentLabel="Add Client Modal"
                        className="modal"
                        ariaHideApp={false}
                    >
                        <AddClient closeModal={closeModalAddClient} changeDataState={changeDataState} clientData={row} isEdit={isEdit} />
                    </Modal>
                    <Modal
                        isOpen={modalIsOpenRemoveClient}
                        onRequestClose={closeModalRemoveClient}
                        contentLabel="Remove Client Modal"
                        className="modal"
                        ariaHideApp={false}
                    >
                        <ConfirmModal onConfirm={DeleteClient} onDismiss={closeModalRemoveClient} text={`Are you sure you want to delete ${row.client_name}?`} errorMsg={ErrorDelete} />
                    </Modal>
                    <Modal
                        isOpen={modalIsOpenAddImg}
                        onRequestClose={closeModalAddImg}
                        contentLabel="Add Img Modal"
                        className="modal"
                        ariaHideApp={false}
                    >
                        <FileUploadModal closeModal={closeModalAddImg} clientData={row} changeDataState={changeDataState} />
                    </Modal>
                </>
            }
            {errorMsg &&
                <>
                    <Headline id="user-page-header" text="Clients" />
                    <ErrorComponent text="Error" />
                </>}
        </div>
    )
}

export default Clients;