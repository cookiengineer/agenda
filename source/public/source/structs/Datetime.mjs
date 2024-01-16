
import { Time      } from "/source/structs/Time.mjs";
import { FormatInt } from "/source/utils/FormatInt.mjs";

const WEEKDAYS  = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
const MONTHS    = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
const MONTHDAYS = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
const TIMEZONES = [

	"BST", "BDT", // Bering
	"HST", "HDT", "HWT", "HPT", // Hawaii
	"AHST", "AHDT", "AKST", "AKDT", // Alaska
	"NST", "NDT", "NWT", "NPT", // Nome
	"YST", "YDT", "YWT", "YPT", "YDDT", // Yukon
	"PST", "PDT", "PWT", "PPT", "PDDT", // Pacific
	"MST", "MDT", "MWT", "MPT", "MDDT", // Mountain
	"CST", "CDT", "CWT", "CPT", "CDDT", // Central America
	"EST", "EDT", "EWT", "EPT", "EDDT", // Eastern America
	"NST", "NDT", "NWT", "NPT", "NDDT", // Newfoundland
	"AST", "ADT", "APT", "AWT", "ADDT", // Atlantic

	"GMT", "BST", "IST", "BDST", // Great Britain
	"WET", "WEST", "WEMT", // Western Europe
	"CET", "CEST", "CEMT", // Central Europe
	"MET", "MEST", // Middle Europe
	"EET", "EEST", // Eastern Europe

	"WAT", "WAST", // Western Africa
	"CAT", "CAST", // Central Africa
	"EAT",  // Eastern Africa
	"SAST", // South Africa

	"MSK", "MSD", // Moscow
	"IST", "IDT", "IDDT", // Israel
	"CST", "CDT", // China
	"PKT", "PKST", // Pakistan
	"IST",                // India
	"HKT", "HKST", "HPT", // Hong Kong
	"KST", "KDT", // Korea
	"JST", "JDT", // Japan

	"AWST", "AWDT", // Western Australia
	"ACST", "ACDT", // Central Australia
	"AEST", "AEDT", // Eastern Australia
	"WIB", "WIT", "WITA", // Waktu Indonesia Barat/Timur/Tengah
	"PST", "PDT", // Philippines
	"GST", "GDT", "CHST", // Guam / Chamorro
	"NZST", "NZDT", // New Zealand
	"SST", // Samoa

	"UTC", // Universal

];

export const IsDatetime = (obj) => {
	return Object.prototype.toString.call(obj) === "[object Datetime]";
};

const isDay = (value) => {

	let result = false;

	let num = parseInt(value, 10);

	if (!isNaN(num)) {

		if (num >= 1 && num <= 31) {
			result = true;
		}

	}

	return result;

};

const isISO8601 = (value) => {

	let result = false;

	if (value.includes("T") && value.endsWith("Z")) {

		let date = value.split("T")[0];
		let time = value.split("T")[1];

		if (time.endsWith("Z")) {
			time = time.substr(0, time.length - 1);
		}

		if (time.includes("+")) {
			time = time.split("+")[0];
		} else if (time.includes("-")) {
			time = time.split("-")[0];
		}

		let check_date = date.split("-");
		let check_time = time.split(":");

		if (check_date.length === 3 && check_time.length === 3) {
			result = true;
		}

	} else if (value.includes("T")) {

		let date = value.split("T")[0];
		let time = value.split("T")[1];

		if (time.includes("+")) {
			time = time.split("+")[0];
		} else if (time.includes("-")) {
			time = time.split("-")[0];
		}

		let check_date = date.split("-");
		let check_time = time.split(":");

		if (check_date.length === 3 && check_time.length === 3) {
			result = true;
		}

	}

	return result;

};

const isISO8601Date = (value) => {

	let result = false;

	if (value.includes("-")) {

		let chunks = value.split("-");

		if (chunks.length === 3) {
			result = true;
		}

	}

	return result;

};

const isYYYYMMDD = (value) => {

	let result = false;

	if (value.length === 8 && !value.includes("-")) {

		let num1 = parseInt(value.substr(0, 4), 10);
		let num2 = parseInt(value.substr(4, 2), 10);
		let num3 = parseInt(value.substr(6, 2), 10);

		if (!isNaN(num1) && num1 >= 1752) {

			if (!isNaN(num2) && num2 >= 1 && num2 <= 12) {

				if (!isNaN(num3) && num3 >= 1 && num3 <= 31) {
					result = true;
				}

			}

		}

	}

	return result;

};

