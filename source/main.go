package main

import "github.com/webview/webview"
import "agenda/server"
import "embed"
import "fmt"
import "io/fs"
import "os"

//go:embed public/*
var EMBED_FS embed.FS

func main() {

	var mode string

	if len(os.Args) == 2 {

		if os.Args[1] == "dev" || os.Args[1] == "development" {
			mode = "development"
		} else {
			mode = "production"
		}

	} else {
		mode = "production"
	}

	if mode == "development" {

		fsys := os.DirFS("public")

		fmt.Println("Listening on http://localhost:13337")
		server.Serve(fsys, 13337)

	} else if mode == "production" {

		fsys, _ := fs.Sub(EMBED_FS, "public")

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

}
