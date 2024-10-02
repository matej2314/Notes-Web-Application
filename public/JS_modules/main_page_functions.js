'use strict';

export const showNote = function () {
	const divNotes = document.getElementById('divNotes');
	const newNoteId = sessionStorage.getItem('noteId');

	const html = ` <div class="h-fit w-1/4 flex flex-col justify-start align-center bg-[#ffffa2] pl-15 pt-2 pb-2 ml-10 mt-10 shadow-zinc-400 shadow-lg">
                        <h2 class="w-full h-fit font-shantell flex flex-row justify-center">T${noteTitle.value}</h2>
                        <h4 class="w-full h-fit font-roboto flex flex-row justify-center text-sm" id="note_noteId">ID ${newNoteId}</h4>
                        <h4 class="w-full h-fit font-roboto flex flex-row justify-center text-sm">Priorytet: ${noteWeight.value}</h4>
                        <p class="w-full h-full font-shantell text-2xl ml-2">${noteText.value}</p>
                        <div id="icons_container--yellow" class=" w-full h-fit flex flex-row justify-end mt-5">
                            <button id="pdf_note--btn"><img src="../images/pdf-file.png" alt="generate-pdf-file" /></button>
                            <button id="edit_note--btn"><img src="../images/edit.png" alt="edit your note" class="ml-2" /></button>
                            <button id="del_note--btn" class="del_note--btn"><img src="../images/bin.png" alt="delete your note" class="ml-2" /></button>
                        </div>`;

	divNotes.insertAdjacentHTML('beforeend', html);
};
