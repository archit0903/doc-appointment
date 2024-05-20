import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.js';
import SignUp from './components/SignUp/SignUp.js';
import Login from './components/Login/Login.js';
import DoctorDashboard from './components/DocDash/DocDash.js';
import PatientDashboard from './components/PaDash/PaDash.js';
function App() {
  return (
   <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Doctor" element={<DoctorDashboard />} />
      <Route path="/Patient" element={<PatientDashboard />} />
   </Routes>
  );
}

export default App;
