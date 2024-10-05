const path = require('path');
const dotenv = require('dotenv').config({ path: '../../../.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT || 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

const sendEmail = async (to, subject, message) => {
	try {
		const mailoptions = {
			from: `Notes Web App sliwowski.copywriting@gmail.com`, //nadawca
			to: to,
			subject: subject,
			html: message,
		};

		const info = await transporter.sendMail(mailoptions);
		console.log(`Email wysłany: %s`, info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('Błąd wysyłania wiad. e-mail:', error.message);
		return { success: false, error };
	}
};

module.exports = { sendEmail };
