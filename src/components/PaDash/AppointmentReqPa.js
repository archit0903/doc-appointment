import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AppointmentReqPa = ({ patientName }) => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [doctorUnavailable, setDoctorUnavailable] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const patient = patientName;
  useEffect(() => {
    // Fetch specialties and locations when the component mounts
    fetchSpecialties();
    fetchLocations();
    fetchAllDoctors(); // Fetch all doctors on component mount
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/specialties');
      if (response.status === 200) {
        const data = response.data;
        setSpecialties(data.specialties);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations');
      if (response.status === 200) {
        const data = response.data;
        setLocations(data.locations);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFindDoctors = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/find-doctors', {
        location,
        specialty,
      });

      if (response.status === 200) {
        const data = response.data;
        
        // Set the list of available doctors based on the response
        setAvailableDoctors(data.doctors);

        // Check if doctors are available
        if (data.doctors.length === 0) {
          setDoctorUnavailable(true);
          setSelectedDoctor('');
        } else {
          setDoctorUnavailable(false);
        }
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/all-doctors');
      if (response.status === 200) {
        const data = response.data;
        // Set the list of all doctors
        setAvailableDoctors(data.doctors);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSelectDoctor = (doctorName) => {
    setSelectedDoctor(doctorName);
  };

  const resetForm = () => {
    setLocation('');
    setSpecialty('');
    setSelectedDoctor('');
    setSelectedDate('');
    setProblemDescription('');
  };

  const handleRequestAppointment = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/appointment-requests', {
        doctorName: selectedDoctor,
        selectedDate,
        problemDescription,
        patientName: patient, // You may need to pass the patient's name
      });

      if (response.status === 200) {
        const data = response.data;
        // Handle success and reset the form
        resetForm();
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 400 && error.response.data.error === 'Selected date is unavailable') {
        setDoctorUnavailable(true);
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h3>Appointment Request</h3>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="location">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    as="select"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="specialty">
                  <Form.Label>Specialty:</Form.Label>
                  <Form.Control
                    as="select"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" onClick={handleFindDoctors}>
                  Find Doctors
                </Button>
              </Form>
              {doctorUnavailable && (
                <Alert variant="warning">
                  No doctors available with the specified filters or the selected date is unavailable.
                </Alert>
              )}
              {!doctorUnavailable && (
                <Row>
                  <Col>
                    <h5>Select Doctor:</h5>
                    <ul>
                      {/* Map through available doctors */}
                      {availableDoctors.map((doctor) => (
                        <li key={doctor.id}>
                          <Button
                            variant="link"
                            onClick={() => handleSelectDoctor(doctor.name)}
                          >
                            Dr. {doctor.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              )}
              {!doctorUnavailable && (
                <Form>
                  <Form.Group controlId="selectedDoctor">
                    <Form.Label>Selected Doctor:</Form.Label>
                    <Form.Control type="text" value={selectedDoctor} readOnly />
                  </Form.Group>
                  <Form.Group controlId="selectedDate">
                    <Form.Label>Select Date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="problemDescription">
                    <Form.Label>Problem Description:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handleRequestAppointment}>
                    Request Appointment
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentReqPa;
