package models
import (
//	"fmt"
"github.com/astaxie/beego/context"
"strings"
)


type EventByTimeRangeRequest struct {
	StartTime	string
	EndTime	string
}


func CreateEventByTimeRangeRequest(input *context.BeegoInput)  (request EventByTimeRangeRequest, err error) {
	r := EventByTimeRangeRequest{}

	StartTime := input.Param(":StartTime")
	r.StartTime = strings.Split(StartTime, "=")[1]


	EndTime := input.Param(":EndTime")
	r.EndTime = strings.Split(EndTime, "=")[1]

	return r, nil
}