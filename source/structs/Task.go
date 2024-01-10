package structs

import "agenda/utils"
import "encoding/json"
import "io"
import "slices"
import "strings"
import "time"

var COMPLEXITIES []int = []int{
	1,
	2,
	3,
	5,
	8,
	13,
	21,
}

var DAYS []string = []string{
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
}

type Task struct {
	ID          int      `json:"id"`
	Project     string   `json:"project"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Complexity  int      `json:"complexity"`
	Deadline    *string  `json:"deadline"`
	Estimation  string   `json:"estimation"`
	Eternal     bool     `json:"eternal"`
	Repeat      []string `json:"repeat"`
	Duration    string   `json:"duration"`
	IsCompleted bool     `json:"is_completed"`
	Activities  []string `json:"activities"`
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

	// Don't validate ID, Eternal, IsCompleted

	if task.Project != "" && utils.ToProject(task.Project) == task.Project {
		valid_project = true
	}

	if task.Title != "" && utils.ToTitle(task.Title) == task.Title {
		valid_title = true
	}

	if task.Description != "" {
		valid_description = true
	}

	if task.Complexity != 0 && slices.Contains(COMPLEXITIES, task.Complexity) {
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

	if len(task.Repeat) > 0 {

		valid_repeat = true

		for r := 0; r < len(task.Repeat); r++ {

			if slices.Contains(DAYS, task.Repeat[r]) == false {
				valid_repeat = false
				break
			}

		}

	} else {
		valid_repeat = true
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

				before := DatetimeFrom(activity[0])
				after := DatetimeFrom(activity[1])

				if before.IsBefore(after) {
					// Do Nothing
				} else {
					valid_activities = false
					break
				}

			} else if len(activity) == 1 && a == len(task.Activities)-1 {

				before := DatetimeFrom(activity[0])
				now := DatetimeFrom(time.Now().Format(time.RFC3339))

				if before.IsBefore(now) {
					// Do Nothing
				} else {
					valid_activities = false
					break
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
