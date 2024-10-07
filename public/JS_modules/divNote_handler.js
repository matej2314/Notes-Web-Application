import { deleteNote } from '../JS_modules/main_page_functions.js';
import { showDelModal, hideDelModal } from '../JS_modules/formFunctions.js';
import { getPDF } from './downloadPDF.js';

const editModal = document.getElementById('editNote--form');
const updatedNoteBtn = document.getElementById('sendNewNote--btn');
const delNoteConfirm = document.getElementById('del_Note--btnyes');
const delNoteDeny = document.getElementById('del_Note--btnno');

export function divNoteHandler() {
	document.getElementById('divNotes').addEventListener('click', function (e) {
		if (e.target && e.target.matches('.del_note--btn img')) {
			showDelModal();

			delNoteConfirm.addEventListener('click', function () {
				const noteId = e.target.closest('button').getAttribute('data-noteId');
				const noteElement = e.target.closest('.note-container');

				deleteNote(noteId, noteElement);
				hideDelModal();
			});

			delNoteDeny.addEventListener('click', function () {
				hideDelModal();
			});
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
}

export const divNoteStyle = () => {
	const divNote = document.getElementById('divNotes');

	if (divNote.childElementCount < 2 || divNote.childElementCount === 2) {
		divNote.classList.remove('justify-between');
		divNote.classList.add('justify-start');
	} else {
		divNote.classList.add('justify-between');
	}
};
