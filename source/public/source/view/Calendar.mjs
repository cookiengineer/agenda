
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

		calendar[0].push({
			datetime: DATETIME.render(Object.assign({}, prev_datetime, {
				day: prev_days - first_day + d + 1
			})),
			tasks: []
		});

	}


	let week = calendar[0];

	for (let day = 1; day <= curr_days; day++) {

		let weekday = toWeekDay(curr_datetime.year, curr_datetime.month, day);

		week.push({
			datetime: DATETIME.render(Object.assign({}, curr_datetime, {
				day: day
			})),
			tasks: []
		});

		if (week.length >= 7) {
			calendar.push([]);
			week = calendar[calendar.length - 1];
		}

	}

	let remaining = 7 - week.length;
	if (remaining > 0) {

		for (let d = 0; d < remaining; d++) {

			week.push({
				datetime: DATETIME.render(Object.assign({}, next_datetime, {
					day: d + 1
				})),
				tasks: []
			});

		}

	}



	let elements = [];

	calendar.forEach((week) => {

		let row = document.createElement('tr');

		week.forEach((day) => {

			let cell    = document.createElement('td');
			let content = [];

			if (day.tasks.length > 0) {

				content.push('<ul>');

				day.tasks.forEach((task) => {

					// TODO: Time should be from - to instead of deadline
					let deadline = task.deadline.split(' ').pop();

					content.push('<li>');
					content.push('<button data-view="editor" data-id="' + task.id + '" data-project="' + task.project + '">');
					content.push('<span>' + deadline + '</span>');
					content.push('<b>' + task.title + '</b>');
					content.push('<button>');
					content.push('</li>');

				});

				content.push('</ul>');

			} else {

				content.push('<button data-datetime="' + day.datetime + '">' + day.datetime + '</button>');
				cell.setAttribute('class', 'empty');

			}

			cell.setAttribute('data-datetime', day.datetime);
			cell.innerHTML = content.join('');

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

const renderEmpty = function() {

	let element = document.createElement('article');
	let html    = [];

	html.push('<h3>');
	html.push('Nothing to do. Great job!');
	html.push('</h3>');

	html.push('<div>');
	html.push('If you want to create a Task, use the "Create Task" button in the bottom left corner.');
	html.push('</div>');

	element.innerHTML = html.join('');

	return element;

};

const render = function(task, active) {

	// if (IsTask(task) === true) {

	// 	let element = document.createElement('article');
	// 	let html    = [];

	// 	element.setAttribute('data-id',   task.id);

	// 	html.push('<h3>');
	// 	html.push('<span data-complexity="' + task.complexity + '">' + task.complexity + '</span>');
	// 	html.push(' - ' + task.title);
	// 	html.push('</h3>');

	// 	html.push('<div>');
	// 	html.push('<b>' + task.project + '</b>');
	// 	html.push('<span data-duration="' + task.duration + '">' + task.duration + '</span>');
	// 	html.push(' / ');
	// 	html.push('<span data-estimation="' + task.estimation + '">' + task.estimation + '</span>');
	// 	if (isArray(task.repeat) === true && task.repeat.length > 0) {
	// 		html.push('<br>');
	// 		html.push('<span data-repeat="' + task.repeat.join(',') + '">(every ' + task.repeat.join(', ') + ')</span>');
	// 	}
	// 	html.push('</div>');

	// 	if (isString(task.deadline) === true) {

	// 		html.push('<div>');

	// 		let deadline = DATETIME.parse(task.deadline);
	// 		let today    = DATETIME.parse(new Date());

	// 		if (
	// 			deadline.year === today.year
	// 			&& deadline.month === today.month
	// 			&& deadline.day === today.day
	// 		) {
	// 			html.push('<span title="Must be done today!">!</span> <span data-deadline="' + task.deadline + '">' + task.deadline + '</span>');
	// 		} else {
	// 			html.push('<span data-deadline="' + task.deadline + '">' + task.deadline + '</span>');
	// 		}
	// 		html.push('</div>');

	// 	}

	// 	html.push('<div>');
	// 	if (isString(task.description) === true) {
	// 		html.push(task.description.split('\n').join('<br>\n'));
	// 	}
	// 	html.push('</div>');

	// 	html.push('<footer>');
	// 	html.push('<button data-action="edit">Edit</button>');
	// 	if (active === true) {
	// 		html.push('<button data-action="stop" title="Stop working on this Task!">Stop</button>');
	// 	} else {
	// 		html.push('<button data-action="start" title="Start to work on this Task!">Start</button>');
	// 	}
	// 	html.push('</footer>');

	// 	element.className = active === true ? 'active' : '';
	// 	element.innerHTML = html.join('');

	// 	return element;

	// }


	return null;

};



const Calendar = function(app, element) {

	this.app     = app;
	this.element = element.querySelector('section');

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

			let rendered = [];

			this.app.tasks.filter((task) => {
				return this.app.isVisible(task);
			}).forEach((task) => {

				let element = render.call(this, task, this.app.active === task);
				if (element !== null) {
					rendered.push(element);
				}

			});

			// Array.from(this.element.querySelectorAll('table button')).forEach((button) => {
			// 	article.parentNode.removeChild(button);
			// });

			// TODO: This is wrong, buttons need to be placed differently
			// if (rendered.length > 0) {
			// 	rendered.forEach((button) => {
			// 		this.element.appendChild(button);
			// 	});
			// } else {
			// 	this.element.appendChild(renderEmpty());
			// }


		}

	}

};


export { Calendar };

