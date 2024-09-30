const express = require('express');
const router = express.Router();
const path = require('path');
const connection = require('../db');
const bodyParser = require('body-parser');
const generatePDF = require('../controllers/generatePDF');
const verifyJWT = require('../controllers/verifyJWT');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res) => {
	const id = req.body.noteId;
	const userId = req.body.userId;
	const noteTitle = req.body.notetitle;
	const noteContent = req.body.notetext;
	const date = req.body.date;

	if (!userId || !noteContent || !noteTitle || !date || noteContent.trim() === '') {
		return res.status(400).send('Prześlij poprawne dane!');
	}

	const sqlQuery = 'INSERT INTO notes (id,user_id, title, note, date) VALUES(?,?,?,?,?)';

	connection.query(sqlQuery, [id, userId, noteTitle, noteContent, date], (err, result) => {
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
			id: note.id,
			userId: note.user_id,
			noteTitle: note.title,
			noteText: note.note,
			date: note.date,
		});
	});
});

router.get('/all', (req, res) => {
	const userId = req.body.userId;

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
	const noteTitle = req.body.notetitle;
	const noteContent = req.body.notetext;
	const userId = req.body.userId;

	if (!noteId || !noteContent || noteContent.trim() === '') {
		return res.status(400).send('Niepoprawne dane');
	}

	const sqlQuery = 'UPDATE notes SET title=?, note=? WHERE id=? AND user_id=?';

	connection.query(sqlQuery, [noteTitle, noteContent, noteId, userId], (err, result) => {
		if (err) {
			console.error('Błąd podczas aktualizacji notatki', err.message);
			return res.status(500).send('Błąd serwera');
		}
		return res.status(200).send('Notatka zaktualizowana pomyślnie!');
	});
});

module.exports = router;
