package server

import "encoding/json"
import "net/http"
import "agenda/structs"

func GetProjects(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodGet {

		json, err := json.MarshalIndent(database.Projects, "", "\t")

		if err == nil {

			response.Header().Set("Content-Type", "application/json")
			response.WriteHeader(http.StatusOK)
			response.Write(json)

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
