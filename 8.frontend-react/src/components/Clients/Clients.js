import React, { useEffect, useState } from 'react';
import Table from '../Table/Table';
import axios from 'axios';
import Headline from '../Headline/Headline';
import Button from '../Button/Button';
import './Clients.scss';
import Modal from 'react-modal';
import AddClient from '../AddClient/AddClient';
function Clients(props) {
    const [data, setData] = useState([]);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const columns = React.useMemo(() => [
        {
            Header : 'Name',
            accessor : "client_name"
        },
        {
            Header : 'Phone',
            accessor : "client_phone"
        },
    ], []
    );

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

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
    }, []);


    function openModal() {
        setIsOpen(true);
    }
    
    function closeModal() {
        setIsOpen(false);
    }


    return (
        <div id="clients-page">
            <Headline id="user-page-header" text="Clients" />
            <div id="table-warper">
                <div id="button-warper">
                    <Button
                        className="add-client-btn"
                        onClick={openModal}
                        text={<i class="fa fa-user-plus"></i>}
                    />
                </div>
                <Table columns={columns} data={data} />
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    // appElement={}
                    contentLabel="Example Modal"
                    className="modal"
                >
                    <AddClient />
                </Modal>
            </div>
        </div>
    )
}

export default Clients;