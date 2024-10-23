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
const admin = require('firebase-admin');

const admin = require('firebase-admin');


const serviceAccount = require('../notes-web-app-baa92-firebase-adminsdk-7avxv-748e8376a7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  const token = req.body.token;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

module.exports = verifyToken;


const jwtCookieOptions = {
	httpOnly: true,
	secure: false,
	maxAge: 86400000,
};

function isValidPassword(password) {
	// Minimum 8 znaków, przynajmniej jedna mała litera, jedna duża litera, jedna cyfra i jeden ze znaków specjalnych *!#^%$@?
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*!#^%$@?])[a-zA-Z\d*!#^%$@?]{10,30}$/;
	return regex.test(password);
}

// Funkcja walidująca e-mail
function isValidEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

// Funkcja walidująca nazwę użytkownika (alfanumeryczna, minimum 5 znaków)
function isValidUsername(username) {
	const regex = /^[a-zA-Z0-9]{5,}$/;
	return regex.test(username);
}

// Funkcja rejestracji użytkownika
exports.registerUser = async (req, res) => {
	try {
		const { reg_username, reg_email, reg_password } = req.body;

		// Sprawdzanie, czy wszystkie pola są uzupełnione
		if (!reg_username || !reg_email || !reg_password) {
			logger.error('Proszę uzupełnić wszystkie pola!');
			return res.status(400).send('Proszę uzupełnić wszystkie pola!');
		}

		// Walidacja nazwy użytkownika
		if (!isValidUsername(reg_username)) {
			logger.error('Nieprawidłowa nazwa użytkownika! (minimum 5 znaków, tylko litery i cyfry)');
			return res.status(400).send('Nieprawidłowa nazwa użytkownika! (minimum 5 znaków, tylko litery i cyfry)');
		}

		// Walidacja adresu e-mail
		if (!isValidEmail(reg_email)) {
			logger.error('Podaj prawidłowy adres e-mail!');
			return res.status(400).send('Podaj prawidłowy adres e-mail!');
		}

		// Walidacja hasła
		if (!isValidPassword(reg_password)) {
			logger.error('Wpisz prawidłowe hasło! (od 10 do 30 znaków, przynajmniej jedna duża litera, cyfra i znak specjalny: *#!^)');
			return res.status(400).send('Wpisz prawidłowe hasło! (od 10 do 30 znaków, przynajmniej jedna duża litera, cyfra i znak specjalny: *#!^)');
		}

		// Sprawdzanie, czy e-mail już istnieje w bazie danych
		connection.query('SELECT email FROM users WHERE email = ?', [reg_email], async (error, results) => {
			if (error) {
				logger.error(error.message);
				return res.status(500).send('Błąd serwera');
			}

			if (results.length > 0) {
				return res.status(400).send('Ten adres e-mail jest już zarejestrowany!');
			}

			try {
				// Haszowanie hasła
				let hashedPasswd = await bcrypt.hash(reg_password, 10);
				const userId = uuidv4();

				// Wstawianie użytkownika do bazy danych
				connection.query('INSERT INTO users SET ?', { id: userId, name: reg_username, email: reg_email, password: hashedPasswd }, error => {
					if (error) {
						logger.error(error.message);
						return res.status(500).send('Błąd serwera');
					}

					// Tworzenie tokena JWT i ustawianie ciasteczka
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
	const { username, userpassword, email } = req.body;

	if (!username || !userpassword) {
		return res.status(400).json({ message: 'Proszę uzupełnić wszystkie pola.' });
	}

	connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
		if (error) {
			logger.error('Błąd SELECT:', error.message);
			return res.status(500).json({ message: 'Błąd serwera', error: error.message });
		}

		if (results.length === 0) {
			return res.status(400).json({ message: 'Niepoprawne dane logowania.' });
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
