const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the doctor schema
const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  specialty: String,
  location: String,
  // Add other fields as needed
});

// Define the patient schema
const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // Add other fields as needed
});

const appointmentSchema = new mongoose.Schema({
  doctorName: String,
  date: Date, // Store the date as a Date object
  name: String,
  problem: String,
});







const unavailableDateSchema = new mongoose.Schema({
  doctorName: String,
  date: Date, // Store the date as a Date object
});
const appointmentRequestSchema = new mongoose.Schema({
  doctorName: String,
  patientName: String,
  date: Date,
  problemDescription: String,
  status: String, // "Pending," "Approved," or "Denied"
});
const notificationSchema = new mongoose.Schema({
  doctorName: String,
  patientName: String,
  notification: String,
});

const Notification = mongoose.model('Notification', notificationSchema);

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);

const UnavailableDate = mongoose.model('UnavailableDate', unavailableDateSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Create and export the doctor and patient models
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Doctor, Patient,Appointment,UnavailableDate,AppointmentRequest,Notification};
