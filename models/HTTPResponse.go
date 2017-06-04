package models
import "solardatabase/utils"


type Response struct {
	Status	string
	StatusCode	int
	Msg	string
}

type EventListResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Result utils.JSONString
}

type ImageUrl struct {
	URL string

}

type ImageUrlResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Result ImageUrl
}

type SearchByIdResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Result utils.JSONString
}

type CloseByEventsResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Result utils.JSONString
}

type PreviewVideoResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Link string
}

type TrackIDResponse struct {
	Status	string
	StatusCode	int
	Msg	string
	Result utils.JSONString
}
