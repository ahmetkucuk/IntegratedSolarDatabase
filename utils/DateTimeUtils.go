package utils

import (
	"strings"
	"time"
)

func ParseDatetime(value string) (time.Time, error) {

	layout := "2006-01-02 15:04:00"
	if strings.Contains(value, "T") {
		layout = "2006-01-02T15:04:00"
	}
	return time.Parse(layout, value)
}
