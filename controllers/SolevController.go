package controllers

import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"solardatabase/services"
)

type SolevController struct {
	beego.Controller
}

func (this *SolevController) GenerateVideo() {

	request, _ := models.CreateGenerateVideoRequest(this.Input())
	this.Data["json"] = services.GenerateVideo(request)
	this.ServeJSON()
}
