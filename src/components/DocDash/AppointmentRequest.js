import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';

const AppointmentRequest = ({ doctorName }) => {
  const [appointmentRequests, setAppointmentRequests] = useState([]);

  useEffect(() => {
    // Fetch appointment requests when the component mounts
    fetchAppointmentRequests();
  }, []);

  const fetchAppointmentRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointment-requests/${doctorName}`);
      if (response.status === 200) {
        const data = response.data;
        console.log(data.appointmentRequests);
        setAppointmentRequests(data.appointmentRequests);
      } else {
        // Handle error
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Update handleApproveRequest
const handleApproveRequest = async (request) => {
  try {
    
    await axios.put(`http://localhost:5000/api/appointment-requests/${doctorName}/approve`, {
      doctorName,
      patientName: request.patientName,
      date: request.date,
    });

    // Fetch updated appointment requests
    fetchAppointmentRequests();
  } catch (error) {
    console.error(error);
  }
};

// Update handleDenyRequest
const handleDenyRequest = async (request) => {
  try {
    await axios.put(`http://localhost:5000/api/appointment-requests/${doctorName}/deny`, {
      doctorName,
      patientName: request.patientName,
      date: request.date,
    });

    // Fetch updated appointment requests
    fetchAppointmentRequests();
  } catch (error) {
    console.error(error);
  }
};

// Update handleRemoveRequest
const handleRemoveRequest = async (request) => {
  try {
    // Remove the request from the list
    setAppointmentRequests((prevRequests) =>
      prevRequests.filter((req) => req !== request)
    );

    await axios.delete(`http://localhost:5000/api/appointment-requests/${doctorName}/remove`, {
      data: {
        doctorName,
        patientName: request.patientName,
        date: request.date,
      },
    });
  } catch (error) {
    console.error(error);
  }
};


return (
  <div>
    <h2>Appointment Requests</h2>
    {appointmentRequests.map((request) => (
      <Card key={request._id} style={{ marginBottom: '10px' }}>
        <Card.Body style={{ position: 'relative' }}>
          {request.status !== 'Pending' && (
            <Button
              variant="danger"
              onClick={() => handleRemoveRequest(request)}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              &#10005;
            </Button>
          )}
          <Card.Title>Date: {request.date}</Card.Title>
          <Card.Text>Problem Description: {request.problemDescription}</Card.Text>
          {request.status === 'Pending' && (
            <div>
              <Button
                variant="success"
                onClick={() => handleApproveRequest(request)}
                style={{ marginRight: '10px' }}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDenyRequest(request)}
              >
                Deny
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    ))}
  </div>
);

};

export default AppointmentRequest;
