package controllers

import (
	"github.com/astaxie/beego"
	"solardatabase/models"
	"fmt"
)

type ImageController struct {
	beego.Controller
}


func (this *ImageController) SDOImageAPI() {

	request, _ := models.CreateSDOImageRequest(this.Input())
	var redirectURL = fmt.Sprintf("http://dmlab.cs.gsu.edu/dmlabapi/images/SDO/AIA/%s/?wave=%s&starttime=%s", request.Resolution, request.Wavelength, request.StartTime)
	this.Redirect(redirectURL, 302)
}

func (this *ImageController) ParameterImageAPI() {

	request, _ := models.CreateParameterImageRequest(this.Input())
	var redirectURL = fmt.Sprintf("http://dmlab.cs.gsu.edu/dmlabapi/images/SDO/AIA/param/64/%s/?wave=%s&starttime=%s&param=%s", request.Resolution, request.Wavelength, request.StartTime, request.ParameterID)
	this.Redirect(redirectURL, 302)
}

func (this *ImageController) ImageParameterAPI() {

	request, _ := models.CreateImageParameterRequest(this.Input())
	var redirectURL = fmt.Sprintf("http://dmlab.cs.gsu.edu/dmlabapi/params/SDO/AIA/64/full/?wave=%s&starttime=%s", request.Wavelength, request.StartTime)
	this.Redirect(redirectURL, 302)
}
