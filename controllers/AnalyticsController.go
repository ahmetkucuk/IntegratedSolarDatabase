package controllers

import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"fmt"
	"solardatabase/services"
)

type AnalyticsController struct {
	beego.Controller
}

func (c *AnalyticsController) Get() {
	c.TplName = "analytics.html"
	c.Render()
}

func (this *AnalyticsController) TrackImageParameterAPI() {

	request, _ := models.CreateTrackImageParameterRequest(this.Input())
	var redirectURL = fmt.Sprintf("http://dmlab.cs.gsu.edu/dmlabapi/params/SDO/AIA/param/track/ts?wave=%s&id=%s&param=%s", request.Wavelength, request.EventID, request.ParameterID)
	this.Redirect(redirectURL, 302)
}

func (this *AnalyticsController) EventCountByMonth() {

	request, _ := models.CreateEventCountByMonthRequest(this.Input())
	this.Data["json"] = services.CountEventByMonth(request)
	this.ServeJSON()
}
