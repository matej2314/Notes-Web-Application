const path = require('path');
const dotenv = require('dotenv').config({ path: './.env' });
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const connection = require('./src/backend/db');
const port = process.env.SERV_PORT;
const favicon = require('serve-favicon');

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

const indexRoutes = require('./src/backend/routes/pages.js');
const notesRoutes = require('./src/backend/routes/notesRoutes.js');
// const authRoutes = require('./src/backend/routes/auth');

app.use('/notes', notesRoutes);
// app.use('/auth', authRoutes);

app.listen(port, () => {
	console.log(`SERVER LISTENING ON PORT ${port}`);
});
