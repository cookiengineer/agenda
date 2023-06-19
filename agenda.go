package main

import "github.com/webview/webview"
import "agenda/server"
import "embed"
import "fmt"
import "io/fs"
import "net/http"

//go:embed public/*
var EMBED_FS embed.FS

var WEBVIEW webview.WebView

func main() {

	fsys, _ := fs.Sub(EMBED_FS, "public")
	fsrv := http.FileServer(http.FS(fsys))
	http.Handle("/", fsrv)

	http.HandleFunc("/api/tasks", server.GetTasks)
	http.HandleFunc("/api/tasks/create", server.CreateTask)
	http.HandleFunc("/api/tasks/modify", server.ModifyTask)

	fmt.Println("Listening on http://localhost:13337")

	err1 := http.ListenAndServe(":13337", nil)

	if err1 == nil {

		WEBVIEW := webview.New(true)
		defer WEBVIEW.Destroy()
		WEBVIEW.SetTitle("Agenda")
		WEBVIEW.SetSize(800, 600, webview.HintNone)
		WEBVIEW.Navigate("http://localhost:13337/index.html")
		WEBVIEW.Run()

	} else if err1 != nil {
		fmt.Println("Sorry, network port 13337 needs to be used already.")
	}

}
