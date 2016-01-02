package main

import (
	_ "solardatabase/routers"
	"github.com/astaxie/beego"
//	"solardatabase/dao"
)

func main() {

//	dao.OpenDBConnection()
	beego.Run()
}

