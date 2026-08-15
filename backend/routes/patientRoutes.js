/**
 * Patient & Directory Routes
 * Path: backend/routes/patientRoutes.js
 */
const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientDetail,
  getPharmacies,
} = require('../controllers/patientController');

router.get('/patients', getPatients);
router.get('/patients/:id', getPatientDetail);
router.get('/pharmacies', getPharmacies);

module.exports = router;
