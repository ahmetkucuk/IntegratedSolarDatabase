package main

import (
	_ "solardatabase/routers"
	"github.com/astaxie/beego"
//	"solardatabase/dao"
	"strconv"
	"os"
	"solardatabase/dao"
	"fmt"
	"solardatabase/models"
)

func main() {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err == nil {
		beego.BConfig.Listen.HTTPPort = port
	}
	beego.BConfig.RunMode = "dev"
	beego.BConfig.WebConfig.AutoRender = false
	beego.BConfig.WebConfig.TemplateLeft = "<<<"
	beego.BConfig.WebConfig.TemplateRight = ">>>"
	var dbUser = beego.AppConfig.String("dbuser")
	var dbHost = beego.AppConfig.String("dbhost")
	var dbName = beego.AppConfig.String("dbname")
	var dbPass = beego.AppConfig.String("dbpass")
	fmt.Printf("before type")
	fmt.Println(models.Tvalue(models.T_GreaterThan))
	fmt.Println(models.Svalue(models.S_Contains))
	dao.OpenDBConnection(dbUser, dbHost, dbName, dbPass)
	beego.Run()
}

