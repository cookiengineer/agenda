
import { IsArray, IsString } from "/stdlib.mjs";
import { Datetime          } from "/source/structs/Datetime.mjs";
import { IsTask            } from "/source/structs/Task.mjs";

const renderEmpty = function() {

	let element = document.createElement("article");
	let html    = [];

	html.push("<h3>No tasks found. Great job!</h3>");
	html.push("<div>");
	html.push("- Change the scope of tasks with the buttons for each project in the header.<br>");
	html.push("- Refine your search with the search field in the footer.<br>");
	html.push("- Create a new task with the button in the bottom right corner.<br>");
	html.push("- Switch to another view with the menu in the top left corner.<br>");
	html.push("</div>");

	element.innerHTML = html.join("");

	return element;

};

const render = function(task, active) {

	if (IsTask(task)) {

		let element = document.createElement("article");
		let html    = [];

		element.setAttribute("data-id",      task.ID);
		element.setAttribute("data-project", task.Project);

		html.push("<h3>");
		html.push("<span data-complexity=\"" + task.Complexity + "\">" + task.Complexity + "</span>");
		html.push(task.Title);
		html.push("</h3>");

		html.push("<div>");
		html.push("<b>" + task.Project + "</b>");
		html.push("<span data-duration=\"" + task.Duration + "\">" + task.Duration + "</span>");
		html.push(" / ");
		html.push("<span data-estimation=\"" + task.Estimation + "\">" + task.Estimation + "</span>");
		if (IsArray(task.Repeat) && task.Repeat.length > 0) {
			html.push("<br>");
			html.push("<span data-repeat=\"" + task.Repeat.join(",") + "\">(every " + task.Repeat.join(", ") + ")</span>");
		}
		html.push("</div>");

		if (IsString(task.Deadline)) {

			html.push("<div>");

			let deadline = Datetime.from(task.Deadline);
			let today    = Datetime.from(new Date());

			if (
				deadline.Year === today.Year
				&& deadline.Month === today.Month
				&& deadline.Day === today.Day
			) {
				html.push("<span title=\"Must be done today!\">!</span> <span data-deadline=\"" + task.Deadline + "\">" + task.Deadline + "</span>");
			} else {
				html.push("<span data-deadline=\"" + task.Deadline + "\">" + task.Deadline + "</span>");
			}
			html.push("</div>");

		}

		html.push("<div>");
		if (IsString(task.Description)) {
			html.push(task.Description.split("\n").join("<br>\n"));
		}
		html.push("</div>");

		html.push("<footer>");
		html.push("<button data-action=\"edit\">Edit</button>");
		if (active === true) {
			html.push("<button data-action=\"stop\" title=\"Stop working on this Task!\">Stop</button>");
		} else {
			html.push("<button data-action=\"start\" title=\"Start to work on this Task!\">Start</button>");
		}
		html.push("</footer>");

		element.className = active === true ? "active" : "";
		element.innerHTML = html.join("");

		return element;

	}


	return null;

};



const Agenda = function(app, element) {

	this.app     = app;
	this.element = element.querySelector("section");

};

Agenda.prototype = {

	[Symbol.toStringTag]: "view/Agenda",

	Render: function() {

		let rendered = [];
		let has_active = false;

		this.app.Tasks.filter((task) => {
			return this.app.IsVisible(task);
		}).forEach((task) => {

			if (this.app.active === task) {

				let element = render.call(this, task, true);
				if (element !== null) {
					has_active = true;
					rendered.unshift(element);
				}

			} else {

				let element = render.call(this, task, false);
				if (element !== null) {
					rendered.push(element);
				}

			}

		});

		Array.from(this.element.querySelectorAll("article")).forEach((article) => {
			article.parentNode.removeChild(article);
		});

		if (rendered.length > 0) {

			if (has_active === true) {

				let active_article  = rendered[0];
				let active_interval = setInterval(() => {

					if (this.app.active !== null) {

						let duration = active_article.querySelector("span[data-duration]");
						if (duration !== null) {
							duration.innerHTML = this.app.active.duration;
						}

					} else {
						clearInterval(active_interval);
					}

				}, 1000);

			}

			rendered.forEach((article) => {
				this.element.appendChild(article);
			});

		} else {
			this.element.appendChild(renderEmpty());
		}

	}

};


export { Agenda };

