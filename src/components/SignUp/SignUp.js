import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Header from '../Header/Header.js';
import img1 from './image1.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SignupPage = () => {
  // Define state variables for the form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Doctor', // Default role
    specialty: 'Cardiologist', // Additional field for Doctor
    location: '', // Additional field for Doctor
  });

  const navigate = useNavigate();
  // Define state for error handling
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSpecialtyChange = (event) => {
    const selectedSpecialty = event.target.value;
    setFormData({
      ...formData,
      specialty: selectedSpecialty,
    });
  };
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Password validation
    if (formData.password.length < 5) {
      setShowError(true);
      setErrorMessage('Password must be at least 5 characters long.');
      return;
    } else {
      setShowError(false);
      setErrorMessage('');
    }

    try {
      // Make a POST request to the relevant sign-up route based on role
      const response = await axios.post(`http://localhost:5000/api/signup/${formData.role.toLowerCase()}`, formData);

      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setShowError(true);
        setErrorMessage('Email is already in use.');
      } else {
        setShowError(true);
        setErrorMessage('Internal server error. Please try again later.');
      }
    }
  };

  const { name, email, password, confirmPassword, role, speciality, location } = formData;

  // List of doctor specialties
  const doctorSpecialties = [
    'Cardiologist',
    'Dermatologist',
    'Gynecologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Psychiatrist',
    'Urologist',
    'Other',
  ];

  return (
    <>
      <Header />
      <div
        style={{
          backgroundImage: `url(${img1})`,
          backgroundSize: 'cover',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease-in-out',
            maxWidth: '400px',
            width: '100%',
            position: 'relative', // Set position to enable hover animation
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')}
        >
          <div className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="w-100">
              <h2>Sign Up</h2>
              {showError && (
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
              )}
              <Form.Group controlId="role">
                <Form.Label>Role:</Form.Label>
                <Form.Control as="select" value={role} onChange={handleInputChange} name="role">
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="name">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="text" value={name} onChange={handleInputChange} name="name" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={handleInputChange} name="confirmPassword" />
              </Form.Group>

              {role === 'Doctor' && (
                <>
                  <Form.Group controlId="speciality">
                    <Form.Label>Speciality:</Form.Label>
                    <Form.Control as="select" value={speciality} onChange={handleSpecialtyChange} name="speciality">
                      {doctorSpecialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="location">
                    <Form.Label>Location:</Form.Label>
                    <Form.Control type="text" value={location} onChange={handleInputChange} name="location" />
                  </Form.Group>
                </>
              )}
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
