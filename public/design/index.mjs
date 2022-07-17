
const global   = window;
const document = global['document'];


import { initialize as init_Agenda } from './view/Agenda.mjs';
import { initialize as init_Editor } from './view/Editor.mjs';



document.addEventListener('DOMContentLoaded', () => {

	init_Agenda();
	init_Editor();

}, true);

