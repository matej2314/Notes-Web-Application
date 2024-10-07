const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const verifyJWT = require('../controllers/verifyJWT');
const uploadFile = require('../controllers/uploadFiles');
const sendAvatar = require('../controllers/sendAvatar');

// Middleware do obsługi danych z formularzy i JSON
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Serwowanie plików statycznych z folderu public
router.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../public/html', 'index.html'));
});

router.get('/main', verifyJWT, (req, res) => {
	res.sendFile(path.join(__dirname, '../../../public/html', 'main_page.html'));
});

router.post('/upload', verifyJWT, uploadFile);
router.get('/avatar', verifyJWT, sendAvatar);

module.exports = router;
