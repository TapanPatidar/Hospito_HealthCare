/**
 * Pharmacy Alerts & Stats Controller
 * Path: backend/controllers/alertController.js
 */
const Alert = require('../models/Alert');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// @desc    Get pharmacy incoming alerts
// @route   GET /api/alerts
exports.getAlerts = async (req, res) => {
  try {
    const { pharmacyId } = req.query;
    const filter = pharmacyId ? { pharmacyId } : {};
    const alerts = await Alert.find(filter).sort({ createdAt: -1 });

    res.json({
      alerts,
      total: alerts.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Mark pharmacy alerts as read
// @route   POST /api/alerts/mark-read
exports.markAlertsRead = async (req, res) => {
  try {
    const { pharmacyId } = req.body;
    if (pharmacyId) {
      await Alert.updateMany({ pharmacyId, read: false }, { $set: { read: true } });
    }
    res.json({ success: true, message: 'Alerts marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get doctor operational statistics
// @route   GET /api/stats/doctor/:doctorId
exports.getDoctorStats = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalPatients, myPrescriptions, todayPrescriptions] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Prescription.countDocuments({ doctorId }),
      Prescription.countDocuments({ doctorId, createdAt: { $gte: startOfToday } }),
    ]);

    res.json({
      totalPatients,
      myPrescriptions,
      todayPrescriptions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get pharmacist operational statistics
// @route   GET /api/stats/pharmacist/:pharmacyId
exports.getPharmacistStats = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const [totalRx, pendingRx, fulfilledRx, unreadAlerts] = await Promise.all([
      Prescription.countDocuments({ pharmacyId }),
      Prescription.countDocuments({ pharmacyId, status: 'pending' }),
      Prescription.countDocuments({ pharmacyId, status: 'fulfilled' }),
      Alert.countDocuments({ pharmacyId, read: false }),
    ]);

    res.json({
      totalRx,
      pendingRx,
      fulfilledRx,
      unreadAlerts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
