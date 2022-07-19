
package server;

import "encoding/json";
import "net/http";



var CACHE Cache = NewCache();


func GetTasks (response http.ResponseWriter, request *http.Request) {

	CACHE.Update();

	if request.Method == http.MethodGet {

		if len(CACHE.Tasks) > 0 {

			json, err := json.Marshal(CACHE.Tasks);

			if err == nil {

				response.Header().Set("Content-Type", "application/json");
				response.WriteHeader(http.StatusOK);
				response.Write(json);

			} else {

				response.Header().Set("Content-Type", "application/json");
				response.WriteHeader(http.StatusInternalServerError);
				response.Write([]byte("[]"));

			}

		} else {

			response.Header().Set("Content-Type", "application/json");
			response.WriteHeader(http.StatusOK);
			response.Write([]byte("[]"));

		}

	} else {

		response.Header().Set("Content-Type", "application/json");
		response.WriteHeader(http.StatusMethodNotAllowed);
		response.Write([]byte("[]"));

	}

}

func CreateTask (response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodPost {

		task, err1 := NewTask(request.Body);

		if err1 == nil {

			CACHE.Update();

			var result bool = CACHE.Create(task);

			if result == true {

				json, err2 := json.Marshal(task);

				if err2 == nil {

					response.Header().Set("Content-Type", "application/json");
					response.WriteHeader(http.StatusOK);
					response.Write(json);

				} else {

					response.Header().Set("Content-Type", "application/json");
					response.WriteHeader(http.StatusInternalServerError);
					response.Write([]byte("{}"));

				}

			} else {

				response.Header().Set("Content-Type", "application/json");
				response.WriteHeader(http.StatusInternalServerError);
				response.Write([]byte("{}"));

			}

		} else {

			response.Header().Set("Content-Type", "application/json");
			response.WriteHeader(http.StatusInternalServerError);
			response.Write([]byte("{}"));

		}

	} else {

		response.Header().Set("Content-Type", "application/json");
		response.WriteHeader(http.StatusMethodNotAllowed);
		response.Write([]byte("{}"));

	}

}

func ModifyTask (response http.ResponseWriter, request *http.Request) {

	if request.Method == http.MethodPost {

		task, err1 := NewTask(request.Body);

		if err1 == nil {

			var result bool = CACHE.Modify(task);

			if result == true {

				CACHE.Update();


				json, err2 := json.Marshal(task);

				if err2 == nil {

					response.Header().Set("Content-Type", "application/json");
					response.WriteHeader(http.StatusOK);
					response.Write(json);

				} else {

					response.Header().Set("Content-Type", "application/json");
					response.WriteHeader(http.StatusInternalServerError);
					response.Write([]byte("{}"));

				}

			} else {

				response.Header().Set("Content-Type", "application/json");
				response.WriteHeader(http.StatusForbidden);
				response.Write([]byte("{}"));

			}

		} else {

			response.Header().Set("Content-Type", "application/json");
			response.WriteHeader(http.StatusInternalServerError);
			response.Write([]byte("{}"));

		}

	} else {

		response.Header().Set("Content-Type", "application/json");
		response.WriteHeader(http.StatusMethodNotAllowed);
		response.Write([]byte("{}"));

	}

}

