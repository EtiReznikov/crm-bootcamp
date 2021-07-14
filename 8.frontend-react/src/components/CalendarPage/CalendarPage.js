import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Headline from '../SubComponents/Headline/Headline';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getNextDay } from '../../tools/dateCalculate';
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

  const [myEventsList, setEventsList] = useState([]);

  useEffect(() => {
    (async () => {
      await axios.post('http://localhost:991/classes/getClasses/', {
        business_id: localStorage.getItem('business_id'),
      })
        .then((response) => {
          let data = []
          for (const classValue of response.data) {
            let obj = JSON.parse(classValue.days_and_time)
            for (let week=-10; week<10; week++){
            for (const day of obj.days) {
              let temp = {
                'title': classValue.class_name,
                'color': classValue.color,
                'start': getNextDay(day, parseInt(obj.hours), parseInt(obj.min), week),
                'end': getNextDay(day, parseInt(obj.hours)+1, parseInt(obj.min), week),
                // days: days,
                // time: obj.hours + ":" + obj.min
              }
              data.push(temp)
            }
          }
          }
          setEventsList(data);
        })
        .catch(function (error) {

        });
    })();
  }, []);


  return <div id="calendar-page" className="page-wrapper">
    <Headline id="calendar-page-header" text="Calendar" />
    <Calendar
      views={['month', 'week','day']}
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ width: "100%", height: "85%" }}
      eventPropGetter={(eventStyleGetter)}
    />
  </div>
}

export default CalendarPage;