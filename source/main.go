package main

import "github.com/webview/webview"
import "agenda/console"
import "agenda/server"
import "embed"
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

		console.Clear()
		console.Group("agenda: Command-Line Arguments")
		console.Inspect(struct {
			Mode string
		}{
			Mode: mode,
		})
		console.GroupEnd("")

		console.Log("Listening on http://localhost:13337")
		server.Serve(fsys, 13337)

	} else if mode == "production" {

		fsys, _ := fs.Sub(EMBED_FS, "public")

		console.Clear()
		console.Group("agenda: Command-Line Arguments")
		console.Inspect(struct {
			Mode string
		}{
			Mode: mode,
		})
		console.GroupEnd("")

		console.Log("Listening on http://localhost:13337")

		go func() {

			console.Log("Opening WebView...")

			view := webview.New(true)
			defer view.Destroy()
			view.SetTitle("Agenda")
			view.SetSize(800, 600, webview.HintNone)
			view.Navigate("http://localhost:13337/index.html")
			view.Run()

		}()

		server.Serve(fsys, 13337)

	}

}
