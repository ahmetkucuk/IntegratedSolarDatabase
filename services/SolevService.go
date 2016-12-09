package services
import (
	"fmt"
	"solardatabase/models"

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
