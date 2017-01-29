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
	"github.com/astaxie/beego/plugins/cors"
)

func main() {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err == nil {
		beego.BConfig.Listen.HTTPPort = port
	}
	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "DELETE", "PUT", "PATCH", "POST"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
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

