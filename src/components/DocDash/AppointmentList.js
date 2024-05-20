import React, { useState, useEffect } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const AppointmentList = ({ doctorName }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments for the specified doctorName using Axios
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${doctorName}`);
        if (response.status === 200) {
          setAppointments(response.data.appointments);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, [doctorName]);

  // Define state to track expanded appointments
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  // Function to handle expanding/collapsing an appointment
  const toggleAppointment = (id) => {
    if (expandedAppointment === id) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(id);
    }
  };

  return (
    <div>
      <h2>Appointment List</h2>
      {appointments.map((appointment) => (
        <Card key={appointment._id} style={{ marginBottom: '10px' }}>
          <Card.Header
            style={{ cursor: 'pointer' }}
            onClick={() => toggleAppointment(appointment._id)}
          >
            {appointment.date} - {appointment.name}
          </Card.Header>
          {expandedAppointment === appointment._id && (
            <Card.Body>
              <Card.Title>Appointment Details</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Date: {appointment.date}</ListGroup.Item>
                <ListGroup.Item>Name: {appointment.name}</ListGroup.Item>
                <ListGroup.Item>Problem: {appointment.problem}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          )}
        </Card>
      ))}
    </div>
  );
};

export default AppointmentList;
