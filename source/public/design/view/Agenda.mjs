
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
							APP.Show('editor', task);
						}

					} else if (action === 'start' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.Start(task);
						}

						event.target.setAttribute('data-action', 'stop');
						event.target.innerHTML = 'Stop';

					} else if (action === 'stop' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.Stop(task);
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
					APP.Show('editor', null);
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

