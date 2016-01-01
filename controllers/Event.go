package controllers


import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"solardatabase/dao"
)

type EventController struct {
	beego.Controller
}

func (this *EventController) ListEvents() {
	res := struct{ Tasks []*models.Event }{dao.GetAllEvents()}
	this.Data["json"] = res
	this.ServeJson()
}

func (this *EventController) ListEventsByRange() {
//	res := struct{ Tasks string }{dao.EventsByTimeRange()}
	this.Data["json"] = dao.EventsByTimeRange()
	this.ServeJson()
}
