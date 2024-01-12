package structs

import "agenda/utils"
import "encoding/json"
import "io"
import "slices"
import "strings"
import "time"

var TASK_COMPLEXITIES []int = []int{
	1,
	2,
	3,
	5,
	8,
	13,
	21,
}

var TASK_REPEAT []string = []string{
	"weekly",
	"bi-weekly",
	"monthly",
	"yearly",
}

var TASK_WEEKDAYS []string = []string{
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
}

type Task struct {
	ID             int      `json:"id"`
	Project        string   `json:"project"`
	Title          string   `json:"title"`
	Description    string   `json:"description"`
	Complexity     int      `json:"complexity"`
	Deadline       *string  `json:"deadline"`
	Estimation     string   `json:"estimation"`
	Repeat         *string  `json:"repeat"`
	RepeatWeekdays []string `json:"repeat_weekdays"`
	Duration       string   `json:"duration"`
	IsCompleted    bool     `json:"is_completed"`
	Activities     []string `json:"activities"`
}

func TaskFrom(requestbody io.ReadCloser) (Task, error) {

	var task Task

	decoder := json.NewDecoder(requestbody)
	err := decoder.Decode(&task)

	if err != nil {
		return task, err
	}

	task.Project = utils.ToProject(task.Project)
	task.Title = utils.ToTitle(task.Title)

	return task, nil

}

func (task *Task) IsValid() bool {

	var valid_project bool = false
	var valid_title bool = false
	var valid_description bool = false
	var valid_complexity bool = false
	var valid_deadline bool = false
	var valid_estimation bool = false
	var valid_repeat bool = false
	var valid_duration bool = false
	var valid_activities bool = false

	// Don't validate ID, IsCompleted

	if task.Project != "" && utils.ToProject(task.Project) == task.Project {
		valid_project = true
	}

	if task.Title != "" && utils.ToTitle(task.Title) == task.Title {
		valid_title = true
	}

	if task.Description != "" {
		valid_description = true
	}

	if task.Complexity != 0 && slices.Contains(TASK_COMPLEXITIES, task.Complexity) {
		valid_complexity = true
	}

	if task.Deadline != nil {

		datetime := DatetimeFrom(*task.Deadline)

		if datetime.IsValid() {
			valid_deadline = true
		}

	} else {
		valid_deadline = true
	}

	if task.Estimation != "" {

		time := TimeFrom(task.Estimation)

		if time.IsValid() {
			valid_estimation = true
		}

	}

	if task.Repeat != nil {

		if len(task.RepeatWeekdays) > 0 {

			valid_repeat = true

			for r := 0; r < len(task.RepeatWeekdays); r++ {

				if slices.Contains(TASK_WEEKDAYS, task.RepeatWeekdays[r]) == false {
					valid_repeat = false
					break
				}

			}

			if valid_repeat == true {

				if slices.Contains(TASK_REPEAT, *task.Repeat) {
					valid_repeat = true
				} else {
					valid_repeat = false
				}

			} else {
				valid_repeat = false
			}

		} else {

			if slices.Contains(TASK_REPEAT, *task.Repeat) {
				valid_repeat = true
			}

		}

	} else {

		if len(task.RepeatWeekdays) == 0 {
			valid_repeat = true
		}

	}

	if task.Duration != "" {

		time := TimeFrom(task.Estimation)

		if time.IsValid() {
			valid_duration = true
		}

	}

	if len(task.Activities) > 0 {

		valid_activities = true

		for a := 0; a < len(task.Activities); a++ {

			activity := strings.Split(task.Activities[a], " - ")

			if len(activity) == 2 {

				if activity[1] == "" && a == len(task.Activities)-1 {

					before := DatetimeFrom(activity[0])
					now := DatetimeFrom(time.Now().Format(time.RFC3339))

					if before.IsBefore(now) {
						// Do Nothing
					} else {
						valid_activities = false
						break
					}

				} else {

					before := DatetimeFrom(activity[0])
					after := DatetimeFrom(activity[1])

					if before.IsBefore(after) {
						// Do Nothing
					} else {
						valid_activities = false
						break
					}

				}

			}

		}

	} else {
		valid_activities = true
	}

	if valid_project &&
		valid_title &&
		valid_description &&
		valid_complexity &&
		valid_deadline &&
		valid_estimation &&
		valid_repeat &&
		valid_duration &&
		valid_activities {
		return true
	}

	return false

}
