
import { update as update_theme } from '../design/theme/index.mjs';
import { Client                 } from './Client.mjs';
import { DATETIME               } from './parsers/DATETIME.mjs';
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
		completed: false, // true || false || null
		datetime:  null,  // "2023-01" || "2023-01-02" || null
		keywords:  [],    // [ "keyword", "additional-keyword" ] || []
		project:   null   // "<project>" || null
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


	this.Update(() => {
		this.Show('agenda');
	});

};


App.prototype = {

	Refresh: function() {

		// this.selector has changed
		if (this.view !== this.views['editor']) {
			this.view.render();
		}

	},

	Show: function(name, task) {

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

	Start: function(task) {

		// TODO: Start Interval / duration update for task
		// TODO: Integrate Interval with rendering in DOM

	},

	Stop: function(task) {

		// TODO: Stop Interval / duration update for task

	},

	Update: function(callback) {

		callback = isFunction(callback) ? callback : null;

		this.client.Update((tasks, projects) => {

			this.tasks = tasks.filter((task) => IsTask(task));
			this.projects = projects;

			update_theme();

			if (callback !== null) {
				callback();
			}

		});

	},

	IsVisible: function(task) {

		let matches_completed = false;
		let matches_datetime = false;
		let matches_keywords = false;
		let matches_project  = false;

		let completed = this.selector.completed;
		if (completed === true) {

			if (task.is_completed === true) {
				matches_completed = true;
			}

		} else if (completed === false) {

			if (task.is_completed === false) {
				matches_completed = true;
			}

		} else {
			matches_completed = true;
		}

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

		let keywords = this.selector.keywords;
		if (keywords.length > 0) {

			let matches = new Array(keywords.length);

			for (let k = 0; k < keywords.length; k++) {

				let keyword = keywords[k].toLowerCase();
				let task_project     = task.project.toLowerCase();
				let task_title       = task.title.toLowerCase();
				let task_description = task.description.toLowerCase();
				let task_deadline    = task.deadline !== null ? task.deadline : '';
				let task_repeat      = task.repeat.map((v) => v.toLowerCase());

				if (
					task_project.includes(keyword)
					|| task_title.includes(keyword)
					|| task_description.includes(keyword)
					|| task_deadline.includes(keyword)
					|| task_repeat.includes(keyword)
				) {
					matches[k] = true;
				} else {
					matches[k] = false;
				}

			}

			matches_keywords = matches.includes(false) === false;

		} else {
			matches_keywords = true;
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

		if (matches_completed && matches_datetime && matches_keywords && matches_project) {
			return true;
		}

		return false;

	}

};


export { App };

