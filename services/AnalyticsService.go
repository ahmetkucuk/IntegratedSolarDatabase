package services

import (
	"solardatabase/models"
	"solardatabase/dao"
)

func CountEventByMonth(r models.CountEventByMonthRequest) (*models.CloseByEventsResponse) {


	results, _ := dao.CountEventByMonth(r)
	result := &models.CloseByEventsResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result: results,
	}
	return result
}
