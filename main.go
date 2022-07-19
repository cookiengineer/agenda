
package main;

import (_ "embed");
import "github.com/wailsapp/wails";



func main() {

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1024,
		Height:  768,
		Title:  "Agenda",
		Colour: "#383c4a",
	});

	app.Run();

}

