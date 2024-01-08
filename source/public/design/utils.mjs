
export const ToArticle = (target) => {

	let found   = null;
	let current = target;

	while (current.tagName !== 'BODY') {

		if (current.tagName === 'ARTICLE') {

			found = current;
			break;

		} else {

			current = current.parentNode;

		}

	}

	return found;

};

export const ToTask = function(identifier) {

	let id = parseInt(identifier, 10);

	if (Number.isNaN(id) === false && id !== 0) {

		let APP = window.APP || null;
		if (APP !== null) {
			return APP.tasks.find((other) => other.id === id);
		}

	}

	return null;

};

