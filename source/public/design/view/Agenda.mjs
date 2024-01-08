
import { ToArticle, ToTask } from '../utils.mjs';

export const initialize = () => {

	let section = document.querySelector('section#agenda > section');
	if (section !== null) {

		section.addEventListener('click', (event) => {

			let article = ToArticle(event.target);
			if (article !== null) {

				if (event.target.tagName === 'BUTTON') {

					let action = event.target.getAttribute('data-action');
					let task   = ToTask(article.getAttribute('data-id'));

					if (action === 'edit' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.Show('editor', task);
						}

					} else if (action === 'start' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.Start(task);
							APP.Refresh();
						}

						event.target.setAttribute('data-action', 'stop');
						event.target.innerHTML = 'Stop';

					} else if (action === 'stop' && task !== null) {

						let APP = window.APP || null;
						if (APP !== null) {
							APP.Stop(task);
							APP.Refresh();
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

		let search = footer.querySelector('input[data-action="search"]');
		if (search !== null) {

			search.addEventListener('keyup', () => {

				let APP = window.APP || null;
				let keywords = search.value.trim().split(' ').map((value) => {

					value = value.split('.').join('');
					value = value.split(',').join('');
					value = value.split('/').join('');

					return value;

				});

				if (APP !== null) {
					APP.selector.keywords = keywords;
					APP.Refresh();
				}

			});

			search.addEventListener('change', () => {

				let APP = window.APP || null;
				let keywords = search.value.trim().split(' ').map((value) => {

					value = value.split('.').join('');
					value = value.split(',').join('');
					value = value.split('/').join('');

					return value;

				});

				if (APP !== null) {
					APP.selector.keywords = keywords;
					APP.Refresh();
				}

			});

		}

	}

};

