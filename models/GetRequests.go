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

type TemporalRequest struct {
	StartTime	string
	EndTime	string
	TableName	string
	QueryType	string
}


func CreateEventByTimeRangeRequest(input *context.BeegoInput)  (request EventByTimeRangeRequest, err error) {
	r := EventByTimeRangeRequest{}

	StartTime := input.Param(":StartTime")
	r.StartTime = strings.Split(StartTime, "=")[1]


	EndTime := input.Param(":EndTime")
	r.EndTime = strings.Split(EndTime, "=")[1]

	return r, nil
}

func CreateTemporalRequest(input *context.BeegoInput)  (request TemporalRequest, err error) {
	r := TemporalRequest{}

	StartTime := input.Param(":StartTime")
	r.StartTime = strings.Split(StartTime, "=")[1]


	EndTime := input.Param(":EndTime")
	r.EndTime = strings.Split(EndTime, "=")[1]


	TableName := input.Param(":TableName")
	r.TableName = strings.Split(TableName, "=")[1]


	QueryType := input.Param(":QueryType")
	r.QueryType = strings.Split(QueryType, "=")[1]

	return r, nil
}