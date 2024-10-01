const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const verifyJWT = require('../controllers/verifyJWT');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.put('/usermail', verifyJWT, authController.changeEmail);

module.exports = router;