const isYYYYMM = (value) => {

	let result = false;

	if (value.length === 7 && value.includes("-")) {

		let year  = value.split("-")[0];
		let month = value.split("-")[1];

		let num1 = parseInt(year, 10);
		let num2 = parseInt(month, 10);

		if (!isNaN(num1) && num1 >= 1752) {

			if (!isNaN(num2) && num2 >= 1 && num2 <= 12) {
				result = true;
			}

		}

	} else if (value.length === 6 && !value.includes("-")) {

		let num1 = parseInt(value.substr(0, 4), 10);
		let num2 = parseInt(value.substr(4, 2), 10);

		if (!isNaN(num1) && num1 >= 1752) {

			if (!isNaN(num2) && num2 >= 1 && num2 <= 12) {
				result = true;
			}

		}

	}

	return result;

};

const isMeridiem = (value) => {

	if (value === "AM" || value === "PM") {
		return true;
	}

	return false;

};

const isMonth = (value) => {

	let result = false;

	if (MONTHS.includes(value)) {
		result = true;
	}

	return result;

};

const isTime = (value) => {

	let result = false;

	if (value.includes(":")) {

		let chunks = value.split(":");

		if (chunks.length === 3) {
			result = true;
		} else if (chunks.length === 2) {
			result = true;
		}

	}

	return result;

};

const isTimezone = (value) => {

	let result = false;

	if (TIMEZONES.includes(value)) {
		result = true;
	}

	return result;

};

const isWeekday = (value) => {

	let result = false;

	if (WEEKDAYS.includes(value)) {
		result = true;
	}

	return result;

};

const isLeapYear = (value) => {

	if (value % 4 !== 0) {
		return false;
	} else if (value % 100 !== 0) {
		return true;
	} else if (value % 400 !== 0) {
		return false;
	} else {
		return true;
	}

};

const isYear = (value) => {

	let result = false;

	let num = parseInt(value, 10);

	if (isNaN(num) === false) {

		if (num >= 1752) {
			result = true;
		}

	}

	return result;

};

const parseDay = (datetime, value) => {

	let num = parseInt(value, 10);

	if (isNaN(num) === false) {

		if (num >= 1 && num <= 31) {
			datetime.Day = num;
		}

	}

};

const parseISO8601 = (datetime, value) => {

	if (value.endsWith("Z")) {
		value = value.substr(0, value.length - 1);
	}

	if (value.includes("T")) {

		let date = value.split("T")[0];
		let time = value.split("T")[1];
		let tmp  = date.split("-");

		if (tmp.length === 3) {
			parseYear(datetime, tmp[0]);
			parseMonth(datetime, tmp[1]);
			parseDay(datetime, tmp[2]);
		}

		// Strip out milliseconds
		if (time.includes(".")) {
			time = time.split(".")[0];
		}

		if (time.includes(":")) {
			parseTime(datetime, time);
		}

	}

};

const parseISO8601Date = (datetime, value) => {

	if (value.includes("-")) {

		let tmp = value.split("-");

		if (tmp.length === 3) {
			parseYear(datetime, tmp[0]);
			parseMonth(datetime, tmp[1]);
			parseDay(datetime, tmp[2]);
		}

	}

};

const parseYYYYMM = (datetime, value) => {

	if (value.length === 7 && value.includes("-")) {

		let year  = value.split("-")[0];
		let month = value.split("-")[1];

		parseYear(datetime, year);
		parseMonth(datetime, month);
		datetime.Day = 1;

	} else if (value.length === 6 && !value.includes("-")) {

		parseYear(datetime, value.substr(0, 4));
		parseMonth(datetime, value.substr(4, 2));
		datetime.Day = 1;

	}

};

const parseYYYYMMDD = (datetime, value) => {

	if (value.length === 8) {
		parseYear(datetime, value.substr(0, 4));
		parseMonth(datetime, value.substr(4, 2));
		parseDay(datetime, value.substr(6, 2));
	}

};

const parseMonth = (datetime, value) => {

	let check = MONTHS.indexOf(value);

	if (check !== -1) {
		datetime.Month = check + 1;
	}

	if (datetime.Month === 0) {

		let num = parseInt(value, 10);

		if (isNaN(num) === false) {

			if (num >= 1 && num <= 12) {
				datetime.Month = num;
			}

		}

	}

};

