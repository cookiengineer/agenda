
export const ToArticle = (target) => {

	let found   = null;
	let current = target;

	while (current.tagName !== "BODY") {

		if (current.tagName === "ARTICLE") {

			found = current;
			break;

		} else {

			current = current.parentNode;

		}

	}

	return found;

};

