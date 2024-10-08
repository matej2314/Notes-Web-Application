const avatarContainer = document.getElementById('profile_img--cont');
const avatarForm = document.getElementById('add_userAvatar--form');

export const getAvatar = async function (req, res) {
	try {
		const response = await fetch('http://localhost:8088/avatar', {
			method: 'GET',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			console.log('Błąd serwera');
			return;
		}

		const avatar = await response.json();
		const avFromDb = avatar.avatar;

		createAvatarHandler(avFromDb);
	} catch (error) {
		console.log('Wystąpił błąd podczas pobierania avatara.', error.message);
		return null;
	}
};

export const createAvatarHandler = function (avFromDb) {
	const existingAvatar = document.getElementById('userAvatar--img');

	if (existingAvatar) {
		avatarContainer.removeChild(existingAvatar);
	}

	const imgEl = document.createElement('img');
	imgEl.id = 'userAvatar--img';

	if (avFromDb) {
		imgEl.src = `../images/avatars/${avFromDb}`;
	} else {
		imgEl.src = '../images/avatars/default.jpg';
	}

	avatarContainer.appendChild(imgEl);
};

export const showAvatarForm = function () {
	document.addEventListener('click', function (e) {
		if (e.target && e.target.matches('.add_userAvatar')) {
			avatarForm.classList.toggle('invisible');
			avatarForm.classList.toggle('visible');
		}
	});
};
