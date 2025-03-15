// routes/admin.js
const express = require('express');
const router = express.Router();
const { getUserPlainPassword } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// Route to get the decrypted plain password for a given user
router.get('/user-plain-password/:userId', protect, authorize('admin'), getUserPlainPassword);

module.exports = router;
