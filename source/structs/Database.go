package structs

import "agenda/console"
import "encoding/json"
import "os"
import "slices"
import "strconv"
import "strings"

type Database struct {
	Projects map[string][]int
	Tasks    map[int]*Task
	folder   string
	task_id  int
}

func NewDatabase() Database {

	var database Database

	home, err := os.UserHomeDir()

	if err == nil {
		database.folder = home + "/Agenda"
	} else {
		database.folder = "/tmp/agenda"
	}

	database.Projects = make(map[string][]int, 0)
	database.Tasks = make(map[int]*Task)
	database.task_id = 0

	folders, err1 := os.ReadDir(database.folder)

	if err1 == nil {

		for _, folder := range folders {

			folder_name := folder.Name()

			if strings.Contains(folder_name, ".") == false {

				files, err2 := os.ReadDir(database.folder + "/" + folder_name)

				if err2 == nil {

					for _, file := range files {

						file_name := file.Name()

						if strings.HasSuffix(file_name, ".json") {

							buffer, err3 := os.ReadFile(database.folder + "/" + folder_name + "/" + file_name)

							if err3 == nil {

								var task Task

								err4 := json.Unmarshal(buffer, &task)

								if err4 == nil && task.IsValid() {

									database.Tasks[task.ID] = &task

									check_project, ok := database.Projects[task.Project]

									if ok == true {

										if slices.Contains(check_project, task.ID) == false {
											database.Projects[task.Project] = append(database.Projects[task.Project], task.ID)
										}

									} else {
										database.Projects[task.Project] = []int{task.ID}
									}

									if task.ID > database.task_id {
										database.task_id = task.ID
									}

								}

							}

						}

					}

				}

			}

		}

	}

	console.Group("Database")

	for project, task_ids := range database.Projects {
		console.Log("> Project \"" + project + "\" has " + strconv.Itoa(len(task_ids)) + " Tasks")
	}

	console.GroupEnd("Database")

	return database

}
