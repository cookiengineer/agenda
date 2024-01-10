
import { IsString             } from "/stdlib.mjs";
import { IsDatetime, Datetime } from "/source/structs/Datetime.mjs";
import { IsTask               } from "/source/structs/Task.mjs";
import { FormatInt            } from "/source/utils/FormatInt.mjs";
import { SortTaskByDeadline   } from "/source/utils/SortTaskByDeadline.mjs";
import { ToDateString         } from "/source/utils/ToDateString.mjs";
import { ToTimeString         } from "/source/utils/ToTimeString.mjs";
import { ToElement            } from "/source/utils/ToElement.mjs";

let DRAGGED = null;

const TIMETABLE = [
	"08:00:00",
	"08:30:00",
	"09:00:00",
	"09:30:00",
	"10:00:00",
	"10:30:00",
	"11:00:00",
	"11:30:00",
	"12:00:00",
	"12:30:00",
	"13:00:00",
	"13:30:00",
	"14:00:00",
	"14:30:00",
	"15:00:00",
	"15:30:00",
	"16:00:00",
	"16:30:00",
	"17:00:00",
	"17:30:00",
	"18:00:00",
	"18:30:00",
	"19:00:00",
	"19:30:00",
	"20:00:00",
	"20:30:00",
	"21:00:00",
	"21:30:00",
	"22:00:00",
	"22:30:00",
	"23:00:00",
	"23:30:00",
	"23:59:59"
];

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

		row.style.height = "calc(100% / " + calendar.length + ")";

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

	let table = this.section.querySelector("table tbody");
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

	if (IsTask(task)) {

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

		element.className = active === true ? "active" : "";
		element.innerHTML = html.join("");

		element.setAttribute("draggable", true);
		element.addEventListener("dragstart", (event) => {

			DRAGGED = event.srcElement;

			// XXX: WEBKIT only works if this is set!
			event.dataTransfer.setData("id", event.srcElement.getAttribute("data-id"));
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.dropEffect = "move";

		});

		return element;

	}

	return null;

};



const Calendar = function(app, element) {

	this.app     = app;
	this.section = element.querySelector("section");
	this.aside   = element.querySelector("aside");
	this.footer  = element.querySelector("footer");
	this.message = element.querySelector("aside p");
	this.table   = element.querySelector("table");

	this.actions = {
		"prev-month": this.footer.querySelector("button[data-action=\"prev-month\"]"),
		"next-month": this.footer.querySelector("button[data-action=\"next-month\"]")
	};


	this.Init();

};


