
import { Datetime     } from "/source/structs/Datetime.mjs";
import { Task, IsTask } from "/source/structs/Task.mjs";

const DAYS = {
	"Mon": "Monday",
	"Tue": "Tuesday",
	"Wed": "Wednesday",
	"Thu": "Thursday",
	"Fri": "Friday",
	"Sat": "Saturday",
	"Sun": "Sunday"
};

const onresize = () => {

	let mode = "desktop";
	let body = document.querySelector("body");
	if (body !== null) {
		mode = body.getAttribute("data-mode");
	}

	let width = window.innerWidth;
	if (width > 720) {

		if (mode !== "desktop") {

			let repeat = Array.from(document.querySelectorAll("section#editor > section fieldset ul#editor-repeat li label"));
			if (repeat.length > 0) {

				repeat.forEach((element) => {

					let keys = Object.keys(DAYS);
					let vals = Object.values(DAYS);
					let text = element.innerHTML.trim();

					if (vals.includes(text) === true) {
						element.innerHTML = keys[vals.indexOf(text)];
					}

				});

			}

			body.setAttribute("data-mode", "desktop");

		}

	} else if (width < 720) {

		if (mode !== "mobile") {

			let repeat = Array.from(document.querySelectorAll("section#editor > section fieldset ul#editor-repeat li label"));
			if (repeat.length > 0) {

				repeat.forEach((element) => {

					let keys = Object.keys(DAYS);
					let vals = Object.values(DAYS);
					let text = element.innerHTML.trim();

					if (keys.includes(text) === true) {
						element.innerHTML = vals[keys.indexOf(text)];
					}

				});

			}

			body.setAttribute("data-mode", "mobile");

		}

	}

};

const toBoolean = (element) => {

	if (element !== null) {

		if (element.checked === true) {
			return true;
		}

	}

	return false;

};

const toDatetimeString = (date_element, time_element) => {

	let date_str = "";
	let time_str = "";

	if (date_element !== null) {
		date_str = (date_element.value).trim();
	}

	if (time_element !== null) {
		time_str = (time_element.value).trim();
	}

	if (date_str === "" && time_str.includes(":") === true) {

		let now = Datetime.from(new Date()).toString();
		if (now.includes(" ")) {
			date_str = now.split(" ").shift();
		}

	}

	if (date_str !== "" && time_str !== "") {

		let datetime = Datetime.from(date_str + " " + time_str);
		if (datetime.IsValid()) {
			return datetime.toString();
		}

	} else if (date_str !== "") {

		let datetime = Datetime.from(date_str + " 23:59:59");
		if (datetime.IsValid()) {
			return datetime.toString();
		}

	}

	return null;

};

const toNumber = (element) => {

	if (element !== null) {

		let val = element.value.trim();
		let num = parseInt(val, 10);

		if ((num).toString() === val) {
			return num;
		}

	}

	return 0;

};

const toString = (element) => {

	if (element !== null) {

		let str = element.value.trim();
		if (str !== "") {
			return str;
		}

	}

	return null;

};

const toStrings = (elements) => {

	if (elements.length > 0) {

		let filtered = [];

		elements.forEach((element) => {

			if (element !== null) {

				let str = element.value.trim();
				if (str !== "") {

					if (element.type === "checkbox") {

						if (element.checked === true) {
							filtered.push(str);
						}

					} else {
						filtered.push(str);
					}

				}

			}

		});

		return filtered;

	}

	return [];

};

const toTask = (section) => {

	let task = new Task();

	task.ID          = toNumber(section.querySelector("input[data-name=\"id\"]"));
	task.Project     = toString(section.querySelector("input[data-name=\"project\"]"));
	task.Title       = toString(section.querySelector("input[data-name=\"title\"]"));
	task.Description = toString(section.querySelector("textarea[data-name=\"description\"]"));
	task.Complexity  = toNumber(section.querySelector("select[data-name=\"complexity\"]")) || 1;
	task.Duration    = toString(section.querySelector("input[data-name=\"duration\"]"));
	task.Estimation  = toString(section.querySelector("input[data-name=\"estimation\"]"));
	task.Deadline    = toDatetimeString(section.querySelector("input[data-name=\"deadline-date\"]"), section.querySelector("input[data-name=\"deadline-time\"]"));
	task.Eternal     = toBoolean(section.querySelector("input[data-name=\"eternal\"]"));
	task.Repeat      = toStrings(Array.from(section.querySelectorAll("input[data-name=\"repeat\"]")));

	return task;

};

export const initialize = () => {

	let header = document.querySelector("section#editor > header");
	if (header !== null) {
		// Do Nothing
	}

	let section = document.querySelector("section#editor > section");
	let footer = document.querySelector("section#editor > footer");

	if (section !== null && footer !== null) {

		let remove = footer.querySelector("button[data-action=\"remove\"]");
		if (remove !== null) {

			remove.addEventListener("click", () => {

				let APP  = window.APP || null;
				let task = toTask(section);

				if (APP !== null && IsTask(task)) {

					if (task.ID !== 0) {

						APP.Client.Remove(task, (result) => {

							if (result === true) {

								APP.Update(() => {
									APP.Show("agenda");
								});

							}

						});

					}

				}

			});

		}

		let save = footer.querySelector("button[data-action=\"save\"]");
		if (save !== null) {

			save.addEventListener("click", () => {

				let APP  = window.APP || null;
				let task = toTask(section);

				if (APP !== null && IsTask(task)) {

					if (task.ID !== 0) {

						APP.Client.Modify(task, () => {

							APP.Render(null);
							APP.Update(() => {
								APP.Show("agenda");
							});

						});

					} else {

						APP.Client.Create(task, (result) => {

							if (result === true) {

								APP.Render(null);
								APP.Update(() => {
									APP.Show("agenda");
								});

							}

						});

					}

				}

			});

		}

		let save_create = footer.querySelector("button[data-action=\"save-create\"]");
		if (save_create !== null) {

			save_create.addEventListener("click", () => {

				let APP  = window.APP || null;
				let task = toTask(section);

				if (APP !== null && IsTask(task)) {

					APP.Client.Create(task, (result, response) => {

						if (result === true) {

							APP.Render(response);
							APP.Reset();

						}

					});

				}

			});

		}

	}

	window.addEventListener("resize", onresize);

	setTimeout(() => {
		onresize();
	}, 0);

};

