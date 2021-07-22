import React, { useState, useEffect } from 'react';
import '../../../Views/Form.scss'
import Table from '../../SubComponents/Table/Table';
import axios from 'axios';
import './PaymentHistory.scss'
import moment from 'moment';
function PaymentHistory(props) {
    const [data, setData] = useState([]);
    const [errorMsg, setError] = useState(false);

    const columns = [
        {
            Header: "Type",
            accessor: "type",
        },
        {
            Header: 'Price',
            accessor: "price"
        },
        {
            Header: 'Payment Date',
            accessor: "payment_date"
        },
    ]

    useEffect(() => {
        let data = [];
        (async () => {
            await axios.post('http://localhost:991/payments/getPaymentsByClient/', {
                clientId: props.clientData.client_id
            })
                .then((response) => {

                    if (response.data === "")
                        setData([]);
                    else if (Array.isArray(response.data)) {
                        for (const paymentValue of response.data) {
                            let startDate = moment(paymentValue.start_date).format("DD/MM/YY");
                            let endDate = moment(paymentValue.end_date).format("DD/MM/YY");
                            let temp = {
                                type: paymentValue.type === 'package' ? `Package | ${paymentValue.name} | ${startDate}-${endDate} ` : `Personal Training | ${paymentValue.name} |  ${startDate}`,
                                price: paymentValue.price,
                                payment_date: paymentValue.date
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
        <div className="form_wrapper" id="payment-history">

            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>


            <div className="form_container">
                <div className="title_container">
                    <h2 id="payment-history-headline">{props.clientData.client_name} Payment History</h2>
                    {
                        data.length === 0 ? <div> The client doesn't have payment history</div> :
                            <Table columns={columns} data={data} isSort={true} isPagination={true} />
                    }
                </div>
            </div>

        </div>

    );
}



export default PaymentHistory;