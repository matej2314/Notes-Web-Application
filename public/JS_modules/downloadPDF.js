export const getPDF = async function (noteId, noteTitle, noteText, noteDate) {
	try {
		const response = await fetch('http://localhost:8088/notes/generate-pdf', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ noteId, noteTitle, noteText, noteDate }),
		});

		if (!response.ok) {
			throw new Error('Błąd pobierania pliku PDF');
		}

		const blob = await response.blob();

		const url = window.URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'notatka.pdf';
		document.body.appendChild(a);
		a.click();

		a.remove();

		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.log('Wystąpił błąd podczas pobierania pliku PDF:', error);
		alert('Wystąpił błąd podczas pobierania pliku PDF');
	}
};
