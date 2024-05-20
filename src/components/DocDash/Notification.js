import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const Notification = ({ doctorName }) => {
  const [notificationText, setNotificationText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  // Fetch patients when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []);
  const doctor = doctorName;
  // Fetch patients for the dropdown
  // Fetch patients for the dropdown based on the doctor's name
const fetchPatients = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/api/patients/${doctorName}`);

    if (response.status === 200) {
      const data = response.data;
      // Set the list of patients in the state
      setPatients(data.patients);
    } else {
      // Handle error
    }
  } catch (error) {
    console.error(error);
  }
};


  // Handle sending a notification
  const handleSendNotification = async () => {
    if (notificationText && selectedPatient) {
      try {
        // Send the notification data to the server
        await axios.post('http://localhost:5000/api/notifications', {
          doctorName: doctor, // Replace with the actual doctor name
          patientName: selectedPatient.name,
          notification: notificationText,
        });

        // Clear the notification text and selected patient
        setNotificationText('');
        setSelectedPatient(null);

        // Show a success message or perform any other actions as needed
      } catch (error) {
        console.error(error);
        // Handle error
      }
    }
  };

  return (
    <div>
      <h2>Send Notification</h2>
      <Form>
        <Form.Group controlId="notificationText">
          <Form.Label>Notification Text:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
            placeholder="Enter your notification message here"
          />
        </Form.Group>
        <Form.Group controlId="selectPatient">
          <Form.Label>Select Patient:</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="patientDropdown">
              {selectedPatient ? selectedPatient.name : 'Select a patient'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {patients.map((patient) => (
                <Dropdown.Item
                  key={patient._id}
                  onClick={() => setSelectedPatient(patient)}
                >
                  {patient.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <Button
          variant="primary"
          type="button"
          onClick={handleSendNotification}
        >
          Send Notification
        </Button>
      </Form>
    </div>
  );
};

export default Notification;
