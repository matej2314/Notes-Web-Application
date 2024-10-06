const path = require('path');
const dotenv = require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = process.env.SERV_PORT;
const favicon = require('serve-favicon');
const cors = require('cors');

app.use(cookieParser());

app.use(
	cors({
		origin: 'http://localhost:8088',
		credentials: true,
	})
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(favicon(path.join(__dirname, './public/images', 'favicon.ico')));

const indexRoutes = require('./src/backend/routes/pages.js');
const notesRoutes = require('./src/backend/routes/notesRoutes.js');
const authRoutes = require('./src/backend/routes/auth.js');

app.use('/notes', notesRoutes);
app.use('/', indexRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
	console.log(`SERVER LISTENING ON PORT ${port}`);
});

// process.on('SIGTERM', () => {
// 	server.close(() => {
// 		console.log('Proces zakończony');
// 	});
// });

// process.on('SIGINT', () => {
// 	server.close(() => {
// 		console.log('Aplikacja została przerwana');
// 	});
// });
