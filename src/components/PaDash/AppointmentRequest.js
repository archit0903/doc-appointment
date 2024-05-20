import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AppointmentRequest = ({ patientName }) => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
    
  useEffect(() => {
    // Fetch appointment requests when the component mounts
    fetchAppointmentRequests();
  }, []);

  const fetchAppointmentRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/requests/${patientName}`);

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setRequests(data.requests || []); // Initialize with an empty array if requests are undefined
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveRequest = async (selectedDate) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/appointment-requests/${patientName}/${selectedDate}`);

    if (response.status === 200) {
      // Remove the request from the state
      setRequests((prevRequests) => prevRequests.filter((request) => request.date !== selectedDate)); // Compare as strings
    } else {
      // Handle error
    }
  } catch (error) {
    console.error(error);
  }
};

  
  const handleStatusFilterChange = (e) => {
    // Update the status filter when the user selects a different option
    setStatusFilter(e.target.value);
  };

  const filteredRequests = statusFilter === 'All' ? requests : requests.filter((request) => request.status === statusFilter);

  return (
    <Container>
      <Row>
        <Col>
          <h3>Appointment Requests</h3>
          <Form.Group controlId="statusFilter">
            <Form.Label>Filter by Status:</Form.Label>
            <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </Form.Control>
          </Form.Group>
          {filteredRequests.map((request) => (
            <Card key={request._id}>
              <Card.Body>
                <Card.Title>Dr. {request.doctorName}</Card.Title>
                <Card.Text>
                  Date: {request.date} <br />
                  Status: {request.status}
                </Card.Text>
                <Button
                  variant="danger"
                  style={{ float: 'right' }}
                  onClick={() => handleRemoveRequest(request.date)}
                >
                  &#10005;
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentRequest;
