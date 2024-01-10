package server

import "encoding/json"
import "net/http"
import "agenda/structs"

func GetTasks(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodGet {

		payload := make([]structs.Task, 0)

		for _, task := range database.Tasks {
			payload = append(payload, *task)
		}

		json, err := json.MarshalIndent(payload, "", "\t")

		if err == nil {

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusOK)
			response.Write(json)

		} else {

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusInternalServerError)
			response.Write([]byte("[]"))

		}

	} else {

		response.Header().Set("Content-Type", "application/json")
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("[]"))

	}

}
