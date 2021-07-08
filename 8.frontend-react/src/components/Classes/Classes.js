import React, { useEffect, useState, useMemo } from 'react';
import Table from '../Table/Table';
import axios from 'axios';
import Headline from '../Headline/Headline';
import Button from '../Button/Button';
import './Classes.scss';
import Modal from 'react-modal';
import AddClass from '../AddClass/AddClass';

function Classes(props) {
    const [data, setData] = useState([]);
    const [modalIsOpenAddClass, setIsOpenAddClassModal] = useState(false);
    // const [modalIsOpenRemoveUser, setIsOpenRemoveUserModal] = useState(false);
    // const [modalIsOpenEditUser, setIsOpenEditUserModal] = useState(false);
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);

    const columns = useMemo(() => [
        {
            Header: "Class Name",
            accessor: "class_name",
        },
        {
            Header: 'Description',
            accessor: "description"
        },
        {
            Header: 'Update',
            width: '1em',
            Cell: ({ row }) => (
                <div id="row-button-wrapper">
                    <button class="row-button" onClick={() => {
                        // openModalRemoveUser();
                        setRow(row.original);
                    }}>
                        {<i class="fa fa-trash"></i>}
                    </button>
                    <button class="row-button" onClick={() => {
                        // openModalEditUser();
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


    const openModalAddClass = () => {
        setIsOpenAddClassModal(true);
    }

    const closeModalAddClass = () => {
        setIsOpenAddClassModal(false);
    }


    useEffect(() => {
        (async () => {
            await axios.post('http://localhost:991/classes/getClasses/', {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    setData(response.data);
                })
                .catch(function (error) {

                });
        })();
    }, [dataHasChanged]);



    // const DeleteClient = () => {
    //     console.log(row);

    //     axios.post('http://localhost:991/clients/removeClient/', {
    //         clientId: row.client_id
    //     }).then(function (response) {
    //         console.log(response.data)
    //         closeModalRemoveUser();
    //         changeDataState();
    //         //TODO: handle error

    //     })

    //         .catch(function (error) {
    //             console.log(error)
    //         });
    // };




    return (
        <div id="classes-page">
            <Headline id="user-page-header" text="Classes" />
            <div id="table-wrapper">
                <div id="button-wrapper">
                    <Button
                        className="add-class-btn"
                        onClick={openModalAddClass}
                        text={<i class="fa fa-calendar-plus-o"></i>}
                    />
                </div>
                <Table columns={columns} data={data} />
            </div>
            <Modal
                isOpen={modalIsOpenAddClass}
                onRequestClose={closeModalAddClass}
                contentLabel="Add Class Modal"
                className="modal"
                ariaHideApp={false}
            >
                <AddClass closeModal={closeModalAddClass} changeDataState={changeDataState} />
            </Modal>
            {/* <Modal
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
            </Modal> */}
        </div>
    )
}

export default Classes;