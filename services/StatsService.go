package services
import (
	"solardatabase/models"
	"solardatabase/dao"
)


func EventCountByMonth(r models.EventCountByMonthRequest) (*models.EventCountByMonthResponse) {

	result := &models.EventCountByMonthResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result:dao.EventCountByMonth(r),
	}
	return result
}
