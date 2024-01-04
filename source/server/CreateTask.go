package server

import "agenda/structs"
import "encoding/json"
import "fmt"
import "net/http"
import "strconv"

func CreateTask(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodPost {

		task, err1 := structs.NewTask(request.Body)

		if err1 == nil {

			database.Update()

			var result bool = database.Create(task)

			if result == true {

				json, err2 := json.Marshal(task)

				if err2 == nil {

					fmt.Println("CreateTask(ID=" + strconv.Itoa(task.ID) + "): OK")

					response.Header().Set("Content-Type", "application/json")
					response.WriteHeader(http.StatusOK)
					response.Write(json)

				} else {

					fmt.Println("CreateTask(ID=" + strconv.Itoa(task.ID) + "): Error")

					response.Header().Set("Content-Type", "application/json")
					response.WriteHeader(http.StatusInternalServerError)
					response.Write([]byte("{}"))

				}

			} else {

				fmt.Println("CreateTask(ID=" + strconv.Itoa(task.ID) + "): Forbidden")

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