const parseTime = (datetime, value) => {

	if (value.includes(":")) {

		let chunks = value.split(":");

		if (chunks.length === 3) {

			let num1 = parseInt(chunks[0], 10);
			let num2 = parseInt(chunks[1], 10);
			let num3 = parseInt(chunks[2], 10);

			if (isNaN(num1) === false) {

				if (num1 >= 0 && num1 <= 24) {
					datetime.Hour = num1;
				}

			}

			if (isNaN(num2) === false) {

				if (num2 >= 0 && num2 <= 60) {
					datetime.Minute = num2;
				}

			}

			if (isNaN(num3) === false) {

				if (num3 >= 0 && num3 <= 60) {
					datetime.Second = num3;
				}

			}

		} else if (chunks.length === 2) {

			let num1 = parseInt(chunks[0], 10);
			let num2 = parseInt(chunks[1], 10);

			if (isNaN(num1) === false) {

				if (num1 >= 0 && num1 <= 24) {
					datetime.Hour = num1;
				}

			}

			if (isNaN(num2) === false) {

				if (num2 >= 0 && num2 <= 60) {
					datetime.Minute = num2;
				}

			}

		}

	}

};

const parseYear = (datetime, value) => {

	let num = parseInt(value, 10);

	if (isNaN(num) === false && num >= 1970) {
		datetime.Year = num;
	}

};

const toChunks = (value) => {

	let chunks = [];
	let values = value.trim().split(" ");

	for (let v = 0; v < values.length; v++) {

		let value = values[v].trim();
		if (value !== "") {
			chunks.push(value);
		}

	}

	return chunks;

};

export const Datetime = function() {

	this.Year   = 0;
	this.Month  = 0;
	this.Day    = 0;
	this.Hour   = 0;
	this.Minute = 0;
	this.Second = 0;

};

Datetime.from = function(value) {

	if (value === null || value === undefined) {

		// Do Nothing

	} else if (Object.prototype.toString.call(value) === "[object Date]") {

		let datetime = new Datetime();

		datetime.Year   = value.getUTCFullYear();
		datetime.Month  = value.getUTCMonth() + 1;
		datetime.Day    = value.getUTCDate();
		datetime.Hour   = value.getUTCHours();
		datetime.Minute = value.getUTCMinutes();
		datetime.Second = value.getUTCSeconds();

		return datetime;

	} else if (Object.prototype.toString.call(value) === "[object String]") {

		let datetime = new Datetime();

		datetime.Parse(value);

		return datetime;

	}

	return null;

};

