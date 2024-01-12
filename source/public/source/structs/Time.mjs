
import { FormatInt } from "/source/utils/FormatInt.mjs";

export const Time = function() {

	this.Hour   = 0;
	this.Minute = 0;
	this.Second = 0;
	this.iszero = false;

};

Time.from = function(value) {

	if (value === null || value === undefined) {

		// Do Nothing

	} else if (Object.prototype.toString.call(value) === "[object Date]") {

		let time = new Time();

		time.Hour   = value.getUTCHours();
		time.Minute = value.getUTCMinutes();
		time.Second = value.getUTCSeconds();
		time.valid  = true;

		return time;

	} else if (Object.prototype.toString.call(value) === "[object String]") {

		let time = new Time();

		if (value.includes(":")) {

			let chunks = value.split(":");

			if (chunks.length === 3) {

				time.Parse(value);

				if (value === "00:00:00") {
					time.iszero = true;
				}

			} else if (chunks.length === 2) {

				time.Parse(value);

				if (value === "00:00") {
					time.iszero = true;
				}

			}

		}

		return time;

	}

	return null;

};

Time.prototype = {

	[Symbol.toStringTag]: "Time",

	AddHour: function() {

		this.Hour = this.Hour + 1;

	},

	AddMinute: function() {

		let hour   = this.Hour;
		let minute = this.Minute + 1;

		if (minute > 60) {
			hour += 1;
			minute -= 60;
		}

		this.Hour   = hour;
		this.Minute = minute;

	},

	AddSecond: function() {

		let hour   = this.Hour;
		let minute = this.Minute;
		let second = this.Second + 1;

		if (second > 60) {
			minute += 1;
			second -= 60;
		}

		if (minute > 60) {
			hour   += 1;
			minute -= 60;
		}

		this.Hour   = hour;
		this.Minute = minute;
		this.Second = second;

	},

	AddTime: function(other) {

		let hour   = this.Hour   + other.Hour;
		let minute = this.Minute + other.Minute;
		let second = this.Second + other.Second;

		if (second > 60) {
			minute += 1;
			second -= 60;
		}

		if (minute > 60) {
			hour   += 1;
			minute -= 60;
		}

		this.Hour   = hour;
		this.Minute = minute;
		this.Second = second;

	},

	IsAfter: function(other) {

		let result = false;

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

		return result;

	},

	IsBefore: function(other) {

		let result = false;

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

		return result;

	},

	IsPast: function() {

		let tmp = new Date().toString();
		if (tmp.includes("(") && tmp.endsWith(")")) {
			tmp = tmp.split(" ")[4];
		}

		let now = Time.from(tmp);

		return this.IsBefore(now);

	},

	IsFuture: function() {

		let tmp = new Date().toString();
		if (tmp.includes("(") && tmp.endsWith(")")) {
			tmp = tmp.split(" ")[4];
		}

		let now = Time.from(tmp);

		return this.IsAfter(now);

	},

	IsValid: function() {

		if (this.iszero === true && this.Hour === 0 && this.Minute === 0 && this.Second === 0) {

			return true;

		} else {

			if (this.Hour !== 0 || this.Minute !== 0 || this.Second !== 0) {
				return true;
			}

		}

		return false;

	},

	Offset: function(offset) {

		let operator       = "";
		let offset_hours   = 0;
		let offset_minutes = 0;

		if (offset.length === 6) {

			if (offset.startsWith("+") || offset.startsWith("-")) {
				operator       = offset[0];
				offset_hours   = parseInt(offset.substr(1, 2), 10);
				offset_minutes = parseInt(offset.substr(4, 2), 10);
			}

		} else if (offset.length === 5) {

			if (offset.startsWith("+") || offset.startsWith("-")) {
				operator       = offset[0];
				offset_hours   = parseInt(offset.substr(1, 2), 10);
				offset_minutes = parseInt(offset.substr(3, 2), 10);
			}

		}

		if (!isNaN(offset_hours) && !isNaN(offset_minutes)) {

			if (operator === "+") {

				let hour   = this.Hour   - offset_hours;
				let minute = this.Minute - offset_minutes;

				if (minute < 0) {
					hour   -= 1;
					minute += 60;
				}

				if (hour < 0) {
					hour += 24;
				}

				this.Hour   = hour;
				this.Minute = minute;

			} else if (operator === "-") {

				let hour   = this.Hour   + offset_hours;
				let minute = this.Minute + offset_minutes;

				if (minute > 60) {
					hour   += 1;
					minute -= 60;
				}

				if (hour > 24) {
					hour -= 24;
				}

				this.Hour   = hour;
				this.Minute = minute;

			}

		}

	},

	Parse: function(value) {

		if (value.includes(":")) {

			let chunks = value.split(":");

			if (chunks.length === 3) {

				let num1 = parseInt(chunks[0], 10);
				let num2 = parseInt(chunks[1], 10);
				let num3 = parseInt(chunks[2], 10);

				if (isNaN(num1) === false) {

					if (num1 >= 0 && num1 <= 24) {
						this.Hour = num1;
					}

				}

				if (isNaN(num2) === false) {

					if (num2 >= 0 && num2 <= 60) {
						this.Minute = num2;
					}

				}

				if (isNaN(num3) === false) {

					if (num3 >= 0 && num3 <= 60) {
						this.Second = num3;
					}

				}

			} else if (chunks.length === 2) {

				let num1 = parseInt(chunks[0], 10);
				let num2 = parseInt(chunks[1], 10);

				if (isNaN(num1) === false) {

					if (num1 >= 0 && num1 <= 24) {
						this.Hour = num1;
					}

				}

				if (isNaN(num2) === false) {

					if (num2 >= 0 && num2 <= 60) {
						this.Minute = num2;
					}

				}

			}

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

		if (this.Hour > 99) {
			buffer += FormatInt(this.Hour, 0);
		} else {
			buffer += FormatInt(this.Hour, 2);
		}
		buffer += ":";
		buffer += FormatInt(this.Minute, 2);
		buffer += ":";
		buffer += FormatInt(this.Second, 2);

		return buffer;

	},

	ToZulu: function() {

		let offset = new Date().toString().substr(25).split(" ")[0];
		if (offset.startsWith("GMT")) {
			offset = offset.substr(3);
		}

		if (offset.length === 5) {
			this.Offset(offset);
		}

	}

};
