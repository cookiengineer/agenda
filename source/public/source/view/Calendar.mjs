
import { IsString           } from "/stdlib.mjs";
import { Datetime           } from "/source/structs/Datetime.mjs";
import { IsTask             } from "/source/structs/Task.mjs";
import { FormatInt          } from "/source/utils/FormatInt.mjs";
import { ToDateString       } from "/source/utils/ToDateString.mjs";
import { ToTimeString       } from "/source/utils/ToTimeString.mjs";
import { SortTaskByDeadline } from "/source/utils/SortTaskByDeadline.mjs";

const toFirstWeekday = (datetime) => {

	let index = new Date(Date.UTC(datetime.Year, datetime.Month - 1, 1)).getDay();

	// Sunday to Saturday, stoopid Americans
	if (index === 0) {
		return 6;
	} else {
		return index - 1;
	}

};

const renderCalendar = function(selector) {

	let prev_month = Datetime.from(ToDateString(selector)).PrevMonth();
	let curr_month = Datetime.from(ToDateString(selector));
	let next_month = Datetime.from(ToDateString(selector)).NextMonth();

	let calendar  = [[]];
	let first_day = toFirstWeekday(curr_month);

	for (let d = 0; d < first_day; d++) {

		let day      = prev_month.ToDays() - first_day + d + 1;
		let datetime = Datetime.from(FormatInt(prev_month.Year, 4) + "-" + FormatInt(prev_month.Month, 2) + "-" + FormatInt(day, 2));

		calendar[0].push(datetime);

	}

	let week = calendar[0];

	for (let day = 1; day <= curr_month.ToDays(); day++) {

		let datetime = Datetime.from(FormatInt(curr_month.Year, 4) + "-" + FormatInt(curr_month.Month, 2) + "-" + FormatInt(day, 2));

		week.push(datetime);

		if (week.length === 7) {
			calendar.push([]);
			week = calendar[calendar.length - 1];
		}

	}

	if (week.length > 0 && week.length < 7) {

		let remaining = 7 - week.length;
		if (remaining > 0) {

			for (let day = 1; day <= remaining; day++) {

				let datetime = Datetime.from(FormatInt(next_month.Year, 4) + "-" + FormatInt(next_month.Month, 2) + "-" + FormatInt(day, 2));

				week.push(datetime);

			}

		}

	}


	let elements = [];
	let today    = ToDateString(Datetime.from(new Date()));

	calendar.forEach((week) => {

		let row = document.createElement("tr");

		week.forEach((datetime) => {

			let cell = document.createElement("td");
			let date = ToDateString(datetime);

			cell.setAttribute("data-date", date);
			cell.setAttribute("title", date);

			if (today === date) {
				cell.setAttribute("class", "today");
			}

			row.appendChild(cell);

		});

		elements.push(row);

	});

	let table = this.element.querySelector("table tbody");
	if (table !== null) {

		Array.from(table.querySelectorAll("tr")).forEach((row) => {
			row.parentNode.removeChild(row);
		});

		elements.forEach((row) => {
			table.appendChild(row);
		});

	}

};

const render = function(task, active) {

	if (IsTask(task) === true) {

		let element = document.createElement("article");
		let html    = [];

		element.setAttribute("data-id",      task.ID);
		element.setAttribute("data-project", task.Project);
		element.setAttribute("data-view",    "editor");

		if (task.Deadline !== null) {
			element.setAttribute("data-date", ToDateString(Datetime.from(task.Deadline)));
			element.setAttribute("data-time", ToTimeString(Datetime.from(task.Deadline)));
			element.setAttribute("title",     task.Deadline);
		}

		html.push("<h3>");
		html.push("<span data-complexity=\"" + task.Complexity + "\">" + task.Complexity + "</span>");
		html.push(task.Title);
		html.push("</h3>");

		html.push("<div>");
		html.push("<b>" + task.Project + "</b>");
		html.push("<span data-estimation=\"" + task.Estimation + "\">" + task.Estimation + "</span>");
		html.push("</div>");

		if (IsString(task.Deadline) === true) {

			html.push("<div>");
			html.push("<span data-deadline=\"" + task.Deadline + "\">" + task.Deadline + "</span>");
			html.push("</div>");

		}

		html.push("<div>");
		if (IsString(task.Description) === true) {
			html.push(task.Description.split("\n").join("<br>\n"));
		}
		html.push("</div>");

		element.className = active === true ? "active" : "";
		element.innerHTML = html.join("");

		return element;

	}

	return null;

};



const Calendar = function(app, element) {

	this.app     = app;
	this.element = element.querySelector("section");
	this.sidebar = element.querySelector("aside div");

};


Calendar.prototype = {

	Render: function(task) {

		task = IsTask(task) ? task : null;


		let datetime = this.app.Selector.datetime;
		if (datetime === null) {

			let now = Datetime.from(new Date());
			if (now !== null) {
				this.app.Selector.datetime = Datetime.from(ToDateString(now));
			}

		}

		if (this.app.Selector.datetime !== null) {
			renderCalendar.call(this, this.app.Selector.datetime);
		}

		if (task !== null) {

			// Do Nothing

		} else {

			let calendar = [];
			let sidebar = [];

			this.app.Tasks.filter((task) => {
				return this.app.IsVisible(task);
			}).sort((a, b) => {
				return SortTaskByDeadline(a, b);
			}).forEach((task) => {

				if (IsTask(task) === true) {

					if (IsString(task.Deadline) === true) {

						let element = render.call(this, task, this.app.active === task);
						if (element !== null) {
							calendar.push(element);
						}

					} else {

						let element = render.call(this, task, this.app.active === task);
						if (element !== null) {
							sidebar.push(element);
						}

					}

				}

			});

			Array.from(this.element.querySelectorAll("article")).forEach((article) => {
				article.parentNode.removeChild(article);
			});

			if (calendar.length > 0) {
				calendar.forEach((article) => {

					let date = article.getAttribute("data-date");
					let cell = this.element.querySelector("table tbody td[data-date=\"" + date + "\"]");
					if (cell !== null) {
						cell.appendChild(article);
					}

				});
			}

			Array.from(this.sidebar.querySelectorAll("article")).forEach((article) => {
				article.parentNode.removeChild(article);
			});

			if (sidebar.length > 0) {
				sidebar.forEach((article) => {
					this.sidebar.appendChild(article);
				});
			}

		}

	}

};


export { Calendar };

