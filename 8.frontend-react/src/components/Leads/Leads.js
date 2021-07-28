import React, { useEffect, useState, useMemo } from 'react';
import Table from '../SubComponents/Table/Table';
import axios from 'axios';
import Headline from '../SubComponents/Headline/Headline'
import './Leads.scss';
import ErrorComponent from '../SubComponents/ErrorComponenet/ErrorComponent';
function Leads(props) {

    const [modalIsOpenAddClient, setIsOpenAddClientModal] = useState(false);
    const [modalIsOpenRemoveClient, setIsOpenRemoveClientModal] = useState(false);
    const [modalIsOpenAddImg, setIsOpenAddImgModal] = useState(false);
    const [modalIsOpenStore, setIsOpenStoreModal] = useState(false);
    const [modalIsOpenPaymentHistory, setIsOpenPaymentHistoryModal] = useState(false)
    const [row, setRow] = useState("");
    const [dataHasChanged, setDataHasChanged] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [errorMsg, setError] = useState(false);
    const [ErrorDelete, setErrorDelete] = useState(false);
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
        }
    ]
    );

    function changeDataState() {
        setDataHasChanged(!dataHasChanged);
    }

    useEffect(async () => {
        const leads = await getLeads();
    }, [dataHasChanged]);

    const getLeads = () => {
        return new Promise(resolve => {
            axios.post('http://crossfit.com:8004/leads', "", {
                business_id: localStorage.getItem('business_id'),
            })
                .then((response) => {
                    let data = []
                    for (const leadsValue of response.data) {
                        let temp = {
                            name: leadsValue.name,
                            phone: leadsValue.phone_number,
                            email: leadsValue.email,
                            gender: leadsValue.gender === 'f' ? <i id="gender-icon" className="fa fa-female"></i> : <i id="gender-icon" className="fa fa-male"></i>,
                            more_info: leadsValue.more_info,
                            update_confirm: leadsValue.update_confirm === 't' ? <i id="confirm-msg-icon" className="fa fa-check"></i> :  <i id="confirm-msg-icon" className="fa fa-times"></i> 
                        }
                        data.push(temp)
                    }
                    console.log(data)
                    setData(data);
                    resolve(data);
                })
                .catch(function (error) {
                    resolve(error)
                })
        })
    }



    return (
        <div id="leads-page" className="page-wrapper">
            {!errorMsg &&
                <>
                    <div id="btn-head-wrapper">
                        <Headline id="leads-page-head" text="Leads" />
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
        </div>
    )
}

export default Leads;