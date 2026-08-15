/**
 * Bilingual AI Assistant Routes
 * Path: backend/routes/chatRoutes.js
 */
const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');

router.post('/chat', handleChat);

module.exports = router;
