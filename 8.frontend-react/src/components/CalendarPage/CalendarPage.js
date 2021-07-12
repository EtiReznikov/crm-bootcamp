import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Headline from '../SubComponents/Headline/Headline';
import "react-big-calendar/lib/css/react-big-calendar.css";
import './CalendarPage.scss';
const localizer = momentLocalizer(moment);
function CalendarPage(props) {

    const eventStyleGetter = function(event, start, end, isSelected) {
        console.log(event);
        var backgroundColor = '#' + event.hexColor;
        var style = {
            backgroundColor: event.color,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'black',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    }

    const myEventsList = [
        {
            'title': 'All Day Event very long title',
            'allDay': true,
            'start': new Date(2021, 6, 13),
            'end': new Date(2021, 6, 15),
            'color': "red"

          },
          {
            'title': 'Long Event',
            'start': new Date(2021, 7, 9),
            'end': new Date(2021, 7, 11)
          },
        
          {
            'title': 'DTS STARTS',
            'start': new Date(2016, 2, 13, 0, 0, 0),
            'end': new Date(2016, 2, 20, 0, 0, 0)
          },
        
          {
            'title': 'DTS ENDS',
            'start': new Date(2016, 10, 6, 0, 0, 0),
            'end': new Date(2016, 10, 13, 0, 0, 0)
          },
        
          {
            'title': 'Some Event',
            'start': new Date(2015, 3, 9, 0, 0, 0),
            'end': new Date(2015, 3, 9, 0, 0, 0)
          },
          {
            'title': 'Conference',
            'start': new Date(2015, 3, 11),
            'end': new Date(2015, 3, 13),
            desc: 'Big conference for important people'
          },
          {
            'title': 'Meeting',
            'start': new Date(2015, 3, 12, 10, 30, 0, 0),
            'end': new Date(2015, 3, 12, 12, 30, 0, 0),
            desc: 'Pre-meeting meeting, to prepare for the meeting'
          },
          {
            'title': 'Lunch',
            'start': new Date(2015, 3, 12, 12, 0, 0, 0),
            'end': new Date(2015, 3, 12, 13, 0, 0, 0),
            desc: 'Power lunch'
          },
          {
            'title': 'Meeting',
            'start': new Date(2015, 3, 12, 14, 0, 0, 0),
            'end': new Date(2015, 3, 12, 15, 0, 0, 0)
          },
          {
            'title': 'Happy Hour',
            'start': new Date(2015, 3, 12, 17, 0, 0, 0),
            'end': new Date(2015, 3, 12, 17, 30, 0, 0),
            desc: 'Most important meal of the day'
          },
          {
            'title': 'Dinner',
            'start': new Date(2015, 3, 12, 20, 0, 0, 0),
            'end': new Date(2015, 3, 12, 21, 0, 0, 0)
          },
          {
            'title': 'Birthday Party',
            'start': new Date(2015, 3, 13, 7, 0, 0),
            'end': new Date(2015, 3, 13, 10, 30, 0)
          },
          {
            'title': 'Birthday Party 2',
            'start': new Date(2015, 3, 13, 7, 0, 0),
            'end': new Date(2015, 3, 13, 10, 30, 0)
          },
          {
            'title': 'Birthday Party 3',
            'start': new Date(2015, 3, 13, 7, 0, 0),
            'end': new Date(2015, 3, 13, 10, 30, 0)
          },
          {
            'title': 'Late Night Event',
            'start': new Date(2015, 3, 17, 19, 30, 0),
            'end': new Date(2015, 3, 18, 2, 0, 0)
          },
          {
            'title': 'Multi-day Event',
            'start': new Date(2015, 3, 20, 19, 30, 0),
            'end': new Date(2015, 3, 22, 2, 0, 0)
          }
    ]
    return <div className="calendar-page">
         <Headline id="user-page-header" text="Calendar" />
        <Calendar
            
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{  width: "70%", height: "85%" }}
            eventPropGetter={(eventStyleGetter)}
        />
    </div>
}

export default CalendarPage;