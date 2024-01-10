
export const IsElement = (tagname, target) => {

	let result = false;

	if (tagname !== "") {

		if (target.tagName.toLowerCase() === tagname) {
			result = true;
		}
	}

	return result;

};
