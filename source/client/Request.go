package client

import "net/http"
import "io/ioutil"

func Request(url string) []byte {

	var result []byte

	client := &http.Client{}
	// client.CloseIdleConnections()

	request, err1 := http.NewRequest("GET", url, nil)

	if err1 == nil {

		response, err2 := client.Do(request)

		if err2 == nil {

			status_code := response.StatusCode

			if status_code == 200 || status_code == 304 {

				if response.Header["Content-Type"][0] == "application/json" {

					buffer, err3 := ioutil.ReadAll(response.Body)

					if err3 == nil {
						result = buffer
					}

				}

			}

		}

	}

	return result

}
