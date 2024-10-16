const path = require('path');
const dotenv = require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = process.env.SERV_PORT || 8088;
const favicon = require('serve-favicon');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const logger = require('./src/backend/logger.js');

app.use(cookieParser());
app.use(express.json());

app.use(
	cors({
		origin: (origin, callback) => {
			const allowedOrigins = [`http://localhost:8088`, `http://127.0.0.1:8088`];
			if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

app.use(fileUpload());

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
	logger.info(`SERVER LISTENING ON PORT ${port}`);
});
