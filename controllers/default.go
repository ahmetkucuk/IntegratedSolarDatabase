package controllers

import (
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

type AnalyticsController struct {
	beego.Controller
}

func (c *MainController) Get() {
	c.TplName = "index.html"
	c.Render()
}

func (c *AnalyticsController) Get() {
	c.TplName = "analytics.html"
	c.Render()
}