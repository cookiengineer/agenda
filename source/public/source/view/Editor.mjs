
import { IsArray, IsString                 } from "/stdlib.mjs";
import { ToBoolean    as InputToBoolean    } from "/source/elements/Input.mjs";
import { ToNumber     as InputToNumber     } from "/source/elements/Input.mjs";
import { ToString     as InputToString     } from "/source/elements/Input.mjs";
import { ToNumber     as SelectToNumber    } from "/source/elements/Select.mjs";
import { ToString     as SelectToString    } from "/source/elements/Select.mjs";
import { ToString     as TextareaToString  } from "/source/elements/Textarea.mjs";
import { ToDateString as InputToDateString } from "/source/elements/Input.mjs";
import { ToTimeString as InputToTimeString } from "/source/elements/Input.mjs";
import { Datetime                          } from "/source/structs/Datetime.mjs";
import { IsTask, Task                      } from "/source/structs/Task.mjs";
import { ToDateString                      } from "/source/utils/ToDateString.mjs";
import { ToTimeString                      } from "/source/utils/ToTimeString.mjs";

const CheckboxesToStrings = (elements) => {

	let filtered = [];

	elements.forEach((element) => {

		if (element !== null && element.checked === true) {
			filtered.push(InputToString(element));
		}

	});

	return filtered;

};

const InputsToStrings = (elements) => {

	let filtered = [];

	elements.forEach((element) => {

		if (element !== null) {
			filtered.push(InputToString(element));
		}

	});

	return filtered;

};

const toTask = function() {

	let task = new Task();

	task.ID             = InputToNumber(this.section.querySelector("input[data-name=\"id\"]"));
	task.Project        = InputToString(this.section.querySelector("input[data-name=\"project\"]"));
	task.Title          = InputToString(this.section.querySelector("input[data-name=\"title\"]"));
	task.Description    = TextareaToString(this.section.querySelector("textarea[data-name=\"description\"]"));
	task.Complexity     = SelectToNumber(this.section.querySelector("select[data-name=\"complexity\"]")) || 1;
	task.Duration       = InputToString(this.section.querySelector("input[data-name=\"duration\"]"));
	task.Estimation     = InputToString(this.section.querySelector("input[data-name=\"estimation\"]"));
	task.IsCompleted    = InputToBoolean(this.section.querySelector("input[data-name=\"is-completed\"]"));
	task.Activities     = InputsToStrings(Array.from(this.section.querySelectorAll("input[data-name=\"activities\"]")));

	let date = InputToDateString(this.section.querySelector("input[data-name=\"deadline-date\"]"));
	let time = InputToTimeString(this.section.querySelector("input[data-name=\"deadline-time\"]"));

	if (date !== "" && date.endsWith(" 00:00:00")) {
		date = date.split(" ").shift();
	}

	if (date !== "") {

		if (time === "") {
			time = "23:59:59";
		}

		task.Deadline = date + " " + time;

	}

	let repeat_element = this.section.querySelector("select[data-name=\"repeat\"]");
	if (repeat_element.getAttribute("disabled") === null) {
		task.Repeat         = SelectToString(this.section.querySelector("select[data-name=\"repeat\"]"));
		task.RepeatWeekdays = CheckboxesToStrings(Array.from(this.section.querySelectorAll("input[data-name=\"repeat-weekdays\"]")));
	} else {
		task.Repeat         = null;
		task.RepeatWeekdays = [];
	}

	return task;

};

