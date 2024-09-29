const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');

// Middleware do obsługi danych z formularzy i JSON
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Serwowanie plików statycznych z folderu public
router.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../public/html', 'index.html'));
});

// router.get('/generate-pdf', generatePDF);

module.exports = router;
