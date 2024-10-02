import { showNote } from '../JS_modules/main_page_functions';

const logOutBtns = document.querySelectorAll('.logOutBtn');
const addNoteBtns = document.querySelectorAll('.addnote');
const addNoteForm = document.getElementById('addNote--form');
const closeNoteForm = document.getElementById('closeNoteForm--btn');

const noteTitle = document.getElementById('input_noteTitle');
const noteWeight = document.getElementById('input_noteWeight');
const noteText = document.getElementById('input_noteText');
const saveNoteBtn = document.getElementById('sendNote--btn');
const deleteBtns = document.querySelectorAll('del_note--btn');

const logOut = async function (req, res) {
	try {
		const response = await fetch('http://localhost:8088/logout', {
			method: 'POST',
			credentials: 'include',
		});

		if (response.ok) {
			alert('Wylogowano pomyślnie!');
			window.location.href = '/';
		} else {
			alert('Wylogowanie nie powiodło się');
		}
	} catch (error) {
		if (error) {
			console.log('Wystąpił błąd:', error.message);
			alert('Wystąpił błąd podczas wylogowywania.');
		}
	}
};

logOutBtns.forEach(btn => btn.addEventListener('click', logOut));

const showAddForm = function () {
	addNoteForm.classList.remove('invisible');
	addNoteForm.classList.add('visible');
};

addNoteBtns.forEach(btn => btn.addEventListener('click', showAddForm));

closeNoteForm.addEventListener('click', function () {
	addNoteForm.classList.remove('visible');
	addNoteForm.classList.add('invisible');
});

// const showNote = function () {
// 	const divNotes = document.getElementById('divNotes');
// 	const newNoteId = sessionStorage.getItem('noteId');

// 	const html = ` <div class="h-fit w-1/4 flex flex-col justify-start align-center bg-[#ffffa2] pl-15 pt-2 pb-2 ml-10 mt-10 shadow-zinc-400 shadow-lg">
//                         <h2 class="w-full h-fit font-shantell flex flex-row justify-center">T${noteTitle.value}</h2>
//                         <h4 class="w-full h-fit font-roboto flex flex-row justify-center text-sm" id="note_noteId">ID ${newNoteId}</h4>
//                         <h4 class="w-full h-fit font-roboto flex flex-row justify-center text-sm">Priorytet: ${noteWeight.value}</h4>
//                         <p class="w-full h-full font-shantell text-2xl ml-2">${noteText.value}</p>
//                         <div id="icons_container--yellow" class=" w-full h-fit flex flex-row justify-end mt-5">
//                             <button id="pdf_note--btn"><img src="../images/pdf-file.png" alt="generate-pdf-file" /></button>
//                             <button id="edit_note--btn"><img src="../images/edit.png" alt="edit your note" class="ml-2" /></button>
//                             <button id="del_note--btn" class="del_note--btn"><img src="../images/bin.png" alt="delete your note" class="ml-2" /></button>
//                         </div>`;

// 	divNotes.insertAdjacentHTML('beforeend', html);
// };

// const deleteNote = async function () {
// 	const noteId = document.getElementById('note_noteId');
// 	try {
// 		const response = await fetch(`http://localhost:8088/notes`, {
// 			method: 'DELETE',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ noteId: noteId.value }),

// 			credentials: 'include',
// 		});

// 		if (!response.ok) {
// 			console.log('Wystąpił błąd podczas wysyłania danych:', response.statusText);
// 			alert('Błąd podczas usuwania notatki.');
// 			return;
// 		}

// 		const deletedNote = await response.json();
// 		alert(deleteNote.message);
// 	} catch (error) {
// 		if (error) {
// 			throw new Error('Wystąpił błąd:', error.message);
// 		}
// 	}
// };

// deleteBtns.forEach(btn =>
// 	btn.addEventListener('click', function (e) {
// 		e.preventDefault();
// 		deleteNote();
// 	})
// );

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
			sessionStorage.setItem('noteId', addedNote.noteId);

			showNote();
		}
	} catch (error) {
		console.log('Wystąpił błąd podczas wysyłania danych:', error.message);
		alert('Wystąpił błąd. Spróbuj ponownie.');
	}
};

saveNoteBtn.addEventListener('click', function (e) {
	e.preventDefault();
	addNote();
});
