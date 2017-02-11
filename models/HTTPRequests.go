package models
import (
	"github.com/astaxie/beego/context"
	"strings"
	"net/url"
	"strconv"
)


type TemporalRequest struct {
	StartTime	string
	EndTime	string
	TableNames	[]string
	SortBy string
	Limit int
	Offset int
	Interpolated bool
}


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

func CreateTemporalRequest(input url.Values)  (r TemporalRequest, err error) {

	r.StartTime = input.Get("starttime")
	r.EndTime = input.Get("endtime")
	r.TableNames = strings.Split(input.Get("tablenames"), ",")
	r.SortBy = input.Get("sortby")

	r.Limit, err = strconv.Atoi(input.Get("limit"))

	if err != nil {
		return r, err
	}

	r.Offset, err = strconv.Atoi(input.Get("offset"))

	if err != nil {
		return r, err
	}

	interpolated := input.Get("interpolated")

	if interpolated == "True" {
		r.Interpolated = true
	} else {
		r.Interpolated = false
	}

	return r, nil
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
