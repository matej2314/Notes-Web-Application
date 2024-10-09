const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail', //nazwa usługi
	auth: {
		user: 'moj.email@gmail.com',
		pass: 'haslo_do_email',
	},
});

const sendEmail = (to, subject, text) => {
	const mailOptions = {
		from: 'moj.email@gmail.com',
		to: to,
		subject: subject,
		text: text,
	};

	return transporter
		.sendMail(mailOptions)
		.then(info => {
			console.log('Email wysłany:', info.response);
		})
		.catch(error => {
			console.log('Błąd wysyłania wiadomości e-mail:', error);
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
