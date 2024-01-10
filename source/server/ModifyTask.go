package server

import "agenda/console"
import "agenda/structs"
import "encoding/json"
import "net/http"
import "strconv"

func ModifyTask(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodPost {

		task, err1 := structs.TaskFrom(request.Body)

		if err1 == nil {

			result := database.Modify(task)

			if result != nil {

				json, err2 := json.Marshal(result)

				if err2 == nil {

					console.Info("ModifyTask(Project=" + result.Project + ", ID=" + strconv.Itoa(result.ID) + "): OK")

					response.Header().Set("Content-Type", "application/json")
					response.WriteHeader(http.StatusOK)
					response.Write(json)

				} else {

					console.Error("ModifyTask(Project=" + result.Project + ", ID=" + strconv.Itoa(result.ID) + "): Error")

					response.Header().Set("Content-Type", "application/json")
					response.WriteHeader(http.StatusInternalServerError)
					response.Write([]byte("{}"))

				}

			} else {

				console.Error("ModifyTask(Project=" + task.Project + ", ID=" + strconv.Itoa(task.ID) + "): Forbidden")

				response.Header().Set("Content-Type", "application/json")
				response.WriteHeader(http.StatusForbidden)
				response.Write([]byte("{}"))

			}

		} else {

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusInternalServerError)
			response.Write([]byte("{}"))

		}

	} else {

		response.Header().Set("Content-Type", "application/json")
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("{}"))

	}

}
