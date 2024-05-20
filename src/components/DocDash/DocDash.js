import React from 'react'; // Import useParams
import Header from './Header';
import AppointmentList from './AppointmentList';
import Calendar from './Calendar';
import Notification from './Notification';
import AppointmentRequest from './AppointmentRequest';
import AppointmentDetails from './AppointmentDetails';
import { Container, Row, Col } from 'react-bootstrap';

const DoctorDashboard = () => {
  // Get the doctor's name from the URL params
  const params = new URLSearchParams(window.location.search);
  const doctorName = params.get('name');
  return (
    <>
      <Header doctorName={doctorName} />
      <Container>
        <Row>
          <AppointmentList doctorName={doctorName} />
        </Row>
        <Row>
          <Calendar doctorName={doctorName} />
        </Row>
        <Row>
          <AppointmentDetails doctorName={doctorName}  />
        </Row>
        <Row>
          <Col><AppointmentRequest doctorName={doctorName} /></Col>
          <Col><Notification doctorName={doctorName}  /></Col>
        </Row>
      </Container>
    </>
  );
};

export default DoctorDashboard;
