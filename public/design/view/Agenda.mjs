
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

const toArticle = (target) => {

	let found   = null;
	let current = target;

	while (current.tagName !== 'BODY') {

		if (current.tagName === 'ARTICLE') {

			found = current;
			break;

		} else {

			current = current.parentNode;

		}

	}

	return found;

};

const toTask = function(identifier) {

	let id = parseInt(identifier, 10);

	if (Number.isNaN(id) === false && id !== 0) {

		let APP = window.APP || null;
		if (APP !== null) {
			return APP.tasks.find((other) => other.id === id);
		}

	}

	return null;

};



export const initialize = () => {

	let header = document.querySelector('section#agenda > header');
	if (header !== null) {

		cleanify(header);


		let selectors = Array.from(header.querySelectorAll('li'));
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

	}

	let section = document.querySelector('section#agenda > section');
	if (section !== null) {

		section.addEventListener('click', (event) => {

			let article = toArticle(event.target);
			if (article !== null) {

				if (event.target.tagName === 'BUTTON') {

					let action = event.target.getAttribute('data-action');
					let task   = toTask(article.getAttribute('data-id'));

					if (action === 'edit' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.show('editor', task);
						}

					} else if (action === 'start' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.start(task);
						}

						event.target.setAttribute('data-action', 'stop');
						event.target.innerHTML = 'Stop';

					} else if (action === 'stop' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.stop(task);
						}

						event.target.setAttribute('data-action', 'start');
						event.target.innerHTML = 'Start';

					}

				} else {

					let articles = Array.from(section.querySelectorAll('article'));
					if (articles.length > 0) {

						articles.forEach((other) => {

							if (other === article) {
								other.setAttribute('data-focus', 'whatever');
							} else {
								other.removeAttribute('data-focus');
							}

						});

					}

				}

			}

		});

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

		let show_deadlines = footer.querySelector('button[data-action="show-deadlines"]');
		if (show_deadlines !== null) {

			show_deadlines.addEventListener('click', () => {

				// TODO: Show only important tasks with a deadline

			});

		}

		let search_agenda = footer.querySelector('input[data-action="search-agenda"]');
		if (search_agenda !== null) {

			show_deadlines.addEventListener('change', () => {

				// TODO: Show only Tasks that match search in either of:
				// project, title, description

			});

		}

	}

};

