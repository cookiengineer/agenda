package server

import "agenda/structs"
import "fmt"
import "net/http"
import "strconv"

func RemoveTask(database *structs.Database, response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodDelete {

		task, err1 := structs.NewTask(request.Body)

		if err1 == nil {

			var result bool = database.RemoveTask(task)

			if result == true {

				database.Update()

				fmt.Println("RemoveTask(ID=" + strconv.Itoa(task.ID) + "): OK")

				response.Header().Set("Content-Type", "application/json")
				response.WriteHeader(http.StatusOK)
				response.Write([]byte("{}"))

			} else {

				fmt.Println("RemoveTask(ID=" + strconv.Itoa(task.ID) + "): Forbidden")

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
