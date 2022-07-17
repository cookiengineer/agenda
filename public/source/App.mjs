
import { Client  } from './Client.mjs';
import { isTask  } from './data/Task.mjs';
import { Agenda  } from './view/Agenda.mjs';
import { Editor  } from './view/Editor.mjs';
// import { Journal } from './view/Journal.mjs';

const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';



const App = function(selector) {

	selector = isObject(selector) ? selector : {};


	this.selector = Object.assign({
		project: null,
		types:   [ 'company', 'work', 'family', 'household', 'other' ]
	}, selector);


	this.client = new Client(this);

	this.active   = null;
	this.elements = {
		'agenda':  document.querySelector('section#agenda'),
		'editor':  document.querySelector('section#editor'),
		'journal': document.querySelector('section#journal')
	};
	this.tasks = [];
	this.view  = null;
	this.views = {
		'agenda':  new Agenda(this,  this.elements['agenda']),
		'editor':  new Editor(this,  this.elements['editor']),
		// 'journal': new Journal(this, this.elements['journal'])
	};


	this.client.read((tasks) => {

		console.log(this);

		this.tasks = tasks.filter((task) => isTask(task));
		this.show('agenda');

	});

};


App.prototype = {

	refresh: function() {

		// XXX: Selector has changed

		if (this.view === this.views['agenda']) {
			this.view.render();
		}

	},

	show: function(name, task) {

		name = typeof name === 'string' ? name : null;
		task = isTask(task)             ? task : null;


		if (name !== null) {

			let element = this.elements[name] || null;
			let view    = this.views[name]    || null;

			console.log(view, element);

			if (element !== null && view !== null) {

				if (view !== this.view) {

					Object.values(this.elements).forEach((element) => {

						if (element !== null) {
							element.className = '';
						}

					});

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

	}

};


export { App };

