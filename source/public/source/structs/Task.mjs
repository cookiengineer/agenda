
import { IsArray, IsBoolean, IsNumber, IsString } from "/stdlib.mjs";
import { Datetime                               } from "/source/structs/Datetime.mjs";
import { ToTitle                                } from "/source/utils/ToTitle.mjs";
import { ToProject                              } from "/source/utils/ToProject.mjs";

export const IsTask = (obj) => Object.prototype.toString.call(obj) === "[object Task]";

const TASK_COMPLEXITIES = [
	1,
	2,
	3,
	5,
	8,
	13,
	21
];

const TASK_REPEAT = [
	"weekly",
	"bi-weekly",
	"monthly",
	"yearly"
];

const TASK_WEEKDAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
];

const isComplexity = function(complexity) {

	if (
		IsNumber(complexity)
		&& TASK_COMPLEXITIES.includes(complexity)
	) {
		return true;
	}

	return false;

};

const isTime = (value) => {

	let result = false;

	if (IsString(value) && value.includes(":")) {

		let chunks = value.split(":");

		if (chunks.length === 3) {
			result = true;
		} else if (chunks.length === 2) {
			result = true;
		}

	}

	return result;

};

const isDatetime = function(datetime) {

	if (
		IsString(datetime)
		&& datetime.includes("-")
		&& datetime.includes(":")
	) {

		let check = Datetime.from(datetime);

		if (check.IsValid()) {
			return true;
		}

	}

	return false;

};

const isRepeat = function(repeat) {

	if (
		IsString(repeat)
		&& TASK_REPEAT.includes(repeat)
	) {
		return true;
	}

	return false;

};

const isRepeatWeekdays = function(weekdays) {

	if (IsArray(weekdays)) {

		let days  = weekdays.map((v) => v.trim());
		let valid = true;

		days.forEach((day) => {

			if (TASK_WEEKDAYS.includes(day)) {
				valid = false;
			}

		});

		return valid;

	}

	return false;

};

export const NewTask = function(id) {

	let task = new Task();

	if (IsNumber(id)) {
		task.ID = id;
	}

	return task;

};

export const Task = function() {

	this.ID             = 0;
	this.Project        = "life";
	this.Title          = null;
	this.Description    = "";
	this.Complexity     = TASK_COMPLEXITIES[0];
	this.Deadline       = null;
	this.Estimation     = "01:00:00";
	this.Repeat         = null;
	this.RepeatWeekdays = [];
	this.Duration       = "00:00:00";
	this.IsCompleted    = false;
	this.Activities     = [];

};

Task.from = function(value) {

	if (value === null || value === undefined) {

		// Do Nothing

	} else if (Object.prototype.toString.call(value) === "[object Object]") {

		let task = new Task();

		if (IsNumber(value["id"])) {
			task.ID = value["id"];
		}

		if (IsString(value["project"])) {
			task.Project = value["project"];
		}

		if (IsString(value["title"])) {
			task.Title = value["title"];
		}

		if (IsString(value["description"])) {
			task.Description = value["description"];
		}

		if (isComplexity(value["complexity"])) {
			task.Complexity = value["complexity"];
		}

		if (isDatetime(value["deadline"])) {
			task.Deadline = value["deadline"];
		}

		if (isTime(value["estimation"])) {
			task.Estimation = value["estimation"];
		}

		if (isRepeat(value["repeat"])) {
			task.Repeat = value["repeat"];
		}

		if (isRepeatWeekdays(value["repeat_weekdays"])) {
			task.RepeatWeekdays = value["repeat_weekdays"];
		}

		if (isTime(value["duration"])) {
			task.Duration = value["duration"];
		}

		if (IsBoolean(value["is_completed"])) {
			task.IsCompleted = value["is_completed"];
		}

		if (IsArray(value["activities"])) {
			task.Activities = value["activities"];
		}

		return task;

	} else if (Object.prototype.toString.call(value) === "[object String]") {

		let object = null;

		try {
			object = JSON.parse(value);
		} catch (err) {
			object = null;
		}

		if (Object.prototype.toString.call(object) === "[object Object]") {
			return Task.from(object);
		}

	}

	return null;

};


