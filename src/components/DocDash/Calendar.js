import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ doctorName }) => {
  const [appointments, setAppointments] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableDate, setUnavailableDate] = useState('');

  // Function to fetch appointment dates for the doctor
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${doctorName}`);
      if (response.status === 200) {
        const data = response.data;
       
        // Map the received data to adjust the date format
        const formattedAppointments = data.appointments.map((appointment) => ({
          title: appointment.name,
          start: new Date(appointment.date),
          end: new Date(appointment.date),
        }));

        setAppointments(formattedAppointments);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch unavailable dates for the doctor
  const fetchUnavailableDates = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/unavailable-dates/${doctorName}`);
      if (response.status === 200) {
        const data = response.data;
        
        // Map the received data to adjust the date format
        const formattedDates = data.unavailableDates.map((appointment) => ({
          title: 'Unavailable',
          start: new Date(appointment.date),
          end: new Date(appointment.date),
        }));
        
        setUnavailableDates(formattedDates);
      } else {
        
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  
  useEffect(() => {
    fetchAppointments();
    fetchUnavailableDates();
  }, [doctorName]);

  // Function to handle adding unavailable dates
  const handleAddUnavailableDate = async () => {
    if (unavailableDate) {
      try {
        // Send the date as it is, assuming it's already in the correct format ("YYYY-MM-DD")
        await axios.post(`http://localhost:5000/api/unavailable-dates/${doctorName}`, {
          date: unavailableDate,
        });

        // Update the unavailable dates state
        setUnavailableDates([...unavailableDates, new Date(unavailableDate)]);
        setUnavailableDate('');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>Appointment Calendar</h2>

      {/* Display Calendar */}
      <Calendar
       
       localizer={localizer}
       events={[
         ...appointments.map((appointment) => ({
           title: appointment.title,
           start: appointment.start,
           end: appointment.end,
           color: 'blue', // Set the color for appointments
         })),
         ...unavailableDates.map((unav) => ({
           title: 'Unavailable',
           start: unav.start,
           end: unav.end,
           color: 'black', // Set the color for unavailable dates
         })),
       ]}
       startAccessor="start"
       endAccessor="end"
       style={{ height: 500 }}
     
     
      />

      {/* Add Unavailable Dates */}
      <Form.Group controlId="unavailableDate">
        <h3>
          <Form.Label>Add Unavailable Dates:</Form.Label>
        </h3>
        <Form.Control
          type="date"
          value={unavailableDate}
          onChange={(e) => setUnavailableDate(e.target.value)}
        />
        <Button onClick={handleAddUnavailableDate}>Add</Button>
      </Form.Group>
    </div>
  );
};

export default CalendarComponent;
