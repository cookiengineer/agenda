package structs

import "encoding/json"
import "os"
import "strconv"
import "strings"

func toFilename(task Task) string {

	var project string = strings.ToLower(task.Project)
	var number string = strconv.Itoa(task.ID)

	if len(number) == 6 {
		return project + "-" + number + ".json"
	} else if len(number) == 5 {
		return project + "-0" + number + ".json"
	} else if len(number) == 4 {
		return project + "-00" + number + ".json"
	} else if len(number) == 3 {
		return project + "-000" + number + ".json"
	} else if len(number) == 2 {
		return project + "-0000" + number + ".json"
	} else if len(number) == 1 {
		return project + "-00000" + number + ".json"
	} else if len(number) == 0 {
		return ""
	}

	return ""

}

type Database struct {
	Folder string
	Tasks  []*Task
}

func NewDatabase() Database {

	var database Database

	home, err := os.UserHomeDir()

	if err == nil {
		database.Folder = home + "/Agenda"
	} else {
		database.Folder = "/tmp/agenda"
	}

	database.Tasks = make([]*Task, 0)

	return database

}

func (database *Database) ReadTask(filename string) Task {

	var task Task

	buffer, err1 := os.ReadFile(database.Folder + "/" + filename)

	if err1 == nil {

		err2 := json.Unmarshal(buffer, &task)

		if err2 != nil {
			task.ID = 0
		}

	}

	return task

}

func (database *Database) RemoveTask(task Task) bool {

	if task.Project != "" && task.ID != 0 {

		var filename = toFilename(task)

		if filename != "" {

			err := os.Remove(database.Folder+"/"+filename)

			if err == nil {
				return true
			}

		}

	}

	return false

}
func (database *Database) WriteTask(task Task) bool {

	if task.Project != "" && task.ID != 0 {

		var filename = toFilename(task)

		if filename != "" {

			buffer, err1 := json.MarshalIndent(task, "", "\t")

			if err1 == nil {

				err2 := os.WriteFile(database.Folder+"/"+filename, buffer, 0644)

				if err2 == nil {
					return true
				}

			}

		}

	}

	return false

}

func (database *Database) Update() {

	files, err := os.ReadDir(database.Folder)

	if err == nil {

		var tasks []*Task

		for _, file := range files {

			if strings.HasSuffix(file.Name(), ".json") {

				var task Task = database.ReadTask(file.Name())

				if task.ID != 0 {
					tasks = append(tasks, &task)
				}

			}

		}

		database.Tasks = tasks

	}

}

func (database *Database) Create(task Task) bool {

	if task.ID == 0 {

		var max_id int = 0

		for t := 0; t < len(database.Tasks); t++ {

			var other = database.Tasks[t]

			if other.ID > max_id {
				max_id = other.ID
			}

		}

		if max_id < 999999 {

			task.ID = max_id + 1

			var result = database.WriteTask(task)

			if result == true {
				return true
			}

		}

	}

	return false

}

func (database *Database) Modify(task Task) bool {

	var found *Task = nil

	for t := 0; t < len(database.Tasks); t++ {

		other := database.Tasks[t]

		if other.ID == task.ID {
			found = database.Tasks[t]
			break
		}

	}

	if found != nil {

		if found.Project != task.Project {
			database.RemoveTask(*found)
			found = nil
		}

	}

	if task.ID != 0 && task.ID < 999999 {

		var result = database.WriteTask(task)

		if result == true {
			return true
		}

	}

	return false

}
