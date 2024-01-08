
const global   = window;
const document = global["document"];


import { initialize as initialize_Agenda   } from "./view/Agenda.mjs";
import { initialize as initialize_Calendar } from "./view/Calendar.mjs";
import { initialize as initialize_Editor   } from "./view/Editor.mjs";



const cleanify = (element) => {

	if (element.childNodes.length > 0) {

		for (let c = 0, cl = element.childNodes.length; c < cl; c++) {

			let node = element.childNodes[c];
			if (
				node.nodeName === "#text"
				&& node.textContent.trim() === ""
			) {

				element.removeChild(node);
				cl--;
				c--;

			} else {

				cleanify(node);

			}

		}

	}

};



document.addEventListener("DOMContentLoaded", () => {

	let headers = Array.from(document.querySelectorAll("section > header"));
	if (headers.length > 0) {

		headers.forEach((header) => {

			cleanify(header);

			let buttons = Array.from(header.querySelectorAll("button"));
			if (buttons.length > 0) {

				buttons.forEach((button) => {

					button.addEventListener("click", () => {

						let view = button.getAttribute("data-view");
						if (view !== null && view !== "") {

							let APP = window.APP || null;
							if (APP !== null) {
								APP.Selector.datetime = null;
								APP.Show(view);
							}
						}

					});

				});

			}

			let list = header.querySelector("ul");
			if (list !== null) {

				list.addEventListener("click", (event) => {

					if (event.target.tagName.toLowerCase() === "li") {

						let element = event.target;

						Array.from(list.querySelectorAll("li")).forEach((item) => {

							if (item === element) {
								item.className = item.className === "active" ? "" : "active";
							} else {
								item.className = "";
							}

						});

						setTimeout(() => {

							let APP = window.APP || null;
							let project = null;

							if (element.className === "active") {
								project = element.getAttribute("data-project") || null;
							}

							if (APP !== null) {
								APP.Selector.project = project;
								APP.Render();
							}

						}, 0);

					}

				});

			}

		});

	}

	initialize_Agenda();
	initialize_Calendar();
	initialize_Editor();

}, true);

