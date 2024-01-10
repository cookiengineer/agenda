
const DAYS = {
	"Mon": "Monday",
	"Tue": "Tuesday",
	"Wed": "Wednesday",
	"Thu": "Thursday",
	"Fri": "Friday",
	"Sat": "Saturday",
	"Sun": "Sunday"
};

export const OnResize = () => {

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
