const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../db');
const bodyParser = require('body-parser');
const generatePDF = require('../controllers/generatePDF');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res) => {
	const userId = req.body.userId;
	const noteContent = req.body.notetext;
	const date = req.body.date;

	if (!userId || !noteContent || noteContent.trim() === '') {
		return res.status(400).send('Prześlij poprawne dane!');
	}

	const sqlQuery = 'INSERT INTO notes (user_id, note, date) VALUES(?,?,?)';

	connection.query(sqlQuery, [userId, noteContent, date], (err, result) => {
		if (err) {
			console.error('Błąd podczas dodawania notatki:', err);
			return res.status(500).send(`Błąd serwera: ${err.message}`);
		}
		res.status(201).send('Notatka dodana pomyślnie!');
	});
});

router.get('/', (req, res) => {
	const userId = req.body.userId;
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
			id: noteId,
			userId: note.user_id,
			note: note.note.toString('utf-8'),
			date: note.date,
		});
	});
});

router.delete('/', (req, res) => {
	const userId = req.body.userId;
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
		return res.status(200).send('Notatka usunięta pomyślnie');
	});
});

router.put('/', (req, res) => {
	const noteId = req.body.noteId;
	const noteContent = req.body.notetext;

	if (!noteId || !noteContent || noteContent.trim() === '') {
		return res.status(400).send('Niepoprawne dane');
	}

	const sqlQuery = 'UPDATE notes SET note=? WHERE id=?';

	connection.query(sqlQuery, [noteContent, noteId], (err, result) => {
		if (err) {
			console.error('Błąd podczas aktualizacji notatki', err.message);
			return res.status(500).send('Błąd serwera');
		}
		return res.status(200).send('Notatka zaktualizowana pomyślnie!');
	});
});
module.exports = router;
