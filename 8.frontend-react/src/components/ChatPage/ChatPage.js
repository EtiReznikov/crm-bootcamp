import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Table from '../SubComponents/Table/Table';
import Headline from '../SubComponents/Headline/Headline';
import Modal from 'react-modal';
import AddLead from '../Leads/addLead/addLead'
import './ChatPage.scss'
import { map } from 'async';
function ChatPage(props) {
    const [allConnections, setAllConnections] = useState(() => new Set());
    const [data, setData] = useState([])
    const [iframe, setIframe] = useState(null);
    const [leadData, setLeadData] = useState({});
    const [modalIsOpenAddLead, setIsOpenAddLeadModal] = useState(false);
    const [oldChats, setOldChats] = useState(() => new Set());

    const chatURL = 'http://localhost:9034/crmChat'
    const columns = useMemo(() => [
        {
            Header: "Chat",
            accessor: "link",
        },
    ], []
    );

    const getAllConnections = () => {
        axios.get('http://localhost:9034/allConnections')
            .then((response) => {
                let temp = new Set();
                response.data.forEach(room =>
                    temp.add(room.key)
                )
                setAllConnections(temp)
            }).catch((error) => {
                console.log(error)
            });
    }

    const openIframe = (link) => {
        setIframe(link);
    }


    function receiveMessage(evt) {
        switch (evt.data.type) {
            case 'newRoom':
                setAllConnections(allConnections =>
                    new Set(allConnections).add(evt.data.room));
                break;
            case 'disconnected':
                setAllConnections(allConnections => {
                    const temp = new Set(allConnections);
                    temp.delete(evt.data.room)
                    return temp;
                });
                break;
            case 'newLead':
                setLeadData(evt.data.leadData.data)
                openModalAddLead();
                break;
        }
    }


    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);
        getAllConnections();
    }, []);

    useEffect(() => {
        let data = []
        for (const connection of allConnections) {
            data.push({
                link:
                    <button className="chat-link" onClick={() => { openIframe(chatURL + "?room=" + connection) }}>
                        <i id="chat-icon" className="fa fa-comments"></i>
                    </button>
            }
            )
        }
        setData(data);
    }, [allConnections]);


    const openModalAddLead = () => {
        setIsOpenAddLeadModal(true);
    }

    const closeModalAddLead = () => {
        setIsOpenAddLeadModal(false);
    }


    return (
        <div id="chats-page" className="page-wrapper">
            <div id="btn-head-wrapper">
                <Headline id="chat-page-head" text="Active Chats" />
            </div>
            <div id="chat-table-wrapper">
                <div id="table-wrapper">
                    <Table columns={columns} data={data} />
                </div>
                <iframe id="chat-iframe" src={iframe}></iframe>
            </div>
            <Modal
                isOpen={modalIsOpenAddLead}
                onRequestClose={closeModalAddLead}
                contentLabel="Add Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <AddLead closeModal={closeModalAddLead} leadData={leadData} isFromLandingPage={true} />
            </Modal>
            <iframe id="chat-iframe-loader" src='http://localhost:9034/crmChat'></iframe>
            {/* <script src='http://localhost:9034/crmChat'></script> */}
        </div>
    );
}

export default ChatPage;