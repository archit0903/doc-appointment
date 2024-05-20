import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const AppointmentDetails = ({ doctorName }) => {
  const [activeAppointments, setActiveAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Fetch active appointments when the component mounts
    fetchAppointments();
  }, []);
  
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${doctorName}`);
      if (response.status === 200) {
        const data = response.data;
       
        setActiveAppointments(data.appointments);
      } else {
        setFetchError('Failed to fetch appointments');
      }
    } catch (error) {
      console.error(error);
      setFetchError('Failed to fetch appointments');
    }
  };

  const handleOpenModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setShowModal(false);
  };

  const handleChangeDate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${doctorName}`, {
        patientName: selectedAppointment.patientName,
        currentDate: selectedAppointment.date,
        newDate,
      });
      // Refresh the list of appointments after updating
      fetchAppointments();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveAppointment = async (appointment) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${doctorName}`, {
        data: {
          patientName: appointment.patientName,
          date: appointment.date,
        },
      });
      // Refresh the list of appointments after deleting
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Active Appointments</h2>
      {fetchError ? (
        <p className="text-danger">{fetchError}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Problem Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.date}</td>
                <td>{appointment.name}</td>
                <td>{appointment.problem}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleOpenModal(appointment)}
                  >
                    Change Date
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveAppointment(appointment)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Appointment Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="newDate">
            <Form.Label>New Date:</Form.Label>
            <Form.Control
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChangeDate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentDetails;
