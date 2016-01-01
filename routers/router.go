package routers

import (
	"solardatabase/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
	beego.Router("/event/", &controllers.EventController{}, "get:ListEvents")
	beego.Router("/eventByRange/", &controllers.EventController{}, "get:ListEventsByRange")
}
