import React from 'react';
import Header from './Header';
import AppointmentReqPa from './AppointmentReqPa';
import Notification from './Notification';
import AppointmentRequest from './AppointmentRequest';
import PatientAppointments from './PatientAppointments';
import { Container, Row, Col } from 'react-bootstrap';

const PatientDashboard = () => {
  const params = new URLSearchParams(window.location.search);
  const patientName = params.get('name');
  return (
    <>
      <Header patientName={patientName} />
      <br></br>
      <Container>
        <Row>
          <Col>
            <Notification patientName={patientName} />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col>
            <PatientAppointments patientName={patientName} />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col>
            <AppointmentReqPa patientName={patientName}/>
          </Col>
        </Row><br></br>
        <Row>
          <Col>
            <AppointmentRequest patientName={patientName}/>
          </Col>
        </Row>
        
      </Container>
    </>
  );
};

export default PatientDashboard;
