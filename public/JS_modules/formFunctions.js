const addNoteForm = document.getElementById('addNote--form');
const editNoteForm = document.getElementById('editNote--form');

export const showAddForm = function () {
	addNoteForm.classList.remove('invisible');
	addNoteForm.classList.add('visible');
};

export const closeAddForm = function () {
	const closeNoteForm = document.getElementById('closeNoteForm--btn');
	closeNoteForm.addEventListener('click', function () {
		addNoteForm.classList.remove('visible');
		addNoteForm.classList.add('invisible');
	});
};

export const closeEditForm = function () {
	const closeEditForm = document.getElementById('closeEditForm--btn');
	closeEditForm.addEventListener('click', function () {
		editNoteForm.classList.remove('visible');
		editNoteForm.classList.add('invisible');
	});
};

export const formDate = function (date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
};
