'use strict';

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const datetime = new Date().toLocaleString('pl');

const generatePDF = async (req, res) => {
	console.log('Dane przekazane na endpoint PDF:', req.body);
	const userId = req.userId;
	const noteId = req.body.noteId;
	const noteTitle = req.body.noteTitle;
	const noteContent = req.body.noteText;
	const noteDate = req.body.noteDate;

	if (!userId || !noteId || !noteTitle || !noteContent || !noteDate) {
		res.status(400).json({ message: 'Brak danych do PDF.' });
	}

	const doc = new PDFDocument();
	const filePath = path.join(__dirname, 'notatka.pdf');
	const fileStream = fs.createWriteStream(filePath);
	doc.pipe(fileStream);

	doc.font(path.join(__dirname, '../../fonts/Roboto/Roboto-Regular.ttf'));

	doc.rect(0, 0, doc.page.width, doc.page.height).fill('white');
	doc.y = 8;

	doc.fillColor('black');
	doc.lineGap(5);
	doc.fontSize(16);
	doc.text(`Notatka: ${noteTitle}`, { underline: true, align: 'center' });
	doc.moveDown();
	doc.text(`Utworzona dnia ${noteDate}`, { align: 'center' });
	doc.text(`ID: ${noteId}`, { align: 'center' });
	doc.moveDown();
	doc.text(`Treść:  ${noteContent}`);
	doc.moveDown();
	doc.text(`Wygenerowano dnia:  ${datetime}`);
	doc.end();

	fileStream.on('finish', () => {
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'attachment; filename="notatka.pdf"');
		res.sendFile(filePath, err => {
			if (err) {
				console.log('Wystąpił błąd podczas wysyłania pliku:', err.message);
				res.status(500).json({ message: 'Błąd pobierania pliku PDF' });
			} else {
				console.log('Plik PDF został wysłany');

				fs.unlink(filePath, err => {
					if (err) {
						console.log('Wystąpił błąd:', err.message);
					} else {
						console.log('Plik PDF został usunięty z serwera.');
					}
				});
			}
		});
	});
};

module.exports = generatePDF;
