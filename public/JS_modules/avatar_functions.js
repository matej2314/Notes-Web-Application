const addAvatarBtn = document.getElementById('add_userAvatar');
const addAvatarCont = document.getElementById('add_userAvatar--form');
const avatarFile = document.getElementById('add_userAvatar--input').value;
const sendAvatarBtn = document.getElementById('add_userAvatar--save__btn');

export const showAvatarForm = function () {
	document.getElementById('userProfile--cont').addEventListener('click', function (e) {
		if (e.target && e.target.matches('.add_userAvatar')) {
			addAvatarCont.classList.toggle('invisible');
			addAvatarCont.classList.toggle('visible');
		}
	});
};
