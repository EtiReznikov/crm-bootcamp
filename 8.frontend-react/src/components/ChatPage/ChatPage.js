import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Table from '../SubComponents/Table/Table';
import Headline from '../SubComponents/Headline/Headline';
import Modal from 'react-modal';
import AddLead from '../Leads/addLead/addLead'
import './ChatPage.scss'
import AddClient from '../Clients/AddClient/AddClient'
import { map } from 'async';
function ChatPage(props) {
    const [allConnections, setAllConnections] = useState(() => new Set());
    const [activeChatsData, setActiveChatsData] = useState([])
    const [oldChatsData, setOldChatsData] = useState([])
    const [iframe, setIframe] = useState(null);
    const [leadData, setLeadData] = useState({});
    const [modalIsOpenAddLead, setIsOpenAddLeadModal] = useState(false);
    const [modalIsOpenAddClient, setIsOpenAddClientModal] = useState(false);
    const [oldChats, setOldChats] = useState(() => new Set());
    const [allChats, setAllChats] = useState(() => new Set());
    const [allChatMessages, setAllChatMessages] = useState([]);
    const chatURL = 'http://localhost:9034'
    const [oldChatsHasChanged, setOldChatsHasChanged] = useState(false);
    const columnsActiveChats = useMemo(() => [
        {
            Header: "Chat",
            accessor: "link",
        },
    ], []
    );

    const columnsOldChats = useMemo(() => [
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

    function getAllRooms() {
        return new Promise(resolve => {
            axios.get('http://localhost:9034/getAllRooms')
                .then((response) => {
                    resolve(new Set(response.data))
                }).catch((error) => {
                    console.log(error)
                });
        })
    }

    const updateOldSets = () => {
        let diff = Array.from(allChats).filter(x => !allConnections.has(x))
        setOldChats(diff)
    }

    const openIframe = (link) => {
        setIframe(link);
    }

    function getOldChatMessages(connection) {
        axios.get('http://localhost:9034/getMessagesByRoom', {
            headers: { roomId: connection }
        }
        )
            .then(function (response) {
                let dataMsgs = [];
                for (const messageValue of response.data) {
                    let temp = {
                        msg: messageValue.msg,
                        isFromCrm: messageValue.isFromCrm,
                        time: messageValue.time
                    }
                    dataMsgs.push(temp)
                }
                setAllChatMessages(dataMsgs)
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    async function receiveMessage(evt) {
        let rooms;
        switch (evt.data.type) {
            case 'newRoom':
                setAllConnections(allConnections =>
                    new Set(allConnections).add(evt.data.room));
                rooms = await getAllRooms();
                setAllChats(rooms);
                break;
            case 'disconnected':
                setAllConnections(allConnections => {
                    const temp = new Set(allConnections);
                    temp.delete(evt.data.room)
                    return temp;
                });
                rooms = await getAllRooms();
                setAllChats(rooms);
                break;
            case 'newLead':
                setLeadData(evt.data.leadData.data)
                openModalAddLead();
                break;
            case 'newUser':
                setLeadData(evt.data.leadData.data)
                openModalAddClient();
                break;
        }
    }

    useEffect(() => {
        let data = []
        for (const connection of oldChats) {
            data.push({
                link:
                    <button className="chat-link" onClick={() => {
                        setOldChatsHasChanged(!oldChatsHasChanged);
                        getOldChatMessages(connection)
                    }}>
                        <i id="chat-icon" className="fa fa-comments"></i>
                    </button>
            }
            )
        }
        setOldChatsData(data);
    }, [oldChats]);

    useEffect(() => {
        updateOldSets();
    }, [allChats, oldChatsHasChanged]);


    useEffect(async () => {
        window.addEventListener("message", receiveMessage, false);
        getAllConnections();
        let rooms = await getAllRooms();
        setAllChats(rooms);
    }, []);

    useEffect(() => {
        let data = []
        for (const connection of allConnections) {
            data.push({
                link:
                    <button className="chat-link" onClick={() => { openIframe(chatURL + "/crmChat?room=" + connection) }}>
                        <i id="chat-icon" className="fa fa-comments"></i>
                    </button>
            }
            )
        }
        setActiveChatsData(data);
    }, [allConnections]);


    const openModalAddLead = () => {
        setIsOpenAddLeadModal(true);
    }

    const closeModalAddLead = () => {
        setIsOpenAddLeadModal(false);
    }

    const openModalAddClient = () => {
        setIsOpenAddClientModal(true);
    }

    const closeModalAddClient = () => {
        setIsOpenAddClientModal(false);
    }


    return (
        <div id="chats-page" className="page-wrapper">
            <div id="btn-head-wrapper">
                <Headline id="chat-page-head" text="Active Chats" />
            </div>
            <div id="chat-table-wrapper">
                <div id="table-wrapper">
                    <Table columns={columnsActiveChats} data={activeChatsData} isPagination={true} isSort={true} />
                </div>
                <iframe id="chat-iframe" src={iframe}></iframe>
            </div>

            <div id="btn-head-wrapper">
                <Headline id="chat-page-head" text="Chats History" />
            </div>
            <div id="chat-table-wrapper">
                <div id="table-wrapper">
                    <Table columns={columnsOldChats} data={oldChatsData} isPagination={true} isSort={true} />
                </div>
                <div id="chat-history">
                    <div id="chat-wrapper-history">
                        <ul id="messages">
                            {
                                allChatMessages.map(
                                    (element, key) => {
                                        return (
                                            <li key={element.time}>
                                                <div id={element.isFromCrm ? "FromCrm" : "FromLead"} >
                                                    {element.isFromCrm ? "You: " : "Lead: "}
                                                </div>
                                                <div id={element.isFromCrm ? "msgFromCrm" : "msgFromLead"}>
                                                    {element.msg}
                                                </div>
                                                <div id="time">
                                                    {element.time}
                                                </div>
                                            </li>
                                        );
                                    }
                                )
                            }
                        </ul>
                        <div id="fallback"></div>
                    </div>
                </div >
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

            <Modal
                isOpen={modalIsOpenAddClient}
                onRequestClose={closeModalAddClient}
                contentLabel="Add Client Modal"
                className="modal"
                ariaHideApp={false}
            >
                <AddClient closeModal={closeModalAddClient} clientData={leadData} isFromLandingPage={true} />
            </Modal>
            <iframe id="chat-iframe-loader" src='http://localhost:9034/crmChat'></iframe>
            {/* <script src='http://localhost:9034/crmChat'></script> */}
        </div >
    );
}

export default ChatPage;