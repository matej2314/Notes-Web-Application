const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.put('/usermail', authController.changeEmail);

module.exports = router;
