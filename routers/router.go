package routers

import (
	"solardatabase/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
	beego.Router("/api/event/", &controllers.EventController{}, "get:ListEvents")
	beego.Router("/api/eventByRange/:StartTime/:EndTime", &controllers.EventController{}, "get:ListEventsByRange")
//	beego.Router("/api/eventByTimeRange/", &controllers.EventController{}, "get:ListEventsByRange")
//	beego.Router("/api/eventByTimeAndPosition/", &controllers.EventController{}, "get:ListEventsByRange")
	beego.Router("/*", &controllers.MainController{})
}
