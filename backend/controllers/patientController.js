/**
 * Patient & Pharmacy Directory Controller
 * Path: backend/controllers/patientController.js
 */
const User = require('../models/User');
const Prescription = require('../models/Prescription');

// @desc    Get all patients with search filter (Doctor patient directory)
// @route   GET /api/patients
exports.getPatients = async (req, res) => {
  try {
    const searchQuery = req.query.q || req.query.search || '';
    const filter = { role: 'patient' };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { _id: searchQuery.match(/^[0-9a-fA-F]{24}$/) ? searchQuery : null },
      ].filter((condition) => condition._id !== null);
    }

    const patients = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    res.json({
      patients,
      total: patients.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single patient detail with prescription history
// @route   GET /api/patients/:id
exports.getPatientDetail = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-passwordHash');
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const prescriptions = await Prescription.find({ patientId: patient._id.toString() }).sort({ createdAt: -1 });
    res.json({
      patient,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all registered pharmacies (for doctor prescription selection)
// @route   GET /api/pharmacies
exports.getPharmacies = async (req, res) => {
  try {
    const pharmacies = await User.find({ role: 'pharmacist' }).select('-passwordHash').sort({ pharmacyName: 1 });
    res.json({ pharmacies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
