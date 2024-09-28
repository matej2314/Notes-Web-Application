const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const generatePDF = require('../controllers/generatePDF');
const notesController = require('../controllers/notesController');
const notesRoutes = require('../routes/notesRoutes');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../../../public/html/index.html'));
});

// router.get('/generate-pdf', generatePDF);

module.exports = router;
