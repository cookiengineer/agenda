
import { ToArticle, ToTask } from '../utils.mjs';

export const initialize = () => {

	let section = document.querySelector('section#calendar > section');
	if (section !== null) {

		// TODO: Drag and Drop interaction
		// TODO: click on article in table should open Editor

	}

	let footer = document.querySelector('section#calendar > footer');
	if (footer !== null) {

		let prev_month = footer.querySelector('button[data-action="prev-month"]');
		if (prev_month !== null) {

			prev_month.addEventListener('click', () => {

				let APP = window.APP || null;
				if (APP !== null) {

					let year = APP.selector.datetime.year;
					let month = APP.selector.datetime.month;
					if (month > 1) {
						month = month - 1;
					} else if (month === 1) {
						month = 12;
						year  = year - 1;
					}

					APP.selector.datetime.year  = year;
					APP.selector.datetime.month = month;
					APP.Refresh();

				}

			});

		}

		let next_month = footer.querySelector('button[data-action="next-month"]');
		if (next_month !== null) {

			next_month.addEventListener('click', () => {

				let APP = window.APP || null;
				if (APP !== null) {

					let year = APP.selector.datetime.year;
					let month = APP.selector.datetime.month;
					if (month < 12) {
						month = month + 1;
					} else {
						year  = year + 1;
						month = 1;
					}

					APP.selector.datetime.year  = year;
					APP.selector.datetime.month = month;
					APP.Refresh();

				}

			});

		}

	}

};

