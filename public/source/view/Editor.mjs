
import { IsTask   } from '../../source/data/Task.mjs';
import { DATETIME } from '../../source/parser/DATETIME.mjs';

const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';



const toDateString = function(datetime) {

	let yyyy = (datetime.year).toString();
	if (yyyy.length < 4) {
		yyyy = '0000'.substr(4 - yyyy.length) + yyyy;
	}

	let mm = (datetime.month).toString();
	if (mm.length < 2) {
		mm = '00'.substr(2 - mm.length) + mm;
	}

	let dd = (datetime.day).toString();
	if (dd.length < 2) {
		dd = '00'.substr(2 - dd.length) + dd;
	}

	return yyyy + '-' + mm + '-' + dd;

};

const toTimeString = function(datetime) {

	let hh = (datetime.hour).toString();
	if (hh.length < 2) {
		hh = '00'.substr(2 - hh.length) + hh;
	}

	let ii = (datetime.minute).toString();
	if (ii.length < 2) {
		ii = '00'.substr(2 - ii.length) + ii;
	}

	let ss = (datetime.second).toString();
	if (ss.length < 2) {
		ss = '00'.substr(2 - ss.length) + ss;
	}

	return hh + ':' + ii + ':' + ss;

};

const render = function(task) {

	let elements = {
		'id':          this.element.querySelector('input[data-name="id"]'),
		'type':        this.element.querySelector('select[data-name="type"]'),
		'project':     this.element.querySelector('input[data-name="project"]'),
		'title':       this.element.querySelector('input[data-name="title"]'),
		'description': this.element.querySelector('textarea[data-name="description"]'),

		'complexity':  this.element.querySelector('select[data-name="complexity"]'),
		'duration':    this.element.querySelector('input[data-name="duration"]'),
		'estimation':  this.element.querySelector('input[data-name="estimation"]'),

		'deadline': {
			'date': this.element.querySelector('input[data-name="deadline-date"]'),
			'time': this.element.querySelector('input[data-name="deadline-time"]'),
		},
		'eternal':  this.element.querySelector('input[data-name="eternal"]'),
		'repeat':   Array.from(this.element.querySelectorAll('input[data-name="repeat"]'))
	};


	if (IsTask(task) === true) {

		elements['id'].value            = (task['id']).toString();
		elements['type'].value          = task['type'];
		elements['project'].value       = task['project'];
		elements['title'].value         = task['title'];
		elements['description'].value   = task['description'];
		elements['complexity'].value    = (task['complexity']).toString();
		elements['duration'].value      = task['duration'];
		elements['estimation'].value    = task['estimation'];

		if (task['deadline'] !== null) {

			let datetime = DATETIME.parse(task['deadline']);

			if (DATETIME.isDATETIME(datetime) === true) {

				elements['deadline']['date'].value = toDateString(datetime);
				elements['deadline']['time'].value = toTimeString(datetime);

			}

		}

		elements['eternal'].checked = task['eternal'];
		elements['repeat'].forEach((element) => {

			if (task['repeat'].includes(element.value) === true) {
				element.checked = true;
			} else {
				element.checked = false;
			}

		});

	} else {

		elements['id'].value            = '0';
		elements['type'].value          = 'other';
		elements['project'].value       = '';
		elements['title'].value         = '';
		elements['description'].value   = '';
		elements['complexity'].value    = '1';
		elements['duration'].value      = '00:00:00';
		elements['estimation'].value    = '';
		elements['deadline']['date'].value = '';
		elements['deadline']['time'].value = '';
		elements['eternal'].checked = false;
		elements['repeat'].forEach((element) => {
			element.checked = false;
		});

	}

};

const renderHeader = function(title) {

	title = isString(title) ? title : 'Create Task';

	this.header.innerHTML = '<b>' + title + '</b>';

};

const reset = function() {

	let elements = {
		'id':          this.element.querySelector('input[data-name="id"]'),

		'title':       this.element.querySelector('input[data-name="title"]'),
		'description': this.element.querySelector('textarea[data-name="description"]'),

		'duration':    this.element.querySelector('input[data-name="duration"]')
	};

	elements['id'].value            = '0';
	elements['title'].value         = '';
	elements['description'].value   = '';
	elements['duration'].value      = '00:00:00';

};


const Editor = function(app, element) {

	this.app     = app;
	this.header  = element.querySelector('header');
	this.element = element.querySelector('section');

};


Editor.prototype = {

	render: function(task) {

		task = IsTask(task) ? task : null;


		if (task !== null) {

			render.call(this, task);
			renderHeader.call(this, 'Edit Task #' + task.id);

		} else if (task === null) {

			render.call(this, null);
			renderHeader.call(this, 'Create Task');

		}

	},

	reset: function() {

		reset.call(this);

	}

};


export { Editor };

