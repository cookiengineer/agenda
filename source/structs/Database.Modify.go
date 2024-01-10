package structs

import "slices"

func (database *Database) Modify(task Task) *Task {

	var pointer *Task = nil

	if task.ID > 0 && task.ID < 99999999 && task.IsValid() {

		check_task, ok1 := database.Tasks[task.ID]

		if ok1 == true {

			if check_task.Project != task.Project {
				database.Remove(*check_task)
				check_task = nil
			}

		}

		result := database.Write(task)

		if result == true {

			check_project, ok2 := database.Projects[task.Project]

			if ok2 == true {

				if slices.Contains(check_project, task.ID) == false {
					database.Projects[task.Project] = append(database.Projects[task.Project], task.ID)
				}

			} else {
				database.Projects[task.Project] = []int{task.ID}
			}

			database.Tasks[task.ID] = &task
			pointer = database.Tasks[task.ID]

		}

	}

	return pointer

}