Task.prototype = {

	[Symbol.toStringTag]: "Task",

	IsRunning: function() {

		let result = false;

		if (this.Activities.length > 0) {

			let check = this.Activities[this.Activities.length - 1];
			if (check.endsWith(" - ")) {
				result = true;
			}

		}

		return result;

	},

	IsValid: function() {

		let valid_id = false;
		let valid_project = false;
		let valid_title = false;
		let valid_description = false;
		let valid_complexity = false;
		let valid_deadline = false;
		let valid_estimation = false;
		let valid_repeat = false;
		let valid_duration = false;
		let valid_activities = false;

		// Don't validate IsCompleted

		if (IsNumber(this.ID)) {
			// Don't validate ID
			valid_id = true;
		}

		if (IsString(this.Project) && this.Project !== "" && ToProject(this.Project) === this.Project) {
			valid_project = true;
		}

		if (IsString(this.Title) && this.Title !== "" && ToTitle(this.Title) === this.Title) {
			valid_title = true;
		}

		if (IsString(this.Description) && this.Description !== "") {
			valid_description = true;
		}

		if (isComplexity(this.Complexity)) {
			valid_complexity = true;
		}

		if (this.Deadline !== null) {

			if (isDatetime(this.Deadline)) {
				valid_deadline = true;
			}

		} else {
			valid_deadline = true;
		}

		if (isTime(this.Estimation)) {
			valid_estimation = true;
		}

		if (this.Repeat !== null) {

			if (this.RepeatWeekdays.length > 0) {

				valid_repeat = true;

				for (let r = 0; r < this.RepeatWeekdays.length; r++) {

					let weekday = this.RepeatWeekdays[r];

					if (TASK_WEEKDAYS.includes(weekday) === false) {
						valid_repeat = false;
						break;
					}

				}

				if (valid_repeat === true) {

					if (TASK_REPEAT.includes(this.Repeat)) {
						valid_repeat = true;
					} else {
						valid_repeat = false;
					}

				}

			} else {

				if (TASK_REPEAT.includes(this.Repeat)) {
					valid_repeat = true;
				}

			}

		} else {

			if (this.RepeatWeekdays.length === 0) {
				valid_repeat = true;
			}

		}

		if (isTime(this.Duration)) {
			valid_duration = true;
		}

		if (this.Activities.length > 0) {

			valid_activities = true;

			for (let a = 0; a < this.Activities.length; a++) {

				let activity = this.Activities[a].split(" - ");

				if (activity.length === 2) {

					if (activity[1] === "" && a === this.Activities.length - 1) {

						let before = Datetime.from(activity[0]);
						let now = Datetime.from(new Date());

						if (before.IsBefore(now)) {
							// Do Nothing
						} else {
							valid_activities = false;
							break;
						}

					} else {

						let before = Datetime.from(activity[0]);
						let after = Datetime.from(activity[1]);

						if (before.IsBefore(after)) {
							// Do Nothing
						} else {
							valid_activities = false;
							break;
						}

					}

				}

			}

		} else {
			valid_activities = true;
		}

		if (
			valid_id
			&& valid_project
			&& valid_title
			&& valid_description
			&& valid_complexity
			&& valid_deadline
			&& valid_estimation
			&& valid_repeat
			&& valid_duration
			&& valid_activities
		) {
			return true;
		}

		return false;

	},

	"String": function() {
		return this.toString();
	},

	toJSON: function() {

		return {
			"id":              this.ID,
			"project":         this.Project,
			"title":           this.Title,
			"description":     this.Description,
			"complexity":      this.Complexity,
			"deadline":        this.Deadline,
			"estimation":      this.Estimation,
			"repeat":          this.Repeat,
			"repeat_weekdays": this.RepeatWeekdays,
			"duration":        this.Duration,
			"is_completed":    this.IsCompleted,
			"activities":      this.Activities
		};

	},

	toString: function() {

		return JSON.stringify(this.toJSON(), "", "\t");

	},

	ToDatetimes: function(datetime1, datetime2) {

		let result = [];

		// TODO

		return result;

	}

};