Calendar.prototype = {

	Init: function() {

		this.table.addEventListener("click", (event) => {

			let article = ToElement("article", event.target);
			if (article !== null) {

				let task = this.app.ToTask(article.getAttribute("data-id"));
				if (task !== null) {
					this.app.Show("editor", task);
				}

			}

		});

		this.actions["prev-month"].addEventListener("click", () => {

			if (IsDatetime(this.app.Selector.datetime)) {
				this.app.Selector.datetime = this.app.Selector.datetime.PrevMonth();
				this.app.Render();
			}

		});

		this.actions["next-month"].addEventListener("click", () => {

			if (IsDatetime(this.app.Selector.datetime)) {
				this.app.Selector.datetime = this.app.Selector.datetime.NextMonth();
				this.app.Render();
			}

		});

		this.aside.addEventListener("dragenter", (event) => {
			event.preventDefault();
		});

		this.aside.addEventListener("dragover", (event) => {

			this.message.innerHTML = "Unschedule Task";

			event.preventDefault();

		});

		this.aside.addEventListener("dragleave", (event) => {
			event.preventDefault();
		});

		this.aside.addEventListener("drop", (event) => {

			if (DRAGGED !== null) {

				let task = this.app.ToTask(DRAGGED.getAttribute("data-id"));
				if (task !== null) {

					task.Deadline = null;

					DRAGGED.removeAttribute("data-date");
					DRAGGED.removeAttribute("data-time");
					DRAGGED.removeAttribute("title");

					DRAGGED.parentNode.removeChild(DRAGGED);
					this.aside.querySelector("div").appendChild(DRAGGED);
					DRAGGED = null;

					this.message.innerHTML = "(Schedule via Drag and Drop)";

					this.app.Client.Modify(task, () => {

						this.app.Update(() => {
							this.app.Show("calendar");
							this.app.Render();
						});

					});

				}

			} else {
				event.preventDefault();
			}

		});

		this.table.addEventListener("dragenter", (event) => {
			event.preventDefault();
		});

		this.table.addEventListener("dragleave", (event) => {
			event.preventDefault();
		});

		this.table.addEventListener("dragover", (event) => {

			let td = ToElement("td", event.target);
			if (td !== null) {

				Array.from(this.table.querySelectorAll("td")).forEach((other) => {
					other.className = other === td ? "dragover" : "";
				});

				let td_rect      = td.getBoundingClientRect();
				let min_y        = td_rect.top;
				let max_y        = td_rect.top + td_rect.height;
				let percentage_y = (event.clientY - min_y) / (max_y - min_y);
				let index        = Math.floor(percentage_y * TIMETABLE.length);
				let time         = TIMETABLE[index] || null;

				if (DRAGGED !== null && time !== null) {

					this.message.innerHTML = "Schedule Task at " + time;
					DRAGGED.setAttribute("data-time", time);

				}

			}

			event.preventDefault();

		});

		this.table.addEventListener("drop", (event) => {

			let td = ToElement("td", event.target);
			if (td !== null && DRAGGED !== null) {

				Array.from(this.table.querySelectorAll("td")).forEach((other) => {
					other.className = "";
				});

				let td_rect      = event.target.getBoundingClientRect();
				let min_y        = td_rect.top;
				let max_y        = td_rect.top + td_rect.height;
				let percentage_y = (event.clientY - min_y) / (max_y - min_y);
				let index        = Math.floor(percentage_y * TIMETABLE.length);
				let date         = event.target.getAttribute("data-date");
				let time         = TIMETABLE[index] || null;
				let task         = this.app.ToTask(DRAGGED.getAttribute("data-id"));

				if (task !== null && date !== null && time !== null) {

					task.Deadline = date + " " + time;

					DRAGGED.setAttribute("data-date", date);
					DRAGGED.setAttribute("data-time", time);
					DRAGGED.setAttribute("title", task.Deadline);

					DRAGGED.parentNode.removeChild(DRAGGED);
					td.appendChild(DRAGGED);
					DRAGGED = null;

					this.message.innerHTML = "(Schedule via Drag and Drop)";

					this.app.Client.Modify(task, () => {

						this.app.Update(() => {
							this.app.Show("calendar");
							this.app.Render();
						});

					});

				}

			} else {
				event.preventDefault();
			}

		});

	},

	Render: function() {

		let datetime = this.app.Selector.datetime;
		if (datetime === null) {

			let now = Datetime.from(new Date());
			if (now !== null) {
				this.app.Selector.datetime = Datetime.from(ToDateString(now));
				this.app.Selector.datetime.Day = null;
			}

		}

		if (this.app.Selector.datetime !== null) {
			renderCalendar.call(this, this.app.Selector.datetime);
		}

		let calendar = [];
		let sidebar = [];

		this.app.Tasks.filter((task) => {
			return this.app.IsVisible(task);
		}).sort((a, b) => {
			return SortTaskByDeadline(a, b);
		}).forEach((task) => {

			if (IsTask(task)) {

				if (IsString(task.Deadline)) {

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

		Array.from(this.section.querySelectorAll("article")).forEach((article) => {
			article.parentNode.removeChild(article);
		});

		if (calendar.length > 0) {
			calendar.forEach((article) => {

				let date = article.getAttribute("data-date");
				let cell = this.section.querySelector("table tbody td[data-date=\"" + date + "\"]");
				if (cell !== null) {
					cell.appendChild(article);
				}

			});
		}

		Array.from(this.aside.querySelectorAll("article")).forEach((article) => {
			article.parentNode.removeChild(article);
		});

		if (sidebar.length > 0) {

			sidebar.forEach((article) => {
				this.aside.querySelector("div").appendChild(article);
			});

		}

	}

};


export { Calendar };

