
package main;

import "agenda/api";
import "fmt";
import "net/http";



func main() {

	fileserver := http.FileServer(http.Dir("../../public"));

	http.Handle("/",                     fileserver);
	http.HandleFunc("/api/tasks",        api.GetTasks);
	http.HandleFunc("/api/tasks/create", api.CreateTask);
	http.HandleFunc("/api/tasks/modify", api.ModifyTask);

	err1 := http.ListenAndServe(":13337", nil);

	if err1 != nil {
		fmt.Println("Sorry, we need port 13337 to be unused.");
	} else {
		fmt.Println("Listening on http://localhost:13337/api");
	}

}

