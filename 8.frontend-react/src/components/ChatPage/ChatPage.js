import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Table from '../SubComponents/Table/Table';
import Headline from '../SubComponents/Headline/Headline';
import './ChatPage.scss'
function ChatPage(props) {
    const [allConnections, setAllConnections] = useState(() => new Set());
    const [data, setData] = useState([])
    const [isIframe, setIsIframe] = useState(false);
    const [iframe, setIframe] = useState(null);


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
                setAllConnections(response.data)
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
            case 'leadData':
                console.log(evt.leadData)
                break;
        }
    }


    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);
        getAllConnections();
    }, []);

    useEffect(() => {
        console.log(allConnections)
        let data = []
        for (const connection of allConnections) {
            data.push({
                link:
                    <button className="chat-link" onClick={() => { openIframe(chatURL + "?room=" + connection) }}>
                        <i id="chat-icon" className="fa fa-comments"></i>
                    </button>
                // <a className="chat-link" href={chatURL + "?room=" + connection.key} >

                // </a>
            }
            )
        }
        setData(data);

    }, [allConnections]);



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
            <iframe id="chat-iframe-loader" src='http://localhost:9034/crmChat'></iframe>
            <script src='http://localhost:9034/crmChat'></script>
        </div>
    );
}

export default ChatPage;