const addNoteForm = document.getElementById('addNote--form');
const editModal = document.getElementById('editNote--form');
const delnoteModal = document.getElementById('del_Note--modal');
const changePassModal = document.getElementById('');
const closeAvatarForm = document.getElementById('close_Avatar--form');
const userAvatarForm = document.getElementById('add_userAvatar--form');

export const showAddForm = function () {
	addNoteForm.classList.toggle('invisible');
	addNoteForm.classList.toggle('visible');
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
		editModal.classList.toggle('visible');
		editModal.classList.toggle('invisible');
	});
};

export const showDelModal = function () {
	delnoteModal.classList.remove('invisible');
	delnoteModal.classList.add('visible');
};

export const hideDelModal = function () {
	delnoteModal.classList.remove('visible');
	delnoteModal.classList.add('invisible');
};

export const changePassForm = function () {
	const changePassBtn = document.getElementById('change_userPass--btn');
	const changePassForm = document.getElementById('change_userPass--form');
	const closePassFormBtn = document.getElementById('closePassForm--btn');

	changePassBtn.addEventListener('click', function () {
		changePassForm.classList.toggle('invisible');
		changePassForm.classList.toggle('visible');
	});

	closePassFormBtn.addEventListener('click', function () {
		changePassForm.classList.remove('visible');
		changePassForm.classList.add('invisible');
	});
};

export const MailForm = function () {
	const changeMailBtn = document.getElementById('change_userMail--btn');
	const changeMailForm = document.getElementById('change_userMail--form');
	const closeMailFormBtn = document.getElementById('closeMailForm--btn');

	changeMailBtn.addEventListener('click', function () {
		changeMailForm.classList.toggle('invisible');
		changeMailForm.classList.toggle('visible');
	});

	closeMailFormBtn.addEventListener('click', function () {
		changeMailForm.classList.remove('visible');
		changeMailForm.classList.add('invisible');
	});
};
export const closeAvFrom = function () {
	userAvatarForm.classList.remove('visible');
	userAvatarForm.classList.add('invisible');
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
