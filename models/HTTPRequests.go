package models
import (
	"github.com/astaxie/beego/context"
	"strings"
	"net/url"
	"strconv"
)



type SearchByIdRequest struct {
	Id	string
	EventType	string
}

type ImageRequest struct {
	ImageDate	string
	Size	string
	Wavelength	string
}

type GenerateVideoRequest struct {
	EventID	string
	Email	string
	Institute string
}

type PreviewVideoRequest struct {
	EventID	string
	EventType string
}

type SDOImageRequest struct {
	Resolution string
	Wavelength	string
	StartTime string
}

type ParameterImageRequest struct {
	Resolution string
	Wavelength	string
	StartTime string
	ParameterID string
}

type ImageParameterRequest struct {
	Wavelength	string
	StartTime string
}

type TrackIDRequest struct {
	EventID	string
	EventType string
}

type CloseByEventRequest struct {
	QueryEventType	string
	QueryEventID	string
	TargetEventType	string
	LookBack	int
	SpatialBuffer	float64
}

type TrackImageParameterRequest struct {
	EventID string
	Wavelength	string
	ParameterID string
}

type EventTypesRangeRequest struct {
	EventTypes []string
	StartTime string
	EndTime string
}

func CreateGenerateVideoRequest(input url.Values)  (request GenerateVideoRequest, err error) {
	r := GenerateVideoRequest{}

	r.EventID = input.Get("eventid")
	r.Email = input.Get("email")
	r.Institute = input.Get("institude")

	return r, nil
}

func CreatePreviewVideoRequest(input url.Values)  (request PreviewVideoRequest, err error) {
	r := PreviewVideoRequest{}

	r.EventID = input.Get("eventid")
	r.EventType = input.Get("eventtype")

	return r, nil
}

func CreateImageRequest(input *context.BeegoInput)  (request ImageRequest, err error) {
	r := ImageRequest{}

	ImageDate := input.Param(":ImageDate")
	r.ImageDate = strings.Split(ImageDate, "=")[1]


	Size := input.Param(":Size")
	r.Size = strings.Split(Size, "=")[1]


	Wavelengths := input.Param(":Wavelength")
	r.Wavelength = strings.Split(Wavelengths, "=")[1]


	return r, nil
}

func CreateSearchByIdRequest(input url.Values)  (SearchByIdRequest, error) {
	r := SearchByIdRequest{}

	r.Id = input.Get("id")
	r.EventType = input.Get("eventtype")

	return r, nil
}

func CreateSDOImageRequest(input url.Values)  (SDOImageRequest, error) {
	r := SDOImageRequest{}

	r.Resolution = input.Get("resolution")
	r.Wavelength = input.Get("wavelength")
	r.StartTime = input.Get("starttime")

	return r, nil
}

func CreateParameterImageRequest(input url.Values)  (ParameterImageRequest, error) {
	r := ParameterImageRequest{}

	r.Resolution = input.Get("resolution")
	r.Wavelength = input.Get("wavelength")
	r.StartTime = input.Get("starttime")
	r.ParameterID = input.Get("paramid")

	return r, nil
}

func CreateImageParameterRequest(input url.Values)  (ImageParameterRequest, error) {
	r := ImageParameterRequest{}

	r.Wavelength = input.Get("wavelength")
	r.StartTime = input.Get("starttime")

	return r, nil
}

func CreateTrackIDRequest(input url.Values)  (TrackIDRequest, error) {
	r := TrackIDRequest{}

	r.EventID = input.Get("id")
	r.EventType = input.Get("eventtype")

	return r, nil
}

func CreateCloseByEventRequest(input url.Values)  (CloseByEventRequest, error) {
	r := CloseByEventRequest{}

	r.QueryEventType = input.Get("queryeventtype")
	r.QueryEventID = input.Get("queryeventid")
	r.TargetEventType = input.Get("targeteventtype")

	r.LookBack, _  = strconv.Atoi(input.Get("lookback"))

	spatialBuffer, err := strconv.ParseFloat(input.Get("spatialbuffer"), 64)
	if err != nil {
		spatialBuffer = 0
	}
	r.SpatialBuffer = spatialBuffer;

	return r, nil
}

func CreateTrackImageParameterRequest(input url.Values)  (TrackImageParameterRequest, error) {
	r := TrackImageParameterRequest{}

	r.EventID = input.Get("id")
	r.Wavelength = input.Get("wavelength")
	r.ParameterID = input.Get("paramid")

	return r, nil
}

func CreateEventTypesRangeRequest(input url.Values)  (EventTypesRangeRequest, error) {
	r := EventTypesRangeRequest{}

	r.StartTime = input.Get("starttime")
	r.EndTime = input.Get("endtime")
	r.EventTypes = strings.Split(input.Get("eventtypes"), ",")

	return r, nil
}


