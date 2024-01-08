
export const ToAppTask = function(identifier) {

	let id = parseInt(identifier, 10);

	if (Number.isNaN(id) === false && id !== 0) {

		let APP = window.APP || null;
		if (APP !== null) {

			let found = null;

			for (let t = 0; t < APP.Tasks.length; t++) {

				if (APP.Tasks[t].ID === id) {
					found = APP.Tasks[t];
					break;
				}

			}

			return found;

		}

	}

	return null;

};

