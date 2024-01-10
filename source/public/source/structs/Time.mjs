
const formatUint = (value, length) => {

	let result = "";

	let chunk = (value).toString();

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

export const Time = function() {

	this.Hour   = 0;
	this.Minute = 0;
	this.Second = 0;
	this.valid  = false;

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

				if (value === "00:00:00" && time.Hour === 0 && time.Minute === 0 && time.Second === 0) {
					time.valid = true;
				} else if (time.Hour !== 0 || time.Minute !== 0 || time.Second !== 0) {
					time.valid = true;
				}

			} else if (chunks.length === 2) {

				time.Parse(value);

				if (value === "00:00" && time.Hour === 0 && time.Minute === 0 && time.Second === 0) {
					time.valid = true;
				} else if (time.Hour !== 0 || time.Minute !== 0) {
					time.valid = true;
				}

			}

		}

		return time;

	}

	return null;

};

Time.prototype = {

	[Symbol.toStringTag]: "Time",

	IncrementSecond: function() {

		let hour   = this.Hour;
		let minute = this.Minute;
		let second = this.Second + 1;

		if (second > 60) {
			minute += 1;
			second -= 60;
		}

		if (minute > 60) {
			hour += 1;
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
		return this.valid;
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

		buffer += this.Hour > 99 ? "99" : formatUint(this.Hour, 2);
		buffer += ":";
		buffer += formatUint(this.Minute, 2);
		buffer += ":";
		buffer += formatUint(this.Second, 2);

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
