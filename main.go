package main

import (
	_ "solardatabase/routers"
	"github.com/astaxie/beego"
//	"solardatabase/dao"
	"strconv"
	"os"
	"solardatabase/dao"
)

func main() {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err == nil {
		beego.BConfig.Listen.HTTPPort = port
	}

	dao.OpenDBConnection()
	beego.Run()
}

