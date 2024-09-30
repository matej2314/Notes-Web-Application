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
	sameSite: 'Strict',
	maxAge: 3600000,
};

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
	try {
		const { reg_username, reg_email, reg_password, rep_reg_password } = req.body;

		if (!reg_username || !reg_email || !reg_password || !rep_reg_password) {
			console.log('Brak wymaganych danych');
			return res.status(400).send('Proszę uzupełnić wszystkie pola!');
		}

		connection.query('SELECT email FROM users WHERE email = ?', [reg_email], async (error, results) => {
			if (error) {
				console.log('Błąd zapytania do bazy danych:', error);
				return res.status(500).send('Błąd serwera');
			}

			if (results.length > 0) {
				console.log('Email already registered');
				return res.status(400).send('Ten adres e-mail jest już zarejestrowany!');
			}

			if (reg_password !== rep_reg_password) {
				console.log('Passwords do not match');
				return res.status(400).send('Hasła muszą być identyczne');
			}

			try {
				let hashedPasswd = await bcrypt.hash(reg_password, 10);

				const userId = uuidv4();

				connection.query('INSERT INTO users SET ?', { id: userId, name: reg_username, email: reg_email, password: hashedPasswd }, (error, results) => {
					if (error) {
						console.log('Błąd wstawiania użytkownika:', error);
						return res.status(500).send('Błąd serwera');
					}

					const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
					res.cookie('SESSID:', token, jwtCookieOptions);
					console.log('Użytkownik zarejestrowany pomyślnie:', results);
					res.status(200).send('Użytkownik zarejestrowany pomyślnie. Możesz się zalogować!');
				});
			} catch (err) {
				console.log('Błąd podczas przygotowywania hasła:', err);
				return res.status(500).send('Błąd serwera');
			}
		});
	} catch (err) {
		console.log('Błąd rejestracji:', err);
		return res.status(500).send('Błąd serwera');
	}
};

exports.loginUser = async (req, res) => {
	const { username, userpassword } = req.body;

	if (!username || !userpassword) {
		return res.status(400).send('Proszę uzupełnić wszystkie pola!');
	}

	connection.query('SELECT * FROM users WHERE name=?', [username], async (error, results) => {
		if (error) {
			console.log(error);
			return res.status(500).send('Błąd serwera');
		}

		if (results.length === 0) {
			return res.status(400).send('Niepoprawny login lub hasło.');
		}

		const user = results[0];

		try {
			const isMatch = await bcrypt.compare(userpassword, user.password);
			if (!isMatch) {
				return res.status(400).send('Niepoprawny login lub hasło');
			}

			const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

			res.cookie('SESSID:', token, jwtCookieOptions);

			return res.status(200).json({ message: 'Zalogowano pomyślnie' });
		} catch (bcryptError) {
			console.log('Wprowadź dane ponownie.', bcryptError);
			return res.status(500).send('Błąd serwera');
		}
	});
};

exports.logoutUser = (req, res) => {
	res.clearCookie('SESSID', jwtCookieOptions);
};

exports.changeEmail = (req, res) => {
	const { userId, username, email, newEmail } = req.body;

	if (!userId || !newEmail || !username || !email) {
		return res.status(400).send('Podaj prawidłowe dane');
	}

	connection.query('SELECT email FROM users WHERE email=?', [newEmail], async (error, results) => {
		if (error) {
			console.log('Błąd zapytania do bazy danych', error);
			return res.status(500).send('Błąd serwera.');
		}

		if (results.length > 0) {
			return res.status(400).send('Ten adres e-mail jest już zarejestrowany!');
		}

		connection.query('SELECT id FROM users WHERE name=? AND email=?', [username, email], async (error, results) => {
			if (error) {
				console.log('Błąd zapytania do bazy danych', error);
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
