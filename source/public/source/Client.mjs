
import { IsArray, IsFunction, IsObject, IsString } from "/stdlib.mjs";
import { Task, IsTask                            } from "./structs/Task.mjs";

const Client = function(app, api) {

	this.app = app;
	this.api = IsString(api) ? api : "/api";

};


Client.prototype = {

	Update: function(callback) {

		callback = IsFunction(callback) ? callback : null;


		if (callback !== null) {

			let xhr1 = new XMLHttpRequest();

			xhr1.open("GET", this.api + "/tasks");
			xhr1.responseType = "json";
			xhr1.setRequestHeader("Content-Type", "application/json");

			xhr1.onload = () => {

				if (IsArray(xhr1.response) === true) {

					let xhr2 = new XMLHttpRequest();

					xhr2.open("GET", this.api + "/projects");
					xhr2.responseType = "json";
					xhr2.setRequestHeader("Content-Type", "application/json");

					xhr2.onload = () => {

						if (IsObject(xhr2.response) === true) {
							callback(xhr1.response, xhr2.response);
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

		callback = IsFunction(callback) ? callback : null;


		if (IsTask(task)) {

			let payload = task.toString();
			if (payload !== null) {

				let xhr = new XMLHttpRequest();

				xhr.open("POST", this.api + "/tasks/create");
				xhr.responseType = "json";
				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.onload = () => {

					let response = Task.from(xhr.response);

					if (IsTask(response) && response.IsValid()) {

						if (callback !== null) {
							callback(true, response);
						}

					} else {

						if (callback !== null) {
							callback(false, null);
						}

					}

				};

				xhr.onerror = () => {

					if (callback !== null) {
						callback(false, null);
					}

				};

				xhr.send(payload);

			} else {

				if (callback !== null) {
					callback(false, null);
				}

			}

		}

	},

	Modify: function(task, callback) {

		callback = IsFunction(callback) ? callback : null;


		if (IsTask(task) && task.IsValid()) {

			let payload = task.toString();
			if (payload !== null) {

				let xhr = new XMLHttpRequest();

				xhr.open("POST", this.api + "/tasks/modify");
				xhr.responseType = "json";
				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.onload = () => {

					if (callback !== null) {
						callback(true);
					}

				};

				xhr.onerror = () => {

					if (callback !== null) {
						callback(false);
					}

				};

				xhr.send(payload);

			} else {

				if (callback !== null) {
					callback(false);
				}

			}

		}

	},

	Remove: function(task, callback) {

		callback = IsFunction(callback) ? callback : null;


		if (IsTask(task) && task.IsValid()) {

			let payload = task.toString();
			if (payload !== null) {

				let xhr = new XMLHttpRequest();

				xhr.open("DELETE", this.api + "/tasks/remove");
				xhr.setRequestHeader("Content-Type", "application/json");

				xhr.onload = () => {

					if (callback !== null) {
						callback(true);
					}

				};

				xhr.onerror = () => {

					if (callback !== null) {
						callback(false);
					}

				};

				xhr.send(payload);

			} else {

				if (callback !== null) {
					callback(false);
				}

			}

		}

	}

};


export { Client };

