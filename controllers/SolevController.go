package controllers

import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"solardatabase/services"
)

type SolevController struct {
	beego.Controller
}

func (ctrl *SolevController) GenerateVideo() {

	request, _ := models.CreateGenerateVideoRequest(ctrl.Input())
	ctrl.Data["json"] = services.GenerateVideo(request)
	ctrl.ServeJSON()
}


func (ctrl *SolevController) PreviewVideo() {

	request, _ := models.CreatePreviewVideoRequest(ctrl.Input())
	ctrl.Data["json"] = services.PreviewVideo(request)
	ctrl.ServeJSON()
}
