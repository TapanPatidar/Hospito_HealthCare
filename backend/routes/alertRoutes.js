/**
 * Alert & Analytics Routes
 * Path: backend/routes/alertRoutes.js
 */
const express = require('express');
const router = express.Router();
const {
  getAlerts,
  markAlertsRead,
  getDoctorStats,
  getPharmacistStats,
} = require('../controllers/alertController');

router.get('/alerts', getAlerts);
router.post('/alerts/mark-read', markAlertsRead);
router.get('/stats/doctor/:doctorId', getDoctorStats);
router.get('/stats/pharmacist/:pharmacyId', getPharmacistStats);

module.exports = router;
