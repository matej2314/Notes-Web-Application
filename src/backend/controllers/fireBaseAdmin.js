const admin = require('firebase-admin');

const serviceAccount = require('sciezka do pliku serviceAccount pobr. z firebase');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
