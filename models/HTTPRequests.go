package models
import (
//	"fmt"
"github.com/astaxie/beego/context"
"strings"
	"net/url"
	"fmt"
)


type EventByTimeRangeRequest struct {
	StartTime	string
	EndTime	string
}

type TemporalRequest struct {
	StartTime	string
	EndTime	string
	TableNames	[]string
	SortBy string
	Limit string
	Offset string
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


func CreateEventByTimeRangeRequest(input *context.BeegoInput)  (request EventByTimeRangeRequest, err error) {
	r := EventByTimeRangeRequest{}

	StartTime := input.Param(":StartTime")
	r.StartTime = strings.Split(StartTime, "=")[1]


	EndTime := input.Param(":EndTime")
	r.EndTime = strings.Split(EndTime, "=")[1]

	return r, nil
}

func CreateTemporalRequest(input url.Values)  (request TemporalRequest, err error) {
	r := TemporalRequest{}

	r.StartTime = input.Get("starttime")
	r.EndTime = input.Get("endtime")
	r.TableNames = strings.Split(input.Get("tablenames"), ",")
	r.SortBy = input.Get("sortby")
	r.Limit = input.Get("limit")
	r.Offset = input.Get("offset")

	fmt.Println("EndTime", r.TableNames)

	return r, nil
}

func CreateGenerateVideoRequest(input url.Values)  (request GenerateVideoRequest, err error) {
	r := GenerateVideoRequest{}

	r.EventID = input.Get("eventid")
	r.Email = input.Get("email")
	r.Institute = input.Get("institude")

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

