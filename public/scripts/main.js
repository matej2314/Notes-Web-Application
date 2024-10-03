import { showNote, logOut, deleteNote, updateNote } from '../JS_modules/main_page_functions.js';
import { showAddForm, closeAddForm, closeEditForm } from '../JS_modules/formFunctions.js';

const logOutBtns = document.querySelectorAll('.logOutBtn');
const addNoteBtns = document.querySelectorAll('.addnote');
const noteTitle = document.getElementById('input_noteTitle');
const noteWeight = document.getElementById('input_noteWeight');
const noteText = document.getElementById('input_noteText');
const saveNoteBtn = document.getElementById('sendNote--btn');
const editModal = document.getElementById('editNote--form');
const updatedNoteBtn = document.getElementById('sendNewNote--btn');

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
		}
	} catch (error) {
		console.log('Wystąpił błąd podczas wysyłania danych:', error.message);
		alert('Wystąpił błąd. Spróbuj ponownie.');
	}
};

saveNoteBtn.addEventListener('click', function (e) {
	e.preventDefault();
	addNoteForm.classList.remove('visible');
	addNoteForm.classList.add('invisible');
	location.reload();
	addNote();
});

document.addEventListener('DOMContentLoaded', function () {
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

	getAllNotes().then(notes => {
		if (notes) {
			showNote(notes);
		}
	});
});

document.getElementById('divNotes').addEventListener('click', function (e) {
	if (e.target && e.target.matches('.del_note--btn img')) {
		const noteId = e.target.closest('button').getAttribute('data-noteId');
		const noteElement = e.target.closest('.note-container');

		deleteNote(noteId, noteElement);
	}

	if (e.target && e.target.matches('.edit_note--btn img')) {
		const editButton = e.target.closest('button'); // Pobierz przycisk edycji
		const noteId = editButton.getAttribute('data-noteId');
		const noteTitle = editButton.getAttribute('data-noteTitle');
		const noteWeight = editButton.getAttribute('data-noteWeight');
		const noteText = editButton.getAttribute('data-noteText');

		document.getElementById('input_editTitle').value = noteTitle;
		document.getElementById('input_editWeight').value = noteWeight;
		document.getElementById('input_editNoteText').value = noteText;

		editModal.classList.remove('invisible');
		editModal.classList.add('visible');
	}
});

// updatedNoteBtn.addEventListener('click', function (e) {
// 	e.preventDefault();
// });

logOutBtns.forEach(btn => btn.addEventListener('click', logOut));

addNoteBtns.forEach(btn => btn.addEventListener('click', showAddForm));

closeAddForm();
closeEditForm();
