
export const ToElement = (tagname, target) => {

	let found = null;

	if (tagname !== "") {

		let current = target;

		while (current.tagName !== "BODY") {

			if (current.tagName.toLowerCase() === tagname) {

				found = current;
				break;

			} else {

				current = current.parentNode;

			}

		}

	}

	return found;

};

