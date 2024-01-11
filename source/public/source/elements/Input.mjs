
import { Datetime } from "/source/structs/Datetime.mjs";

export const ToBoolean = (element) => {

	let value = false;

	if (element !== null && element.tagName === "INPUT") {

		let type = element.getAttribute("type");
		if (type === "checkbox") {

			if (element.checked === true) {
				value = true;
			}

		} else if (type === "hidden") {

			if (element.value === "true") {
				value = true;
			} else if (element.value === "false") {
				value = false;
			}

		} else if (type === "text") {

			if (element.value.trim() !== "") {
				value = true;
			}

		}

	}

	return value;

};

export const ToDateString = (element) => {

	let value = "";

	if (element !== null && element.tagName === "INPUT") {

		let type = element.getAttribute("type");
		if (type === "date" || type === "hidden") {

			let tmp = element.value.trim();
			if (tmp !== "") {

				let datetime = Datetime.from(tmp);
				if (datetime.IsValid()) {
					value = datetime.toString();
				}

			}

		}

	}

	return value;

};

export const ToNumber = (element) => {

	let value = 0;

	if (element !== null && element.tagName === "INPUT") {

		let type = element.getAttribute("type");
		if (type === "text" || type === "hidden") {

			let tmp = element.value.trim();
			let num = parseInt(tmp, 10);

			if (!Number.isNaN(num) && (num).toString() === tmp) {
				value = num;
			}

		}

	}

	return value;

};

export const ToString = (element) => {

	let value = "";

	if (element !== null && element.tagName === "INPUT") {

		let type = element.getAttribute("type");
		if (type === "text" || type === "hidden") {

			let tmp = element.value.trim();
			if (tmp !== "") {
				value = tmp;
			}

		}

	}

	return value;

};

export const ToTimeString = (element) => {

	let value = "";

	if (element !== null && element.tagName === "INPUT") {

		let type = element.getAttribute("type");
		if (type === "time" || type === "hidden") {

			let tmp = element.value.trim();

			if (tmp.length === 5 && tmp.includes(":")) {
				value = tmp + ":00";
			}

		}

	}

	return value;

};


