package structs

import "agenda/utils"
import "os"
import "strings"

func (database *Database) Remove(task Task) bool {

	var result bool = false

	if task.ID != 0 && task.IsValid() {

		folder_name := strings.ToLower(task.Project)
		file_name := utils.FormatInt(task.ID, 8) + ".json"

		stat, err0 := os.Stat(database.folder + "/" + folder_name)

		if err0 == nil && stat.IsDir() {

			err1 := os.Remove(database.folder + "/" + folder_name + "/" + file_name)

			if err1 == nil {
				delete(database.Tasks, task.ID)
				result = true
			}

		}

	}

	return result

}