Datetime.prototype = {

	[Symbol.toStringTag]: "Datetime",

	IsAfter: function(other) {

		let result = false;

		if (this.Year > other.Year) {
			result = true;
		} else if (this.Year === other.Year) {

			if (this.Month > other.Month) {
				result = true;
			} else if (this.Month === other.Month) {

				if (this.Day > other.Day) {
					result = true;
				} else if (this.Day === other.Day) {

					if (this.Hour > other.Hour) {
						result = true;
					} else if (this.Hour === other.Hour) {

						if (this.Minute > other.Minute) {
							result = true;
						} else if (this.Minute === other.Minute) {

							if (this.Second > other.Second) {
								result = true;
							} else if (this.Second === other.Second) {
								result = false;
							}

						}

					}

				}

			}

		}

		return result;

	},

	IsBefore: function(other) {

		let result = false;

		if (this.Year < other.Year) {
			result = true;
		} else if (this.Year == other.Year) {

			if (this.Month < other.Month) {
				result = true;
			} else if (this.Month == other.Month) {

				if (this.Day < other.Day) {
					result = true;
				} else if (this.Day == other.Day) {

					if (this.Hour < other.Hour) {
						result = true;
					} else if (this.Hour == other.Hour) {

						if (this.Minute < other.Minute) {
							result = true;
						} else if (this.Minute == other.Minute) {

							if (this.Second < other.Second) {
								result = true;
							} else if (this.Second == other.Second) {
								result = false;
							}

						}

					}

				}

			}

		}

		return result;

	},

	IsPast: function() {

		let tmp = new Date().toString();
		if (tmp.includes("(") && tmp.endsWith(")")) {
			tmp = tmp.split("(")[0].trim();
		}

		let now = Datetime.from(tmp);

		return this.IsBefore(now);

	},

	IsFuture: function() {

		let tmp = new Date().toString();
		if (tmp.includes("(") && tmp.endsWith(")")) {
			tmp = tmp.split("(")[0].trim();
		}

		let now = Datetime.from(tmp);

		return this.IsAfter(now);

	},

	IsValid: function() {

		if (this.Year > 1752) {

			if (this.Month >= 1 && this.Month <= 12) {

				if (this.Day >= 1 && this.Day <= 31) {
					return true;
				}

			}

		}

		return false;

	},

	PrevDay: function() {

		let datetime = new Datetime();

		if (this.Day === 1) {

			if (this.Month === 1) {
				datetime.Year  = this.Year - 1;
				datetime.Month = 12;
				datetime.Day   = datetime.ToDays();
			} else {
				datetime.Year  = this.Year;
				datetime.Month = this.Month - 1;
				datetime.Day   = datetime.ToDays();
			}

		} else {
			datetime.Year  = this.Year;
			datetime.Month = this.Month;
			datetime.Day   = this.Day - 1;
		}

		return datetime;

	},

	PrevMonth: function() {

		let datetime = new Datetime();

		if (this.Month === 1) {
			datetime.Year  = this.Year - 1;
			datetime.Month = 12;
		} else {
			datetime.Year  = this.Year;
			datetime.Month = this.Month - 1;
		}

		return datetime;

	},

	NextMonth: function() {

		let datetime = new Datetime();

		if (this.Month === 12) {
			datetime.Year  = this.Year + 1;
			datetime.Month = 1;
		} else {
			datetime.Year  = this.Year;
			datetime.Month = this.Month + 1;
		}

		return datetime;

	},

	Offset: function(offset) {

		let operator       = "";
		let offset_hours   = 0;
		let offset_minutes = 0;

		if (offset.length === 6 && this.Year > 0 && this.Month > 0 && this.Day > 0) {

			if (offset.startsWith("+") || offset.startsWith("-")) {
				operator       = offset[0];
				offset_hours   = parseInt(offset.substr(1, 2), 10);
				offset_minutes = parseInt(offset.substr(4, 2), 10);
			}

		} else if (offset.length === 5 && this.Year > 0 && this.Month > 0 && this.Day > 0) {

			if (offset.startsWith("+") || offset.startsWith("-")) {
				operator       = offset[0];
				offset_hours   = parseInt(offset.substr(1, 2), 10);
				offset_minutes = parseInt(offset.substr(3, 2), 10);
			}

		}

		if (!isNaN(offset_hours) && !isNaN(offset_minutes)) {

			if (operator === "+") {

				let year   = this.Year;
				let month  = this.Month;
				let day    = this.Day;
				let hour   = this.Hour   - offset_hours;
				let minute = this.Minute - offset_minutes;

				if (minute < 0) {
					hour   -= 1;
					minute += 60;
				}

				if (hour < 0) {
					day  -= 1;
					hour += 24;
				}

				if (day < 0) {

					month -= 1;

					if (isLeapYear(year) && month === 2) {
						day += MONTHDAYS[month-1] + 1;
					} else {
						day += MONTHDAYS[month-1];
					}

				}

				if (month < 0) {
					year  -= 1;
					month += 12;
				}

				this.Year   = year;
				this.Month  = month;
				this.Day    = day;
				this.Hour   = hour;
				this.Minute = minute;

			} else if (operator === "-") {

				let year   = this.Year;
				let month  = this.Month;
				let day    = this.Day;
				let hour   = this.Hour   + offset_hours;
				let minute = this.Minute + offset_minutes;

				if (minute > 60) {
					hour   += 1;
					minute -= 60;
				}

				if (hour > 24) {
					day  += 1;
					hour -= 24;
				}

				let monthdays = MONTHDAYS[month-1];

				if (isLeapYear(year) && month === 2) {
					monthdays += 1;
				}

				if (day > monthdays) {
					month += 1;
					day   -= monthdays;
				}

				if (month > 12) {
					year  += 1;
					month -= 12;
				}

				this.Year   = year;
				this.Month  = month;
				this.Day    = day;
				this.Hour   = hour;
				this.Minute = minute;

			}

		}

	},

	Parse: function(value) {

		let chunks = toChunks(value);
		let isZulu = false;

		if (isISO8601(value.trim())) {

			if (chunks[0].includes("T")) {

				let time_suffix = chunks[0].split("T")[1];

				if (time_suffix.endsWith("Z")) {

					parseISO8601(this, chunks[0]);
					isZulu = true;

				} else if (time_suffix.includes("+")) {

					parseISO8601(this, chunks[0].substr(0, 18));

					this.Offset(time_suffix.split("+")[1]);
					isZulu = true;

				} else if (time_suffix.includes("-")) {

					parseISO8601(this, chunks[0].substr(0, 18));

					this.Offset(time_suffix.split("-")[1]);
					isZulu = true;

				}

			}

		} else if (chunks.length === 1) {

			if (isISO8601Date(chunks[0])) {

				parseISO8601Date(this, chunks[0]);
				isZulu = true;

			} else if (isYYYYMMDD(chunks[0])) {

				parseYYYYMMDD(this, chunks[0]);
				isZulu = true;

			} else if (isYYYYMM(chunks[0])) {

				parseYYYYMM(this, chunks[0]);
				isZulu = true;

			}

		} else if (chunks.length === 2) {

			if (isISO8601Date(chunks[0]) && isTime(chunks[1])) {

				parseISO8601Date(this, chunks[0]);
				parseTime(this, chunks[1]);
				isZulu = true;

			}

		} else if (chunks.length === 3) {

			if (isMonth(chunks[0]) && isDay(chunks[1]) && isTime(chunks[2])) {

				this.Year = new Date().getFullYear();

				parseMonth(this, chunks[0]);
				parseDay(this, chunks[1]);
				parseTime(this, chunks[2]);

			}

		} else if (chunks.length === 5) {

			if (isWeekday(chunks[0]) && isMonth(chunks[1]) && isDay(chunks[2]) && isTime(chunks[3]) && isYear(chunks[4])) {

				parseMonth(this, chunks[1]);
				parseDay(this, chunks[2]);
				parseTime(this, chunks[3]);
				parseYear(this, chunks[4]);

			}

		} else if (chunks.length === 6) {

			if (isWeekday(chunks[0]) && isMonth(chunks[1]) && isDay(chunks[2]) && isTime(chunks[3]) && isMeridiem(chunks[4]) && isYear(chunks[5])) {

				parseMonth(this, chunks[1]);
				parseDay(this, chunks[2]);
				parseTime(this, chunks[3]);
				parseYear(this, chunks[5]);

				if (chunks[4] == "PM") {
					this.Hour += 12;
				}

			} else if (isWeekday(chunks[0]) && isMonth(chunks[1]) && isDay(chunks[2]) && isTime(chunks[3]) && isTimezone(chunks[4]) && isYear(chunks[5])) {

				parseMonth(this, chunks[1]);
				parseDay(this, chunks[2]);
				parseTime(this, chunks[3]);
				parseYear(this, chunks[5]);

			}

		} else if (chunks.length === 7) {

			if (isWeekday(chunks[0]) && isMonth(chunks[1]) && isDay(chunks[2]) && isTime(chunks[3]) && isMeridiem(chunks[4]) && isTimezone(chunks[5]) && isYear(chunks[6])) {

				parseMonth(this, chunks[1]);
				parseDay(this, chunks[2]);
				parseTime(this, chunks[3]);
				parseYear(this, chunks[6]);

				if (chunks[4] == "PM") {
					this.Hour += 12;
				}

			}

		}

		if (isZulu === false) {
			this.ToZulu();
		}

	},

	"String": function() {
		return this.toString();
	},

	toJSON: function() {
		return this.toString();
	},

	toString: function() {

		let buffer = "";

		buffer += FormatInt(this.Year, 4);
		buffer += "-";
		buffer += FormatInt(this.Month, 2);
		buffer += "-";
		buffer += FormatInt(this.Day, 2);
		buffer += " ";
		buffer += FormatInt(this.Hour, 2);
		buffer += ":";
		buffer += FormatInt(this.Minute, 2);
		buffer += ":";
		buffer += FormatInt(this.Second, 2);

		return buffer;

	},

	ToDays: function() {

		let days = 0;

		let year  = this.Year;
		let month = this.Month;

		if (isLeapYear(year) && month == 2) {
			days = MONTHDAYS[month-1] + 1;
		} else {
			days = MONTHDAYS[month-1];
		}

		return days;

	},

	ToDatetimeDifference: function(other) {

		let result = new Datetime();

		if (this.IsBefore(other) === true) {

			let years   = 0;
			let months  = 0;
			let days    = 0;
			let hours   = (24 - this.Hour)   + other.Hour;
			let minutes = (60 - this.Minute) + other.Minute;
			let seconds = (60 - this.Second) + other.Second;

			let tmp = Datetime.from(this.toString());

			if (tmp.Year <= other.Year) {

				if (tmp.Month <= other.Month) {

					while (tmp.Year < other.Year) {
						years += 1;
						tmp.Year += 1;
					}

					while (tmp.Month < other.Month) {
						months += 1;
						tmp.Month += 1;
					}

					if (tmp.Day <= other.Day) {
						days = other.Day - tmp.Day;
					} else {
						months -= 1;
						tmp.Month -= 1;
						days = (tmp.ToDays() - tmp.Day) + other.Day;
					}

				} else {

					if (tmp.Day <= other.Day) {
						months = (12 - tmp.Month) + other.Month;
						days = other.Day - tmp.Day;
					} else {
						months = (12 - tmp.Month) + other.Month - 1;
						days = (tmp.ToDays() - tmp.Day) + other.Day;
					}

				}

			}

			if (hours > 0 || minutes > 0 || seconds > 0) {
				days -= 1;
			}

			if (minutes > 0 || seconds > 0) {

				hours -= 1;

				if (seconds > 60) {
					seconds -= 60;
					minutes += 1;
				}

				if (seconds > 60) {
					seconds -= 60;
					minutes += 1;
				}

				if (minutes > 60) {
					minutes -= 60;
					hours += 1;
				}

				if (minutes > 60) {
					minutes -= 60;
					hours += 1;
				}

				if (hours == 23 && minutes == 60 && seconds == 60) {
					days += 1;
					hours = 0;
					minutes = 0;
					seconds = 0;
				} else if (minutes == 60 && seconds == 60) {
					seconds = 0;
					minutes = 0;
					hours += 1;
				} else if (minutes == 60) {
					minutes = 0;
					hours += 1;
				}

			}

			result.Year   = years;
			result.Month  = months;
			result.Day    = days;
			result.Hour   = hours;
			result.Minute = minutes;
			result.Second = seconds;

		}

		return result;

	},

	ToTimeDifference: function(other) {

		let time = new Time();

		if (this.IsBefore(other) === true) {

			let days    = 0;
			let hours   = (24 - this.Hour)   + other.Hour;
			let minutes = (60 - this.Minute) + other.Minute;
			let seconds = (60 - this.Second) + other.Second;

			let tmp = Datetime.from(this.toString());

			if (tmp.Year !== other.Year) {

				while (tmp.Year < other.Year - 1) {

					if (isLeapYear(tmp.Year)) {
						days += 366;
					} else {
						days += 365;
					}

					tmp.Year += 1;

				}

				days += (tmp.ToDays() - tmp.Day);
				tmp.Day = tmp.ToDays();
				tmp.Month += 1;

				while (tmp.Month <= 12) {
					days += tmp.ToDays();
					tmp.Month += 1;
				}

				days += 1;
				tmp.Year += 1;
				tmp.Month = 1;
				tmp.Day = 1;

			}

			if (tmp.Year === other.Year) {

				if (tmp.Month === other.Month) {

					if (tmp.Day !== other.Day) {
						days += (other.Day - tmp.Day);
					}

				} else {

					days += (tmp.ToDays() - tmp.Day);
					tmp.Month += 1;

					while (tmp.Month !== other.Month) {
						days += tmp.ToDays();
						tmp.Month += 1;
					}

					days += other.Day;

				}

			}

			if (days > 0) {
				hours += (days - 1) * 24;
			} else {
				hours -= 24;
			}

			if (minutes > 0 || seconds > 0) {

				hours -= 1;

				if (seconds > 60) {
					seconds -= 60;
					minutes += 1;
				}

				if (seconds > 60) {
					seconds -= 60;
					minutes += 1;
				}

				if (minutes > 60) {
					minutes -= 60;
					hours   += 1;
				}

				if (minutes > 60) {
					minutes -= 60;
					hours   += 1;
				}

				if (minutes === 60 && seconds === 60) {
					seconds = 0;
					minutes = 0;
					hours += 1;
				} else if (minutes === 60) {
					minutes = 0;
					hours += 1;
				}

			}

			time.Hour   = hours;
			time.Minute = minutes;
			time.Second = seconds;

		}

		return time;

	},

	ToWeekday: function() {

		let year    = this.Year;
		let month   = this.Month;
		let day     = this.Day;
		let offsets = [ 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 ];

		if (month < 3) {
			year -= 1;
		}

		let index = (year + year/4 - year/100 + year/400 + offsets[month-1] + day) % 7;
		let weekdays = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

		return weekdays[index];

	},

	ToZulu: function() {

		let offset = new Date().toString().substr(25).split(" ")[0];
		if (offset.startsWith("GMT")) {
			offset = offset.substr(3);
		}

		if (offset.length === 5 && this.Year > 0 && this.Month > 0 && this.Day > 0) {
			this.Offset(offset);
		}

	}

};

