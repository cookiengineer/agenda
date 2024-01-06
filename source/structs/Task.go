package structs

import "encoding/json"
import "io"

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

func NewTask(requestbody io.ReadCloser) (Task, error) {

	var task Task

	decoder := json.NewDecoder(requestbody)
	err := decoder.Decode(&task)

	if err != nil {
		return task, err
	}

	return task, nil

}

