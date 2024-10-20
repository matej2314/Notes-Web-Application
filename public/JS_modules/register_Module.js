'use strict';

const divReg = document.getElementById('reg_form');
const divLogin = document.getElementById('login_window');
const btnReg = document.getElementById('btn-reg');
const regLogin = document.getElementById('reg_login--input');
const regPass = document.getElementById('reg_passwd--input');
const repRegPass = document.getElementById('rep_regpasswd--input');
const regEmail = document.getElementById('reg_email--input');
const regSubmit = document.getElementById('reg_submit--btn');

function isValidPassword(password) {
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[*!#^])[A-Za-z\d*!#^]{10,30}$/;
	return regex.test(password);
}

// Funkcja sanitizująca input (usuwanie niebezpiecznych znaków)
function sanitizeInput(input) {
	return input.replace(/[^a-zA-Z0-9!#*?@.]/g, ''); // Pozwala na !, #, *, ?, @, .
}

function containsDangCharacters(input) {
	const dngPattern = /[<>"'`;&|\/"]|(--|\/\*|\*\/|select|insert|update|delete|drop|alter|truncate)/i;
	return dngPattern.test(input);
}

btnReg.addEventListener('click', function () {
	if (divLogin.classList.contains('visible')) {
		divLogin.classList.remove('visible');
		divLogin.classList.add('invisible');
	}
	divReg.classList.toggle('invisible');
	divReg.classList.toggle('visible');
});

// Zaktualizowana funkcja do walidacji pól rejestracji
function processInput() {
	const inFields = [regLogin, regEmail, regPass];
	let allFieldsValid = true;

	inFields.forEach((field, index) => {
		const sanitizedValue = sanitizeInput(field.value.trim());
		field.value = sanitizedValue;

		if (containsDangCharacters(sanitizedValue)) {
			alert(`Pole ${index + 1} zawiera niebezpieczne znaki!`);
			allFieldsValid = false;
			return;
		}

		if (field === regLogin && sanitizedValue.length < 5) {
			alert('Podaj prawidłową nazwę użytkownika! (Minimum 5 znaków)');
			allFieldsValid = false;
		}

		if (field === regEmail && !field.value.includes('@')) {
			alert('Podaj prawidłowy adres e-mail!');
			allFieldsValid = false;
		}

		if (field === regPass && !isValidPassword(sanitizedValue)) {
			alert('Wpisz prawidłowe hasło! (od 10 do 30 znaków, jedna duża litera, jedna cyfra, 1 znak specjalny (*^#!))');
			allFieldsValid = false;
		}
	});

	return allFieldsValid;
}

regSubmit.addEventListener('click', async function (e) {
	e.preventDefault();

	if (processInput()) {
		if (regPass.value !== repRegPass.value) {
			alert('Hasła muszą być identyczne!');
			return;
		}

		console.log(regLogin.value, regEmail.value, regPass.value);
		try {
			const response = await fetch('http://localhost:8088/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					reg_username: regLogin.value,
					reg_email: regEmail.value,
					reg_password: regPass.value,
				}),
			});

			if (response.ok) {
				const result = await response.json();
				alert('Użytkownik zarejestrowany. Możesz się zalogować');
				divReg.classList.add('invisible');
			} else {
				const errorMessage = await response.text();
				alert('Rejestracja nie powiodła się: ' + errorMessage);
			}
		} catch (error) {
			console.log('Błąd podczas rejestracji:', error.message);
			alert('Błąd podczas rejestracji.');
		}
	}
});
