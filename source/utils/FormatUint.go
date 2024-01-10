package utils

import "strconv"
import "strings"

func FormatUint(number uint, length int) string {

	var result string

	chunk := strconv.FormatUint(uint64(number), 10)

	if len(chunk) < length {

		var prefix strings.Builder

		for p := 0; p < length-len(chunk); p++ {
			prefix.WriteString("0")
		}

		result = prefix.String() + chunk

	} else {

		result = chunk

	}

	return result

}
