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

	rows, err := db.Query("SELECT kb_archivid as id, event_starttime as starttime, ST_AsText(hpc_bbox) as hpcbbox, ST_AsText(hpc_coord) as coordinate FROM ar LIMIT 10")

	if err != nil {
		fmt.Println("error %e", err)
	}

	var id, hpcbbox, coordinate string
	var starttime time.Time
	events := models.NewEvents()
	for rows.Next() {
		err := rows.Scan(&id, &starttime, &hpcbbox, &coordinate)
		if err != nil {
			fmt.Println("error", err)
		}
		event := &models.Event{
			Id: id,
			StartTime:  starttime,
			HpcBBox:  hpcbbox,
			Coordinate:  coordinate,
		}
		events = append(events, event)
	}
	return events
}

func EventsByTimeRange(r models.EventByTimeRangeRequest) (utils.JSONString) {

	fmt.Println("r.Startime:" + r.StartTime)
	query := fmt.Sprintf("Select * from ar WHERE event_starttime > '%s' AND event_endtime < '%s';", r.StartTime, r.EndTime)
	fmt.Printf(query)
	resultJson, err := utils.GetJSON(db, query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson;
}

func GetEventsByTimeFilter(r models.TemporalRequest) (string) {
	query := fmt.Sprintf(utils.QUERY_TEMPORAL, r.TableName, r.QueryType, r.StartTime, r.EndTime)
	resultJson, err := utils.GetAsString(db, query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson
}

func EventTemporalSearch(r models.TemporalRequest) (utils.JSONString) {
	query := fmt.Sprintf(utils.QUERY_TEMPORAL, r.TableName, r.QueryType, r.StartTime, r.EndTime)
	resultJson, err := utils.GetJSON(db, query)
	if err != nil {
		fmt.Println("error %e", err)
	}
	return resultJson
}
