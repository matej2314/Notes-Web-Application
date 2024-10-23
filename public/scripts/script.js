'use strict';

const btns = document.querySelectorAll('.btn');
const btnLogin = document.getElementById('btn-login');
const modalWindow = document.getElementById('login_window');
const regWindow = document.getElementById('reg_form');
const loginInput = document.getElementById('login_input');
const loginEmailInput = document.getElementById('login_email--input');
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

function isValidPassword(password) {
	// Minimum 8 znaków, przynajmniej jedna mała litera, jedna duża litera, jedna cyfra i jeden ze znaków specjalnych *!#^%$@?
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*!#^%$@?])[a-zA-Z\d*!#^%$@?]{10,30}$/;
	return regex.test(password);
}

function sanitizeInput(input) {
	// Pozwalamy na litery, cyfry oraz znaki specjalne *!#^%$@?
	const sanitized = input.replace(/[^a-zA-Z0-9*!#^%$@?]/g, '');
	return sanitized;
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
	const userEmail = loginEmailInput.value;

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
			body: JSON.stringify({ username: sanitizedUsername, userpassword, email: userEmail }),
		});

		if (response.ok) {
			// Odczytanie odpowiedzi tylko raz
			const result = await response.json();

			alert(`Witamy spowrotem! ${result.username}`);
			sessionStorage.setItem('userId', result.userId);
			window.location.href = result.redirectUrl;
		} else {
			alert('Niepoprawne dane logowania');
		}
	} catch (error) {
		alert('Wystąpił błąd podczas logowania');
	}
});
