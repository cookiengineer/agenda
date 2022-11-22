
const global   = window;
const document = global['document'];


import { initialize as initialize_Agenda   } from './view/Agenda.mjs';
import { initialize as initialize_Calendar } from './view/Calendar.mjs';
import { initialize as initialize_Editor   } from './view/Editor.mjs';



const cleanify = (element) => {

	if (element.childNodes.length > 0) {

		for (let c = 0, cl = element.childNodes.length; c < cl; c++) {

			let node = element.childNodes[c];
			if (
				node.nodeName === '#text'
				&& node.textContent.trim() === ''
			) {

				element.removeChild(node);
				cl--;
				c--;

			} else {

				cleanify(node);

			}

		}

	}

};



document.addEventListener('DOMContentLoaded', () => {

	let headers = Array.from(document.querySelectorAll('section > header'));
	if (headers.length > 0) {

		headers.forEach((header) => {

			cleanify(header);

			let buttons = Array.from(header.querySelectorAll('button'));
			if (buttons.length > 0) {

				buttons.forEach((button) => {

					button.addEventListener('click', () => {

						let view = button.getAttribute('data-view');
						if (view !== null && view !== '') {
							APP.show(view);
						}

					});

				});

			}

			let selectors = Array.from(header.querySelectorAll('ul li'));
			if (selectors.length > 0) {

				selectors.forEach((element) => {

					element.addEventListener('click', () => {

						if (element.className === 'active') {
							element.className = '';
						} else {
							element.className = 'active';
						}


						setTimeout(() => {

							let types = [];

							selectors.forEach((other) => {

								if (other.className === 'active') {
									types.push(other.getAttribute('data-type'));
								}

							});

							let APP = window.APP || null;
							if (APP !== null) {
								APP.selector.types = types;
								APP.refresh();
							}

						}, 0);

					});

				});

			}

		});

	}

	initialize_Agenda();
	initialize_Calendar();
	initialize_Editor();

}, true);

