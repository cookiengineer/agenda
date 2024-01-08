
import { IsTask   } from '../structs/Task.mjs';
import { DATETIME } from '../parsers/DATETIME.mjs';

const isArray  = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';



const renderEmpty = function() {

	let element = document.createElement('article');
	let html    = [];

	html.push('<h3>No tasks found. Great job!</h3>');
	html.push('<div>');
	html.push('- Change the scope of tasks with the buttons for each project in the header.<br>');
	html.push('- Refine your search with the search field in the footer.<br>');
	html.push('- Create a new task with the button in the bottom right corner.<br>');
	html.push('- Switch to another view with the menu in the top left corner.<br>');
	html.push('</div>');

	element.innerHTML = html.join('');

	return element;

};

const render = function(task, active) {

	if (IsTask(task) === true) {

		let element = document.createElement('article');
		let html    = [];

		element.setAttribute('data-id',      task.id);
		element.setAttribute('data-project', task.project);

		html.push('<h3>');
		html.push('<span data-complexity="' + task.complexity + '">' + task.complexity + '</span>');
		html.push(task.title);
		html.push('</h3>');

		html.push('<div>');
		html.push('<b>' + task.project + '</b>');
		html.push('<span data-duration="' + task.duration + '">' + task.duration + '</span>');
		html.push(' / ');
		html.push('<span data-estimation="' + task.estimation + '">' + task.estimation + '</span>');
		if (isArray(task.repeat) === true && task.repeat.length > 0) {
			html.push('<br>');
			html.push('<span data-repeat="' + task.repeat.join(',') + '">(every ' + task.repeat.join(', ') + ')</span>');
		}
		html.push('</div>');

		if (isString(task.deadline) === true) {

			html.push('<div>');

			let deadline = DATETIME.parse(task.deadline);
			let today    = DATETIME.parse(new Date());

			if (
				deadline.year === today.year
				&& deadline.month === today.month
				&& deadline.day === today.day
			) {
				html.push('<span title="Must be done today!">!</span> <span data-deadline="' + task.deadline + '">' + task.deadline + '</span>');
			} else {
				html.push('<span data-deadline="' + task.deadline + '">' + task.deadline + '</span>');
			}
			html.push('</div>');

		}

		html.push('<div>');
		if (isString(task.description) === true) {
			html.push(task.description.split('\n').join('<br>\n'));
		}
		html.push('</div>');

		html.push('<footer>');
		html.push('<button data-action="edit">Edit</button>');
		if (active === true) {
			html.push('<button data-action="stop" title="Stop working on this Task!">Stop</button>');
		} else {
			html.push('<button data-action="start" title="Start to work on this Task!">Start</button>');
		}
		html.push('</footer>');

		element.className = active === true ? 'active' : '';
		element.innerHTML = html.join('');

		return element;

	}


	return null;

};



const Agenda = function(app, element) {

	this.app     = app;
	this.element = element.querySelector('section');

};


Agenda.prototype = {

	render: function(task) {

		task = IsTask(task) ? task : null;


		if (task !== null) {

			// Do Nothing

		} else {

			let rendered = [];
			let has_active = false;

			this.app.tasks.filter((task) => {
				return this.app.IsVisible(task);
			}).forEach((task) => {

				if (this.app.active === task) {

					let element = render.call(this, task, true);
					if (element !== null) {
						has_active = true;
						rendered.unshift(element);
					}

				} else {

					let element = render.call(this, task, false);
					if (element !== null) {
						rendered.push(element);
					}

				}

			});

			Array.from(this.element.querySelectorAll('article')).forEach((article) => {
				article.parentNode.removeChild(article);
			});

			if (rendered.length > 0) {

				if (has_active === true) {

					let active_article  = rendered[0];
					let active_interval = setInterval(() => {

						if (this.app.active !== null) {

							let duration = active_article.querySelector('span[data-duration]');
							if (duration !== null) {
								duration.innerHTML = this.app.active.duration;
							}

						} else {
							clearInterval(active_interval);
						}

					}, 1000);

				}

				rendered.forEach((article) => {
					this.element.appendChild(article);
				});

			} else {
				this.element.appendChild(renderEmpty());
			}

		}

	}

};


export { Agenda };

