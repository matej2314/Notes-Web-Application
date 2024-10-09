'use strict';

const btns = document.querySelectorAll('.btn');
const btnLogin = document.getElementById('btn-login');
const modalWindow = document.getElementById('login_window');
const regWindow = document.getElementById('reg_form');
const loginInput = document.getElementById('login_input');
const passwdInput = document.getElementById('pass_input');
const btnSubmit = document.getElementById('btn-submit');
const mainSiteBtn = document.getElementById('mainSiteBtn');
const allinputs = document.querySelectorAll('.input');

function handleCredentialResponse(response) {
	const tokenId = response.credentials;

	fetch('http://localhost:8088/google-login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ tokenId: tokenId }),
		credentials: 'include',
	})
		.then(res => res.json())
		.then(data => {
			if (data.message === 'Zalogowano pomyślnie.') {
				alert('Zalogowano przez Google!');
				window.location.href = 'http://localhost:8088/main';
			} else {
				alert('Błąd logowania z Google!');
			}
		})
		.catch(error => console.log('Błąd logowania:', error.message));
}

btnLogin.addEventListener('click', function () {
	if (regWindow.classList.contains('visible')) {
		regWindow.classList.remove('visible');
		regWindow.classList.add('invisible');
	}
	modalWindow.classList.toggle('invisible');
	modalWindow.classList.toggle('visible');
});

// Funkcja walidująca hasło
function isValidPassword(password) {
	const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!#*$<>:]{10,30}$/;
	return regex.test(password);
}
// Funkcja sanitizująca input (usuwanie niebezpiecznych znaków)
function sanitizeInput(input) {
	return input.replace(/[^a-zA-Z0-9!#*?]/g, ''); // Pozwala na !, #, *, ?
}

btns.forEach(btn =>
	btn.addEventListener('click', function () {
		alert('Zaloguj się, aby uaktywnić funkcję!');
	})
);

btnSubmit.addEventListener('click', async function (e) {
	e.preventDefault();
	console.log('Przycisk kliknięty!');

	const sanitizedUsername = sanitizeInput(loginInput.value.trim());
	const userpassword = passwdInput.value;

	// Logowanie danych przed wysłaniem
	console.log('Dane do przesłania:', { username: loginInput.value, userpassword: userpassword });

	// Walidacja hasła
	if (!isValidPassword(passwdInput.value)) {
		alert('Niepoprawne dane logowania.');
		return;
	}

	// Wysłanie danych do serwera
	try {
		const response = await fetch('http://localhost:8088/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: sanitizedUsername, userpassword }),
		});

		// Logowanie statusu odpowiedzi
		console.log('Status odpowiedzi serwera:', response.body);

		if (response.ok) {
			// Odczytanie odpowiedzi tylko raz
			const result = await response.json();

			alert(`Witamy spowrotem! ${result.username}`);
			sessionStorage.setItem('userId', result.userId);
			window.location.href = result.redirectUrl;
		} else {
			const errorMessage = await response.text();
			alert('Niepoprawne dane logowania. ' + errorMessage);
		}
	} catch (error) {
		console.log('Błąd:', error);
		alert('Wystąpił błąd podczas logowania');
	}
});
