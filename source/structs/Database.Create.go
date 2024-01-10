package structs

func (database *Database) Create(task Task) *Task {

	var pointer *Task = nil

	if task.ID == 0 && task.IsValid() {

		database.task_id += 1
		task.ID = database.task_id

		if task.ID > 0 && task.ID < 99999999 {

			result := database.Write(task)

			if result == true {

				database.Projects[task.Project] = []int{task.ID}
				database.Tasks[task.ID] = &task

				pointer = database.Tasks[task.ID]

			}

		}

	}

	return pointer

}
