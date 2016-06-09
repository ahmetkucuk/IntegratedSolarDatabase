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

func FindClosestImage(r models.ImageRequest) (*models.ImageUrlResponse) {


	result := &models.ImageUrlResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result: dao.GetClosestImage(r),
	}
	return result
}
