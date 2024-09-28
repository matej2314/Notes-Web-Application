require('dotenv').config({ path: '../../.env' });

const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

connection.connect(function (error) {
	if (error) {
		console.log(`ERROR! Can not connect to DB:`, error);
		return;
	} else {
		console.log('MYSQL_DB_CONNECTED');
	}
});

module.exports = connection;
