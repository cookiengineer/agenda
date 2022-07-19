
package server;

import "encoding/json";
import "io";



type Task struct {

	ID           int    `json:"id"`;
	Type         string `json:"type"`;
	Project      string `json:"project"`;
	Title        string `json:"title"`;
	Description  string `json:"description"`;

	Complexity   int    `json:"complexity"`;
	Deadline    *string `json:"deadline"`;
	Estimation   string `json:"estimation"`;

	Eternal      bool   `json:"eternal"`;
	Repeat     []string `json:"repeat"`;

	Duration     string `json:"duration"`;
	IsCompleted  bool   `json:"is_completed"`;

}

func NewTask (requestbody io.ReadCloser) (Task, error) {

	var task Task;

	decoder := json.NewDecoder(requestbody);
	err     := decoder.Decode(&task);

	if err != nil {
		return task, err;
	}

	return task, nil;

}

func (task *Task) SetDuration (duration string) {
	task.Duration = duration;
}

func (task *Task) SetCompleted (completed bool) {
	task.IsCompleted = completed;
}

