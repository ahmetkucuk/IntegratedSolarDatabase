package controllers


import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"solardatabase/dao"
	"solardatabase/services"
)

type EventController struct {
	beego.Controller
}

func (this *EventController) ListEvents() {
	res := struct{ Events []*models.Event }{dao.GetAllEvents()}
	this.Data["json"] = res
	this.ServeJSON()
}

func (this *EventController) ListEventsByRange() {
	request, _ := models.CreateEventByTimeRangeRequest(this.Ctx.Input)
	res := struct{ Events []*models.Event }{dao.EventsByTimeRange(request)}
	this.Data["json"] = res
	this.ServeJSON()
}

func (this *EventController) TemporalQuery() {
	request, _ := models.CreateTemporalRequest(this.Ctx.Input)
	this.Data["json"] = services.EventsByTimeFilter(request)
	this.ServeJSON()
}

func (this *EventController) ImageUrlQuery() {
	request, _ := models.CreateImageRequest(this.Ctx.Input)
	this.Data["json"] = services.FindClosestImage(request)
	this.ServeJSON()
}