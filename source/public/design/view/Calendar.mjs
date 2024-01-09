
import { IsDatetime } from "/source/structs/Datetime.mjs";
import { ToElement  } from "/design/utils/ToElement.mjs";
import { ToAppTask  } from "/design/utils/ToAppTask.mjs";

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

export const initialize = () => {

	let section = document.querySelector("section#calendar > section");
	let aside   = document.querySelector("section#calendar > aside");
	let table   = document.querySelector("section#calendar > section > table");

	if (table !== null) {

		table.addEventListener("click", (event) => {

			let article = ToElement("article", event.target);
			if (article !== null) {

				let APP  = window.APP || null;
				let task = ToAppTask(parseInt(article.getAttribute("data-id"), 10));

				if (APP !== null && task !== null) {
					APP.Show("editor", task);
				}

			}

		});

	}

	if (aside !== null && table !== null) {

		let article = null;
		let message = aside.querySelector("p");

		section.addEventListener("dragover", (event) => {
			event.preventDefault();
		});

		aside.addEventListener("dragstart", (event) => {

			if (event.srcElement.tagName === "ARTICLE") {
				article           = event.srcElement;
				article.className = "dragging";
			}

		});

		aside.addEventListener("dragenter", (event) => {
			event.preventDefault();
		});

		aside.addEventListener("dragleave", (event) => {
			event.preventDefault();
		});

		aside.addEventListener("dragover", (event) => {
			message.innerHTML = "Unschedule Task";
			event.preventDefault();
		});

		aside.addEventListener("drop", (event) => {

			let aside = ToElement("aside", event.target);
			if (aside !== null && article !== null) {

				let task = ToAppTask(parseInt(article.getAttribute("data-id"), 10));
				let APP  = window.APP || null;

				if (APP !== null && task !== null) {

					task.Deadline = null;

					article.className = "";
					article.removeAttribute("data-date");
					article.removeAttribute("data-time");
					article.removeAttribute("title");

					article.parentNode.removeChild(article);
					aside.querySelector("div").appendChild(article);
					message.innerHTML = "(Schedule via Drag and Drop)";

					APP.Client.Modify(task, () => {

						APP.Update(() => {
							APP.Show("calendar");
							APP.Render();
						});

					});

				}

			} else {
				event.preventDefault();
			}

		});

		table.addEventListener("dragstart", (event) => {

			if (event.srcElement.tagName === "ARTICLE") {
				article           = event.srcElement;
				article.className = "dragging";
			}

		});

		table.addEventListener("dragenter", (event) => {
			event.preventDefault();
		});

		table.addEventListener("dragleave", (event) => {
			event.preventDefault();
		});

		table.addEventListener("dragover", (event) => {

			let td = ToElement("td", event.target);
			if (td !== null) {

				Array.from(table.querySelectorAll("td")).forEach((other) => {
					other.className = other === td ? "dragover" : "";
				});

				let td_rect      = td.getBoundingClientRect();
				let min_y        = td_rect.top;
				let max_y        = td_rect.top + td_rect.height;
				let percentage_y = (event.clientY - min_y) / (max_y - min_y);
				let index        = Math.floor(percentage_y * TIMETABLE.length);
				let time         = TIMETABLE[index] || null;

				if (article !== null && time !== null) {
					article.setAttribute("data-time", time);
					message.innerHTML = "Schedule Task at " + time;
				}

			}

		});

		table.addEventListener("drop", (event) => {

			let td = ToElement("td", event.target);
			if (td !== null && article !== null) {

				Array.from(table.querySelectorAll("td")).forEach((other) => {
					other.className = "";
				});

				let td_rect      = event.target.getBoundingClientRect();
				let min_y        = td_rect.top;
				let max_y        = td_rect.top + td_rect.height;
				let percentage_y = (event.clientY - min_y) / (max_y - min_y);
				let index        = Math.floor(percentage_y * TIMETABLE.length);
				let date         = event.target.getAttribute("data-date");
				let time         = TIMETABLE[index] || null;
				let task         = ToAppTask(parseInt(article.getAttribute("data-id"), 10));
				let APP          = window.APP || null;

				if (APP !== null && task !== null && date !== null && time !== null) {

					task.Deadline = date + " " + time;

					article.className = "";
					article.setAttribute("data-date", date);
					article.setAttribute("data-time", time);
					article.setAttribute("title", task.Deadline);

					article.parentNode.removeChild(article);
					td.appendChild(article);
					message.innerHTML = "(Schedule via Drag and Drop)";

					APP.Client.Modify(task, () => {

						APP.Update(() => {
							APP.Show("calendar");
							APP.Render();
						});

					});

				}

			} else {
				event.preventDefault();
			}

		});

	}

	let footer = document.querySelector("section#calendar > footer");
	if (footer !== null) {

		let prev_month = footer.querySelector("button[data-action=\"prev-month\"]");
		if (prev_month !== null) {

			prev_month.addEventListener("click", () => {

				let APP = window.APP || null;
				if (APP !== null) {

					if (IsDatetime(APP.Selector.datetime)) {
						APP.Selector.datetime = APP.Selector.datetime.PrevMonth();
					}

					APP.Render();

				}

			});

		}

		let next_month = footer.querySelector("button[data-action=\"next-month\"]");
		if (next_month !== null) {

			next_month.addEventListener("click", () => {

				let APP = window.APP || null;
				if (APP !== null) {

					if (IsDatetime(APP.Selector.datetime)) {
						APP.Selector.datetime = APP.Selector.datetime.NextMonth();
					}

					APP.Render();

				}

			});

		}

	}

};

