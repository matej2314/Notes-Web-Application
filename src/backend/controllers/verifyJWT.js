const dotenv = require('dotenv').config({ path: '../../../.env' });

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
	const token = req.cookies['SESSID'];

	if (!token) {
		return res.status(401).send('Błąd uwierzytelniania. Brak dostępu.');
	}

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			console.log('Błąd autoryzacji:', err);
			return res.status(401).send('Dane uwierzytelniające nie prawidłowe.');
		}

		req.userId = decoded.id;
		next();
	});
};

module.exports = verifyToken;
