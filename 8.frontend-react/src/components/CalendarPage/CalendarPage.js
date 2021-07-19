import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Headline from '../SubComponents/Headline/Headline';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getNextDay } from '../../tools/dateCalculate';
import Modal from 'react-modal';
import AddPersonalTraining from '../store/PersonalTrainings/AddPersonalTraining/AddPersonalTraining';
import  RegisterClients from '../RegisterClients/RegisterClients'
import './CalendarPage.scss';
const localizer = momentLocalizer(moment);
function CalendarPage(props) {

  const eventStyleGetter = function (event, start, end, isSelected) {
    var style = {
      backgroundColor: event.color,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'black',
      // border: '1px',
      // display: 'block'
    };
    return {
      style: style
    };
  }

  const [groupTrainingsList, setGroupTrainingsList] = useState([]);
  const [personalTrainingsList, setPersonalTrainingsList] = useState([]);
  const [modalIsOpenPersonalTraining, setIsOpenPersonalTrainingModal] = useState(false);
  const [modalIsOpenRegisterClients, setIsOpenRegisterClientsModal] = useState(false);
  const [view, setView] = useState("all");
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [event, setEvent] = useState("");

  useEffect(async () => {

    const classes = await getClasses();
    const personalTrainings = await getPersonalTrainings();
  }, [dataHasChanged]);

  const getClasses = () => {
    return new Promise(resolve => {
      axios.post('http://localhost:991/classes/getClasses/', {
        business_id: localStorage.getItem('business_id'),
      })
        .then((response) => {
          let data = []
          for (const classValue of response.data) {
            let obj = JSON.parse(classValue.days_and_time)
            for (let week = -10; week < 10; week++) {
              for (const day of obj.days) {
                let temp = {
                  'title': classValue.class_name,
                  'color': classValue.color,
                  'start': getNextDay(day, parseInt(obj.hours), parseInt(obj.min), week),
                  'end': getNextDay(day, parseInt(obj.hours) + 1, parseInt(obj.min), week),
                  id : classValue.class_id
                }
                data.push(temp)
              }
            }
          }
          setGroupTrainingsList(data);
          resolve(data);
        })
        .catch(function (error) {
          resolve(error)
        })


    })
  }

  const getPersonalTrainings = () => {
    return new Promise(resolve => {
      axios.post('http://localhost:991/personalTraining/getPersonalTraining/', {
        business_id: localStorage.getItem('business_id'),
      })
        .then((response) => {
          let data = []
          for (const classValue of response.data) {
            let start = new Date(classValue.date)
            let end = new Date(classValue.date);
            end.setHours(1 + end.getHours())
            let temp = {
              'title': classValue.client_name + " & " + classValue.user_name,
              'start': start,
              'end': end,
            }
            data.push(temp)
          }
          setPersonalTrainingsList(data);
          resolve(data);
        })
        .catch(function (error) {
          resolve(error)
        })


    })
  }

  function changeDataState() {
    setDataHasChanged(!dataHasChanged);
  }

  const openModalAddPersonalTraining = () => {
    setIsOpenPersonalTrainingModal(true);
  }

  const closeModalPersonalTraining = () => {
    setIsOpenPersonalTrainingModal(false);
  }

  const openModalRegisterClients = () => {
    setIsOpenRegisterClientsModal(true);
  }

  const closeModalRegisterClients  = () => {
    setIsOpenRegisterClientsModal(false);
  }


  return <div id="calendar-page" className="page-wrapper">
    <div id="calendar-wrapper">
      <Headline id="calendar-page-header" text="Calendar" />
      <div className="input_field" >
        <label htmlFor="views">View:</label>
        <select id="views" name="views" onChange={(e) => {
          setView(e.target.value)
        }
        }>
          <option defaultValue="selected" value="all">All</option>
          <option value="groupTrainings">Group Trainings</option>
          <option value="personalTrainings">Personal Trainings</option>
        </select>
      </div>
    </div>
    <Calendar
      views={['month', 'week', 'day']}
      localizer={localizer}
      events={view === 'all' ? personalTrainingsList.concat(groupTrainingsList) : view === 'groupTrainings' ? groupTrainingsList : personalTrainingsList}
      // events={groupTrainingsList.concat(personalTrainingsList)}
      startAccessor="start"
      endAccessor="end"
      selectable={true}
      onSelectSlot={
        (slot) => {
          console.log(slot)
          openModalAddPersonalTraining();
        }
      }
      onSelectEvent={(e)=>{
        setEvent(e);
        openModalRegisterClients();
      }}
      style={{ width: "100%", height: "85%" }}
      eventPropGetter={(eventStyleGetter)}
    />

    {/* <Modal
      isOpen={modalIsOpenPersonalTraining}
      onRequestClose={closeModalPersonalTraining}
      contentLabel="Add Personal Training Modal"
      className="modal"
      ariaHideApp={false}
    >
      <AddPersonalTraining closeModal={closeModalPersonalTraining} changeDataState={changeDataState} />
    </Modal> */}

    <Modal
      isOpen={modalIsOpenRegisterClients}
      onRequestClose={closeModalRegisterClients}
      contentLabel="Register Clients Modal"
      className="modal"
      ariaHideApp={false}
    >
      <RegisterClients closeModal={closeModalRegisterClients} changeDataState={changeDataState} event={event} />
    </Modal>
  </div>
}

export default CalendarPage;