
import { IsTask } from './structs/Task.mjs';

const isArray    = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isFunction = (obj) => Object.prototype.toString.call(obj) === '[object Function]';
const isObject   = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
const isString   = (obj) => Object.prototype.toString.call(obj) === '[object String]';


const Client = function(app, api) {

	this.app = app;
	this.api = isString(api) ? api : '/api';

};


Client.prototype = {

	Update: function(callback) {

		callback = isFunction(callback) ? callback : null;


		if (callback !== null) {

			let xhr1 = new XMLHttpRequest();

			xhr1.open('GET', this.api + '/tasks');
			xhr1.setRequestHeader('Content-Type', 'application/json');

			xhr1.onload = () => {

				let tasks = null;

				try {
					tasks = JSON.parse(xhr1.response);
				} catch (err) {
					tasks = null;
				}

				if (isArray(tasks) === true) {

					let xhr2 = new XMLHttpRequest();

					xhr2.open('GET', this.api + '/projects');
					xhr2.setRequestHeader('Content-Type', 'application/json');

					xhr2.onload = () => {

						let projects = null;

						try {
							projects = JSON.parse(xhr2.response);
						} catch (err) {
							projects = null;
						}

						if (isObject(projects) === true) {
							callback(tasks, projects);
						}

					};

					xhr2.onerror = () => {
						callback([], {});
					};

					xhr2.send();

				} else {
					callback([], {});
				}

			};

			xhr1.onerror = () => {
				callback([], {});
			};

			xhr1.send();

		}

	},

	Create: function(task, callback) {

		task     = IsTask(task)         ? task     : null;
		callback = isFunction(callback) ? callback : null;


		if (task !== null && callback !== null) {

			let payload = null;

			try {
				payload = JSON.stringify(task);
			} catch (err) {
				payload = null;
			}

			if (payload !== null) {

				let xhr = new XMLHttpRequest();

				xhr.open('POST', this.api + '/tasks/create');
				xhr.setRequestHeader('Content-Type', 'application/json');

				xhr.onload = () => {

					let data = null;

					try {
						data = JSON.parse(xhr.response);
					} catch (err) {
						data = null;
					}

					if (IsTask(data) === true) {
						callback(data);
					} else {
						callback(null);
					}

				};

				xhr.onerror = () => {
					callback(null);
				};

				xhr.send(payload);

			} else {

				callback(null);

			}

		}

	},

	Modify: function(task, callback) {

		task     = IsTask(task)         ? task     : null;
		callback = isFunction(callback) ? callback : null;


		if (task !== null && callback !== null) {

			let payload = null;

			try {
				payload = JSON.stringify(task);
			} catch (err) {
				payload = null;
			}

			if (payload !== null) {

				let xhr = new XMLHttpRequest();

				xhr.open('POST', this.api + '/tasks/modify');
				xhr.setRequestHeader('Content-Type', 'application/json');

				xhr.onload = () => {

					let data = null;

					try {
						data = JSON.parse(xhr.response);
					} catch (err) {
						data = null;
					}

					if (IsTask(data) === true) {
						callback(data);
					} else {
						callback(null);
					}

				};

				xhr.onerror = () => {
					callback(null);
				};

				xhr.send(payload);

			} else {

				callback(null);

			}

		}

	},

	Remove: function(task, callback) {

		task     = IsTask(task)         ? task     : null;
		callback = isFunction(callback) ? callback : null;


		if (task !== null && callback !== null) {

			let payload = null;

			try {
				payload = JSON.stringify(task);
			} catch (err) {
				payload = null;
			}

			if (payload !== null) {

				let xhr = new XMLHttpRequest();

				xhr.open('DELETE', this.api + '/tasks/remove');
				xhr.setRequestHeader('Content-Type', 'application/json');

				xhr.onload = () => {
					callback(true);
				};

				xhr.onerror = () => {
					callback(false);
				};

				xhr.send(payload);

			} else {

				callback(null);

			}

		}

	}

};


export { Client };

