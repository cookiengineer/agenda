
export const ToString = (element) => {

	let value = "";

	if (element !== null && element.tagName === "TEXTAREA") {

		let tmp = element.value.trim();
		if (tmp !== "") {
			value = tmp;
		}

	}

	return value;

};
