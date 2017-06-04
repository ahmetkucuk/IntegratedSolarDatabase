package models

import (
	"net/url"
	"strings"
	"github.com/go-ozzo/ozzo-validation"
	"solardatabase/utils"
	"strconv"
)

type SpatioTemporalRequest struct {
	StartTime	string
	EndTime	string
	TableNames	string
	SortBy string
	TemporalPredicate string
	SpatialPredicate string
	Limit int
	Offset int
	Xmin float64
	Ymin float64
	Xmax float64
	Ymax float64
	IsWEB bool
}


func CreateSpatioTemporalRequest(input url.Values)  (r SpatioTemporalRequest, err error) {

	r.StartTime = input.Get("starttime")
	r.EndTime = input.Get("endtime")
	r.SortBy = input.Get("sortby")
	r.TemporalPredicate = input.Get("temporalpredicate")
	r.SpatialPredicate = input.Get("spatialpredicate")

	r.Xmin, _ = strconv.ParseFloat(input.Get("xmin"), 64)
	r.Xmax, _ = strconv.ParseFloat(input.Get("xmax"), 64)
	r.Ymin, _ = strconv.ParseFloat(input.Get("ymin"), 64)
	r.Ymax, _ = strconv.ParseFloat(input.Get("ymax"), 64)

	r.Limit, err = strconv.Atoi(input.Get("limit"))

	if err != nil {
		return r, err
	}

	r.Offset, err = strconv.Atoi(input.Get("offset"))

	if err != nil {
		return r, err
	}

	web := input.Get("web")
	if web == "True" {
		r.IsWEB = true
	} else {
		r.IsWEB = false
	}

	tableNames := strings.Split(input.Get("tablenames"), ",")
	r.TableNames = utils.CreateTableNameString(tableNames)

	err = r.Validate()
	return r, err
}



func (r SpatioTemporalRequest) Validate() error {

	var sTime, err1 = utils.ParseDatetime(r.StartTime)

	if err1 != nil {
		return err1
	}
	var eTime, err2 = utils.ParseDatetime(r.EndTime)

	if err2 != nil {
		return err2
	}

	return validation.ValidateStruct(&r,
		validation.Field(&r.StartTime, &dateRule{message: "Start Time should be before end time", timeRange:TimeRange{start:sTime, end:eTime}}),
	)
}
