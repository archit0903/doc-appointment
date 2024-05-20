import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import Header from '../Header/Header.js';
import img1 from './image1.png';
import axios from 'axios'; // Import Axios

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize navigat=us/ Define state variables for the login form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Doctor', // Set the default role here
  });


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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password, role } = formData; // Destructure the 'role' here

    try {
      // Make a POST request to the appropriate login route based on the user's role (doctor or patient)
      const response = await axios.post(
        `http://localhost:5000/api/login/${role.toLowerCase()}`, // Use 'role' directly
        { email, password }
      );

      // On successful login, navigate to the appropriate dashboard
      if (response.status === 200) {
        navigate(`/${role}?name=${response.data.name}`);
      }
    } catch (error) {
      // Handle login errors
      if (error.response && error.response.status === 401) {
        setShowError(true);
        setErrorMessage('Invalid email or password');
      } else {
        console.error(error);
      }
    }
  };


  const { email, password } = formData;

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
              <h2>Login</h2>
              {showError && (
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
              )}
              <Form.Group controlId="role">
                <Form.Label>Role:</Form.Label>
                <Form.Control as="select" value={formData.role} onChange={handleInputChange} name="role">
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} onChange={handleInputChange} name="email" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} onChange={handleInputChange} name="password" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Log In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
