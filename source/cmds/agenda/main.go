package main

import "github.com/webview/webview"
import "agenda"
import "agenda/server"
import "fmt"
import "io/fs"

func main() {

	fsys, _ := fs.Sub(agenda.PUBLIC, "public")

	go func() {

		view := webview.New(true)
		defer view.Destroy()
		view.SetTitle("Agenda")
		view.SetSize(800, 600, webview.HintNone)
		view.Navigate("http://localhost:13337/index.html")
		view.Run()

	}()

	fmt.Println("Listening on http://localhost:13337")
	server.Serve(fsys, 13337)

}
