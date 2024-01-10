package structs

import "agenda/utils"
import "encoding/json"
import "os"
import "strings"

func (database *Database) Write(task Task) bool {

	if task.ID != 0 && task.IsValid() {

		folder_name := strings.ToLower(task.Project)
		file_name := utils.FormatInt(task.ID, 8) + ".json"

		stat, err0 := os.Stat(database.folder + "/" + folder_name)

		if err0 == nil && stat.IsDir() {
			// Do Nothing
		} else {
			err0 = os.MkdirAll(database.folder+"/"+folder_name, 0750)
		}

		buffer, err1 := json.MarshalIndent(task, "", "\t")

		if err0 == nil && err1 == nil {

			err2 := os.WriteFile(database.folder+"/"+folder_name+"/"+file_name, buffer, 0644)

			if err2 == nil {
				return true
			}

		}

	}

	return false

}
