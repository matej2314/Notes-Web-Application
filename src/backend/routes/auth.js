const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const verifyJWT = require('../controllers/verifyJWT');

const jwtCookieOptions = {
	httpOnly: true,
	secure: false,
	maxAge: 86400000,
};

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/usermail', verifyJWT, authController.changeEmail);
router.post('/userpass', verifyJWT, authController.changePass);
router.post('/logout', authController.logoutUser);

module.exports = router;
