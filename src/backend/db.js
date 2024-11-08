require('dotenv').config({ path: '../../.env' });
const logger = require('./logger');
const mysql = require('mysql2');

let connection;

const handleDisconnect = () => {
	connection = mysql.createConnection({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});

	connection.connect((error) => {
		if (error) {
			console.error('Error connecting to DB:', error);
			logger.error(`Error connecting to DB: ${error.message}`);
			
			setTimeout(handleDisconnect, 5000);
		} else {
			console.log('Connected to MySQL DB');
			logger.info('MYSQL_DB_CONNECTED');
		}
	});

	
	connection.on('error', (error) => {
		logger.error(`DB Connection Error: ${error.message}`);
		if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNRESET') {
			console.log('Reconnecting to MySQL...');
			handleDisconnect(); // Ponowne nawiązanie połączenia
		} else {
			throw error;
		}
	});
};


handleDisconnect();

module.exports = connection;
