package services
import (
	"solardatabase/models"
	"solardatabase/dao"
)


func EventsByTemporalFilter(r models.TemporalRequest) (*models.EventListResponse) {

	result := &models.EventListResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result:dao.TemporalSearch(r),
	}
	return result
}

func EventsBySpatioTemporalFilter(r models.SpatioTemporalRequest) (*models.EventListResponse) {

	result := &models.EventListResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result:dao.SpatioTemporalSearch(r),
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

func SearchById(r models.SearchByIdRequest) (*models.SearchByIdResponse) {


	result := &models.SearchByIdResponse {
		Status: "OK",
		StatusCode:1,
		Msg:"Successful",
		Result: dao.GetEventByIdAndTableName(r),
	}
	return result
}
