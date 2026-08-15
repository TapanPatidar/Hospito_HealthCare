/**
 * Prescription Controller
 * Path: backend/controllers/prescriptionController.js
 */
const Prescription = require('../models/Prescription');
const Alert = require('../models/Alert');

// @desc    Get prescriptions with role-based or custom filters
// @route   GET /api/prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const { role, userId, patientId, pharmacyId, doctorId } = req.query;
    const filter = {};

    if (patientId) filter.patientId = patientId;
    if (pharmacyId) filter.pharmacyId = pharmacyId;
    if (doctorId) filter.doctorId = doctorId;

    if (!patientId && !pharmacyId && !doctorId && userId && role) {
      if (role === 'patient') filter.patientId = userId;
      if (role === 'doctor') filter.doctorId = userId;
      if (role === 'pharmacist') filter.pharmacyId = userId;
    }

    const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
    res.json({
      prescriptions,
      total: prescriptions.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new digital prescription (Doctor)
// @route   POST /api/prescriptions
exports.createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      patientEmail,
      patientDob,
      patientBloodType,
      doctorId,
      doctorName,
      doctorLicense,
      pharmacyId,
      pharmacyName,
      medication,
      dosage,
      frequency,
      duration,
      diagnosis,
      notes,
    } = req.body;

    if (!patientId || !doctorId || !pharmacyId || !medication || !dosage || !frequency || !duration) {
      return res.status(400).json({ error: 'Missing required clinical fields for prescription' });
    }

    const newPrescription = await Prescription.create({
      patientId,
      patientName: patientName || 'Patient',
      patientEmail: patientEmail || '',
      patientDob,
      patientBloodType,
      doctorId,
      doctorName: doctorName || 'Dr.',
      doctorLicense,
      pharmacyId,
      pharmacyName: pharmacyName || 'Pharmacy',
      medication,
      dosage,
      frequency,
      duration,
      diagnosis: diagnosis || 'General medical examination',
      notes: notes || '',
      status: 'pending',
    });

    // Create real-time notification dispatch for the selected pharmacy
    await Alert.create({
      pharmacyId,
      title: `New Rx: ${medication} (${dosage})`,
      message: `${doctorName} dispatched order for patient ${patientName} (${frequency}, ${duration})`,
      type: 'new_rx',
      prescriptionId: newPrescription._id.toString(),
      read: false,
    });

    res.status(201).json({
      prescription: newPrescription,
      message: 'Prescription created and dispatched to pharmacy successfully!',
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

// @desc    Update prescription status (Pharmacist: fulfilled / rejected)
// @route   PATCH /api/prescriptions/:id/status
exports.updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['fulfilled', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "fulfilled" or "rejected"' });
    }

    const updateData = { status };
    if (status === 'fulfilled') {
      updateData.fulfilledAt = new Date();
    }

    const updated = await Prescription.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Prescription record not found' });
    }

    res.json({ prescription: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
