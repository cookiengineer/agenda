package utils

import "strconv"
import "strings"

func FormatInt(number int, length int) string {

	var result string

	chunk := strconv.Itoa(number)

	if strings.HasPrefix(chunk, "-") {
		chunk = chunk[1:]
	}

	if length == 0 {

		result = chunk

	} else {

		if len(chunk) < length {

			var prefix strings.Builder

			for p := 0; p < length-len(chunk); p++ {
				prefix.WriteString("0")
			}

			result = prefix.String() + chunk

		} else {

			result = chunk

		}

	}

	return result

}
