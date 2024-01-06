
import { DATETIME } from '../parsers/DATETIME.mjs';

const isArray   = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isBoolean = (obj) => Object.prototype.toString.call(obj) === '[object Boolean]';
const isNumber  = (obj) => Object.prototype.toString.call(obj) === '[object Number]';
const isObject  = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
const isString  = (obj) => Object.prototype.toString.call(obj) === '[object String]';



const COMPLEXITY = [
	1,
	2,
	3,
	5,
	8,
	13,
	21
];

const DAYS = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
];



const isComplexity = function(complexity) {

	if (
		isNumber(complexity) === true
		&& COMPLEXITY.includes(complexity) === true
	) {
		return true;
	}

	return false;

};

const isTime = function(duration) {

	if (
		isString(duration) === true
		&& duration.includes(':') === true
	) {

		let check = DATETIME.parse(duration);
		if (DATETIME.isTime(check) === true) {
			return true;
		}

	}

	return false;

};

const isDatetime = function(datetime) {

	if (
		isString(datetime) === true
		&& datetime.includes('-') === true
		&& datetime.includes(':') === true
	) {

		let check = DATETIME.parse(datetime);
		if (DATETIME.isDATETIME(check) === true) {
			return true;
		}

	}

	return false;

};

const isRepeat = function(repeat) {

	if (isArray(repeat) === true) {

		let days  = repeat.map((v) => v.trim());
		let valid = true;

		days.forEach((day) => {

			if (DAYS.includes(day) === false) {
				valid = false;
			}

		});

		return valid;

	}

	return false;

};



export const IsTask = function(task) {

	if (
		isObject(task) === true
		&& isNumber(task.id) === true
		&& isString(task.project) === true
		&& isString(task.title) === true
		&& isString(task.description) === true
		&& isComplexity(task.complexity) === true
		&& (isDatetime(task.deadline) === true || task.deadline === null)
		&& isTime(task.estimation) === true
		&& isBoolean(task.eternal) === true
		&& isRepeat(task.repeat) === true
		&& isTime(task.duration) === true
		&& isBoolean(task.is_completed) === true
		&& isArray(task.activities) === true
	) {
		return true;
	}

	return false;

};

export const NewTask = function(id) {

	id = isNumber(id) ? id : 0;

	return {
		id:           id,
		project:      'life',
		title:        null,
		description:  '',
		complexity:   COMPLEXITY[0],
		deadline:     null,
		estimation:   '01:00:00',
		eternal:      false,
		repeat:       [],
		duration:     '00:00:00',
		is_completed: false
		activities:   []
	};

};

