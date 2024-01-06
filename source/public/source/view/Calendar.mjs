
import { IsTask   } from '../structs/Task.mjs';
import { DATETIME } from '../parsers/DATETIME.mjs';

const isArray  = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';

const MONTH_DAYS = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const WEEK_DAYS  = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];

const isLeapYear = function(value) {

	if (value % 4 !== 0) {
		return false;
	} else if (value % 100 !== 0) {
		return true;
	} else if (value % 400 !== 0) {
		return false;
	} else {
		return true;
	}

};

const toWeekDay = function(year, month, day) {

	let index = new Date(Date.UTC(year, month - 1, day)).getDay();

	// Sunday to Saturday, stoopid Americans
	if (index === 0) {
		return 6;
	} else {
		return index - 1;
	}

};

const renderMonth = function(year, month) {

	if (month < 10) {
		return year + '-0' + month;
	} else {
		return year + '-' + month;
	}

};

const renderCalendar = function(year, month) {

	let curr_datetime = {
		year:   year,
		month:  month,
		day:    null,
		hour:   null,
		minute: null,
		second: null
	};

	let prev_datetime = {
		year:   month === 1 ? year - 1 : year,
		month:  month === 1 ? 12       : month - 1,
		day:    null,
		hour:   null,
		minute: null,
		second: null
	};

	let next_datetime = {
		year:   month === 12 ? year + 1 : year,
		month:  month === 12 ? 1        : month + 1,
		day:    null,
		hour:   null,
		minute: null,
		second: null
	};

	let curr_days = 0;

	if (isLeapYear(curr_datetime.year) && curr_datetime.month === 2) {
		curr_days = MONTH_DAYS[curr_datetime.month - 1] + 1;
	} else {
		curr_days = MONTH_DAYS[curr_datetime.month - 1];
	}

	let prev_days = 0;

	if (isLeapYear(prev_datetime.year) && prev_datetime.month === 2) {
		prev_days = MONTH_DAYS[prev_datetime.month - 1] + 1;
	} else {
		prev_days = MONTH_DAYS[prev_datetime.month - 1];
	}


	let calendar   = [[]];
	let first_day  = toWeekDay(curr_datetime.year, curr_datetime.month, 1);

	for (let d = 0; d < first_day; d++) {

		calendar[0].push(DATETIME.render(Object.assign({}, prev_datetime, {
			day: prev_days - first_day + d + 1
		})));

	}


	let week = calendar[0];

	for (let day = 1; day <= curr_days; day++) {

		let weekday = toWeekDay(curr_datetime.year, curr_datetime.month, day);

		week.push(DATETIME.render(Object.assign({}, curr_datetime, {
			day: day
		})));

		if (week.length >= 7) {
			calendar.push([]);
			week = calendar[calendar.length - 1];
		}

	}

	let remaining = 7 - week.length;
	if (remaining > 0) {

		for (let d = 0; d < remaining; d++) {

			week.push(DATETIME.render(Object.assign({}, next_datetime, {
				day: d + 1
			})));

		}

	}


	let elements = [];

	let today = Object.assign(DATETIME.parse(new Date()), {
		hour: null,
		minute: null,
		second: null
	});

	calendar.forEach((week) => {

		let row = document.createElement('tr');

		week.forEach((date) => {

			let cell = document.createElement('td');

			cell.setAttribute('data-date', date);
			cell.setAttribute('title', date);

			if (DATETIME.render(today) === date) {
				cell.setAttribute('class', 'today');
			}

			row.appendChild(cell);

		});

		elements.push(row);

	});

	let table = this.element.querySelector('table tbody');
	if (table !== null) {

		Array.from(table.querySelectorAll('tr')).forEach((row) => {
			row.parentNode.removeChild(row);
		});

		elements.forEach((row) => {
			table.appendChild(row);
		});

	}

};

