package services

import (
	"solardatabase/models"
	"solardatabase/dao"
)

func CountEventTypeByMonth(r models.EventTypesRangeRequest) (*models.CloseByEventsResponse) {


	results, _ := dao.AggregateEventAttributeByMonth(r, false)
	result := &models.CloseByEventsResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result: results,
	}
	return result
}

func AreaSumEventTypeByMonth(r models.EventTypesRangeRequest) (*models.CloseByEventsResponse) {


	results, _ := dao.AggregateEventAttributeByMonth(r, true)
	result := &models.CloseByEventsResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result: results,
	}
	return result
}

