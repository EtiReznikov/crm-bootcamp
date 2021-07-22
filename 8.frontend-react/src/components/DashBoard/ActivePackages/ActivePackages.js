
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import ErrorDashboard from '../ErrorDashboard/ErrorDashBoard';
import './ActivePackages.scss'

function PersonalTrainingPerTrainer(props) {
    const [state, setState] = useState({
        labels: [],
        datasets: [
            {}
        ]
    });
    const [errorState, setError] = useState(false);
    
    const getCountResult = () => {
        return new Promise(resolve => {

            axios.post('http://localhost:991/dashboard/countPackages/', {
                businessId: localStorage.getItem('business_id'),
            }).then((response) => {
                let dataset = [];
                let labels = [];
                for (const countValue of response.data) {
                    labels.push(countValue.package_name);
                    dataset.push(countValue.count)
                }

                setError(false);
                resolve({
                    labels: labels,
                    datasets: [
                        {
                            label: labels,
                            backgroundColor: [
                                'rgba(70, 212, 198, 0.4)',
                                'rgba(83, 77, 213, 0.4)',
                                'rgb(106, 210, 233, 0.4)',
                                'rgba(255, 99, 132, 0.4)',
                                'rgba(255, 159, 64, 0.4)',
                                'rgba(255, 206, 86, 0.4)',
                                'rgba(75, 192, 192, 0.4)',
                                'rgba(153, 102, 255, 0.4)',
                                'rgba(54, 162, 235, 0.4)',
                               
                            ],
                            borderColor: 'rgba(0,0,0,1)',
                            borderWidth: 2,
                            data: dataset,
                        },

                    ]
                }
                )
            }).catch((error) => {
                setError(true)
            });

        })
    }
    useEffect(async () => {
        const countResult = await getCountResult();
        setState({
            ...state,
            labels: countResult.labels,
            datasets: countResult.datasets
        })
    }, [])
    return (
        <div className="card">
            <div className="chart-title">
            Today Active packages
            </div>
            {errorState && <ErrorDashboard></ErrorDashboard>}
            <div  id="active-packages-wrapper">
                {!errorState &&
                    <Doughnut
                        data={state}
                    />
                }
            </div>
        </div>
    );
}
export default PersonalTrainingPerTrainer;