const render = function(task, active) {

	if (IsTask(task) === true) {

		let date = DATETIME.render(Object.assign(DATETIME.parse(task.deadline), {
			hour: null,
			minute: null,
			second: null
		}))

		let time = DATETIME.render(Object.assign(DATETIME.parse(task.deadline), {
			year: null,
			month: null,
			day: null
		}));

		let element = document.createElement('article');
		let html    = [];

		element.setAttribute('data-id',      task.id);
		element.setAttribute('data-project', task.project);
		element.setAttribute('data-view',    'editor');
		element.setAttribute('data-date',    date);
		element.setAttribute('data-time',    time);

		if (task.deadline !== null) {
			element.setAttribute('title', task.deadline);
		}

		html.push('<h3>');
		html.push('<span data-complexity="' + task.complexity + '">' + task.complexity + '</span>');
		html.push(task.title);
		html.push('</h3>');

		html.push('<div>');
		html.push('<b>' + task.project + '</b>');
		html.push('<span data-estimation="' + task.estimation + '">' + task.estimation + '</span>');
		html.push('</div>');

		if (isString(task.deadline) === true) {

			html.push('<div>');
			html.push('<span data-deadline="' + task.deadline + '">' + task.deadline + '</span>');
			html.push('</div>');

		}

		html.push('<div>');
		if (isString(task.description) === true) {
			html.push(task.description.split('\n').join('<br>\n'));
		}
		html.push('</div>');

		element.className = active === true ? 'active' : '';
		element.innerHTML = html.join('');

		return element;

	}

	return null;

};



const Calendar = function(app, element) {

	this.app     = app;
	this.element = element.querySelector('section');
	this.sidebar = element.querySelector('aside div');

};


Calendar.prototype = {

	render: function(task) {

		task = IsTask(task) ? task : null;


		let datetime = this.app.selector.datetime;
		if (datetime === null) {

			let now = DATETIME.parse(new Date());
			if (now !== null) {

				this.app.selector.datetime = {
					year:   now.year,
					month:  now.month,
					day:    null,
					hour:   null,
					minute: null,
					second: null
				};

			}

		}

		if (this.app.selector.datetime !== null) {
			renderCalendar.call(this, this.app.selector.datetime.year, this.app.selector.datetime.month);
		}

		if (task !== null) {

			// Do Nothing

		} else {

			let calendar = [];
			let sidebar = [];

			this.app.tasks.filter((task) => {
				return this.app.IsVisible(task);
			}).sort((a, b) => {

				if (a.deadline !== null && b.deadline !== null) {

					if (a.deadline < b.deadline) return -1;
					if (b.deadline < a.deadline) return 1;

					return 0;

				} else if (a.deadline !== null && b.deadline === null) {

					return 1;

				} else if (b.deadline !== null && a.deadline === null) {

					return -1;

				} else if (a.deadline === null && b.deadline === null) {

					if (a.id < b.id) return -1;
					if (b.id < a.id) return 1;

					return 0;

				}

			}).forEach((task) => {

				if (IsTask(task) === true) {

					if (isString(task.deadline) === true) {

						let element = render.call(this, task, this.app.active === task);
						if (element !== null) {
							calendar.push(element);
						}

					} else {

						let element = render.call(this, task, this.app.active === task);
						if (element !== null) {
							sidebar.push(element);
						}

					}

				}

			});

			Array.from(this.element.querySelectorAll('article')).forEach((article) => {
				article.parentNode.removeChild(article);
			});

			if (calendar.length > 0) {
				calendar.forEach((article) => {

					let date = article.getAttribute('data-date');
					let cell = this.element.querySelector('table tbody td[data-date="' + date + '"]');
					if (cell !== null) {
						cell.appendChild(article);
					}

				});
			}

			Array.from(this.sidebar.querySelectorAll('article')).forEach((article) => {
				article.parentNode.removeChild(article);
			});

			if (sidebar.length > 0) {
				sidebar.forEach((article) => {
					this.sidebar.appendChild(article);
				});
			}

		}

	}

};


export { Calendar };

