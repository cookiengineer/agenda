package server

import "agenda/structs"
import "io/fs"
import "net/http"
import "strconv"

func Serve(filesystem fs.FS, port int) bool {

	var result bool = false

	database := structs.NewDatabase()

	fsrv := http.FileServer(http.FS(filesystem))
	http.Handle("/", fsrv)

	http.HandleFunc("/api/tasks", func(response http.ResponseWriter, request *http.Request) {
		GetTasks(&database, response, request)
	})

	http.HandleFunc("/api/projects", func(response http.ResponseWriter, request *http.Request) {
		GetProjects(&database, response, request)
	})

	http.HandleFunc("/api/tasks/create", func(response http.ResponseWriter, request *http.Request) {
		CreateTask(&database, response, request)
	})

	http.HandleFunc("/api/tasks/modify", func(response http.ResponseWriter, request *http.Request) {
		ModifyTask(&database, response, request)
	})

	http.HandleFunc("/api/tasks/remove", func(response http.ResponseWriter, request *http.Request) {
		RemoveTask(&database, response, request)
	})

	err1 := http.ListenAndServe(":"+strconv.Itoa(port), nil)

	if err1 == nil {
		result = true
	}

	return result

}
