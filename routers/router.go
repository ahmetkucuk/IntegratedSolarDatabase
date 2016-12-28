package routers

import (
	"solardatabase/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/api/event/", &controllers.EventController{}, "get:ListEvents")

	//Example: http://127.0.0.1:8080/api/eventByRange/StartTime=2012-05-01%20:14:47/EndTime=2015-12-30%20:14:47
	beego.Router("/api/eventByRange/:StartTime/:EndTime", &controllers.EventController{}, "get:ListEventsByRange")
	//beego.Router("/api/query/temporal/:StartTime/:EndTime/:TableName/:QueryType", &controllers.EventController{}, "get:TemporalQuery")
	//http://127.0.0.1:8080/api/query/temporal?starttime=2012-05-01%2020:14:47&endtime=2015-05-01%2020:14:47&tablenames=%27ar,ch%27&sortby=event_starttime&limit=20&offset=0
	beego.Router("/api/query/temporal", &controllers.EventController{}, "get:TemporalQuery")

	beego.Router("/api/query/solev/generateVideo", &controllers.SolevController{}, "get:GenerateVideo")
	beego.Router("/api/query/solev/previewVideo", &controllers.SolevController{}, "get:PreviewVideo")

	beego.Router("/api/query/searchById", &controllers.EventController{}, "get:SearchByID")
	beego.Router("/api/imageurl/:ImageDate/:Size/:Wavelength", &controllers.EventController{}, "get:ImageUrlQuery")
//	beego.Router("/api/eventByTimeRange/", &controllers.EventController{}, "get:ListEventsByRange")
//	beego.Router("/api/eventByTimeAndPosition/", &controllers.EventController{}, "get:ListEventsByRange")
	beego.Router("/*", &controllers.MainController{})
}
