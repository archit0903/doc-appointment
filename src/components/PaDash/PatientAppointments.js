import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const PatientAppointments = ({ patientName }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch patient's appointments when the component mounts
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appoint/${patientName}`);

      if (response.status === 200) {
        const data = response.data;
        
        setAppointments(data.appointments || []);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Appointment List</h3>
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment._id}>
                <Card.Body>
                  <Card.Title>Dr. {appointment.doctorName}</Card.Title>
                  <Card.Text>
                    Date: {appointment.date}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PatientAppointments;
