export const logOut = async function (req, res) {
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

export const changeEmailFr = async function (req, res) {
	const user_changeMail = document.getElementById('name_change--input');
	const user_oldMail = document.getElementById('old_userMail--input');
	const user_newMail = document.getElementById('new_userMail--input');

	try {
		const response = await fetch('http://localhost:8088/usermail', {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: user_changeMail.value, email: user_oldMail.value, newEmail: user_newMail.value }),
		});

		if (!response.ok) {
			console.log('Wystąpił błąd podczas zmiany hasła:', response.statusText);
			alert('Błąd podczas zmiany hasła.');
			return;
		}

		const res = await response.json();
		alert('Adres e-mail zmieniony poprawnie.');
	} catch (err) {
		if (err) {
			console.log('Błąd zmiany adresu e-mail:', err.message);
		}
	}
};
