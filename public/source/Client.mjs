
import { IsTask } from '../source/data/Task.mjs';

const isArray    = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isFunction = (obj) => Object.prototype.toString.call(obj) === '[object Function]';
const isString   = (obj) => Object.prototype.toString.call(obj) === '[object String]';


const Client = function(app, api) {

	this.app = app;
	this.api = isString(api) ? api : '/api';

};


Client.prototype = {

	update: function(callback) {

		callback = isFunction(callback) ? callback : null;


		if (callback !== null) {

			let xhr = new XMLHttpRequest();

			xhr.open('GET', this.api + '/tasks');
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => {

				let data = null;

				try {
					data = JSON.parse(xhr.response);
				} catch (err) {
					data = null;
				}

				if (isArray(data) === true) {
					callback(data);
				} else {
					callback([]);
				}

			};

			xhr.send();

		}

	},

	create: function(task, callback) {

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

				xhr.send(payload);

			} else {

				callback(null);

			}

		}

	},

	modify: function(task, callback) {

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

				xhr.send(payload);

			} else {

				callback(null);

			}

		}

	}

};


export { Client };

