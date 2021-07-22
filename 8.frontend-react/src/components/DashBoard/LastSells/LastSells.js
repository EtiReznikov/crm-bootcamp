import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import './LastSells.scss';
import ErrorDashboard from '../ErrorDashboard/ErrorDashBoard';
import Table from '../../SubComponents/Table/Table';
function LastSells(props) {

    const [data, setData] = useState([]);
    const [errorState, setError] = useState(false);

    const columns = React.useMemo(() => [
        {
            Header: 'Date',
            accessor: "date"
        },
        {
            Header: 'Details',
            accessor: "details"
        },
        {
            Header: 'Price',
            accessor: "price"
        },
    ]);
    const getLastSells = () => {
        return new Promise(resolve => {
            let data = [];
            axios.post('http://localhost:991/dashboard/getFiveLastSells/', {
                businessId: localStorage.getItem('business_id'),
            }).then((response) => {
                if (response.data === "")
                    setData([]);
                else if (Array.isArray(response.data)) {
                    for (const paymentValue of response.data) {
                        let startDate = moment(paymentValue.start_date).format("DD/MM/YY");
                        let endDate = moment(paymentValue.end_date).format("DD/MM/YY");
                        let temp = {
                            date: paymentValue.date,
                            details: paymentValue.type === 'package' ? `Package | ${paymentValue.name} | ${startDate}-${endDate} ` : `Personal Training | ${paymentValue.name} |  ${startDate}`,
                            price: paymentValue.price +String.fromCharCode(0x20aa)
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
        })
    }

    useEffect(async () => {
        const totalPayment = await getLastSells();
        // setDataset([totalPayment, packagesPayment, personalTrainingsPayments])
        // setDataset ([personalTrainingsPayments, packagesPayment])
    }, [])


    return (
        <div id="last-sells" className="card">
            <div className="chart-title">
                Last Sells
            </div>
            {errorState && <ErrorDashboard></ErrorDashboard>}
            {
                !errorState &&
                <Table columns={columns} data={data} />
            }
        </div>
    );
}

export default LastSells;