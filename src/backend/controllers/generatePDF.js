const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Cookie } = require('express-session');
const { response } = require('express');
const datetime = new Date();

const generatePDF = async (req, res) => {
	const noteText = '';
	const userId = req.body.userId;
	const noteId = req.body.noteId;

	const doc = new PDFDocument();
	const filePath = path.join(__dirname, 'notatki.pdf');
	const fileStream = fs.createWriteStream(filePath);
	doc.pipe(fileStream);

	doc.font(path.join(__dirname, '../../fonts', 'Roboto-Regular.ttf'));

	doc.rect(0, 0, doc.page.width, doc.page.height).fill('white');
	doc.y = 8;

	doc.fontSize(16);
	doc.text('Twoje notatki:', { underline: true, align: 'center' });
};
