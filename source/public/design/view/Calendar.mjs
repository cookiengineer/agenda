
import { IsDatetime } from "/source/structs/Datetime.mjs";
// import { ToArticle  } from "/design/utils/ToArticle.mjs";
// import { ToAppTask  } from "/design/utils/ToAppTask.mjs";

export const initialize = () => {

	let section = document.querySelector("section#calendar > section");
	if (section !== null) {

		// TODO: Drag and Drop interaction
		// TODO: click on article in table should open Editor

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

