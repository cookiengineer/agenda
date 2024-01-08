
import { IsFunction, IsObject, IsString } from "/stdlib.mjs";
import { update as update_theme         } from "/design/theme/index.mjs";
import { FormatInt                      } from "/source/utils/FormatInt.mjs";
import { Client                         } from "/source/Client.mjs";
import { Datetime                       } from "/source/structs/Datetime.mjs";
import { Task, IsTask                   } from "/source/structs/Task.mjs";
import { Agenda                         } from "/source/view/Agenda.mjs";
import { Calendar                       } from "/source/view/Calendar.mjs";
import { Editor                         } from "/source/view/Editor.mjs";

export const IsApp = (obj) => Object.prototype.toString.call(obj) === "[object App]";

export const App = function(selector) {

	selector = IsObject(selector) ? selector : {};

	this.Client   = new Client(this);
	this.Projects = {};
	this.Selector = Object.assign({
		completed: false, // true || false || null
		datetime:  null,  // "2023-01" || "2023-01-02" || null
		keywords:  [],    // [ "keyword", "additional-keyword" ] || []
		project:   null   // "<project>" || null
	}, selector);
	this.Tasks    = [];


	this.active   = null;
	this.activity = {
		index:     0,
		interval1: null,
		interval2: null,
		start:     null,
		stop:      null
	};
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

			this.active = task;
			this.activity.start = Datetime.from(new Date());

			if (this.active.duration !== "00:00:00") {

				let offset = Datetime.from(this.active.duration);
				this.activity.start.Offset(offset);

			}

			if (this.active.activities.length > 0) {
				this.activity.index = this.active.activities.length;
			} else {
				this.activity.index = 0;
			}

			this.activity.interval1 = setInterval(() => {

				let now = Datetime.from(new Date());

				if (this.active !== null) {

					let delta_hour   = now.hour   - this.activity.start.hour;
					let delta_minute = now.minute - this.activity.start.minute;
					let delta_second = now.second - this.activity.start.second;

					this.active.activities[this.activity.index] = this.activity.start.toString() + " - " + now.toString();
					this.active.duration = FormatInt(delta_hour, 2) + ":" + FormatInt(delta_minute, 2) + ":" + FormatInt(delta_second, 2);

				}

			}, 1000);

			this.activity.interval2 = setInterval(() => {

				if (this.active !== null) {
					this.Client.Modify(this.active);
				}

			}, 60 * 1000);

		}

	},

	Stop: function(task) {

		if (IsTask(this.active)) {

			if (this.active === task) {

				let now = Datetime.from(new Date());

				let delta_hour   = now.hour   - this.activity.start.hour;
				let delta_minute = now.minute - this.activity.start.minute;
				let delta_second = now.second - this.activity.start.second;

				this.active.activities[this.activity.index] = this.activity.start.toString() + " - " + now.toString();
				this.active.duration = FormatInt(delta_hour, 2) + ":" + FormatInt(delta_minute, 2) + ":" + FormatInt(delta_second, 2);

				this.Client.Modify(this.active, () => {
					this.active = null;
				});

			} else {
				this.active = null;
			}

			this.activity.index = 0;
			this.activity.start = null;
			this.activity.stop  = null;

		}

		if (this.activity.interval1 !== null) {
			clearInterval(this.activity.interval1);
			this.activity.interval1 = null;
		}

		if (this.activity.interval2 !== null) {
			clearInterval(this.activity.interval2);
			this.activity.interval2 = null;
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

	}

};

