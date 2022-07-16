
const global   = window;
const document = global['document'];



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

	let ASIDE = document.querySelector('aside');
    if (ASIDE !== null) {

		let create_task = ASIDE.querySelector('button[data-action="create-task"]');
		if (create_task !== null) {

			create_task.onclick = () => {

				let APP = window.APP || null;
				if (APP !== null) {
					APP.show('editor');
				}

			};

		}

		let toggle_important = ASIDE.querySelector('button[data-action="toggle-important"]');

	}

	let MAIN   = document.querySelector('main');
	let VIEWS  = {
		agenda:  document.querySelector('section#agenda'),
		journal: document.querySelector('section#journal'),
		newtask: document.querySelector('section#newtask')
	};

	let HEADER = document.querySelector('header');
	if (HEADER !== null) {

		cleanify(HEADER);


		let selectors = Array.from(HEADER.querySelectorAll('li'));
		if (selectors.length > 0) {
			selectors.forEach((element) => {

				element.onclick = () => {

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

				};

			});

		}

	}

}, true);

