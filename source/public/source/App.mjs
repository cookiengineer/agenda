
import { update as update_theme } from '../design/theme/index.mjs';
import { Client                 } from './Client.mjs';
import { IsTask                 } from './structs/Task.mjs';
import { Agenda                 } from './view/Agenda.mjs';
import { Calendar               } from './view/Calendar.mjs';
import { Editor                 } from './view/Editor.mjs';
// import { Journal } from './view/Journal.mjs';

const isFunction = (obj) => Object.prototype.toString.call(obj) === '[object Function]';
const isObject   = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
const isString   = (obj) => Object.prototype.toString.call(obj) === '[object String]';



const App = function(selector) {

	selector = isObject(selector) ? selector : {};


	this.selector = Object.assign({
		datetime: null,
		project:  null
	}, selector);


	this.client = new Client(this);

	this.active   = null;
	this.elements = {
		'agenda':    document.querySelector('section#agenda'),
		'calendar':  document.querySelector('section#calendar'),
		'editor':    document.querySelector('section#editor'),
		'journal':   document.querySelector('section#journal')
	};
	this.tasks = [];
	this.view  = null;
	this.views = {
		'agenda':   new Agenda(this, this.elements['agenda']),
		'calendar': new Calendar(this, this.elements['calendar']),
		'editor':   new Editor(this, this.elements['editor']),
		// 'journal': new Journal(this, this.elements['journal'])
	};


	this.update(() => {
		this.show('agenda');
	});

};


App.prototype = {

	refresh: function() {

		// XXX: Selector has changed

		if (
			this.view === this.views['agenda']
			|| this.view === this.views['calendar']
			|| this.view === this.views['journal']
		) {
			this.view.render();
		}

	},

	show: function(name, task) {

		name = typeof name === 'string' ? name : null;
		task = IsTask(task)             ? task : null;


		if (name !== null) {

			let element = this.elements[name] || null;
			let view    = this.views[name]    || null;

			if (element !== null && view !== null) {

				if (view !== this.view) {

					if (this.view !== null) {

						let old_name    = Object.keys(this.views)[Object.values(this.views).indexOf(this.view)];
						let old_element = this.elements[old_name] || null;
						if (old_element !== null) {
							old_element.className = 'inactive';
						}

					}

					element.className = 'active';

					setTimeout(() => {
						view.render(task);
						this.view = view;
					}, 500);

				} else if (view === this.view && task !== null) {

					view.render(task);

				}

				return true;

			}

		}


		return false;

	},

	start: function(task) {

		// TODO: Start Interval / duration update for task
		// TODO: Integrate Interval with rendering in DOM

	},

	stop: function(task) {

		// TODO: Stop Interval / duration update for task

	},

	update: function(callback) {

		callback = isFunction(callback) ? callback : null;

		this.client.update((tasks, projects) => {

			this.tasks = tasks.filter((task) => IsTask(task));
			this.projects = projects;

			update_theme();

			if (callback !== null) {
				callback();
			}

		});

	},

	isVisible: function(task) {

		let matches_datetime = false;
		let matches_type     = false;
		let matches_project  = false;

		let datetime = this.selector.datetime;
		if (datetime !== null) {

			if (isString(task.deadline) === true) {

				let deadline = DATETIME.parse(task.deadline);

				let matches_year  = false;
				let matches_month = false;
				let matches_day   = false;

				if (datetime.year !== null) {

					if (datetime.year === deadline.year) {
						matches_year = true;
					}

				} else {
					matches_year = true;
				}

				if (datetime.month !== null) {

					if (datetime.month === deadline.month) {
						matches_month = true;
					}

				} else {
					matches_month = true;
				}

				if (datetime.day !== null) {

					if (datetime.day === deadline.day) {
						matches_day = true;
					}

				} else {
					matches_day = true;
				}

				matches_datetime = matches_year && matches_month && matches_day;

			} else {
				matches_datetime = true;
			}

		} else {
			matches_datetime = true;
		}

		let project = this.selector.project;
		if (project !== null) {

			if (task.project === project) {
				matches_project = true;
			} else {
				matches_project = false;
			}

		} else {
			matches_project = true;
		}

		return (matches_datetime && matches_project);

	}

};


export { App };

