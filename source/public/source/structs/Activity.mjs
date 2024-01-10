
import { IsTask       } from "/source/structs/Task.mjs";
import { Datetime     } from "/source/structs/Datetime.mjs";
import { Time         } from "/source/structs/Time.mjs";
import { ToDateString } from "/source/utils/ToDateString.mjs";
import { ToTimeString } from "/source/utils/ToTimeString.mjs";

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

			let activity = null;

			if (this.Task.Activities.length > 0) {

				let check = this.Task.Activities.length - 1;
				if (this.Task.Activities[check].endsWith(" - ")) {
					activity = this.Task.Activities[check];
					this.Index = check;
				} else {
					this.Index = this.Task.Activities.length;
				}

			} else {
				this.Index = 0;
			}

			if (activity !== null) {

				let now = Datetime.from(new Date());
				let start = Datetime.from(activity.split(" - ")[0]);

				if (now.Year !== start.Year || now.Month !== start.Month || now.Day !== start.Day) {

					let yesterday = now.PrevDay();

					if (yesterday.Year === start.Year && yesterday.Month === start.Month && yesterday.Day === start.Day && start.Hour > 12 && now.Hour < 12) {

						this.Datetime        = start;
						this.Duration        = Time.from("00:00:00");
						this.Duration.Hour   = (24 - start.Hour)   + now.Hour;
						this.Duration.Minute = (60 - start.Minute) + now.Minute;
						this.Duration.Second = (60 - start.Second) + now.Second;

					} else {

						this.Task.Activities[this.Index] = ToDateString(start) + " " + ToTimeString(start) + " - " + ToDateString(start) + " 23:59:59";
						this.Datetime = Datetime.from(new Date());
						this.Duration = Time.from(this.Task.Duration);
						this.Index = this.Task.Activities.length;

					}

				} else {

					this.Datetime      = start;
					this.Duration      = Time.from("00:00:00");

					let delta_hour   = now.Hour - start.Hour;
					let delta_second = (60 - start.Second) + now.Second;
					let delta_minute = (60 - start.Minute) + now.Minute;

					if (delta_second > 60) {
						delta_minute += 1;
						delta_second -= 60;
					}

					if (delta_minute > 60) {
						delta_hour   += 1;
						delta_minute -= 60;
					}

					this.Duration.Hour   = delta_hour;
					this.Duration.Minute = delta_minute;
					this.Duration.Second = delta_second;

				}

			} else {

				this.Datetime = Datetime.from(new Date());
				this.Duration = Time.from(this.Task.Duration);

			}

			this.interval = setInterval(() => {

				if (this.Duration !== null) {

					this.Duration.IncrementSecond();

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
