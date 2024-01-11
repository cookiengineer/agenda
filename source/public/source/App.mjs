
import { IsFunction, IsNumber, IsObject, IsString } from "/stdlib.mjs";
import { update as update_theme                   } from "/design/theme/index.mjs";
import { Client                                   } from "/source/Client.mjs";
import { Activity                                 } from "/source/structs/Activity.mjs";
import { Datetime                                 } from "/source/structs/Datetime.mjs";
import { Task, IsTask                             } from "/source/structs/Task.mjs";
import { Agenda                                   } from "/source/view/Agenda.mjs";
import { Calendar                                 } from "/source/view/Calendar.mjs";
import { Editor                                   } from "/source/view/Editor.mjs";

export const IsApp = (obj) => Object.prototype.toString.call(obj) === "[object App]";

export const App = function(selector) {

	selector = IsObject(selector) ? selector : {};

	this.Activity = new Activity();
	this.Client   = new Client(this);
	this.Projects = {};
	this.Selector = Object.assign({
		completed: false, // true || false || null
		datetime:  null,  // "2023-01" || "2023-01-02" || null
		keywords:  [],    // [ "keyword", "additional-keyword" ] || []
		project:   null   // "<project>" || null
	}, selector);
	this.Tasks    = [];

	this.elements = {
		"agenda":   document.querySelector("section#agenda"),
		"calendar": document.querySelector("section#calendar"),
		"editor":   document.querySelector("section#editor")
	};

	this.view  = null;
	this.views = {
		"agenda":   new Agenda(this, this.elements["agenda"]),
		"calendar": new Calendar(this, this.elements["calendar"]),
		"editor":   new Editor(this, this.elements["editor"])
	};


	this.Update(() => {
		this.Show("agenda");
	});

};


App.prototype = {

	[Symbol.toStringTag]: "App",

	Render: function(task, callback) {

		task     = IsTask(task)         ? task     : null;
		callback = IsFunction(callback) ? callback : null;

		if (this.view === this.views["editor"]) {

			this.view.Render(task);

			if (task !== null) {
				this.view.Reset();
			}

			if (callback !== null) {
				callback(true);
			}

		} else if (this.view !== null) {

			this.view.Render();

			if (callback !== null) {
				callback(true);
			}

		} else {

			if (callback !== null) {
				callback(false);
			}

		}

	},

	Show: function(name, task) {

		name = typeof name === "string" ? name : null;
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
							old_element.className = "inactive";
						}

					}

					element.className = "active";

					setTimeout(() => {
						view.Render(task);
						this.view = view;
					}, 500);

				} else if (view === this.view && task !== null) {

					view.Render(task);

				}

				return true;

			}

		}


		return false;

	},

	Start: function(task) {

		if (IsTask(task)) {

			if (this.interval !== null) {
				clearInterval(this.interval);
				this.interval = null;
			}

			this.Activity.Start(task);
			this.Client.Modify(this.Activity.Task);

			this.interval = setInterval(() => {

				if (this.Activity.IsRunning()) {
					this.Client.Modify(this.Activity.Task);
				}

			}, 60 * 1000);

		}

	},

	Stop: function() {

		if (this.Activity.IsRunning()) {

			let task = this.Activity.Task;

			this.Activity.Stop();
			this.Client.Modify(task);

		}

		if (this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}

	},

	Update: function(callback) {

		callback = IsFunction(callback) ? callback : null;

		this.Client.Update((tasks, projects) => {

			this.Tasks = [];
			this.Projects = projects;

			tasks.forEach((data) => {

				let task = Task.from(data);
				if (task.IsValid()) {

					this.Tasks.push(task);

					if (task.IsRunning()) {
						this.Start(task);
					}

				}

			});

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

		let completed = this.Selector.completed;
		if (completed === true) {

			if (task.IsCompleted) {
				matches_completed = true;
			}

		} else if (completed === false) {

			if (!task.IsCompleted) {
				matches_completed = true;
			}

		} else {
			matches_completed = true;
		}

		let datetime = this.Selector.datetime;
		if (datetime !== null) {

			if (IsString(task.Deadline)) {

				let deadline = Datetime.from(task.Deadline);

				let matches_year  = false;
				let matches_month = false;
				let matches_day   = false;

				if (datetime.Year !== null) {

					if (datetime.Year === deadline.Year) {
						matches_year = true;
					}

				} else {
					matches_year = true;
				}

				if (datetime.Month !== null) {

					if (datetime.Month === deadline.Month) {
						matches_month = true;
					}

				} else {
					matches_month = true;
				}

				if (datetime.Day !== null) {

					if (datetime.Day === deadline.Day) {
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

		let keywords = this.Selector.keywords;
		if (keywords.length > 0) {

			let matches = new Array(keywords.length);

			for (let k = 0; k < keywords.length; k++) {

				let keyword          = keywords[k].toLowerCase();
				let task_project     = task.Project.toLowerCase();
				let task_title       = task.Title.toLowerCase();
				let task_description = task.Description.toLowerCase();
				let task_deadline    = task.Deadline !== null ? task.Deadline : "";
				let task_repeat      = task.Repeat.map((v) => v.toLowerCase());

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

		let project = this.Selector.project;
		if (project !== null) {

			if (task.Project === project) {
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

	},

	ToTask: function(identifier) {

		let id = 0;

		if (IsNumber(identifier)) {

			if (identifier !== 0) {
				id = identifier;
			}

		} else if (IsString(identifier)) {

			let num = parseInt(identifier, 10);

			if (!Number.isNaN(num) && num !== 0) {
				id = num;
			}

		}

		if (id !== 0) {

			let found = null;

			for (let t = 0; t < this.Tasks.length; t++) {

				if (this.Tasks[t].ID === id) {
					found = this.Tasks[t];
					break;
				}

			}

			return found;

		}

		return null;

	}

};

