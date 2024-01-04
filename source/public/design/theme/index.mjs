
const PALETTE = [
	'#d97032', '#32b2d9', '#a732d9', '#6dd932',
	'#d9a432', '#3248d9', '#d9326c', '#32d973',
	'#e2a052', '#5294e2', '#e252dc', '#52e258',
	'#e36f52', '#52e3d6', '#8852e3', '#c2e352',
	'#e3c652', '#6d52e3', '#e35c52', '#52e3bc',
];

const STYLE = document.createElement('style');

export const update = () => {

	let APP = window.APP || null;
	let headers = Array.from(document.querySelectorAll('main > section header'));

	if (APP !== null && headers.length > 0) {

		let palette = {};
		let items = [];

		Object.keys(APP.projects).sort().forEach((project, p) => {
			palette[project] = PALETTE[p % PALETTE.length];
			items.push('<li data-project="' + project + '">' + project + '</li>');
		});

		headers.forEach((header) => {

			let list = header.querySelector('ul');
			if (list !== null) {
				list.innerHTML = items.join('');
			}

		});

		if (Object.keys(palette).length > 0) {

			let stylesheet = []

			Object.keys(palette).forEach((project) => {

				let color = palette[project];

				stylesheet.push('main > section > header ul li[data-project="' + project + '"].active { background-color: ' + color + '; }');
				stylesheet.push('main > section article[data-project="' + project + '"] { border-color: ' + color + '; }');
				stylesheet.push('main > section#agenda article[data-project="' + project + '"] h3 span[data-complexity] { color: #ffffff; background-color: ' + color + '; }');
				stylesheet.push('main > section#calendar table tr td > ul li button[data-project="' + project + '"]   { color: #ffffff; background-color: ' + color + '; }');
				stylesheet.push('');

			});

			STYLE.innerHTML = stylesheet.join('\n');

			if (STYLE.parentNode === null) {
				document.head.appendChild(STYLE);
			}

		}

	}

};

