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
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^*\-+=\[\]{};':"\\,.?~]).{10,30}$/;
	return regex.test(password);
}

// Funkcja sanitizująca input (usuwanie niebezpiecznych znaków)
function sanitizeInput(input) {
	return input.replace(/[^a-zA-Z0-9]/g, '');
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
	console.log('Dane do przesłania:', { username: sanitizedUsername, userpassword: userpassword });

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
		console.log('Status odpowiedzi serwera:', response.status);

		if (response.ok) {
			// Odczytanie odpowiedzi tylko raz
			const result = await response.json();

			alert(`Witamy spowrotem! ${result.username}`);
			sessionStorage.setItem('userId', result.userId);
			window.location.href = result.redirectUrl; // Przekierowanie na URL
		} else {
			// W tej sekcji nie wywołujemy response.json() ponownie
			const errorMessage = await response.text(); // Możesz też użyć response.json(), jeśli zwracasz JSON
			alert('Niepoprawne dane logowania. ' + errorMessage);
		}
	} catch (error) {
		console.log('Błąd:', error);
		alert('Wystąpił błąd podczas logowania');
	}
});
