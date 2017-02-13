package models

import (
	"solardatabase/models"
	"testing"
)

func init() {
}

func TestTemporalRequestValidationSuccess(t *testing.T) {
	var r = &models.TemporalRequest{
		StartTime: "2006-01-02T15:04:00",
		EndTime: "2007-01-02T15:04:00",
		TableNames: []string{"ar", "ch", "ar_interpolated"},
		SortBy: "event_starttime",
		Limit: 10,
		Offset: 0,
		Interpolated: true,
	}
	var err = r.Validate()
	if err != nil {
		t.Error(err)
	}
}

func TestTemporalRequestValidationFail(t *testing.T) {
	var r = &models.TemporalRequest{
		StartTime: "2016-01-02 15:04:00",
		EndTime: "2007-01-02T15:04:00",
		TableNames: []string{"ar", "ch", "ar_interpolated"},
		SortBy: "event_starttime",
		Limit: 10,
		Offset: 0,
		Interpolated: true,
	}
	var err = r.Validate()
	if err == nil {
		t.Error(err)
	}
}
