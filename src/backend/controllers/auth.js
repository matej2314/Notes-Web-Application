const dotenv = require('dotenv').config({ path: '../../../.env' });
const path = require('path');
const connection = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const JWT_SECRET = process.env.JWT_SECRET;
const sendEmail = require('../nodeMailer');
const logger = require('../logger');

const jwtCookieOptions = {
	httpOnly: true,
	secure: false,
	maxAge: 86400000,
};

exports.registerUser = async (req, res) => {
	try {
		const { reg_username, reg_email, reg_password } = req.body;

		if (!reg_username || !reg_email || !reg_password) {
			logger.error('Proszę uzupełnić wszystkie pola!');
			return res.status(400).send('Proszę uzupełnić wszystkie pola!');
		}

		connection.query('SELECT email FROM users WHERE email = ?', [reg_email], async (error, results) => {
			if (error) {
				logger.error(error.message);
				return res.status(500).send('Błąd serwera');
			}

			if (results.length > 0) {
				return res.status(400).send('Ten adres e-mail jest już zarejestrowany!');
			}

			try {
				let hashedPasswd = await bcrypt.hash(reg_password, 10);

				const userId = uuidv4();

				connection.query('INSERT INTO users SET ?', { id: userId, name: reg_username, email: reg_email, password: hashedPasswd }, (error, results) => {
					if (error) {
						logger.error(error.message);
						return res.status(500).send('Błąd serwera');
					}

					const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
					res.cookie('SESSID', token, jwtCookieOptions);

					res.status(200).json({ message: 'Użytkownik zarejestrowany pomyślnie. Możesz się zalogować!' });
				});
			} catch (err) {
				logger.error(err.message);
				return res.status(500).send('Błąd serwera');
			}
		});
	} catch (err) {
		logger.error(err.message);
		return res.status(500).send('Błąd serwera');
	}
};

exports.loginUser = async (req, res) => {
	const { username, userpassword } = req.body;

	if (!username || !userpassword) {
		return res.status(400).json({ message: 'Proszę uzupełnić wszystkie pola.' });
	}

	connection.query('SELECT * FROM users WHERE name = ?', [username], async (error, results) => {
		if (error) {
			logger.error('Błąd SELECT:', error.message);
			return res.status(500).json({ message: 'Błąd serwera', error: error.message });
		}

		if (results.length === 0) {
			return res.status(400).json({ message: 'Niepoprawny login lub hasło.' });
		}

		const user = results[0];

		const isMatch = await bcrypt.compare(userpassword, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: 'Niepoprawny login lub hasło.' });
		}

		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.cookie('SESSID', token, jwtCookieOptions);

		res.status(200).json({ message: 'Zalogowano pomyślnie.', username: user.name, redirectUrl: '/main' });
	});
};

exports.logoutUser = (req, res) => {
	res.clearCookie('SESSID', { httpOnly: true, secure: false });
	res.status(200).json({ message: 'Wylogowano poprawnie.' });
};

exports.changeEmail = async (req, res) => {
	const userId = req.userId;
	const { username, email, newEmail } = req.body;

	if (!userId || !newEmail || !username || !email) {
		return res.status(400).send('Podaj prawidłowe dane');
	}

	try {
		const results = connection.query('SELECT email FROM users WHERE email=?', [newEmail]);
		if (results.length > 0) {
			return res.status(400).json({ message: 'Ten adres e-mail jest już zarejestrowany!' });
		}

		const userResults = connection.query('SELECT id FROM users WHERE id=? AND name=? AND email=?', [userId, username, email]);
		if (userResults.length === 0) {
			return res.status(400).json({ message: 'Podano nieprawidłowe dane użytkownika' });
		}

		connection.query('UPDATE users SET email=? WHERE id=?', [newEmail, userId]);
		return res.status(200).json({ message: 'Adres e-mail zmieniony pomyślnie' });
	} catch (error) {
		logger.error('Błąd serwera', error);
		return res.status(500).json({ message: 'Błąd serwera' });
	}
};

exports.changePass = async (req, res) => {
	const userId = req.userId;
	const userName = req.body.name;
	const oldPass = req.body.oldPass;
	const newPass = req.body.newPass;

	if (!userId || !userName || !oldPass || !newPass) {
		return res.status(400).json({ message: 'Brak wymaganych danych.' });
	}

	try {
		const results = connection.query('SELECT password FROM users WHERE id=?', [userId]);

		if (results.length === 0) {
			return res.status(400).json({ message: 'Nieprawidłowe dane użytkownika.' });
		}

		const user = results.options.password;

		const isMatch = bcrypt.compare(oldPass, user);

		if (!isMatch) {
			return res.status(400).json({ message: 'Podaj poprawne obecne hasło.' });
		}

		// Użycie await do haszowania nowego hasła
		const hashedPasswd = await bcrypt.hash(newPass, 10);

		// Użycie await do zapisu nowego hasła
		const savePass = connection.query('UPDATE users SET password=? WHERE id=?', [hashedPasswd, userId]);

		return res.status(200).json({ message: 'Hasło zostało zmienione.' });
	} catch (error) {
		logger.error('Nie udało się zmienić hasła.', error.message);
		return res.status(500).json({ message: 'Nie udało się zmienić hasła.' });
	}
};
