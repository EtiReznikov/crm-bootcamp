import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Table from '../SubComponents/Table/Table';
import Headline from '../SubComponents/Headline/Headline';
import './ChatPage.scss'
function ChatPage(props) {
    const [allConnections, setAllConnections] = useState([]);
    const [data, setData] = useState([])
    const [crmSocketId, setCrmSocketId] = useState("");

    const chatURL = 'http://localhost:9034/crmChat'
    const columns = useMemo(() => [
        {
            Header: "Link",
            accessor: "link",
        },

    ], []
    );

    const getAllConnections = () => {
        axios.get('http://localhost:9034/allConnections')
            .then((response) => {
                console.log(response.data);
                setAllConnections(response.data)
            }).catch((error) => {
                console.log(error)
            });
    }

    // const getCRMSocketId = () => {
    //     axios.get('http://localhost:9034/crmSocketId')
    //         .then((response) => {
    //             console.log(response)
    //             console.log("id" + response.data)
    //             setCrmSocketId(response.data)
    //         }).catch((error) => {
    //             console.log(error)
    //         });
    // }

    useEffect(() => {
        let data = []
        for (const connection of allConnections) {
            data.push({
                link: <a className="chat-link" href={chatURL + "?room=" + connection.key} >
                    <i id="chat-icon" className="fa fa-comments"></i>
                </a>
            }
            )
        }
        setData(data);

    }, [allConnections]);


    useEffect(() => {
        const interval = setInterval(() => {
            // getCRMSocketId();
            getAllConnections()
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div id="chats-page" className="page-wrapper">
            <div id="btn-head-wrapper">
                <Headline id="chat-page-head" text="Active Chats" />
            </div>
            <div id="table-wrapper">
                <Table columns={columns} data={data} />
            </div>
            {/* <iframe src='http://localhost:9034/crmChat'></iframe> */}
            <script src='http://localhost:9034/crmChat'></script>
        </div>
    );
}

export default ChatPage;