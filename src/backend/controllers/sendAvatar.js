const connection = require('../db');
const express = require('express');

const sendAvatar = (req, res) => {
	userId = req.userId;

	const sqlQuery = 'SELECT avatar FROM users WHERE id=?';

	connection.query(sqlQuery, [userId], (err, result) => {
		if (err) {
			console.log('Wystąpił błąd pobierania avatara', err.message);
			return res.status(500).json({ message: 'Błąd serwera.' });
		}

		if (result.length === 0) {
			return res.status(404).json({ message: 'Nie znaleziono użytkownika.' });
		}
		const avatar = result[0].avatar;

		return res.status(200).json({
			avatar: avatar,
		});
	});
};

module.exports = sendAvatar;
