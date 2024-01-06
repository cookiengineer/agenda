
import { IsTask   } from '../structs/Task.mjs';
import { DATETIME } from '../parsers/DATETIME.mjs';

const isArray  = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';



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

			this.app.tasks.filter((task) => {
				return this.app.IsVisible(task);
			}).forEach((task) => {

				let element = render.call(this, task, this.app.active === task);
				if (element !== null) {
					rendered.push(element);
				}

			});

			Array.from(this.element.querySelectorAll('article')).forEach((article) => {
				article.parentNode.removeChild(article);
			});

			if (rendered.length > 0) {
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

