package dao

import (
	"fmt"
	"database/sql"
	_ "github.com/lib/pq"
	"solardatabase/models"
	"solardatabase/utils"
	"time"
)


var db *sql.DB

func OpenDBConnection() {

	fmt.Println("Connecting to DB")
	var err error
	db, err = sql.Open("postgres", "user=ahmetkucuk dbname=dbproject sslmode=disable")

	if err != nil {
		fmt.Println("error")
	}

	if err = db.Ping(); err != nil {
		fmt.Println("error db connection")
	}
}

func GetAllEvents() ([]*models.Event) {

	rows, err := db.Query("SELECT kb_archivid as id, event_starttime as starttime, ST_AsText(hpc_bbox) as hpcbbox FROM ar")

	if err != nil {
		fmt.Println("error %e", err)
	}

	var id, hpcbbox string
	var starttime time.Time
	events := models.NewEvents()
	for rows.Next() {
		err := rows.Scan(&id, &starttime, &hpcbbox)
		if err != nil {
			fmt.Println("error", err)
		}
		event := &models.Event{
			Id: id,
			StartTime:  starttime,
			HpcBBox:  hpcbbox,
		}
		events = append(events, event)
	}
	return events
}

func EventsByTimeRange() (string) {

	str, err := utils.GetJSON(db, "Select * from ar")
	if err != nil {
		fmt.Println("error %e", err)
	}
	return str;
}
