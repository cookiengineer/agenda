
import { IsArray, IsBoolean, IsNumber, IsString } from "/stdlib.mjs";
import { Datetime                               } from "./Datetime.mjs";

export const IsTask = (obj) => Object.prototype.toString.call(obj) === "[object Task]";

const COMPLEXITIES = [
	1,
	2,
	3,
	5,
	8,
	13,
	21
];

const DAYS = [
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
		&& COMPLEXITIES.includes(complexity)
	) {
		return true;
	}

	return false;

};

const isTime = (value) => {

	let result = false;

	if (value.includes(":")) {

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

	if (IsArray(repeat)) {

		let days  = repeat.map((v) => v.trim());
		let valid = true;

		days.forEach((day) => {

			if (DAYS.includes(day)) {
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

	this.ID          = 0;
	this.Project     = "life";
	this.Title       = null;
	this.Description = "";
	this.Complexity  = COMPLEXITIES[0];
	this.Deadline    = null;
	this.Estimation  = "01:00:00";
	this.Eternal     = false;
	this.Repeat      = [];
	this.Duration    = "00:00:00";
	this.IsCompleted = false;
	this.Activities  = [];

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

		if (IsBoolean(value["eternal"])) {
			task.Eternal = value["eternal"];
		}

		if (isRepeat(value["repeat"])) {
			task.Repeat = value["repeat"];
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

	IsValid: function() {

		if (
			IsNumber(this.ID)
			&& IsString(this.Project)
			&& IsString(this.Title)
			&& IsString(this.Description)
			&& isComplexity(this.Complexity)
			&& (isDatetime(this.Deadline) || this.Deadline === null)
			&& isTime(this.Estimation)
			&& IsBoolean(this.Eternal)
			&& isRepeat(this.Repeat)
			&& isTime(this.Duration)
			&& IsBoolean(this.IsCompleted)
			&& IsArray(this.Activities)
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
			"id":           this.ID,
			"project":      this.Project,
			"title":        this.Title,
			"description":  this.Description,
			"complexity":   this.Complexity,
			"deadline":     this.Deadline,
			"estimation":   this.Estimation,
			"eternal":      this.Eternal,
			"repeat":       this.Repeat,
			"duration":     this.Duration,
			"is_completed": this.IsCompleted,
			"activities":   this.Activities
		};

	},

	toString: function() {

		return JSON.stringify(this.toJSON(), "", "\t");

	}

};

