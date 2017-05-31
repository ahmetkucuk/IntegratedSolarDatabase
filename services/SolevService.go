package services
import (
	"fmt"
	"solardatabase/models"

	"solardatabase/dao"
)


func GenerateVideo(r models.GenerateVideoRequest) (*models.Response) {

	fmt.Println("coming request: ", r.EventID, r.Email, r.Institute )
	result := &models.Response {
		Status: "OK",
		StatusCode:1,
		Msg: "Successful",
	}
	return result
}

func PreviewVideo(r models.PreviewVideoRequest) (*models.PreviewVideoResponse) {

	fmt.Println("coming request: ", r.EventID, r.EventType )
	result := &models.PreviewVideoResponse {
		Status: "OK",
		StatusCode:1,
		Msg: "Successful",
		Link: "static/video/AR131movie.mp4",
	}
	return result
}

func RetrieveTrackID(r models.TrackIDRequest) (*models.TrackIDResponse) {

	trackid, err := dao.GetTrackIDbyEventID(r)

	if err != nil {
		result := &models.TrackIDResponse {
			Status: "FAIL",
			StatusCode:2,
			Msg: "Failed to retreive track id",
			Result: trackid,
		}
		return result
	}

	result := &models.TrackIDResponse {
		Status: "OK",
		StatusCode:1,
		Msg: "Successful",
		Result: trackid,
	}
	return result
}
