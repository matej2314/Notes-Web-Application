import { showNote, deleteNote, updateNote } from '../JS_modules/main_page_functions.js';
import { logOut, changeEmailFr } from '../JS_modules/user_functions.js';
import { showAddForm, closeAddForm, closeEditForm, MailForm, showDelModal, hideDelModal } from '../JS_modules/formFunctions.js';
import { showAvatarForm } from '../JS_modules/avatar_functions.js';
import { getPDF } from '../JS_modules/downloadPDF.js';

const logOutBtns = document.querySelectorAll('.logOutBtn');
const addNoteBtns = document.querySelectorAll('.addnote');
const noteTitle = document.getElementById('input_noteTitle');
const noteWeight = document.getElementById('input_noteWeight');
const noteText = document.getElementById('input_noteText');
const saveNoteBtn = document.getElementById('sendNote--btn');
const editModal = document.getElementById('editNote--form');
const updatedNoteBtn = document.getElementById('sendNewNote--btn');
const fromNewestBtn = document.getElementById('fromNewest--btn');
const fromOldestBtn = document.getElementById('fromOldest--btn');
const changeEmailBtn = document.getElementById('sendNewEmail--btn');
const delNoteConfirm = document.getElementById('del_Note--btnyes');
const delNoteDeny = document.getElementById('del_Note--btnno');

const addNote = async function () {
	const noteTitleValue = noteTitle.value;
	const noteTextValue = noteText.value;
	const noteWeightValue = noteWeight.value;

	try {
		const response = await fetch('http://localhost:8088/notes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				notetitle: noteTitleValue,
				notetext: noteTextValue,
				weight: noteWeightValue,
			}),
			credentials: 'include',
		});

		if (!response.ok) {
			console.log('Wystąpił błąd podczas wysyłania danych:', response.statusText);
			alert('Błąd pobierania danych');
			return;
		}

		const addedNote = await response.json();

		if (addedNote && addedNote.noteId) {
			alert(`Dodano notatkę o ID: ${addedNote.noteId}`);
			location.reload();
		}
	} catch (error) {
		console.log('Wystąpił błąd podczas wysyłania danych:', error.message);
		alert('Wystąpił błąd. Spróbuj ponownie.');
	}
};

saveNoteBtn.addEventListener('click', function (e) {
	e.preventDefault();
	addNote();
	closeAddForm();
});

document.addEventListener('DOMContentLoaded', async function () {
	const getAllNotes = async function () {
		try {
			const response = await fetch('http://localhost:8088/notes/all', {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Nie udało się pobrać notatek', response.statusText);
			}

			const notes = await response.json();
			return notes;
		} catch (error) {
			console.log('Wystąpił błąd podczas pobierania notatek:', error.message);
			alert('Nie udało się pobrać notatek');
			return null;
		}
	};

	let currentNotes = [];

	const sortNotes = (notes, order) => {
		return notes.sort((a, b) => new Date(order === 'newest' ? b.date : a.date) - new Date(order === 'newest' ? a.date : b.date));
	};

	const loadNotes = async () => {
		const notes = await getAllNotes();
		if (notes) {
			currentNotes = notes.notes;
			showNote({ notes: sortNotes(currentNotes, 'newest') });
		}
	};

	loadNotes();

	const updateNotes = order => {
		clearNotes();
		showNote({ notes: sortNotes(currentNotes, order) });
	};

	fromOldestBtn.addEventListener('click', () => updateNotes('oldest'));
	fromNewestBtn.addEventListener('click', () => updateNotes('newest'));

	const clearNotes = () => {
		while (divNotes.firstChild) {
			divNotes.removeChild(divNotes.firstChild);
		}
	};
});

document.getElementById('divNotes').addEventListener('click', function (e) {
	if (e.target && e.target.matches('.del_note--btn img')) {
		showDelModal();
		delNoteConfirm.addEventListener('click', function () {
			const noteId = e.target.closest('button').getAttribute('data-noteId');
			const noteElement = e.target.closest('.note-container');

			deleteNote(noteId, noteElement);
			hideDelModal();
		});

		delNoteDeny.addEventListener('click', hideDelModal);
	}

	if (e.target && e.target.matches('.edit_note--btn img')) {
		const editButton = e.target.closest('button');
		const noteId = editButton.getAttribute('data-noteId');
		const noteTitle = editButton.getAttribute('data-noteTitle');
		const noteWeight = editButton.getAttribute('data-noteWeight');
		const noteText = editButton.getAttribute('data-noteText');
		const updateAtr = updatedNoteBtn.setAttribute('data-noteId', noteId);

		document.getElementById('input_editTitle').value = noteTitle;
		document.getElementById('input_editWeight').value = noteWeight;
		document.getElementById('input_editNoteText').value = noteText;

		editModal.classList.toggle('invisible');
		editModal.classList.toggle('visible');
	}

	if (e.target.matches('.pdf_note--btn img')) {
		const pdfBtn = e.target.closest('button');
		const noteId = pdfBtn.getAttribute('data-noteId');
		const noteTitle = pdfBtn.getAttribute('data-noteTitle');
		const noteDate = pdfBtn.getAttribute('data-notedate');
		const noteText = pdfBtn.getAttribute('data-noteText');

		getPDF(noteId, noteTitle, noteText, noteDate);
	}
});

updatedNoteBtn.addEventListener('click', function (e) {
	e.preventDefault();
	const noteTitle = document.getElementById('input_editTitle').value;
	const noteWeight = document.getElementById('input_editWeight').value;
	const noteContent = document.getElementById('input_editNoteText').value;
	const noteId = updatedNoteBtn.getAttribute('data-noteId');

	updateNote(noteId, noteTitle, noteContent, noteWeight);

	updatedNoteBtn.removeAttribute('data-noteId');
	editModal.classList.remove('visible');
	editModal.classList.add('invisible');

	location.reload();
});

changeEmailBtn.addEventListener('click', function (e) {
	e.preventDefault();
	changeEmailFr();
});

logOutBtns.forEach(btn => btn.addEventListener('click', logOut));

addNoteBtns.forEach(btn => btn.addEventListener('click', showAddForm));

closeAddForm();
closeEditForm();
MailForm();
showAvatarForm();
