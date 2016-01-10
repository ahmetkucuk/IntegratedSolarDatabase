package models
import "solardatabase/utils"


type Response struct {
	status	string
	statusCode	int
	msg	string
}

type EventListResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Result utils.JSONString
}