const render = function(task) {

	if (IsTask(task)) {

		this.elements["id"].value           = (task.ID).toString();
		this.elements["project"].value      = task.Project;
		this.elements["title"].value        = task.Title;
		this.elements["description"].value  = task.Description;
		this.elements["complexity"].value   = (task.Complexity).toString();
		this.elements["estimation"].value   = task.Estimation;
		this.elements["duration"].value     = task.Duration;
		this.elements["is-completed"].value = task.IsCompleted;

		if (IsString(task.Deadline)) {

			let datetime = Datetime.from(task.Deadline);
			if (datetime.IsValid()) {

				this.elements["deadline"]["date"].value = ToDateString(datetime);
				this.elements["deadline"]["time"].value = ToTimeString(datetime);

			}

		} else {

			this.elements["deadline"]["date"].value = "";
			this.elements["deadline"]["time"].value = "";

		}

		if (IsString(task.Repeat) && IsArray(task.RepeatWeekdays)) {

			this.actions["toggle-repeat"].checked = true;
			this.elements["repeat"].removeAttribute("disabled");
			this.elements["repeat"].value = task.Repeat;
			this.elements["repeat-weekdays"].forEach((element) => {

				element.removeAttribute("disabled");
				if (task.RepeatWeekdays.includes(element.value)) {
					element.checked = true;
				} else {
					element.checked = false;
				}

			});

		} else {

			this.actions["toggle-repeat"].checked = false;
			this.elements["repeat"].setAttribute("disabled", true);
			this.elements["repeat"].value = "weekly";
			this.elements["repeat-weekdays"].forEach((element) => {
				element.setAttribute("disabled", true);
				element.checked = false;
			});

		}

		if (IsArray(task.Activities)) {

			this.elements["activities"].forEach((element) => {
				element.parentNode.removeChild(element);
			});
			this.elements["activities"] = [];

			task.Activities.forEach((activity) => {

				let input = document.createElement("input");

				input.setAttribute("data-name", "activities");
				input.setAttribute("type", "hidden");

				input.value = activity;

				let article = this.section.querySelector("article");
				let fieldset = this.section.querySelector("article fieldset:nth-of-type(1)");

				article.insertBefore(input, fieldset);

			});

		} else {

			this.elements["activities"].forEach((element) => {
				element.parentNode.removeChild(element);
			});
			this.elements["activities"] = [];

		}

	} else {

		this.elements["id"].value               = "0";
		this.elements["project"].value          = "";
		this.elements["title"].value            = "";
		this.elements["description"].value      = "";
		this.elements["complexity"].value       = "1";
		this.elements["deadline"]["date"].value = "";
		this.elements["deadline"]["time"].value = "";
		this.elements["estimation"].value       = "";
		this.elements["duration"].value         = "00:00:00";
		this.elements["is-completed"].value     = false;

		this.actions["toggle-repeat"].checked = false;
		this.elements["repeat"].setAttribute("disabled", true);
		this.elements["repeat"].value = "weekly";
		this.elements["repeat-weekdays"].forEach((element) => {
			element.setAttribute("disabled", true);
			element.checked = false;
		});

		this.elements["activities"].forEach((element) => {
			element.parentNode.removeChild(element);
		});
		this.elements["activities"] = [];

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

	if (IsTask(task)) {

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

	// Keep project value
	this.elements["id"].value               = "0";
	this.elements["title"].value            = "";
	this.elements["description"].value      = "";
	this.elements["complexity"].value       = "1";
	this.elements["estimation"].value       = "";
	this.elements["deadline"]["date"].value = "";
	this.elements["deadline"]["time"].value = "";
	this.elements["duration"].value         = "00:00:00";
	this.elements["is-completed"].value     = false;

	this.elements["repeat"].value = "weekly";
	this.elements["repeat-weekdays"].forEach((element) => {
		element.checked = false;
	});

	this.elements["activities"].forEach((element) => {
		element.parentNode.removeChild(element);
	});
	this.elements["activities"] = [];

};


const Editor = function(app, element) {

	this.app     = app;
	this.header  = element.querySelector("header");
	this.section = element.querySelector("section");
	this.footer  = element.querySelector("footer");

	this.actions = {
		"autocomplete":           this.section.querySelector("input[data-action=\"autocomplete\"]"),
		"remove":                 this.footer.querySelector("button[data-action=\"remove\"]"),
		"save":                   this.footer.querySelector("button[data-action=\"save\"]"),
		"save-create":            this.footer.querySelector("button[data-action=\"save-create\"]"),
		"toggle-repeat":          this.section.querySelector("input[data-action=\"toggle-repeat\"]"),
		"toggle-repeat-weekdays": this.section.querySelector("label[data-action=\"toggle-repeat-weekdays\"]")
	};

	this.elements = {
		"id":          this.section.querySelector("input[data-name=\"id\"]"),
		"project":     this.section.querySelector("input[data-name=\"project\"]"),
		"title":       this.section.querySelector("input[data-name=\"title\"]"),
		"description": this.section.querySelector("textarea[data-name=\"description\"]"),
		"complexity":  this.section.querySelector("select[data-name=\"complexity\"]"),
		"duration":    this.section.querySelector("input[data-name=\"duration\"]"),
		"estimation":  this.section.querySelector("input[data-name=\"estimation\"]"),
		"deadline": {
			"date": this.section.querySelector("input[data-name=\"deadline-date\"]"),
			"time": this.section.querySelector("input[data-name=\"deadline-time\"]"),
		},
		"repeat":          this.section.querySelector("select[data-name=\"repeat\"]"),
		"repeat-weekdays": Array.from(this.section.querySelectorAll("input[data-name=\"repeat-weekdays\"]")),
		"is-completed":    this.section.querySelector("input[data-name=\"is-completed\"]"),
		"activities":      Array.from(this.section.querySelectorAll("input[data-name=\"activities\"]"))
	};


	this.Init();

};


Editor.prototype = {

	Init: function() {

		this.actions["autocomplete"].addEventListener("input", (event) => {

			if (
				event.inputType === "insertFromPaste"
				|| event.inputType === "deleteContentForward"
				|| event.inputType === "deleteContentBackward"
			) {

				// Do Nothing

			} else if (
				event.inputType === "insertText"
			) {

				let projects    = Object.keys(this.app.Projects).sort();
				let suggestions = [];
				let value       = this.actions["autocomplete"].value;

				projects.forEach((project) => {

					if (project.startsWith(value)) {
						suggestions.push(project);
					}

				});

				// Only auto-complete if there's exactly one match
				if (suggestions.length === 1) {
					this.actions["autocomplete"].value = suggestions[0];
					this.actions["autocomplete"].setSelectionRange(value.length, suggestions[0].length);
				}

			}

		});

		this.actions["remove"].addEventListener("click", () => {

			let task = toTask.call(this);

			if (IsTask(task) && task.ID !== 0) {

				this.app.Client.Remove(task, (result) => {

					if (result === true) {

						this.app.Update(() => {
							this.app.Show("agenda");
						});

					}

				});

			}

		});

		this.actions["save"].addEventListener("click", () => {

			let task = toTask.call(this);

			if (IsTask(task)) {

				if (task.ID !== 0) {

					this.app.Client.Modify(task, () => {

						this.app.Render(null);
						this.app.Update(() => {
							this.app.Show("agenda");
						});

					});

				} else {

					this.app.Client.Create(task, (result) => {

						if (result === true) {

							this.app.Render(null);
							this.app.Update(() => {
								this.app.Show("agenda");
							});

						}

					});

				}

			}

		});

		this.actions["save-create"].addEventListener("click", () => {

			let task = toTask.call(this);

			if (IsTask(task)) {

				this.app.Client.Create(task, (result, response) => {

					if (result === true) {
						this.app.Render(response);
					}

				});

			}

		});

		this.actions["toggle-repeat"].addEventListener("click", () => {

			let checked = this.actions["toggle-repeat"].checked;
			if (checked === true) {

				this.elements["repeat"].removeAttribute("disabled");
				this.elements["repeat-weekdays"].forEach((element) => {
					element.removeAttribute("disabled");
				});

			} else {

				this.elements["repeat"].setAttribute("disabled", true);
				this.elements["repeat"].value = "weekly";
				this.elements["repeat-weekdays"].forEach((element) => {
					element.setAttribute("disabled", true);
					element.checked = false;
				});

			}

		});

		this.actions["toggle-repeat-weekdays"].addEventListener("click", () => {

			if (this.elements["repeat"].getAttribute("disabled") === null) {

				let first_unchecked = this.elements["repeat-weekdays"].find((element) => {
					return element.checked === false;
				}) || null;

				if (first_unchecked !== null) {

					first_unchecked.checked = true;

				} else {

					this.elements["repeat-weekdays"].find((element) => {
						element.checked = false;
					});

				}

			} else {

				this.elements["repeat-weekdays"].find((element) => {
					element.checked = false;
				});

			}

		});

	},

	Render: function(task) {

		task = IsTask(task) ? task : null;


		if (task !== null) {

			render.call(this, task);
			renderHeader.call(this, "Edit Task #" + task.ID);
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

