
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



export const initialize = () => {

	let header = document.querySelector('section#agenda > header');
	if (header !== null) {

		cleanify(header);


		let selectors = Array.from(header.querySelectorAll('li'));
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

	let footer = document.querySelector('section#agenda > footer');
	if (footer !== null) {

		let create = footer.querySelector('button[data-action="create"]');
		if (create !== null) {

			create.addEventListener('click', () => {

				let APP = window.APP || null;
				if (APP !== null) {
					APP.show('editor', null);
				}

			});

		}

		let filter = footer.querySelector('button[data-action="filter"]');
		if (filter !== null) {

			filter.addEventListener('click', () => {

				// TODO: Show only important tasks with a deadline

			});

		}

	}

};

