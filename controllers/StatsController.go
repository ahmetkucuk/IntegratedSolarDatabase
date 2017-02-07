package controllers


import (
"github.com/astaxie/beego"
"solardatabase/models"
"solardatabase/services"
)

type StatsController struct {
	beego.Controller
}

func (this *StatsController) EventCountByMonthQuery() {

	request, _ := models.CreateEventCountByMonthRequest(this.Input())
	this.Data["json"] = services.EventCountByMonth(request)
	this.ServeJSON()
}
