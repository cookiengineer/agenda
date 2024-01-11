
import { IsArray, IsString } from "/stdlib.mjs";
import { Datetime          } from "/source/structs/Datetime.mjs";
import { IsTask            } from "/source/structs/Task.mjs";
import { IsElement         } from "/source/utils/IsElement.mjs";
import { ToElement         } from "/source/utils/ToElement.mjs";

const renderEmpty = function() {

	let element = document.createElement("article");
	let html    = [];

	html.push("<h3>No tasks found. Good job!</h3>");
	html.push("<div>");
	html.push("<ul>");
	html.push("<li>Switch to another view with the buttons in the header.</li>");
	html.push("<li>Search for a specific project with the selector in the header.</li>");
	html.push("<li>Search for a specific task with the text field in the footer.</li>");
	html.push("<li>Create a new task with the button in the footer.</li>");
	html.push("</ul>");
	html.push("</div>");

	element.classList.add("help");
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
	this.section = element.querySelector("section");
	this.footer  = element.querySelector("footer");
	this.dialog  = element.querySelector("dialog");

	this.actions = {
		"create": this.footer.querySelector("button[data-action=\"create\"]"),
		"search": this.footer.querySelector("input[data-action=\"search\"]"),
	};

	this.dialog_actions = {
		"yes": this.dialog.querySelector("button[data-confirm=\"yes\"]"),
		"no":  this.dialog.querySelector("button[data-confirm=\"no\"]")
	};

	this.Init();

};

Agenda.prototype = {

	[Symbol.toStringTag]: "view/Agenda",

	Init: function() {

		this.dialog.addEventListener("click", (event) => {

			if (IsElement("button", event.target)) {

				let confirm = event.target.getAttribute("data-confirm");

				if (confirm === "yes") {

					if (this.activity.Task !== null) {

						this.activity.Task.IsCompleted = true;
						this.app.Stop();
						this.app.Render();

					}

					this.dialog.removeAttribute("open");

				} else if (confirm === "no") {

					if (this.activity.Task !== null) {

						this.app.Stop();
						this.app.Render();

					}

					this.dialog.removeAttribute("open");

				}

			}

		});

		this.section.addEventListener("click", (event) => {

			let article = ToElement("article", event.target);
			if (article !== null) {

				if (IsElement("button", event.target)) {

					let action = event.target.getAttribute("data-action");
					let task   = this.app.ToTask(article.getAttribute("data-id"));

					if (action === "edit" && task !== null) {

						this.app.Show("editor", task);

					} else if (action === "start" && task !== null) {

						this.app.Start(task);
						this.app.Render();

						event.target.setAttribute("data-action", "stop");
						event.target.innerHTML = "Stop";

					} else if (action === "stop" && task !== null) {

						this.dialog.setAttribute("open", true);

						event.target.setAttribute("data-action", "start");
						event.target.innerHTML = "Start";

					}

				} else {

					let articles = Array.from(this.section.querySelectorAll("article"));
					if (articles.length > 0) {

						articles.forEach((other) => {

							if (other === article) {
								other.setAttribute("data-focus", true);
							} else {
								other.removeAttribute("data-focus");
							}

						});

					}

				}

			}

		});

		this.actions["create"].addEventListener("click", () => {
			this.app.Show("editor", null);
		});

		this.actions["search"].addEventListener("keyup", () => {

			let keywords = this.actions["search"].value.trim().split(" ").map((value) => {

				value = value.split(".").join("");
				value = value.split(",").join("");
				value = value.split("/").join("");

				return value;

			});

			this.app.Selector.keywords = keywords;
			this.app.Render();

		});

		this.actions["search"].addEventListener("change", () => {

			let keywords = this.actions["search"].value.trim().split(" ").map((value) => {

				value = value.split(".").join("");
				value = value.split(",").join("");
				value = value.split("/").join("");

				return value;

			});

			this.app.Selector.keywords = keywords;
			this.app.Render();

		});

		this.interval = setInterval(() => {

			if (this.app.Activity.IsRunning()) {

				let duration = this.section.querySelector("article[data-id=\"" + this.app.Activity.Task.ID + "\"] span[data-duration]");
				if (duration !== null) {
					duration.innerHTML = this.app.Activity.ToDurationString();
				}

			}

		}, 1000);

	},

	Render: function() {

		let rendered = [];

		this.app.Tasks.filter((task) => {
			return this.app.IsVisible(task);
		}).forEach((task) => {

			if (this.app.Activity.IsRunning() && this.app.Activity.Task === task) {

				let element = render.call(this, task, true);
				if (element !== null) {
					rendered.unshift(element);
				}

			} else {

				let element = render.call(this, task, false);
				if (element !== null) {
					rendered.push(element);
				}

			}

		});

		Array.from(this.section.querySelectorAll("article")).forEach((article) => {
			article.parentNode.removeChild(article);
		});

		if (rendered.length > 0) {

			rendered.forEach((article) => {
				this.section.appendChild(article);
			});

		} else {
			this.section.appendChild(renderEmpty());
		}

	}

};


export { Agenda };

