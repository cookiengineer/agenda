
export const FormatInt = function(value, length) {

	let result = "";
	let chunk  = (value).toString();

	if (chunk.startsWith("-")) {
		chunk = chunk.substr(1);
	}

	if (chunk.length < length) {

		let prefix = "";

		for (let p = 0; p < length - chunk.length; p++) {
			prefix += "0";
		}

		result = prefix + chunk;

	} else {

		result = chunk;

	}

	return result;

};
