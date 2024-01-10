
export const ToString = (element) => {

	let value = "";

	if (element !== null && element.tagName === "SELECT") {

		let tmp = element.value.trim();
		if (tmp !== "") {
			value = tmp;
		}

	}

	return value;

};

export const ToNumber = (element) => {

	let value = 0;

	if (element !== null && element.tagName === "SELECT") {

		let tmp = element.value.trim();
		let num = parseInt(tmp, 10);

		if (!Number.isNaN(num) && (num).toString() === tmp) {
			value = num;
		}

	}

	return value;

};

