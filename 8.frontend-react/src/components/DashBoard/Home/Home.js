import React, { useEffect } from 'react';
import './Home.scss'
import PaymentChart from '../PaymentsChart/PaymentChart'
import LastSells from '../LastSells/LastSells';
import PersonalTrainingPerTrainer from '../PersonalTrainingPerTrainers.js/PersonalTrainingPerTrainer';
import ActivePackages from '../ActivePackages/ActivePackages'
function Home(props) {

    useEffect(() => {
        const interval = setInterval(() => {
        }, 5000);
        return () => clearInterval(interval);
      }, []);

    return (<div id="dashboard-wrapper">
        <div id="right-wrapper">
        <PaymentChart />  
        <PersonalTrainingPerTrainer />
        </div>
        <div id="left-wrapper">
        <LastSells /> 
        <ActivePackages />
        </div>
    </div>
    );
}


export default Home;