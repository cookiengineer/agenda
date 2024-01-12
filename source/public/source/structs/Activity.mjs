
import { IsTask       } from "/source/structs/Task.mjs";
import { Datetime     } from "/source/structs/Datetime.mjs";
import { Time         } from "/source/structs/Time.mjs";
import { ToDateString } from "/source/utils/ToDateString.mjs";
import { ToTimeString } from "/source/utils/ToTimeString.mjs";

const toTime = (activity) => {

	let time = Time.from("00:00:00");

	let tmp = activity.split(" - ");
	if (tmp.length === 2) {

		if (tmp[1].trim() === "") {

			let start = Datetime.from(tmp[0].trim());
			let end   = Datetime.from(new Date());

			time = start.ToTimeDifference(end);

		} else {

			let start = Datetime.from(tmp[0].trim());
			let end   = Datetime.from(tmp[1].trim());

			time = start.ToTimeDifference(end);

		}

	}

	return time;

};

export const Activity = function() {

	this.Datetime = null;
	this.Duration = null;
	this.Index    = 0;
	this.Task     = null;
	this.interval = null;

};

Activity.prototype = {

	[Symbol.toStringTag]: "Activity",

	IsRunning: function() {

		if (this.Task !== null) {
			return true;
		}

		return false;

	},

	Start: function(task) {

		if (IsTask(task)) {

			this.Task = task;

			let start = null;

			if (this.Task.Activities.length > 0) {

				let check = this.Task.Activities[this.Task.Activities.length - 1];
				if (check.endsWith(" - ")) {
					start = Datetime.from(check.split(" - ")[0]);
				}

			}

			if (start !== null) {

				let now = Datetime.from(new Date());

				if (now.Year !== start.Year || now.Month !== start.Month || now.Day !== start.Day) {

					let yesterday = now.PrevDay();

					if (yesterday.Year === start.Year && yesterday.Month === start.Month && yesterday.Day === start.Day && start.Hour > 12 && now.Hour < 12) {

						this.Datetime = start;
						this.Index    = this.Task.Activities.length;

					} else {

						this.Task.Activities[this.Task.Activities.length - 1] = ToDateString(start) + " " + ToTimeString(start) + " - " + ToDateString(start) + " 23:59:59";
						this.Datetime = Datetime.from(new Date());
						this.Index    = this.Task.Activities.length;

					}

				} else {

					this.Datetime = start;
					this.Index    = this.Task.Activities.length;

				}

			} else {

				this.Datetime = Datetime.from(new Date());
				this.Index    = this.Task.Activities.length;

			}

			this.Duration = Time.from("00:00:00");

			this.Task.Activities.forEach((activity) => {
				this.Duration.AddTime(toTime(activity));
			});

			this.interval = setInterval(() => {

				if (this.Duration !== null) {

					this.Duration.AddSecond();

					if (this.Task !== null) {
						this.Task.Duration = this.Duration.toString();
						this.Task.Activities[this.Index] = this.Datetime.toString() + " - ";
					}

				} else {
					clearInterval(this.interval);
					this.interval = null;
				}

			}, 1000);

			return true;

		}

		return false;

	},

	Stop: function() {

		if (this.interval !== null) {
			clearInterval(this.interval);
			this.interval = null;
		}

		if (this.Datetime !== null && this.Duration !== null && this.Task !== null) {

			let now = Datetime.from(new Date());

			this.Task.Duration = this.Duration.toString();
			this.Task.Activities[this.Index] = this.Datetime.toString() + " - " + now.toString();

			this.Datetime = null;
			this.Duration = null;
			this.Task = null;

		}

		this.Index = 0;

	},

	ToDurationString() {

		let result = "00:00:00";

		if (this.Duration !== null) {
			result = this.Duration.toString();
		}

		return result;

	},

};
