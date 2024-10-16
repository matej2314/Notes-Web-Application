const path = require('path');
const connection = require('../db');
const logger = require('../logger');

const uploadFile = (req, res) => {
	const userId = req.userId;
	const userAvatar = req.files.userAvatar;
	const fileExtension = path.extname(userAvatar.name);
	const fileName = `${userId}_avatar${fileExtension}`;

	let uploadPath = path.join(__dirname, '../../../public/images/avatars', fileName);

	if (req.files.userAvatar.length === 0) {
		return res.status(400).json({ message: 'No files were uploaded' });
	}

	userAvatar.mv(uploadPath, function (err) {
		if (err) {
			logger.error(err.message);
			return res.status(500).json({ message: err.message });
		}

		const sql = 'UPDATE users SET avatar=? where id=?';

		connection.query(sql, [fileName, userId], (err, result) => {
			if (err) {
				logger.err(err.message);
				return res.status(500).json({ message: 'Błąd zapisu pliku.' });
			}

			res.status(200).json({ message: 'Plik dodany.' });
		});
	});
};

module.exports = uploadFile;
