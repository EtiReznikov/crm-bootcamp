import React, { useEffect, useState, useMemo } from 'react';
import Table from '../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../SubComponents/Headline/Headline'
import './Leads.scss';
import Modal from 'react-modal';
import ErrorComponent from '../SubComponents/ErrorComponenet/ErrorComponent';
import SendEmail from './SendEmails/SendEmail';
import SendSms from './sendSms/SendSms';
import io from "socket.io-client";
import { dateFormattingDayByMonth } from '../../tools/dateCalculate';
function Leads(props) {

    const socket = io("localhost:4002");
    const [modalIsOpenSendEmail, setIsOpenSendEmailModal] = useState(false);
    const [modalIsOpenSendSms, setIsOpenSendSmsModal] = useState(false);
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [data, setData] = useState([]);
    const [confirmEmails, setConfirmEmails] = useState([]);
    const [confirmSms, setConfirmSms] = useState([]);
    const [errorMsg, setError] = useState(false);
    const columns = useMemo(() => [
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: 'Phone',
            accessor: "phone"
        },
        {
            Header: 'Email',
            accessor: "email"
        },
        {
            Header: 'Gender',
            accessor: "gender"
        },
        {
            Header: 'More Information',
            accessor: "more_info"
        },
        {
            Header: 'Updates confirm',
            accessor: "update_confirm"
        },
    ]
    );


    function changeDataState() {
        setDataHasChanged(!dataHasChanged);
    }
    socket.on("emailStatus", function (id, flag) {
        updateEmailStatus(id, flag)
    });

    const updateEmailStatus = (id, flag) => {
        var index = data.findIndex(row => row.id === id);
        let tempData = data.slice();
        if (index != -1) {
            if (flag)
                tempData[index].update_confirm = <i id="confirm-msg-icon-green" className="fa fa-check"></i>
            else
                tempData[index].update_confirm = <i id="confirm-msg-icon-red" className="fa fa-check"></i>
            setData(tempData)
        }
    }

    const setEmailData = (subject, content) => {
        axios.post('http://localhost:3030/sendEmails', {
            confirmEmails,
            subject,
            content
        });
    }

    const setSmsData = (content) => {
        axios.post('http://localhost:3030/sendSms', {
            confirmSms,
            content
        });
    }
    useEffect(async () => {
        const leads = await getLeads();
    }, [dataHasChanged]);

    const getLeads = () => {
        return new Promise(resolve => {
            axios.post('http://localhost:8004/leads', "", {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {

                    let data = [];
                    let confirmEmails = [];
                    let confirmSms = [];
                    let id = 0;
                    for (const leadsValue of response.data) {
                        let temp = {
                            id: id,
                            name: leadsValue.name,
                            phone: leadsValue.phone_number,
                            email: leadsValue.email,
                            gender: leadsValue.gender === 'f' ? <i id="gender-icon" className="fa fa-female"></i> : <i id="gender-icon" className="fa fa-male"></i>,
                            more_info: leadsValue.more_info,
                            update_confirm: leadsValue.update_confirm === 't' ? <i id="confirm-msg-icon" className="fa fa-check"></i> : <i id="confirm-msg-icon" className="fa fa-times"></i>
                        }
                        data.push(temp)
                        if (leadsValue.update_confirm === 't') {
                            confirmEmails.push({ email: leadsValue.email, id: id })
                            confirmSms.push({ phoneNumber: leadsValue.phone_number, id: id })
                        }
                        id++;
                    }
                    setData(data);
                    setConfirmEmails(confirmEmails)
                    setConfirmSms(confirmSms)
                    resolve(data);
                })
                .catch(function (error) {
                    resolve(error)
                })
        })
    }

    const openModalSendEmail = () => {
        setIsOpenSendEmailModal(true);
    }

    const closeModalSendEmail = () => {
        setIsOpenSendEmailModal(false);
    }
    const openModalSendSms = () => {
        setIsOpenSendSmsModal(true);
    }

    const closeModalSendSms = () => {
        setIsOpenSendSmsModal(false);
    }



    return (
        <div id="leads-page" className="page-wrapper">
            {!errorMsg &&
                <>

                    <div id="btn-head-wrapper">
                        <Headline id="leads-page-head" text="Leads" />
                        <div id="button-wrapper">
                            <button className="add-row" onClick={() => {
                                openModalSendEmail();
                            }}>
                                Send Email
                            </button>
                            <button className="add-row" onClick={() => {
                                openModalSendSms();
                            }}>
                                Send SMS
                            </button>
                        </div>
                    </div>

                    <div id="table-wrapper">
                        <Table columns={columns} data={data} isPagination={true} isSort={true} />
                    </div>
                </>
            }
            {errorMsg &&
                <>
                    <Headline id="user-page-header" text="Clients" />
                    <ErrorComponent text="Error" />
                </>}
            <Modal
                isOpen={modalIsOpenSendEmail}
                onRequestClose={closeModalSendEmail}
                contentLabel="Add User Modal"
                className="modal"
                ariaHideApp={false}
            >
                <SendEmail closeModal={closeModalSendEmail} setEmailData={setEmailData} />
            </Modal>
            <Modal
                isOpen={modalIsOpenSendSms}
                onRequestClose={closeModalSendSms}
                contentLabel="Add User Modal"
                className="modal"
                ariaHideApp={false}
            >
                <SendSms closeModal={closeModalSendSms} setSmsData={setSmsData} />
            </Modal>
        </div>
    )
}

export default Leads;