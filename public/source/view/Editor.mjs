
import { isTask   } from '../../source/data/Task.mjs';
import { DATETIME } from '../../source/parser/DATETIME.mjs';

const isArray  = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';



const Editor = function(app, element) {

	this.app     = app;
	this.element = element;
	this.aside   = element.querySelector('aside');

};


Editor.prototype = {

	render: function(task) {

		task = isTask(task) ? task : null;


		if (task !== null) {

			// TODO: Set all fieldsets to values from task

		} else if (task === null) {

			// TODO: Reset all fieldsets and render a new task

		}

	}

};


export { Editor };

