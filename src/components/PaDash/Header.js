import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DoctorHeader = ({ patientName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here if needed
    navigate('/');
  };

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand>{patientName}</Navbar.Brand>
      <Nav className="mr-auto">
        {/* Add additional navigation links if needed */}
      </Nav>
      <Button variant="link" style={{ color: 'red' }} onClick={handleLogout}>
        Logout
      </Button>
    </Navbar>
  );
};

export default DoctorHeader;
