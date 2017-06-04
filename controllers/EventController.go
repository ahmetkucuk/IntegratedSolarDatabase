package controllers


import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"solardatabase/services"
)

type EventController struct {
	beego.Controller
}

func (this *EventController) TemporalQuery() {

	request, _ := models.CreateTemporalRequest(this.Input())
	this.Data["json"] = services.EventsByTemporalFilter(request)
	this.ServeJSON()
}

func (this *EventController) SpatioTemporalQuery() {

	request, _ := models.CreateSpatioTemporalRequest(this.Input())
	this.Data["json"] = services.EventsBySpatioTemporalFilter(request)
	this.ServeJSON()
}

func (this *EventController) SearchByID() {
	request, _ := models.CreateSearchByIdRequest(this.Input())
	this.Data["json"] = services.SearchById(request)
	this.ServeJSON()
}

func (this *EventController) CloseByEvents() {
	request, _ := models.CreateCloseByEventRequest(this.Input())
	this.Data["json"] = services.SearchCloseByEvents(request)
	this.ServeJSON()
}


