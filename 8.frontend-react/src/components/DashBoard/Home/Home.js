import React from 'react';
import Headline from '../../SubComponents/Headline/Headline';
import './Home.scss'
import PaymentChart from '../PaymentsChart/PaymentChart'
import LastSells from '../LastSells/LastSells';
import PersonalTrainingPerTrainer from '../PersonalTrainingPerTrainers.js/PersonalTrainingPerTrainer';
import ActivePackages from '../ActivePackages/ActivePackages'
function Home(props) {

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