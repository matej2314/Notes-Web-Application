const dotenv = require('dotenv').config({ path: '../../../.env' });
const path = require('path');
const connection = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtCookieOptions = {
	httpOnly: true,
	secure: false,
	maxAge: 86400000,
};

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
	try {
		const { reg_username, reg_email, reg_password } = req.body;

		if (!reg_username || !reg_email || !reg_password) {
			return res.status(400).send('Proszę uzupełnić wszystkie pola!');
		}

		const existingUser = await connection.query('SELECT email FROM users WHERE email = ?', [reg_email]);

		if (existingUser.length > 0) {
			return res.status(400).send('Ten adres e-mail jest już zarejestrowany!');
		}

		let hashedPasswd = await bcrypt.hash(reg_password, 10);
		const userId = uuidv4();

		await connection.query('INSERT INTO users SET ?', {
			id: userId,
			name: reg_username,
			email: reg_email,
			password: hashedPasswd,
		});

		res.status(200).json({ message: 'Użytkownik zarejestrowany pomyślnie. Możesz się zalogować!' });
	} catch (err) {
		console.error('Błąd serwera:', err);
		return res.status(500).send('Błąd serwera');
	}
};

exports.loginUser = async (req, res) => {
	const { username, userpassword } = req.body;

	if (!username || !userpassword) {
		return res.status(400).json({ message: 'Proszę uzupełnić wszystkie pola!' });
	}

	try {
		// Zapytanie o użytkownika w bazie danych
		connection.query('SELECT * FROM users WHERE name = ?', [username], async (error, results) => {
			if (error) {
				console.log('Błąd przy zapytaniu do bazy:', error);
				return res.status(500).json({ message: 'Błąd serwera' });
			}

			// Sprawdzenie, czy użytkownik istnieje
			if (results.length === 0) {
				return res.status(400).json({ message: 'Niepoprawny login lub hasło.' });
			}

			const user = results[0];

			// Debug: Wyświetlanie hasła
			console.log('Hasło użytkownika:', userpassword);
			console.log('Hasło w bazie:', user.password);

			// Sprawdzenie hasła
			const isMatch = await bcrypt.compare(userpassword, user.password);
			console.log('Wynik porównania haseł:', isMatch); // Dodaj log

			if (!isMatch) {
				return res.status(400).json({ message: 'Niepoprawny login lub hasło' });
			}

			// Generowanie tokenu
			const token = jwt.sign({ id: user.id, username: username }, process.env.JWT_SECRET, { expiresIn: '24h' });

			res.cookie('SESSID', token, jwtCookieOptions);

			return res.status(200).json({
				message: 'Zalogowano pomyślnie',
				redirectUrl: 'http://localhost:8088/main',
				username: user.name,
				userId: user.id,
			});
		});
	} catch (error) {
		console.log('Błąd podczas logowania:', error);
		return res.status(500).json({ message: 'Błąd serwera' });
	}
};

exports.logoutUser = (req, res) => {
	res.clearCookie('SESSID', { httpOnly: true, secure: false });
	res.status(200).json({ message: 'Wylogowano poprawnie.' });
};

exports.changeEmail = (req, res) => {
	const { userId, username, email, newEmail } = req.body;

	if (!userId || !newEmail || !username || !email) {
		return res.status(400).send('Podaj prawidłowe dane');
	}

	connection.query('SELECT email FROM users WHERE email=?', [newEmail], async (error, results) => {
		if (error) {
			return res.status(500).send('Błąd serwera.');
		}

		if (results.length > 0) {
			return res.status(400).send('Ten adres e-mail jest już zarejestrowany!');
		}

		connection.query('SELECT id FROM users WHERE name=? AND email=?', [username, email], async (error, results) => {
			if (error) {
				return res.status(500).send('Błąd serwera');
			}

			if (results.length === 0) {
				return res.status(400).send('Podano nieprawidłowe dane użytkownika');
			}

			const userId = results[0].id;
			connection.query('UPDATE users SET email=? WHERE id=?', [newEmail, userId], async updateError => {
				if (updateError) {
					console.log('Błąd aktualizacji adresu e-mail', updateError);
					return res.status(500).send('Błąd serwera');
				}
				return res.status(200).send('Adres e-mail zmieniony pomyślnie');
			});
		});
	});
};
