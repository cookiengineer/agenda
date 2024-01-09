
import { IsDatetime } from "../structs/Datetime.mjs";

export const ToDateString = (datetime) => {

	if (IsDatetime(datetime)) {

		let yyyy = (datetime.Year).toString();
		if (yyyy.length < 4) {
			yyyy = "0000".substr(4 - yyyy.length) + yyyy;
		}

		let mm = (datetime.Month).toString();
		if (mm.length < 2) {
			mm = "00".substr(2 - mm.length) + mm;
		}

		if (datetime.Day !== null) {

			let dd = (datetime.Day).toString();
			if (dd.length < 2) {
				dd = "00".substr(2 - dd.length) + dd;
			}

			return yyyy + "-" + mm + "-" + dd;

		} else {
			return yyyy + "-" + mm;
		}

	}

	return "";

};

