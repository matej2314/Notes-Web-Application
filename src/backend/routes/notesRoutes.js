const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../db');
const bodyParser = require('body-parser');
const generatePDF = require('../controllers/generatePDF');
const verifyJWT = require('../controllers/verifyJWT');
const { v4: uuidv4 } = require('uuid');
const formattedDate = require('../backend_modules/formattedDate');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', verifyJWT, (req, res) => {
	const userId = req.userId;
	const noteTitle = req.body.notetitle;
	const noteContent = req.body.notetext;
	const noteWeight = req.body.weight;

	if (!userId || !noteContent || !noteTitle || noteContent.trim() === '') {
		return res.status(400).send('Prześlij poprawne dane!');
	}

	const id = uuidv4();
	const date = formattedDate(new Date());

	const sqlQuery = 'INSERT INTO notes (id, user_id, title, note, weight, date) VALUES(?,?,?,?,?,?)';

	connection.query(sqlQuery, [id, userId, noteTitle, noteContent, noteWeight, date], (err, result) => {
		if (err) {
			console.log('Błąd podczas dodawania notatki:', err.message);
			return res.status(500).send(`Błąd serwera: ${err.message}`);
		}
		res.status(201).json({
			message: 'Notatka dodana pomyślnie!',
			noteId: id,
		});
	});
});

router.get('/', verifyJWT, (req, res) => {
	const userId = req.userId;
	const noteId = req.body.noteId;

	if (!userId || !noteId) {
		return res.status(400).send('Prześlij poprawne dane!');
	}

	const sqlQuery = ` SELECT * FROM notes WHERE id = ? AND user_id = ? `;

	connection.query(sqlQuery, [noteId, userId], (err, result) => {
		if (err) {
			return res.status(500).send('Błąd pobierania danych:', err.message);
		}

		if (result.length === 0) {
			return res.status(404).send('Notatka nie została znaleziona');
		}

		const note = result[0];
		res.status(200).json({
			id: note.id,
			userId: note.user_id,
			noteTitle: note.title,
			noteText: note.note,
			noteWeight: note.weight,
			date: note.date,
		});
	});
});

router.get('/all', verifyJWT, (req, res) => {
	const userId = req.userId;

	if (!userId) {
		return res.send(400).send('Brak danych');
	}

	const sqlQuery = `SELECT * FROM notes WHERE user_id=?`;

	connection.query(sqlQuery, [userId], (err, rows) => {
		if (err) {
			console.log('Błąd podczas pobierania danych:', err.message);
			return res.status(500).send('Błąd serwera.');
		}
		if (rows.length === 0) {
			return res.status(400).send('Brak notatek użytkownika.');
		}

		res.status(200).json({
			notes: rows,
		});
	});
});

router.put('/edit', verifyJWT, (req, res) => {
	const noteId = req.body.noteId;
	const noteTitle = req.body.notetitle;
	const noteContent = req.body.notetext;
	const noteWeight = req.body.noteWeight;
	const userId = req.userId;

	if (!noteId || !noteContent || noteContent.trim() === '') {
		return res.status(400).json({ message: 'Niepoprawne dane' });
	}

	const sqlQuery = 'UPDATE notes SET title = ?, note = ?, weight = ? WHERE id = ? AND user_id = ?';

	connection.query(sqlQuery, [noteTitle, noteContent, noteWeight, noteId, userId], (err, result) => {
		if (err) {
			console.error('Błąd podczas aktualizacji notatki', err.message);
			return res.status(500).json({ message: 'Błąd serwera' });
		}
		return res.status(200).json({ message: 'Notatka zaktualizowana' });
	});
});

router.delete('/delete', verifyJWT, (req, res) => {
	const userId = req.userId;
	const noteId = req.body.noteId;

	if (!userId || !noteId) {
		return res.status(400).send('Dane niepoprawne');
	}

	const sqlQuery = `DELETE FROM notes WHERE id=? AND user_id=?`;

	connection.query(sqlQuery, [noteId, userId], (err, result) => {
		if (err) {
			console.log('Błąd podczas usuwania danych:', err.message);
			return res.status(500).send('Błąd serwera', err.message);
		}

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Notatka nie została znaleziona' });
		}
		return res.status(200).json({ message: 'Notatka usunięta pomyślnie' });
	});
});

// router.get('/generate-pdf', verifyJWT, generatePDF);

module.exports = router;
