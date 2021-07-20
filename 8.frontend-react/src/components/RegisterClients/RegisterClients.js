import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from 'react-avatar';
import Table from '../SubComponents/Table/Table';
import './RegisterClients.scss'
function RegisterClients(props) {
    const [data, setData] = useState([]);
    const [errorMsg, setError] = useState(false);
    const columns = [
        {
            Header: "Clients",
            accessor: "client_name_avatar",
        },

    ]


    useEffect(() => {
        let data = [];
        (async () => {
            await axios.post('http://localhost:991/classes/getRegisterToClass/', {
                classId: props.event.id,
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    if (response.data.length === 1 && response.data[0].client_name === null && response.data[0].file === null) {
                        setData([]);
                    }


                    else if (Array.isArray(response.data)) {
                        for (const clientValue of response.data) {
                            let temp = {
                                client_name_avatar: <div id="avatar-wrapper">
                                    <Avatar className="avatar" name={clientValue.client_name} src={'http://localhost:8005/uploads/' + clientValue.file} size="60" round={true} />
                                    <div id="name-row">{clientValue.client_name}</div>

                                </div>,
                            }
                            data.push(temp)
                        }
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
    }, []);

    return (
        <div className="form_wrapper" id="register-clients">

            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>

            <div className="form_container" id="register-clients-container">
                <div className="title_container">
                    <h2 id="register-clients-headline"> {props.event.title} </h2>
                    <div id="trainer-div">The trainer is: {props.event.trainer}</div>
                    {data.length > 0 && <Table columns={columns} data={data} />}
                    {data.length === 0 && <div>There are no register clients to this class.</div>}
                </div>
            </div>
        </div>
    )
}


export default RegisterClients;