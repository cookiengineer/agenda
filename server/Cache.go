
package server;

import "encoding/json";
import "io/ioutil";
import "os";
import "strconv";
import "strings";



func toFilename (task Task) string {

	var project string = strings.ToLower(task.Project);
	var number  string = strconv.Itoa(task.ID);

	if len(number) == 6 {
		return project + "-" + number + ".json";
	} else if len(number) == 5 {
		return project + "-0" + number + ".json";
	} else if len(number) == 4 {
		return project + "-00" + number + ".json";
	} else if len(number) == 3 {
		return project + "-000" + number + ".json";
	} else if len(number) == 2 {
		return project + "-0000" + number + ".json";
	} else if len(number) == 1 {
		return project + "-00000" + number + ".json";
	} else if len(number) == 0 {
		return "";
	}

	return "";

}



type Cache struct {
	Folder string;
	Tasks  []Task;
};


func NewCache () Cache {

	var cache Cache;

	home, err := os.UserHomeDir();

	if err == nil {
		cache.Folder = home + "/Agenda";
	} else {
		cache.Folder = "/tmp/agenda";
	}

	return cache;

}

func (cache *Cache) ReadTask (filename string) Task {

	var task Task;

	buffer, err1 := ioutil.ReadFile(cache.Folder + "/" + filename);

	if err1 == nil {

		err2 := json.Unmarshal(buffer, &task);

		if err2 != nil {
			task.ID = 0;
		}

	}

	return task;

}

func (cache *Cache) WriteTask (task Task) bool {

	if task.Project != "" && task.ID != 0 {

		var filename = toFilename(task);

		if filename != "" {

			buffer, err1 := json.Marshal(task);

			if err1 == nil {

				err2 := ioutil.WriteFile(cache.Folder + "/" + filename, buffer, 0644);

				if err2 == nil {
					return true;
				}

			}

		}

	}

	return false;

}

func (cache *Cache) Update() {

	files, err := ioutil.ReadDir(cache.Folder);


	if err == nil {

		var tasks []Task;

		for _, file := range files {

			if strings.HasSuffix(file.Name(), ".json") {

				var task Task = cache.ReadTask(file.Name());

				if task.ID != 0 {
					tasks = append(tasks, task);
				}

			}

		}

		cache.Tasks = tasks;

	}

}

func (cache *Cache) Create (task Task) bool {

	if task.ID == 0 {

		var max_id int = 0;

		for t := 0; t < len(cache.Tasks); t++ {

			var other = cache.Tasks[t];

			if other.ID > max_id {
				max_id = other.ID;
			}

		}


		if max_id < 999999 {

			task.ID = max_id + 1;

			var result = cache.WriteTask(task);

			if result == true {
				return true;
			}

		}

	}

	return false;

}

func (cache *Cache) Modify (task Task) bool {

	if task.ID != 0 && task.ID < 999999 {

		var result = cache.WriteTask(task);

		if result == true {
			return true;
		}

	}

	return false;

}

