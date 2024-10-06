'use strict';

const divReg = document.getElementById('reg_form');
const divLogin = document.getElementById('login_window');
const btnReg = document.getElementById('btn-reg');
const regLogin = document.getElementById('reg_login--input');
const regPass = document.getElementById('reg_passwd--input');
const repRegPass = document.getElementById('rep_regpasswd--input');
const regEmail = document.getElementById('reg_email--input');
const regSubmit = document.getElementById('reg_submit--btn');

btnReg.addEventListener('click', function () {
	if (divLogin.classList.contains('visible')) {
		divLogin.classList.remove('visible');
		divLogin.classList.add('invisible');
	}
	divReg.classList.toggle('invisible');
	divReg.classList.toggle('visible');
});

regLogin.addEventListener('input', event => {
	if (regLogin.validity.typeMismatch) {
		regLogin.setCustomValidity('Podaj prawidłową nazwę użytkownika!');
	} else {
		regLogin.setCustomValidity('');
	}
});

regPass.addEventListener('input', event => {
	if (regPass.validity.typeMismatch) {
		regPass.setCustomValidity('Wpisz prawidłowe hasło!');
	} else {
		regPass.setCustomValidity('');
	}
});

regEmail.addEventListener('input', event => {
	if (regEmail.validity.typeMismatch) {
		regEmail.setCustomValidity('Podaj prawidłowy adres e-mail!');
	} else {
		regEmail.setCustomValidity('');
	}
});

// Zaktualizowana funkcja sanitizeInput
function sanitizeInput(input) {
	// Zachowaj znaki alfanumeryczne oraz @, ., *, #, !
	return input.replace(/[^a-z0-9@.*#!]/gi, '');
}

function containsDangCharacters(input) {
	const dngPattern = /[<>"'`;&|\/"]|(--|\/\*|\*\/|select|insert|update|delete|drop|alter|truncate)/i;
	return dngPattern.test(input);
}

function processInput() {
	const inFields = [regLogin, regEmail, regPass, repRegPass];
	let allFieldsValid = true;

	for (let i = 0; i < inFields.length; i++) {
		let sanitizedValue = sanitizeInput(inFields[i].value.trim());
		inFields[i].value = sanitizedValue;

		if (containsDangCharacters(sanitizedValue)) {
			alert(`Pole ${i + 1} może zawierać tylko litery i cyfry!`);
			allFieldsValid = false;
			break;
		}
	}
	return allFieldsValid;
}

regSubmit.addEventListener('click', async function (e) {
	e.preventDefault();

	if (processInput()) {
		if (regPass.value !== repRegPass.value) {
			alert('Hasła muszą być identyczne!');
			return;
		}

		try {
			const response = await fetch('http://localhost:8088/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ reg_username: regLogin.value, reg_email: regEmail.value, reg_password: regPass.value }),
			});

			if (response.ok) {
				const result = await response.json();
				alert('Użytkownik zarejestrowany. Możesz się zalogować');
				divReg.classList.add('invisible');
			} else {
				alert('Rejestracja nie powiodła się.');
			}
		} catch (error) {
			console.log('Błąd podczas rejestracji:', error.message);
			alert('Błąd podczas rejestracji.');
		}
	}
});
