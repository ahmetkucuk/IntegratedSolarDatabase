package services
import (
	"solardatabase/models"
	"solardatabase/dao"
)


func EventsByTimeFilter(r models.TemporalRequest) (*models.EventListResponse) {

	result := &models.EventListResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result:dao.EventTemporalSearch(r),
	}
	return result
}
