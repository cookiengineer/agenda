
const DAYS = {
	'Mon': 'Monday',
	'Tue': 'Tuesday',
	'Wed': 'Wednesday',
	'Thu': 'Thursday',
	'Fri': 'Friday',
	'Sat': 'Saturday',
	'Sun': 'Sunday'
};

const onresize = () => {

	let mode = 'desktop';
	let body = document.querySelector('body');
	if (body !== null) {
		mode = body.getAttribute('data-mode');
	}

	let width = window.innerWidth;
	if (width > 640) {

		if (mode !== 'desktop') {

			let repeat = Array.from(document.querySelectorAll('section#editor > section fieldset ul#editor-repeat li label'));
			if (repeat.length > 0) {

				repeat.forEach((element) => {

					let keys = Object.keys(DAYS);
					let vals = Object.values(DAYS);
					let text = element.innerHTML.trim();

					if (vals.includes(text) === true) {
						element.innerHTML = keys[vals.indexOf(text)];
					}

				});

			}

			body.setAttribute('data-mode', 'desktop');

		}

	} else if (width < 640) {

		if (mode !== 'mobile') {

			let repeat = Array.from(document.querySelectorAll('section#editor > section fieldset ul#editor-repeat li label'));
			if (repeat.length > 0) {

				repeat.forEach((element) => {

					let keys = Object.keys(DAYS);
					let vals = Object.values(DAYS);
					let text = element.innerHTML.trim();

					if (keys.includes(text) === true) {
						element.innerHTML = vals[keys.indexOf(text)];
					}

				});

			}

			body.setAttribute('data-mode', 'mobile');

		}

	}

};

export const initialize = () => {

	let header = document.querySelector('section#editor > header');
	if (header !== null) {
	}

	let section = document.querySelector('section#editor > section');
	if (section !== null) {

		let article = section.querySelector('article');
		let type    = section.querySelector('fieldset select#editor-type');

		if (article !== null && type !== null) {

			type.addEventListener('change', () => {
				article.setAttribute('data-type', type.value);
			});

		}

		let repeat = Array.from(section.querySelectorAll('fieldset ul#editor-repeat li label'));
		console.log(repeat);

	}

	let footer = document.querySelector('section#editor > footer');
	if (footer !== null) {

		let cancel = footer.querySelector('button[data-action="cancel"]');
		if (cancel !== null) {

			cancel.addEventListener('click', () => {

				let APP = window.APP || null;
				if (APP !== null) {
					APP.show('agenda', null);
				}

			});

		}

	}


	window.addEventListener('resize', onresize);

	setTimeout(() => {
		onresize();
	}, 0);

};

