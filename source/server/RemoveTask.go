package server

import "agenda/console"
import "agenda/structs"
import "net/http"
import "strconv"

func RemoveTask(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodDelete {

		task, err1 := structs.TaskFrom(request.Body)

		if err1 == nil {

			result := database.Remove(task)

			if result == true {

				console.Info("RemoveTask(Project=" + task.Project + ", ID=" + strconv.Itoa(task.ID) + "): OK")

				response.Header().Set("Content-Type", "application/json")
				response.WriteHeader(http.StatusOK)
				response.Write([]byte("{}"))

			} else {

				console.Error("RemoveTask(Project=" + task.Project + ", ID=" + strconv.Itoa(task.ID) + "): Forbidden")

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
