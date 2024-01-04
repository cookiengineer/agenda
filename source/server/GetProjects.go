package server

import "encoding/json"
import "net/http"
import "agenda/structs"

func GetProjects(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	database.Update()

	if request.Method == http.MethodGet {

		if len(database.Tasks) > 0 {

			projects := make(map[string][]int)

			for t := 0; t < len(database.Tasks); t++ {

				task := database.Tasks[t]

				if task.ID != 0 && task.Project != "" {

					_, ok := projects[task.Project]

					if ok == true {
						projects[task.Project] = append(projects[task.Project], task.ID)
					} else {
						projects[task.Project] = []int{task.ID}
					}

				}

			}

			json, err := json.MarshalIndent(projects, "", "\t")

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
			response.WriteHeader(http.StatusOK)
			response.Write([]byte("{}"))

		}

	} else {

		response.Header().Set("Content-Type", "application/json")
		response.WriteHeader(http.StatusMethodNotAllowed)
		response.Write([]byte("{}"))

	}

}
