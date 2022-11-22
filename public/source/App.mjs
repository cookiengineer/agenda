
import { Client   } from './Client.mjs';
import { IsTask   } from './data/Task.mjs';
import { Agenda   } from './view/Agenda.mjs';
import { Calendar } from './view/Calendar.mjs';
import { Editor   } from './view/Editor.mjs';
// import { Journal } from './view/Journal.mjs';

const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';



const App = function(selector) {

	selector = isObject(selector) ? selector : {};


	this.selector = Object.assign({
		datetime: null,
		project:  null,
		types:    [ 'company', 'work', 'family', 'household', 'other' ]
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


	this.update();
	this.show('agenda');

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

	update: function() {

		this.client.update((tasks) => {
			this.tasks = tasks.filter((task) => IsTask(task));
		});

	}

};


export { App };

