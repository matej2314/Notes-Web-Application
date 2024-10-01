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
		origin: 'http://localhost:8080',
	})
);

app.use(express.static(path.join(__dirname, 'public')));

// Middleware do obsługi danych z formularzy i JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(favicon(path.join(__dirname, './public/images', 'favicon.ico')));

// Ścieżki do innych funkcji
const indexRoutes = require('./src/backend/routes/pages.js');
const notesRoutes = require('./src/backend/routes/notesRoutes.js');
const authRoutes = require('./src/backend/routes/auth.js');
app.use('/notes', notesRoutes);
app.use('/', indexRoutes);
app.use('/', authRoutes);

// app.get('/generate-pdf', generatePDF);

// Uruchomienie serwera
app.listen(port, () => {
	console.log(`SERVER LISTENING ON PORT ${port}`);
});
