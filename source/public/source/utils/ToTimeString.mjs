
import { IsDatetime } from "../structs/Datetime.mjs";

export const ToTimeString = (datetime) => {

	if (IsDatetime(datetime)) {

		let hh = (datetime.Hour).toString();
		if (hh.length < 2) {
			hh = "00".substr(2 - hh.length) + hh;
		}

		let ii = (datetime.Minute).toString();
		if (ii.length < 2) {
			ii = "00".substr(2 - ii.length) + ii;
		}

		let ss = (datetime.Second).toString();
		if (ss.length < 2) {
			ss = "00".substr(2 - ss.length) + ss;
		}

		return hh + ":" + ii + ":" + ss;

	}

	return "";

};
