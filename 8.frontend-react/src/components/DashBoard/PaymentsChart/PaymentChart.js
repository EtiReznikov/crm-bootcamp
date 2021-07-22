import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import axios from 'axios';
import { dateFormattingDayByMonth } from '../../../tools/dateCalculate';
import ErrorDashboard from '../ErrorDashboard/ErrorDashBoard';
function PaymentChart(props) {

    const [labels, setLabels] = useState([]);
    const [datasets, setDataset] = useState([]);
    const [errorState, setError] = useState(false);


    const lastSevenDays = () => {
        var result = [];
        for (var i = 7; i >= 0; i--) {
            var day = new Date();
            day.setDate(day.getDate() - i);
            result.push(dateFormattingDayByMonth(moment(day).format('l')))
        }
        return result;
    }

    const getTotalPayments = (days, startDay, endDay) => {
        return new Promise(resolve => {
            axios.post('http://localhost:991/dashboard/getPaymentsByDates/', {
                businessId: localStorage.getItem('business_id'),
                startDate: startDay,
                endDate: endDay
            }).then((response) => {
                let data = [];
                let i = 0;
                let j = 0;
                while (j < response.data.length && i < days.length) {
                    if (days[i] === response.data[j].dateFormat) {
                        data.push(response.data[j].totalPayment)
                        j++;
                    }
                    else {
                        data.push(0)
                    }
                    i++
                }
                while (i < days.length) {
                    data.push(0)
                    i++
                }
                resolve(
                    {
                        label: 'Total Payments',
                        fill: false,
                        borderColor: '#210ec9',
                        tension: 0.1,
                        data: data
                    }
                )
            }).catch((error) => {
                setError(true)
            });

        })
    }

    const getTotalPaymentsForPackages = (days, startDay, endDay) => {
        return new Promise(resolve => {
            axios.post('http://localhost:991/dashboard/getPaymentsByDatesForPackages/', {
                businessId: localStorage.getItem('business_id'),
                startDate: startDay,
                endDate: endDay
            }).then((response) => {
                let data = [];
                let i = 0;
                let j = 0;
                while (j < response.data.length && i < days.length) {
                    if (days[i] === response.data[j].dateFormat) {
                        data.push(response.data[j].price)
                        j++;
                    }
                    else {
                        data.push(0)
                    }
                    i++
                }
                while (i < days.length) {
                    data.push(0)
                    i++
                }
                resolve(
                    {
                        label: 'Package Payments',
                        fill: false,
                        borderColor: '#00d4c6',
                        tension: 0.1,
                        data: data
                    }
                )
            }).catch((error) => {
                setError(true)
            });

        })
    }

    const getTotalPaymentsForPersonalTrainings = (days, startDay, endDay) => {
        return new Promise(resolve => {
            axios.post('http://localhost:991/dashboard/getPaymentsByDatesForPersonalTraining/', {
                businessId: localStorage.getItem('business_id'),
                startDate: startDay,
                endDate: endDay
            }).then((response) => {
                let data = [];
                let i = 0;
                let j = 0;
                while (j < response.data.length && i < days.length) {
                    if (days[i] === response.data[j].dateFormat) {
                        data.push(response.data[j].price)
                        j++;
                    }
                    else {
                        data.push(0)
                    }
                    i++
                }
                while (i < days.length) {
                    data.push(0)
                    i++
                }
                console.log(data)
                resolve(
                    {
                        label: 'Personal Trainings Payments',
                        fill: false,
                        borderColor: '#00bfdf',
                        tension: 0.1,
                        data: data
                    }
                )
            }).catch((error) => {
                setError(true)
            });

        })
    }

    useEffect(async () => {
        let days = lastSevenDays();
        setLabels(days);
        let startDate = days[0]
        let endDate = days[7];
        const totalPayment = await getTotalPayments(days, startDate, endDate);
        const packagesPayment = await getTotalPaymentsForPackages(days, startDate, endDate);
        const personalTrainingsPayments = await getTotalPaymentsForPersonalTrainings(days, startDate, endDate);
        setDataset([totalPayment, packagesPayment, personalTrainingsPayments])
        // setDataset ([personalTrainingsPayments, packagesPayment])



    }, [])


    return (
        <div className="card">
            <div className="chart-title">
                Revenue from last 7 days
            </div>
            {errorState && <ErrorDashboard></ErrorDashboard>}
            <div className="chart-wrapper">
                {!errorState &&
                    <Line
                        data={{ labels, datasets }}
                    />
                }
            </div>
        </div>
    );
}

export default PaymentChart;