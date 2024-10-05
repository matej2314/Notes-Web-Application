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

// Zdarzenie kliknięcia przycisku logowania
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
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*_.-]).{10,30}$/;
	return regex.test(password);
}

// Funkcja sanityzująca dane wejściowe
function sanitizeInput(input) {
	return input.replace(/[^a-zA-Z0-9_]/g, ''); // Umożliwienie znaku podkreślenia
}

// Zdarzenie kliknięcia przycisku (inne funkcje)
btns.forEach(btn =>
	btn.addEventListener('click', function () {
		alert('Zaloguj się, aby uaktywnić funkcję!');
	})
);

// Zdarzenie kliknięcia przycisku zatwierdzającego logowanie
btnSubmit.addEventListener('click', async function (e) {
	e.preventDefault(); // Zapobieganie domyślnemu zachowaniu formularza

	// Oczyszczanie danych wejściowych
	const sanitizedUsername = sanitizeInput(loginInput.value.trim());
	const userpassword = passwdInput.value;

	// Walidacja hasła
	if (!isValidPassword(userpassword)) {
		alert('Hasło musi zawierać co najmniej jedną cyfrę, małą literę, znak specjalny oraz mieć długość od 10 do 30 znaków.');
		return;
	}

	console.log('Zalogowanie:', { username: sanitizedUsername, password: userpassword });

	try {
		const response = await fetch('http://localhost:8088/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: sanitizedUsername, userpassword }), // Upewnij się, że nazwy pól są zgodne
		});

		console.log('Status odpowiedzi serwera:', response.status);

		if (response.ok) {
			const result = await response.json();
			alert(`Witamy z powrotem, ${result.username}!`);
			sessionStorage.setItem('userId', result.userId);
			window.location.href = result.redirectUrl; // Przekierowanie na stronę główną
		} else {
			const errorMessage = await response.json(); // Odczytywanie wiadomości błędu w formacie JSON
			alert('Niepoprawne dane logowania: ' + errorMessage.message); // Wyświetlanie komunikatu z serwera
		}
	} catch (error) {
		console.error('Błąd:', error);
		alert('Wystąpił błąd podczas logowania');
	}
});
