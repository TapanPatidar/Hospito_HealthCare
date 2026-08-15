/**
 * Prescription Routes
 * Path: backend/routes/prescriptionRoutes.js
 */
const express = require('express');
const router = express.Router();
const {
  getPrescriptions,
  createPrescription,
  updatePrescriptionStatus,
} = require('../controllers/prescriptionController');

router.get('/', getPrescriptions);
router.post('/', createPrescription);
router.patch('/:id/status', updatePrescriptionStatus);

module.exports = router;
