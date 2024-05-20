const express = require('express');
const app = express();
const port = process.env.PORT || 5000; 
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
app.use(express.json());
app.use(cors());
const { Doctor, Patient,Appointment,UnavailableDate,AppointmentRequest,Notification } = require('./Models');
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.send('Hello, Express.js!');
});
// Doctor signup route
app.post('/api/signup/doctor', async (req, res) => {
  try {
    const { name, email, password, specialty, location } = req.body;
    
    // Check if the email is already in use
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Create a new doctor instance with the plain text password and save to the database
    const newDoctor = new Doctor({
      name,
      email,
      password,
      specialty,
      location,
    });
    await newDoctor.save();
    
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Patient signup route
app.post('/api/signup/patient', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already in use
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Create a new patient instance with the plain text password and save to the database
    const newPatient = new Patient({
      name,
      email,
      password,
    });
    await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Doctor login route
app.post('/api/login/doctor', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the email exists in the database
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the stored plain text password in the database
    if (password !== doctor.password) {
      
      return res.status(401).json({ error: 'Invalid email or password' });
    } else {
      
      res.status(200).json({ name: doctor.name });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Patient login route
app.post('/api/login/patient', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the stored plain text password in the database
    if (password !== patient.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // On successful login, return the patient's name
    res.status(200).json({ name: patient.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Existing route to fetch appointments
app.get('/api/appointments/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  try {
    const appointments = await Appointment.find({ doctorName });
    // Format the date to "YYYY-MM-DD" before sending it in the response
    const formattedAppointments = appointments.map((appointment) => ({
      doctorName: appointment.doctorName,
      date: appointment.date.toISOString().split('T')[0], // Format the date
      name: appointment.name,
      problem: appointment.problem,
    }));
    res.json({ appointments: formattedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add unavailable date for a doctor
app.post('/api/unavailable-dates/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  const { date } = req.body;

  try {
    // Ensure the date is in "YYYY-MM-DD" format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Please use "YYYY-MM-DD".' });
    }

    // Create a new unavailable date entry
    const newUnavailableDate = new UnavailableDate({
      doctorName,
      date, // Store the date in "YYYY-MM-DD" format
    });

    // Save the new entry to the database
    await newUnavailableDate.save();
    res.status(201).json({ message: 'Unavailable date added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch unavailable dates for a doctor
app.get('/api/unavailable-dates/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  try {
    const unavailableDates = await UnavailableDate.find({ doctorName });
    // Format the dates to "YYYY-MM-DD" before sending them in the response
    const formattedUnavailableDates = unavailableDates.map((date) => ({
      doctorName: date.doctorName,
      date: date.date.toISOString().split('T')[0], // Format the date
    }));
    res.json({ unavailableDates: formattedUnavailableDates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/appointments/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  const { patientName, currentDate, newDate } = req.body;

  try {
    // Find the appointment by patient name and current date
    const appointment = await Appointment.findOne({
      doctorName,
      patientName,
      date: currentDate,
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update the appointment date
    appointment.date = newDate;
    await appointment.save();

    res.json({ message: 'Appointment date changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/appointments/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  const { patientName, date } = req.body;

  try {
    // Find the appointment by patient name and date
    const appointment = await Appointment.findOneAndDelete({
      doctorName,
      patientName,
      date,
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch appointment requests for a doctor
app.get('/api/appointment-requests/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  
  try {
    const appointmentRequests = await AppointmentRequest.find({ doctorName });
    // Format the dates to "YYYY-MM-DD" before sending them in the response
    // console.log(appointmentRequests);
    const formattedAppointmentRequests = appointmentRequests.map((request) => ({
      doctorName: request.doctorName,
      patientName: request.patientName,
      date: request.date.toISOString().split('T')[0], // Format the date
      problemDescription: request.problemDescription,
      status: request.status,
    }));
    res.json({ appointmentRequests: formattedAppointmentRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to change the status of an appointment request
// Update the route to approve an appointment request
app.put('/api/appointment-requests/:doctorName/approve', async (req, res) => {
  const { doctorName } = req.params;
  const { patientName, date } = req.body;

  try {
    // Find the appointment request by doctorName, patientName, and date
    const request = await AppointmentRequest.findOne({
      doctorName,
      patientName,
      date,
    });

    if (!request) {
      return res.status(404).json({ error: 'Appointment request not found' });
    }

    // Update the status to 'Approved'
    request.status = 'Approved';
    await request.save();

    // Create a new appointment using the request data
    const newAppointment = new Appointment({
      doctorName,
      date: request.date,
      name: request.patientName,
      problem: request.problemDescription,
    });

    // Save the new appointment to the database
    await newAppointment.save();

    res.json({ message: 'Appointment request approved and added to appointments successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update the route to deny an appointment request
app.put('/api/appointment-requests/:doctorName/deny', async (req, res) => {
  const { doctorName } = req.params;
  const { patientName, date } = req.body;

  try {
    // Find the appointment request by doctorName, patientName, and date
    const request = await AppointmentRequest.findOne({
      doctorName,
      patientName,
      date,
    });

    if (!request) {
      return res.status(404).json({ error: 'Appointment request not found' });
    }

    // Update the status to 'Denied'
    request.status = 'Denied';
    await request.save();

    res.json({ message: 'Appointment request denied successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update the route to remove an appointment request
app.delete('/api/appointment-requests/:doctorName/remove', async (req, res) => {
  const { doctorName } = req.params;
  const { patientName, date } = req.body;

  try {
    // Find and remove the appointment request by doctorName, patientName, and date
    await AppointmentRequest.findOneAndDelete({
      doctorName,
      patientName,
      date,
    });

    res.json({ message: 'Appointment request removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch patients for a specific doctor based on the doctor's name
app.get('/api/patients/:doctorName', async (req, res) => {
  const { doctorName } = req.params;

  try {
    // Find all patients associated with the specified doctor's name in the appointment schema
    const patients = await Appointment.find({ doctorName });

    res.json({ patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/notifications', async (req, res) => {
  const { doctorName, patientName, notification } = req.body;
  try {
    // Create a new notification entry
    const newNotification = new Notification({
      doctorName,
      patientName,
      notification,
    });

    // Save the new notification to the database
    await newNotification.save();
    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch notifications for a patient
app.get('/api/notifications/:patientName', async (req, res) => {
  const { patientName } = req.params;
  try {
    const notifications = await Notification.find({ patientName });
    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to remove a notification by patient name and notification text
app.delete('/api/notifications/:patientName/:notificationText', async (req, res) => {
  const { patientName, notificationText } = req.params;
  try {
    await Notification.deleteOne({ patientName, notification: notificationText });
    res.json({ message: 'Notification removed successfully' });
  } catch (error) {
    console.error('Error removing notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/specialties', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json({ specialties });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Doctor.distinct('location');
    res.json({ locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/appointment-requests', async (req, res) => {
  const {
    doctorName,
    selectedDate,
    problemDescription,
    patientName,
  } = req.body;

  try {
    // Check if the selected date is unavailable for the selected doctor
    const isDateUnavailable = await UnavailableDate.findOne({
      doctorName,
      date: new Date(selectedDate),
    });

    if (isDateUnavailable) {
      return res.status(400).json({ error: 'Selected date is unavailable' });
    }
    const newd=new Date(selectedDate)
    // Create a new appointment request
    const appointmentRequest = new AppointmentRequest({
      doctorName,
      patientName,
      date: new Date(selectedDate),
      problemDescription,
      status: 'Pending',
    });

    await appointmentRequest.save();

    res.json({ message: 'Appointment request added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/find-doctors', async (req, res) => {
  try {
    const { location, specialty } = req.body;

    // Query doctors based on location and specialty
    let query = {};

    if (location) {
      query.location = location;
    }

    if (specialty) {
      query.specialty = specialty;
    }

    const doctors = await Doctor.find(query);

    if (doctors.length === 0) {
      return res.status(404).json({ error: 'No doctors found with the specified filters' });
    }

    res.json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/all-doctors', async (req, res) => {
  try {
    // Retrieve all doctors from the database
    const doctors = await Doctor.find({});

    // Send the list of doctors as a JSON response
    res.status(200).json({ doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/requests/:patientName', async (req, res) => {
  const { patientName } = req.params;
  
  try {
    const requests = await AppointmentRequest.find({ patientName });

    // Format the dates to "YYYY-MM-DD" before sending them in the response
    const formattedRequests = requests.map((request) => ({
      doctorName: request.doctorName,
      date: request.date.toISOString().split('T')[0],
      status:request.status, 
    }));

    res.status(200).json({ requests: formattedRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/appointment-requests/:patientName/:selectedDate', async (req, res) => {
  const { patientName, selectedDate } = req.params;

  try {
    // Check if the request with the specified patient name and date exists
    const request = await AppointmentRequest.findOne({ patientName, date: new Date(selectedDate) });

    if (!request) {
      return res.status(404).json({ error: 'Appointment request not found' });
    }

    // Remove the request using deleteOne
    await AppointmentRequest.deleteOne({ patientName, date: new Date(selectedDate) });

    res.json({ message: 'Appointment request removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/appoint/:patientName', async (req, res) => {
  const { patientName } = req.params;
  
  try {
    const appointments = await Appointment.find({ name: patientName }); // Updated to match the schema field name
   
    // Format the dates to "YYYY-MM-DD" before sending them in the response
    const formattedAppointments = appointments.map((appointment) => ({
      doctorName: appointment.doctorName,
      date: appointment.date.toISOString().split('T')[0], // Format the date
    }));

    res.json({ appointments: formattedAppointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
