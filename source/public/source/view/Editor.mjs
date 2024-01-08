
import { IsString     } from "/stdlib.mjs";
import { Datetime     } from "../structs/Datetime.mjs";
import { IsTask       } from "../structs/Task.mjs";
import { ToDateString } from "../utils/ToDateString.mjs";
import { ToTimeString } from "../utils/ToTimeString.mjs";


const render = function(task) {

	let elements = {
		"id":          this.element.querySelector("input[data-name=\"id\"]"),
		"project":     this.element.querySelector("input[data-name=\"project\"]"),
		"title":       this.element.querySelector("input[data-name=\"title\"]"),
		"description": this.element.querySelector("textarea[data-name=\"description\"]"),

		"complexity":  this.element.querySelector("select[data-name=\"complexity\"]"),
		"duration":    this.element.querySelector("input[data-name=\"duration\"]"),
		"estimation":  this.element.querySelector("input[data-name=\"estimation\"]"),

		"deadline": {
			"date": this.element.querySelector("input[data-name=\"deadline-date\"]"),
			"time": this.element.querySelector("input[data-name=\"deadline-time\"]"),
		},
		"eternal":  this.element.querySelector("input[data-name=\"eternal\"]"),
		"repeat":   Array.from(this.element.querySelectorAll("input[data-name=\"repeat\"]"))
	};


	if (IsTask(task) === true) {

		elements["id"].value            = (task["id"]).toString();
		elements["project"].value       = task["project"];
		elements["title"].value         = task["title"];
		elements["description"].value   = task["description"];
		elements["complexity"].value    = (task["complexity"]).toString();
		elements["duration"].value      = task["duration"];
		elements["estimation"].value    = task["estimation"];

		if (task["deadline"] !== null) {

			let datetime = Datetime.from(task["deadline"]);

			if (datetime.IsValid()) {

				elements["deadline"]["date"].value = ToDateString(datetime);
				elements["deadline"]["time"].value = ToTimeString(datetime);

			}

		}

		elements["eternal"].checked = task["eternal"];
		elements["repeat"].forEach((element) => {

			if (task["repeat"].includes(element.value) === true) {
				element.checked = true;
			} else {
				element.checked = false;
			}

		});

	} else {

		elements["id"].value            = "0";
		elements["project"].value       = "";
		elements["title"].value         = "";
		elements["description"].value   = "";
		elements["complexity"].value    = "1";
		elements["duration"].value      = "00:00:00";
		elements["estimation"].value    = "";
		elements["deadline"]["date"].value = "";
		elements["deadline"]["time"].value = "";
		elements["eternal"].checked = false;
		elements["repeat"].forEach((element) => {
			element.checked = false;
		});

	}

};

const renderHeader = function(title) {

	title = IsString(title) ? title : "Create Task";

	let headline = this.header.querySelector("b");
	if (headline !== null) {
		headline.innerHTML = title;
	}

};

const renderFooter = function(task) {

	if (IsTask(task) === true) {

		this.actions["remove"].removeAttribute("disabled");

		if (this.actions["save-create"].parentNode !== null) {
			this.actions["save-create"].parentNode.removeChild(this.actions["save-create"]);
		}

	} else {

		this.actions["remove"].setAttribute("disabled", true);

		if (this.actions["save-create"].parentNode === null) {
			this.footer.appendChild(this.actions["save-create"]);
		}

	}

};

const reset = function() {

	let elements = {
		"id":          this.element.querySelector("input[data-name=\"id\"]"),
		"title":       this.element.querySelector("input[data-name=\"title\"]"),
		"description": this.element.querySelector("textarea[data-name=\"description\"]"),
		"duration":    this.element.querySelector("input[data-name=\"duration\"]")
	};

	elements["id"].value            = "0";
	elements["title"].value         = "";
	elements["description"].value   = "";
	elements["duration"].value      = "00:00:00";

};


const Editor = function(app, element) {

	this.app     = app;
	this.header  = element.querySelector("header");
	this.element = element.querySelector("section");
	this.footer  = element.querySelector("footer");

	this.actions = {
		"remove":      this.footer.querySelector("button[data-action=\"remove\"]"),
		"save":        this.footer.querySelector("button[data-action=\"save\"]"),
		"save-create": this.footer.querySelector("button[data-action=\"save-create\"]")
	};

};


Editor.prototype = {

	Render: function(task) {

		task = IsTask(task) ? task : null;


		if (task !== null) {

			render.call(this, task);
			renderHeader.call(this, "Edit Task #" + task.id);
			renderFooter.call(this, task);

		} else if (task === null) {

			render.call(this, null);
			renderHeader.call(this, "Create Task");
			renderFooter.call(this, null);

		}

	},

	Reset: function() {

		reset.call(this);

	}

};


export { Editor };

