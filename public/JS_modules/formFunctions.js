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
