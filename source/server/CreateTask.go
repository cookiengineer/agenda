package server

import "agenda/console"
import "agenda/structs"
import "encoding/json"
import "net/http"

func CreateTask(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodPost {

		task, err1 := structs.TaskFrom(request.Body)

		if err1 == nil {

			result := database.Create(task)

			if result != nil {

				json, err2 := json.Marshal(result)

				if err2 == nil {

					console.Info("CreateTask(Project=" + result.Project + "): OK")

					response.Header().Set("Content-Type", "application/json")
					response.WriteHeader(http.StatusOK)
					response.Write(json)

				} else {

					console.Error("CreateTask(Project=" + result.Project + "): Error")

					response.Header().Set("Content-Type", "application/json")
					response.WriteHeader(http.StatusInternalServerError)
					response.Write([]byte("{}"))

				}

			} else {

				console.Error("CreateTask(Project=" + task.Project + "): Forbidden")

				response.Header().Set("Content-Type", "application/json")
				response.WriteHeader(http.StatusInternalServerError)
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
