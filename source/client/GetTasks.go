package client

import "agenda/structs"
import "encoding/json"
import "net/http"
import "io/ioutil"

func GetTasks() []structs.Task {

	var result []structs.Task

	client := &http.Client{}
	// client.CloseIdleConnections()

	request, err1 := http.NewRequest("GET", "/api/tasks", nil)

	if err1 == nil {

		response, err2 := client.Do(request)

		if err2 == nil {

			status_code := response.StatusCode

			if status_code == 200 || status_code == 304 {

				if response.Header["Content-Type"][0] == "application/json" {

					var tasks []structs.Task

					buffer, err3 := ioutil.ReadAll(response.Body)

					if err3 == nil {

						err4 := json.Unmarshal(buffer, &tasks)

						if err4 == nil && len(tasks) > 0 {

							for t := 0; t < len(tasks); t++ {
								result = append(result, tasks[t])
							}

						}

					}

				}

			}

		}

	}

	return result

}
