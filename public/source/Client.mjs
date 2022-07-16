
const isArray    = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isFunction = (obj) => Object.prototype.toString.call(obj) === '[object Function]';
const isString   = (obj) => Object.prototype.toString.call(obj) === '[object String]';


const Client = function(app, url) {

	this.app = app;
	this.url = isString(url) ? url : '/api';

};


Client.prototype = {

	read: function(callback) {

		callback = isFunction(callback) ? callback : null;


		if (callback !== null) {

			fetch('/api/tasks', {
				method: 'GET',
				headers: [
					[ 'Content-Type', 'application/json' ]
				]
			}).then((response) => {
				return response.json();
			}).then((data) => {

				if (isArray(data) === true) {
					callback(data);
				} else {
					callback([]);
				}

			}).catch((err) => {
				console.error(err);
			});

		}

	},

	save: function(task, callback) {

		// TODO: Save task

	}

};


export { Client };

