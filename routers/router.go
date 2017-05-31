package routers

import (
	"solardatabase/controllers"
	"github.com/astaxie/beego"
)

func init() {
	//127.0.0.1:8080/api/query/param/image?resolution=512&wavelength=171&starttime=2015-05-01T20:14:47&paramid=1
	//127.0.0.1:8080/api/query/param?starttime=2015-05-01T20:14:47&wavelength=171
	//http://127.0.0.1:8080/api/query/temporal?starttime=2012-05-01%2020:14:47&endtime=2015-05-01%2020:14:47&tablenames=%27ar,ch%27&sortby=event_starttime&limit=20&offset=0
	beego.Router("/api/query/temporal", &controllers.EventController{}, "get:TemporalQuery")
	beego.Router("/api/query/spatiotemporal", &controllers.EventController{}, "get:SpatioTemporalQuery")

	beego.Router("/api/query/image", &controllers.ImageController{}, "get:SDOImageAPI")
	beego.Router("/api/query/param/image", &controllers.ImageController{}, "get:ParameterImageAPI")
	beego.Router("/api/query/param", &controllers.ImageController{}, "get:ImageParameterAPI")

	beego.Router("/api/query/solev/generateVideo", &controllers.SolevController{}, "get:GenerateVideo")
	beego.Router("/api/query/solev/previewVideo", &controllers.SolevController{}, "get:PreviewVideo")
	beego.Router("/api/query/solev/trackid", &controllers.SolevController{}, "get:GetTrackID")

	beego.Router("/api/query/searchById", &controllers.EventController{}, "get:SearchByID")
	beego.Router("/api/imageurl/:ImageDate/:Size/:Wavelength", &controllers.EventController{}, "get:ImageUrlQuery")
	beego.Router("/*", &controllers.MainController{})
}
