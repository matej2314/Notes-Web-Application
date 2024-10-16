const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
	host: 'in-v3.mailjet.com', //nazwa usługi
	port: 587,
	auth: {
		user: 'a7a249decdba3c3944ac229567a57e89',
		pass: 'b4b19d303f02667040bba9b10a90450b',
	},
});

const sendEmail = (to, subject, text) => {
	const mailOptions = {
		from: 'mateo2314@gmail.com',
		to: to,
		subject: subject,
		text: text,
	};

	return transporter
		.sendMail(mailOptions)
		.then(info => {
			logger.info('Email wysłany:', info.response);
		})
		.catch(error => {
			logger.error('Błąd wysyłania wiadomości e-mail:', error);
		});
};

module.exports = sendEmail;

//użycie:

//import
//
//sendEmail('adres','temat','tresc').then(()=>{
// console.log('Email został wysłany');
// }).catch((error)=>{
//console.log('Nie udało się wysłać wiadomości', error);
//});
