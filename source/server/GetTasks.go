package server

import "encoding/json"
import "net/http"
import "agenda/structs"

func GetTasks(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	database.Update()

	if request.Method == http.MethodGet {

		if len(database.Tasks) > 0 {

			json, err := json.MarshalIndent(database.Tasks, "", "\t")

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
			response.WriteHeader(http.StatusOK)
			response.Write([]byte("[]"))

		}

	} else {

		response.Header().Set("Content-Type", "application/json")
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("[]"))

	}

}
