const addAvatarBtn = document.getElementById('add_userAvatar');
const addAvatarCont = document.getElementById('add_userAvatar--form');

export const showAvatarForm = function () {
	document.getElementById('userProfile--cont').addEventListener('click', function (e) {
		if (e.target && e.target.matches('.add_userAvatar')) {
			addAvatarCont.classList.toggle('invisible');
			addAvatarCont.classList.toggle('visible');
		}
	});
};
